import { isBrowser } from './env';

/**
 * スクリーンリーダーへの通知の優先度（politeness）。
 *
 * - `'polite'`: 現在の読み上げが終わった後に通知（デフォルト）
 * - `'assertive'`: 現在の読み上げを中断して直ちに通知
 */
export type AnnouncePoliteness = 'polite' | 'assertive';

/**
 * `announce` 関数のオプション。
 */
export interface AnnounceOptions {
  /**
   * 通知の優先度（politeness）。
   *
   * @default 'polite'
   */
  politeness?: AnnouncePoliteness;

  /**
   * ライブリージョン内にメッセージ要素が保持される時間（ミリ秒）。
   *
   * @default 7000
   */
  timeout?: number;
}

const DEFAULT_TIMEOUT = 7000;
const INITIAL_DELAY = 100;

// スクリーンリーダー専用テキストを視覚的に非表示にするための最小限のインラインスタイル
// （.agents/rules/component-architecture.md の例外規定に準拠）
const VISUALLY_HIDDEN_STYLE =
  'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';

let container: HTMLElement | null = null;
let politeRegion: HTMLElement | null = null;
let assertiveRegion: HTMLElement | null = null;

interface PendingTimer {
  id: ReturnType<typeof setTimeout>;
  politeness: AnnouncePoliteness;
}

const pendingTimers = new Set<PendingTimer>();

/**
 * ライブリージョンのコンテナおよび polite / assertive リージョンを取得または作成します。
 *
 * @returns 今回の呼び出しでコンテナが新規作成された場合は `true`、既存のものを再利用した場合は `false`
 */
function ensureContainer(): boolean {
  if (container && document.body.contains(container)) {
    return false;
  }

  // 外部要因などでコンテナが DOM から削除されていた場合は、残っているタイマーをリセット
  if (container && !document.body.contains(container)) {
    clearAnnouncer();
    container = null;
    politeRegion = null;
    assertiveRegion = null;
  }

  // DOM 内に既存のコンテナが存在するか確認
  const existing = document.body.querySelector<HTMLElement>('[data-leve-announcer]');
  if (existing) {
    const existingPolite = existing.querySelector<HTMLElement>(
      '[data-leve-announcer-region="polite"]',
    );
    const existingAssertive = existing.querySelector<HTMLElement>(
      '[data-leve-announcer-region="assertive"]',
    );
    if (existingPolite && existingAssertive) {
      container = existing;
      politeRegion = existingPolite;
      assertiveRegion = existingAssertive;
      return false;
    }
  }

  container = document.createElement('div');
  container.setAttribute('data-leve-announcer', '');
  container.setAttribute('style', VISUALLY_HIDDEN_STYLE);

  politeRegion = document.createElement('div');
  politeRegion.setAttribute('data-leve-announcer-region', 'polite');
  politeRegion.setAttribute('aria-live', 'polite');
  politeRegion.setAttribute('aria-relevant', 'additions');
  politeRegion.setAttribute('aria-atomic', 'false');
  politeRegion.setAttribute('role', 'log');

  assertiveRegion = document.createElement('div');
  assertiveRegion.setAttribute('data-leve-announcer-region', 'assertive');
  assertiveRegion.setAttribute('aria-live', 'assertive');
  assertiveRegion.setAttribute('aria-relevant', 'additions');
  assertiveRegion.setAttribute('aria-atomic', 'false');
  assertiveRegion.setAttribute('role', 'log');

  container.appendChild(politeRegion);
  container.appendChild(assertiveRegion);
  document.body.appendChild(container);

  return true;
}

/**
 * リージョンにメッセージノードを追加し、指定時間経過後に削除するタイマーをセットします。
 */
function appendMessage(
  region: HTMLElement,
  message: string,
  politeness: AnnouncePoliteness,
  timeout: number,
): void {
  const node = document.createElement('div');
  node.textContent = message;
  region.appendChild(node);

  let removeTimer: PendingTimer | null = null;
  const timerId = setTimeout(() => {
    if (removeTimer) {
      pendingTimers.delete(removeTimer);
    }
    if (node.parentNode === region) {
      region.removeChild(node);
    }
  }, timeout);

  removeTimer = { id: timerId, politeness };
  pendingTimers.add(removeTimer);
}

/**
 * スクリーンリーダー向けにメッセージを通知します。
 *
 * @param message 通知するメッセージ文字列（空文字や空白のみの場合は無視されます）
 * @param options 通知オプション（politeness、timeout）
 */
export const announce = (message: string, options?: AnnounceOptions): void => {
  if (!isBrowser) {
    return;
  }

  if (!message || message.trim().length === 0) {
    return;
  }

  const politeness = options?.politeness ?? 'polite';
  const timeout = options?.timeout ?? DEFAULT_TIMEOUT;

  const justCreated = ensureContainer();
  const region = politeness === 'assertive' ? assertiveRegion : politeRegion;
  if (!region) {
    return;
  }

  if (justCreated) {
    let appendTimer: PendingTimer | null = null;
    const timerId = setTimeout(() => {
      if (appendTimer) {
        pendingTimers.delete(appendTimer);
      }
      appendMessage(region, message, politeness, timeout);
    }, INITIAL_DELAY);

    appendTimer = { id: timerId, politeness };
    pendingTimers.add(appendTimer);
  } else {
    appendMessage(region, message, politeness, timeout);
  }
};

/**
 * ライブリージョン内のメッセージ要素を消去し、保留中のタイマーをキャンセルします。
 *
 * @param politeness 消去対象の優先度。省略時はすべてのリージョンを消去します。
 */
export const clearAnnouncer = (politeness?: AnnouncePoliteness): void => {
  if (!isBrowser) {
    return;
  }

  for (const entry of Array.from(pendingTimers)) {
    if (!politeness || entry.politeness === politeness) {
      clearTimeout(entry.id);
      pendingTimers.delete(entry);
    }
  }

  if (!politeness || politeness === 'polite') {
    if (politeRegion) {
      politeRegion.textContent = '';
    }
  }

  if (!politeness || politeness === 'assertive') {
    if (assertiveRegion) {
      assertiveRegion.textContent = '';
    }
  }
};

/**
 * ライブリージョンのコンテナを DOM から削除し、すべてのタイマーと参照を破棄します。
 * テストのクリーンアップやティアダウンで使用します。
 */
export const destroyAnnouncer = (): void => {
  if (!isBrowser) {
    return;
  }

  clearAnnouncer();

  if (container) {
    if (typeof container.remove === 'function') {
      container.remove();
    } else {
      container.parentNode?.removeChild(container);
    }
    container = null;
  }
  politeRegion = null;
  assertiveRegion = null;
};
