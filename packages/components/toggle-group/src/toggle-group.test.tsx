import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { ToggleGroup } from './index';

describe('ToggleGroup', () => {
  describe('Root', () => {
    it('role="group" と data-leve-toggle-group が付与され、デフォルトで horizontal となる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root aria-label="Text formatting" class="my-group">
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const root = screen.querySelector('[data-leve-toggle-group]');
      expect(root).not.toBeNull();
      expect(root?.getAttribute('role')).toBe('group');
      expect(root?.getAttribute('data-orientation')).toBe('horizontal');
      expect(root?.hasAttribute('data-disabled')).toBe(false);
      expect(root?.getAttribute('aria-label')).toBe('Text formatting');
      expect(root?.getAttribute('class')).toBe('my-group');
    });

    it('orientation="vertical" で data-orientation="vertical" となる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root orientation="vertical">
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const root = screen.querySelector('[data-leve-toggle-group]');
      expect(root?.getAttribute('data-orientation')).toBe('vertical');
    });

    it('disabled を指定すると Root に data-disabled が付与される', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root disabled>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const root = screen.querySelector('[data-leve-toggle-group]');
      expect(root?.hasAttribute('data-disabled')).toBe(true);
    });
  });

  describe('Item', () => {
    it('button 要素として描画され、初期状態は未押下（aria-pressed="false"、data-state="off"）となる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root>
          <ToggleGroup.Item value="bold" class="item-btn" aria-label="Bold style">
            Bold
          </ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const item = screen.querySelector('[data-leve-toggle-group-item]');
      expect(item).not.toBeNull();
      expect(item?.tagName).toBe('BUTTON');
      expect(item?.getAttribute('type')).toBe('button');
      expect(item?.getAttribute('aria-pressed')).toBe('false');
      expect(item?.getAttribute('data-state')).toBe('off');
      expect(item?.getAttribute('value')).toBe('bold');
      expect(item?.getAttribute('class')).toBe('item-btn');
      expect(item?.getAttribute('aria-label')).toBe('Bold style');
      expect(item?.getAttribute('data-orientation')).toBe('horizontal');
    });
  });

  describe('single モード（デフォルト）', () => {
    it('defaultValue で初期押下され、別アイテムをクリックすると切り替わり、押下中をクリックすると解除される', async () => {
      const { screen, render, userEvent } = await createDOM();
      await render(
        <ToggleGroup.Root defaultValue={['left']}>
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
          <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
          <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.getAttribute('aria-pressed')).toBe('true');
      expect(items[0]?.getAttribute('data-state')).toBe('on');
      expect(items[1]?.getAttribute('aria-pressed')).toBe('false');
      expect(items[1]?.getAttribute('data-state')).toBe('off');

      // Click center -> left unpresses, center presses
      await userEvent('[value="center"]', 'click');
      expect(items[0]?.getAttribute('aria-pressed')).toBe('false');
      expect(items[0]?.getAttribute('data-state')).toBe('off');
      expect(items[1]?.getAttribute('aria-pressed')).toBe('true');
      expect(items[1]?.getAttribute('data-state')).toBe('on');

      // Click center again -> unpresses
      await userEvent('[value="center"]', 'click');
      expect(items[1]?.getAttribute('aria-pressed')).toBe('false');
      expect(items[1]?.getAttribute('data-state')).toBe('off');
    });
  });

  describe('multiple モード', () => {
    it('複数のアイテムを同時に押下でき、個別に解除できる', async () => {
      const { screen, render, userEvent } = await createDOM();
      await render(
        <ToggleGroup.Root type="multiple" defaultValue={['bold']}>
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
          <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.getAttribute('aria-pressed')).toBe('true');
      expect(items[1]?.getAttribute('aria-pressed')).toBe('false');
      expect(items[2]?.getAttribute('aria-pressed')).toBe('false');

      // Click italic -> bold and italic both pressed
      await userEvent('[value="italic"]', 'click');
      expect(items[0]?.getAttribute('aria-pressed')).toBe('true');
      expect(items[1]?.getAttribute('aria-pressed')).toBe('true');
      expect(items[2]?.getAttribute('aria-pressed')).toBe('false');

      // Click bold -> bold unpressed, italic still pressed
      await userEvent('[value="bold"]', 'click');
      expect(items[0]?.getAttribute('aria-pressed')).toBe('false');
      expect(items[1]?.getAttribute('aria-pressed')).toBe('true');
      expect(items[2]?.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('制御モード（bind:value）', () => {
    it('クリックで bind:value の Signal が更新され、onValueChange$ が呼ばれ、外部変更も反映される', async () => {
      const Parent = component$(() => {
        const val = useSignal<string[]>(['italic']);
        const log = useSignal<string[]>([]);
        return (
          <>
            <ToggleGroup.Root
              type="multiple"
              bind:value={val}
              onValueChange$={(next) => {
                log.value = [...log.value, next.join('+')];
              }}
            >
              <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
              <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
            </ToggleGroup.Root>
            <output id="val">{val.value.join(',')}</output>
            <output id="log">{log.value.join('|')}</output>
            <button
              type="button"
              id="ext"
              onClick$={() => {
                val.value = ['bold', 'italic'];
              }}
            >
              Set Both
            </button>
          </>
        );
      });

      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.getAttribute('aria-pressed')).toBe('false');
      expect(items[1]?.getAttribute('aria-pressed')).toBe('true');
      expect(screen.querySelector('#val')?.textContent).toBe('italic');

      // Click bold
      await userEvent('[value="bold"]', 'click');
      expect(items[0]?.getAttribute('aria-pressed')).toBe('true');
      expect(items[1]?.getAttribute('aria-pressed')).toBe('true');
      expect(screen.querySelector('#val')?.textContent).toBe('italic,bold');
      expect(screen.querySelector('#log')?.textContent).toBe('italic+bold');

      // External update
      await userEvent('#ext', 'click');
      expect(items[0]?.getAttribute('aria-pressed')).toBe('true');
      expect(items[1]?.getAttribute('aria-pressed')).toBe('true');
      expect(screen.querySelector('#val')?.textContent).toBe('bold,italic');
    });
  });

  describe('disabled 状態', () => {
    it('Item に disabled を指定すると disabled 属性と data-disabled が付き、クリックしても状態が変わらない', async () => {
      const Parent = component$(() => {
        const val = useSignal<string[]>([]);
        return (
          <ToggleGroup.Root bind:value={val}>
            <ToggleGroup.Item value="a">A</ToggleGroup.Item>
            <ToggleGroup.Item value="b" disabled>
              B
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        );
      });

      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[1]?.hasAttribute('disabled')).toBe(true);
      expect(items[1]?.hasAttribute('data-disabled')).toBe(true);

      await userEvent('[value="b"]', 'click');
      expect(items[1]?.getAttribute('aria-pressed')).toBe('false');
      expect(items[1]?.getAttribute('data-state')).toBe('off');
    });

    it('Root に disabled を指定すると全 Item が disabled となり、クリックしても状態が変わらない', async () => {
      const Parent = component$(() => {
        const val = useSignal<string[]>([]);
        return (
          <ToggleGroup.Root disabled bind:value={val}>
            <ToggleGroup.Item value="a">A</ToggleGroup.Item>
            <ToggleGroup.Item value="b">B</ToggleGroup.Item>
          </ToggleGroup.Root>
        );
      });

      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.hasAttribute('disabled')).toBe(true);
      expect(items[0]?.hasAttribute('data-disabled')).toBe(true);
      expect(items[1]?.hasAttribute('disabled')).toBe(true);
      expect(items[1]?.hasAttribute('data-disabled')).toBe(true);

      await userEvent('[value="a"]', 'click');
      expect(items[0]?.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('ロービングタブインデックス', () => {
    it('押下されている有効な Item があればそれが tabIndex=0 となり、他は -1 となる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root defaultValue={['center']}>
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
          <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
          <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.getAttribute('tabindex')).toBe('-1');
      expect(items[1]?.getAttribute('tabindex')).toBe('0');
      expect(items[2]?.getAttribute('tabindex')).toBe('-1');
    });

    it('未選択時は最初の有効な Item が tabIndex=0 となり、他は -1 となる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root>
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
          <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
          <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.getAttribute('tabindex')).toBe('0');
      expect(items[1]?.getAttribute('tabindex')).toBe('-1');
      expect(items[2]?.getAttribute('tabindex')).toBe('-1');
    });

    it('先頭の Item が disabled の場合、最初の有効な Item が tabIndex=0 となる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root>
          <ToggleGroup.Item value="left" disabled>
            Left
          </ToggleGroup.Item>
          <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
          <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.getAttribute('tabindex')).toBe('-1');
      expect(items[1]?.getAttribute('tabindex')).toBe('0');
      expect(items[2]?.getAttribute('tabindex')).toBe('-1');
    });

    it('複数の押下アイテムがある場合、最初の有効な押下 Item が tabIndex=0 となる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root type="multiple" defaultValue={['center', 'right']}>
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
          <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
          <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.getAttribute('tabindex')).toBe('-1');
      expect(items[1]?.getAttribute('tabindex')).toBe('0');
      expect(items[2]?.getAttribute('tabindex')).toBe('-1');
    });

    it('押下中の Item が disabled の場合、最初の有効な Item が tabIndex=0 となる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root defaultValue={['left']}>
          <ToggleGroup.Item value="left" disabled>
            Left
          </ToggleGroup.Item>
          <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
          <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.getAttribute('tabindex')).toBe('-1');
      expect(items[1]?.getAttribute('tabindex')).toBe('0');
      expect(items[2]?.getAttribute('tabindex')).toBe('-1');
    });

    it('存在しない defaultValue が指定された場合、最初の有効な Item が tabIndex=0 となる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root defaultValue={['nonexistent']}>
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
          <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
          <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.getAttribute('tabindex')).toBe('0');
      expect(items[1]?.getAttribute('tabindex')).toBe('-1');
      expect(items[2]?.getAttribute('tabindex')).toBe('-1');
    });

    it('rovingFocus={false} のとき、Item に tabindex 属性が付与されない', async () => {
      const { screen, render } = await createDOM();
      await render(
        <ToggleGroup.Root rovingFocus={false} defaultValue={['center']}>
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
          <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
          <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
        </ToggleGroup.Root>,
      );

      const items = screen.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]');
      expect(items[0]?.hasAttribute('tabindex')).toBe(false);
      expect(items[1]?.hasAttribute('tabindex')).toBe(false);
      expect(items[2]?.hasAttribute('tabindex')).toBe(false);
    });
  });
});
