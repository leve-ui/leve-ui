import { createDOM } from '@builder.io/qwik/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { screen } = await createDOM();
(globalThis as unknown as { document: Document }).document =
  screen.ownerDocument as unknown as Document;
(globalThis as unknown as { window: unknown }).window = (
  screen.ownerDocument as unknown as { defaultView: unknown }
).defaultView;

const { announce, clearAnnouncer, destroyAnnouncer } = await import('./announcer');

describe('announcer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    destroyAnnouncer();
    vi.clearAllTimers();
  });

  it('コンテナと polite / assertive の両リージョンを正しい属性で作成し、複数回呼び出してもコンテナは 1 つだけ存在する', () => {
    announce('テスト1');
    announce('テスト2');

    const containers = document.body.querySelectorAll('[data-leve-announcer]');
    expect(containers.length).toBe(1);

    const container = containers[0];
    expect(container.hasAttribute('data-leve-announcer')).toBe(true);
    const style = container.getAttribute('style') ?? '';
    expect(style).toContain('position: absolute');
    expect(style).toContain('width: 1px');
    expect(style).toContain('height: 1px');
    expect(style).toContain('overflow: hidden');

    const politeRegion = container.querySelector('[data-leve-announcer-region="polite"]');
    expect(politeRegion).not.toBeNull();
    expect(politeRegion?.getAttribute('aria-live')).toBe('polite');
    expect(politeRegion?.getAttribute('aria-relevant')).toBe('additions');
    expect(politeRegion?.getAttribute('aria-atomic')).toBe('false');
    expect(politeRegion?.getAttribute('role')).toBe('log');

    const assertiveRegion = container.querySelector('[data-leve-announcer-region="assertive"]');
    expect(assertiveRegion).not.toBeNull();
    expect(assertiveRegion?.getAttribute('aria-live')).toBe('assertive');
    expect(assertiveRegion?.getAttribute('aria-relevant')).toBe('additions');
    expect(assertiveRegion?.getAttribute('aria-atomic')).toBe('false');
    expect(assertiveRegion?.getAttribute('role')).toBe('log');
  });

  it('初回通知は 100ms 後に追加され、以降の通知は同期的に追加される', () => {
    announce('初回メッセージ');

    const politeRegion = document.body.querySelector('[data-leve-announcer-region="polite"]');
    expect(politeRegion?.children.length).toBe(0);

    vi.advanceTimersByTime(99);
    expect(politeRegion?.children.length).toBe(0);

    vi.advanceTimersByTime(1);
    expect(politeRegion?.children.length).toBe(1);
    expect(politeRegion?.children[0]?.textContent).toBe('初回メッセージ');

    // 以降の通知は同期的に追加される
    announce('2回目のメッセージ');
    expect(politeRegion?.children.length).toBe(2);
    expect(politeRegion?.children[1]?.textContent).toBe('2回目のメッセージ');
  });

  it('デフォルトで polite リージョンに出力され、politeness: "assertive" の場合は assertive リージョンに出力される', () => {
    announce('通常メッセージ');
    announce('緊急メッセージ', { politeness: 'assertive' });

    vi.advanceTimersByTime(100);

    const politeRegion = document.body.querySelector('[data-leve-announcer-region="polite"]');
    const assertiveRegion = document.body.querySelector('[data-leve-announcer-region="assertive"]');

    expect(politeRegion?.textContent).toContain('通常メッセージ');
    expect(politeRegion?.textContent).not.toContain('緊急メッセージ');

    expect(assertiveRegion?.textContent).toContain('緊急メッセージ');
    expect(assertiveRegion?.textContent).not.toContain('通常メッセージ');
  });

  it('同一メッセージを2回通知した場合、2つのノードが追加される', () => {
    announce('同じメッセージ');
    vi.advanceTimersByTime(100);
    announce('同じメッセージ');

    const politeRegion = document.body.querySelector('[data-leve-announcer-region="polite"]');
    expect(politeRegion?.children.length).toBe(2);
    expect(politeRegion?.children[0]?.textContent).toBe('同じメッセージ');
    expect(politeRegion?.children[1]?.textContent).toBe('同じメッセージ');
  });

  it('メッセージノードはデフォルトで 7000ms 後に削除される', () => {
    announce('7秒で消えるメッセージ');
    vi.advanceTimersByTime(100);

    const politeRegion = document.body.querySelector('[data-leve-announcer-region="polite"]');
    expect(politeRegion?.children.length).toBe(1);

    vi.advanceTimersByTime(6999);
    expect(politeRegion?.children.length).toBe(1);

    vi.advanceTimersByTime(1);
    expect(politeRegion?.children.length).toBe(0);
  });

  it('カスタム timeout を指定した場合、その時間経過後に削除される', () => {
    announce('3秒で消えるメッセージ', { timeout: 3000 });
    vi.advanceTimersByTime(100);

    const politeRegion = document.body.querySelector('[data-leve-announcer-region="polite"]');
    expect(politeRegion?.children.length).toBe(1);

    vi.advanceTimersByTime(2999);
    expect(politeRegion?.children.length).toBe(1);

    vi.advanceTimersByTime(1);
    expect(politeRegion?.children.length).toBe(0);
  });

  it('空文字や空白のみのメッセージは無視され、コンテナも作成されない', () => {
    announce('');
    announce('   ');
    announce('\t\n');

    expect(document.body.querySelector('[data-leve-announcer]')).toBeFalsy();
  });

  it('clearAnnouncer("polite") で polite リージョンのノードが消去され、保留中の追加タイマーもキャンセルされる', () => {
    announce('保留中メッセージ');
    // 100ms 経過前にクリア
    vi.advanceTimersByTime(50);
    clearAnnouncer('polite');

    vi.advanceTimersByTime(100);
    const politeRegion = document.body.querySelector('[data-leve-announcer-region="polite"]');
    expect(politeRegion?.children.length).toBe(0);
  });

  it('clearAnnouncer("polite") は assertive リージョンに影響を与えない', () => {
    announce('通常メッセージ');
    announce('緊急メッセージ', { politeness: 'assertive' });
    vi.advanceTimersByTime(100);

    const politeRegion = document.body.querySelector('[data-leve-announcer-region="polite"]');
    const assertiveRegion = document.body.querySelector('[data-leve-announcer-region="assertive"]');

    expect(politeRegion?.children.length).toBe(1);
    expect(assertiveRegion?.children.length).toBe(1);

    clearAnnouncer('polite');

    expect(politeRegion?.children.length).toBe(0);
    expect(assertiveRegion?.children.length).toBe(1);
  });

  it('引数なしの clearAnnouncer() はすべてのリージョンを消去し、保留中の追加タイマーもキャンセルする', () => {
    announce('通常メッセージ');
    announce('緊急メッセージ', { politeness: 'assertive' });
    vi.advanceTimersByTime(100);

    const politeRegion = document.body.querySelector('[data-leve-announcer-region="polite"]');
    const assertiveRegion = document.body.querySelector('[data-leve-announcer-region="assertive"]');

    expect(politeRegion?.children.length).toBe(1);
    expect(assertiveRegion?.children.length).toBe(1);

    clearAnnouncer();

    expect(politeRegion?.children.length).toBe(0);
    expect(assertiveRegion?.children.length).toBe(0);
  });

  it('destroyAnnouncer() はコンテナを削除し、次の announce で再作成される', () => {
    announce('初回通知');
    expect(document.body.querySelector('[data-leve-announcer]')).toBeTruthy();

    destroyAnnouncer();
    expect(document.body.querySelector('[data-leve-announcer]')).toBeFalsy();

    announce('再作成通知');
    expect(document.body.querySelector('[data-leve-announcer]')).toBeTruthy();

    // 再作成時も初回同様 100ms 遅延する
    const politeRegion = document.body.querySelector('[data-leve-announcer-region="polite"]');
    expect(politeRegion?.children.length).toBe(0);

    vi.advanceTimersByTime(100);
    expect(politeRegion?.children.length).toBe(1);
    expect(politeRegion?.children[0]?.textContent).toBe('再作成通知');
  });

  it('外部要因でコンテナが DOM から削除された場合、次回の announce で再作成される', () => {
    announce('初期通知');
    vi.advanceTimersByTime(100);

    const container = document.body.querySelector('[data-leve-announcer]');
    expect(container).toBeTruthy();

    // 外部からコンテナを削除
    container?.remove();
    expect(document.body.querySelector('[data-leve-announcer]')).toBeFalsy();

    announce('再通知');
    const newContainer = document.body.querySelector('[data-leve-announcer]');
    expect(newContainer).toBeTruthy();

    // 新規作成されたため 100ms 後に追加される
    const politeRegion = newContainer?.querySelector('[data-leve-announcer-region="polite"]');
    expect(politeRegion?.children.length).toBe(0);

    vi.advanceTimersByTime(100);
    expect(politeRegion?.children.length).toBe(1);
    expect(politeRegion?.children[0]?.textContent).toBe('再通知');
  });

  it('isBrowser が false の場合は何もしない (サーバーセーフ)', async () => {
    vi.resetModules();
    vi.doMock('./env', () => ({ isBrowser: false }));
    const serverAnnouncer = await import('./announcer');

    serverAnnouncer.announce('サーバー上での通知');
    serverAnnouncer.clearAnnouncer();
    serverAnnouncer.destroyAnnouncer();

    expect(document.body.querySelector('[data-leve-announcer]')).toBeFalsy();
    vi.doUnmock('./env');
  });
});
