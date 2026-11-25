import { component$, type QRL, type Signal, useSignal } from '@builder.io/qwik';
import { renderToString } from '@builder.io/qwik/server';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { useControllableState } from './controllable-state';

type CounterProps = {
  'bind:value'?: Signal<number>;
  defaultValue?: number;
  onValueChange$?: QRL<(value: number) => void>;
};

/** useControllableState を使う、状態を持つコンポーネントの例 */
const Counter = component$<CounterProps>((props) => {
  const [value, setValue$] = useControllableState({
    value: props['bind:value'],
    defaultValue: props.defaultValue ?? 0,
    onChange$: props.onValueChange$,
  });

  return (
    <>
      <output id="inner">{value.value}</output>
      <button type="button" id="increment" onClick$={() => setValue$(value.value + 1)}>
        +1
      </button>
      <button type="button" id="same" onClick$={() => setValue$(value.value)}>
        same
      </button>
    </>
  );
});

function text(screen: HTMLElement, selector: string) {
  return screen.querySelector(selector)?.textContent;
}

describe('useControllableState', () => {
  describe('非制御（default*）', () => {
    it('defaultValue を初期値にする', async () => {
      const { screen, render } = await createDOM();
      await render(<Counter defaultValue={5} />);

      expect(text(screen, '#inner')).toBe('5');
    });

    it('defaultValue を省略したときはフォールバックの値を使う', async () => {
      const { screen, render } = await createDOM();
      await render(<Counter />);

      expect(text(screen, '#inner')).toBe('0');
    });

    it('setter で値を更新し、onChange$ に新しい値を渡す', async () => {
      const Parent = component$(() => {
        const log = useSignal<number[]>([]);
        return (
          <>
            <Counter defaultValue={1} onValueChange$={(v) => (log.value = [...log.value, v])} />
            <output id="log">{log.value.join(',')}</output>
          </>
        );
      });
      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      await userEvent('#increment', 'click');
      await userEvent('#increment', 'click');

      expect(text(screen, '#inner')).toBe('3');
      expect(text(screen, '#log')).toBe('2,3');
    });
  });

  describe('制御（bind:）', () => {
    const Parent = component$(() => {
      const value = useSignal(10);
      const log = useSignal<number[]>([]);
      return (
        <>
          <Counter
            bind:value={value}
            defaultValue={99}
            onValueChange$={(v) => (log.value = [...log.value, v])}
          />
          <output id="outer">{value.value}</output>
          <output id="log">{log.value.join(',')}</output>
          <button type="button" id="external" onClick$={() => (value.value = 50)}>
            external
          </button>
        </>
      );
    });

    it('bind した Signal の値を初期値にし、defaultValue は無視する', async () => {
      const { screen, render } = await createDOM();
      await render(<Parent />);

      expect(text(screen, '#inner')).toBe('10');
    });

    it('setter で親の Signal を更新し、onChange$ を呼ぶ', async () => {
      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      await userEvent('#increment', 'click');

      expect(text(screen, '#inner')).toBe('11');
      expect(text(screen, '#outer')).toBe('11');
      expect(text(screen, '#log')).toBe('11');
    });

    it('親が Signal を書き換えると追従し、onChange$ は呼ばない', async () => {
      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      await userEvent('#external', 'click');

      expect(text(screen, '#inner')).toBe('50');
      expect(text(screen, '#log')).toBe('');
    });
  });

  it('同じ値を設定したときは onChange$ を呼ばない', async () => {
    const Parent = component$(() => {
      const log = useSignal<number[]>([]);
      return (
        <>
          <Counter defaultValue={1} onValueChange$={(v) => (log.value = [...log.value, v])} />
          <output id="log">{log.value.join(',')}</output>
        </>
      );
    });
    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    await userEvent('#same', 'click');

    expect(text(screen, '#inner')).toBe('1');
    expect(text(screen, '#log')).toBe('');
  });

  describe('SSR', () => {
    // SSR ではイベントハンドラの QRL を HTML に書き出すためにビルド情報が必要になるので、
    // ハンドラを持たない表示専用のコンポーネントで確認する
    const Display = component$<CounterProps>((props) => {
      const [value] = useControllableState({
        value: props['bind:value'],
        defaultValue: props.defaultValue ?? 0,
      });
      return <output id="inner">{value.value}</output>;
    });

    /** SSR の HTML から #inner の値を取り出す（Qwik のテキスト用コメントは除く） */
    function ssrInner(html: string) {
      return html
        .match(/<output id="inner"[^>]*>([\s\S]*?)<\/output>/)?.[1]
        .replace(/<!--[\s\S]*?-->/g, '');
    }

    it('非制御のときは defaultValue を初期値として出力する', async () => {
      const { html } = await renderToString(<Display defaultValue={3} />, {
        containerTagName: 'div',
      });

      expect(ssrInner(html)).toBe('3');
    });

    it('制御のときは bind した Signal の値を初期値として出力する', async () => {
      const Parent = component$(() => {
        const value = useSignal(7);
        return <Display bind:value={value} defaultValue={3} />;
      });
      const { html } = await renderToString(<Parent />, { containerTagName: 'div' });

      expect(ssrInner(html)).toBe('7');
    });
  });

  describe('reset$', () => {
    const ResetCounter = component$<CounterProps>((props) => {
      const [value, setValue$, reset$] = useControllableState({
        value: props['bind:value'],
        defaultValue: props.defaultValue ?? 0,
        onChange$: props.onValueChange$,
      });

      return (
        <>
          <output id="inner">{value.value}</output>
          <button type="button" id="increment" onClick$={() => setValue$(value.value + 1)}>
            +1
          </button>
          <button type="button" id="reset" onClick$={() => reset$()}>
            reset
          </button>
        </>
      );
    });

    const ResetTags = component$<{
      'bind:value'?: Signal<string[]>;
      defaultValue?: string[];
      onValueChange$?: QRL<(value: string[]) => void>;
    }>((props) => {
      const [value, setValue$, reset$] = useControllableState<string[]>({
        value: props['bind:value'],
        defaultValue: props.defaultValue ?? [],
        onChange$: props.onValueChange$,
      });

      return (
        <>
          <output id="tags">{value.value.join(',')}</output>
          <button type="button" id="add-tag" onClick$={() => setValue$([...value.value, 'extra'])}>
            add
          </button>
          <button type="button" id="reset" onClick$={() => reset$()}>
            reset
          </button>
        </>
      );
    });

    it('非制御（プリミティブ）のとき reset$ で defaultValue に戻り、onChange$ が呼ばれる', async () => {
      const Parent = component$(() => {
        const log = useSignal<number[]>([]);
        return (
          <>
            <ResetCounter
              defaultValue={5}
              onValueChange$={(v) => (log.value = [...log.value, v])}
            />
            <output id="log">{log.value.join(',')}</output>
          </>
        );
      });
      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      await userEvent('#increment', 'click');
      expect(text(screen, '#inner')).toBe('6');

      await userEvent('#reset', 'click');
      expect(text(screen, '#inner')).toBe('5');
      expect(text(screen, '#log')).toBe('6,5');
    });

    it('非制御（プリミティブ）で値が変わっていないとき reset$ は onChange$ を呼ばない', async () => {
      const Parent = component$(() => {
        const log = useSignal<number[]>([]);
        return (
          <>
            <ResetCounter
              defaultValue={5}
              onValueChange$={(v) => (log.value = [...log.value, v])}
            />
            <output id="log">{log.value.join(',')}</output>
          </>
        );
      });
      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      await userEvent('#reset', 'click');
      expect(text(screen, '#inner')).toBe('5');
      expect(text(screen, '#log')).toBe('');
    });

    it('非制御（配列）のとき reset$ で初期配列のコピーに戻り、未変更なら onChange$ を呼ばない', async () => {
      const Parent = component$(() => {
        const changes = useSignal(0);
        return (
          <>
            <ResetTags defaultValue={['a']} onValueChange$={() => (changes.value += 1)} />
            <output id="changes">{changes.value}</output>
          </>
        );
      });
      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      expect(text(screen, '#tags')).toBe('a');
      await userEvent('#reset', 'click');
      expect(text(screen, '#changes')).toBe('0');

      await userEvent('#add-tag', 'click');
      expect(text(screen, '#tags')).toBe('a,extra');
      expect(text(screen, '#changes')).toBe('1');

      await userEvent('#reset', 'click');
      expect(text(screen, '#tags')).toBe('a');
      expect(text(screen, '#changes')).toBe('2');

      await userEvent('#reset', 'click');
      expect(text(screen, '#changes')).toBe('2');
    });

    it('制御モードのとき reset$ は何もせず、bind した Signal も onChange$ も変えない', async () => {
      const Parent = component$(() => {
        const value = useSignal(20);
        const log = useSignal<number[]>([]);
        return (
          <>
            <ResetCounter
              bind:value={value}
              defaultValue={5}
              onValueChange$={(v) => (log.value = [...log.value, v])}
            />
            <output id="outer">{value.value}</output>
            <output id="log">{log.value.join(',')}</output>
          </>
        );
      });
      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      await userEvent('#reset', 'click');
      expect(text(screen, '#inner')).toBe('20');
      expect(text(screen, '#outer')).toBe('20');
      expect(text(screen, '#log')).toBe('');
    });
  });
});
