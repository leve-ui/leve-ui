import { component$, Slot, useComputed$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import {
  type FieldIds,
  type UseFieldControlOptions,
  useFieldContext,
  useFieldControl,
  useFieldProvider,
} from './field';

interface TestFieldProps {
  ids?: Partial<FieldIds>;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  hasDescription?: boolean;
}

const TestField = component$<TestFieldProps>((props) => {
  const invalid = useComputed$(() => Boolean(props.invalid));
  const disabled = useComputed$(() => Boolean(props.disabled));
  const required = useComputed$(() => Boolean(props.required));
  const hasDescription = useComputed$(() => Boolean(props.hasDescription));

  useFieldProvider({
    ids: props.ids,
    invalid,
    disabled,
    required,
    hasDescription,
  });

  return (
    <div>
      <Slot />
    </div>
  );
});

const TestControl = component$<UseFieldControlOptions>((props) => {
  const state = useFieldControl(props);
  return (
    <input
      id={state.value.id}
      aria-describedby={state.value.describedBy}
      aria-invalid={state.value.invalid ? 'true' : undefined}
      disabled={state.value.disabled}
      required={state.value.required}
      data-label-id={state.value.labelId}
    />
  );
});

const TestLabel = component$(() => {
  const field = useFieldContext();
  return (
    <label for={field?.ids.control} id={field?.ids.label}>
      <Slot />
    </label>
  );
});

function getInput(screen: HTMLElement): HTMLInputElement | null {
  return screen.querySelector('input');
}

function getLabel(screen: HTMLElement): HTMLLabelElement | null {
  return screen.querySelector('label');
}

describe('field', () => {
  describe('Field の外', () => {
    it('props.id が指定された場合はその id を使う', async () => {
      const { screen, render } = await createDOM();
      await render(<TestControl id="custom-control-id" />);

      expect(getInput(screen)?.id).toBe('custom-control-id');
    });

    it('id を省略した場合は生成された id を使う', async () => {
      const { screen, render } = await createDOM();
      await render(<TestControl />);

      const input = getInput(screen);
      expect(input?.id).toBeTruthy();
      expect(typeof input?.id).toBe('string');
      expect((input?.id ?? '').length).toBeGreaterThan(0);
    });

    it('labelId は undefined になる（data-label-id が付かない）', async () => {
      const { screen, render } = await createDOM();
      await render(<TestControl />);

      expect(getInput(screen)?.getAttribute('data-label-id')).toBeNull();
    });

    it('aria-describedby は props の指定のみが反映される', async () => {
      const { screen, render } = await createDOM();
      await render(<TestControl aria-describedby="hint-id" />);

      expect(getInput(screen)?.getAttribute('aria-describedby')).toBe('hint-id');
    });

    it('aria-describedby を省略した場合は属性が付かない', async () => {
      const { screen, render } = await createDOM();
      await render(<TestControl />);

      expect(getInput(screen)?.getAttribute('aria-describedby')).toBeNull();
    });

    it('props から invalid / disabled / required が反映される', async () => {
      const { screen, render } = await createDOM();
      await render(<TestControl invalid disabled required />);

      const input = getInput(screen);
      expect(input?.getAttribute('aria-invalid')).toBe('true');
      expect(input?.disabled).toBe(true);
      expect(input?.required).toBe(true);
    });

    it('props でフラグが false のときは属性が付かない / false になる', async () => {
      const { screen, render } = await createDOM();
      await render(<TestControl />);

      const input = getInput(screen);
      expect(input?.getAttribute('aria-invalid')).toBeNull();
      expect(input?.disabled).toBe(false);
      expect(input?.required).toBe(false);
    });
  });

  describe('Field の中', () => {
    it('コントロールの id とラベルの for が一致する', async () => {
      const { screen, render } = await createDOM();
      await render(
        <TestField>
          <TestLabel>ラベル</TestLabel>
          <TestControl />
        </TestField>,
      );

      const input = getInput(screen);
      const label = getLabel(screen);
      expect(input?.id).toBeTruthy();
      expect(label?.getAttribute('for')).toBe(input?.id);
    });

    it('ids prop で各 id（control / label / description / errorMessage）を個別に上書きできる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <TestField
          ids={{
            control: 'my-control',
            label: 'my-label',
            description: 'my-description',
            errorMessage: 'my-error',
          }}
          hasDescription
          invalid
        >
          <TestLabel>ラベル</TestLabel>
          <TestControl />
        </TestField>,
      );

      const input = getInput(screen);
      const label = getLabel(screen);
      expect(input?.id).toBe('my-control');
      expect(label?.id).toBe('my-label');
      expect(label?.getAttribute('for')).toBe('my-control');
      expect(input?.getAttribute('data-label-id')).toBe('my-label');
      expect(input?.getAttribute('aria-describedby')).toBe('my-description my-error');
    });

    it('Field の中ではコントロールの props.id は無視され、Field の control id が使われる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <TestField ids={{ control: 'field-control-id' }}>
          <TestControl id="ignored-control-id" />
        </TestField>,
      );

      const input = getInput(screen);
      expect(input?.id).toBe('field-control-id');
      expect(input?.id).not.toBe('ignored-control-id');
    });

    it('Field の invalid / disabled / required が伝搬し、コントロールの props と OR 結合される', async () => {
      // Field が true、コントロールが false の場合
      const { screen: screen1, render: render1 } = await createDOM();
      await render1(
        <TestField invalid disabled required>
          <TestControl />
        </TestField>,
      );
      const input1 = getInput(screen1);
      expect(input1?.getAttribute('aria-invalid')).toBe('true');
      expect(input1?.disabled).toBe(true);
      expect(input1?.required).toBe(true);

      // Field が false、コントロールが true の場合
      const { screen: screen2, render: render2 } = await createDOM();
      await render2(
        <TestField>
          <TestControl invalid disabled required />
        </TestField>,
      );
      const input2 = getInput(screen2);
      expect(input2?.getAttribute('aria-invalid')).toBe('true');
      expect(input2?.disabled).toBe(true);
      expect(input2?.required).toBe(true);

      // 両方が false の場合
      const { screen: screen3, render: render3 } = await createDOM();
      await render3(
        <TestField>
          <TestControl />
        </TestField>,
      );
      const input3 = getInput(screen3);
      expect(input3?.getAttribute('aria-invalid')).toBeNull();
      expect(input3?.disabled).toBe(false);
      expect(input3?.required).toBe(false);
    });

    it('hasDescription が true のときだけ description id が describedBy に含まれる', async () => {
      // hasDescription が false の場合
      const { screen: screen1, render: render1 } = await createDOM();
      await render1(
        <TestField ids={{ description: 'custom-desc' }}>
          <TestControl />
        </TestField>,
      );
      expect(getInput(screen1)?.getAttribute('aria-describedby')).toBeNull();

      // hasDescription が true の場合
      const { screen: screen2, render: render2 } = await createDOM();
      await render2(
        <TestField ids={{ description: 'custom-desc' }} hasDescription>
          <TestControl />
        </TestField>,
      );
      expect(getInput(screen2)?.getAttribute('aria-describedby')).toBe('custom-desc');
    });

    it('Field が invalid のときだけ error message id が含まれ、コントロール単体の invalid では含まれない', async () => {
      // コントロール単体のみ invalid（Field は invalid: false）
      const { screen: screen1, render: render1 } = await createDOM();
      await render1(
        <TestField ids={{ errorMessage: 'custom-error' }}>
          <TestControl invalid />
        </TestField>,
      );
      const input1 = getInput(screen1);
      expect(input1?.getAttribute('aria-invalid')).toBe('true');
      expect(input1?.getAttribute('aria-describedby')).toBeNull();

      // Field が invalid の場合
      const { screen: screen2, render: render2 } = await createDOM();
      await render2(
        <TestField ids={{ errorMessage: 'custom-error' }} invalid>
          <TestControl />
        </TestField>,
      );
      const input2 = getInput(screen2);
      expect(input2?.getAttribute('aria-invalid')).toBe('true');
      expect(input2?.getAttribute('aria-describedby')).toBe('custom-error');
    });

    it('利用者の aria-describedby が先頭に保持される', async () => {
      const { screen, render } = await createDOM();
      await render(
        <TestField
          ids={{ description: 'field-desc', errorMessage: 'field-error' }}
          hasDescription
          invalid
        >
          <TestControl aria-describedby="user-hint" />
        </TestField>,
      );

      expect(getInput(screen)?.getAttribute('aria-describedby')).toBe(
        'user-hint field-desc field-error',
      );
    });

    it('該当する id がない場合は describedBy が undefined になり属性が付かない', async () => {
      const { screen, render } = await createDOM();
      await render(
        <TestField ids={{ description: 'field-desc', errorMessage: 'field-error' }}>
          <TestControl />
        </TestField>,
      );

      expect(getInput(screen)?.getAttribute('aria-describedby')).toBeNull();
    });

    it('labelId は Field の label id と一致する', async () => {
      const { screen, render } = await createDOM();
      await render(
        <TestField ids={{ label: 'custom-label' }}>
          <TestControl />
        </TestField>,
      );

      expect(getInput(screen)?.getAttribute('data-label-id')).toBe('custom-label');
    });
  });

  describe('リアクティビティ', () => {
    it('Field の invalid を束ねた Signal をトグルすると aria-invalid と aria-describedby が更新される', async () => {
      const Wrapper = component$(() => {
        const invalid = useSignal(false);
        return (
          <div>
            <button
              type="button"
              id="toggle"
              onClick$={() => {
                invalid.value = !invalid.value;
              }}
            >
              toggle
            </button>
            <TestField
              invalid={invalid.value}
              hasDescription
              ids={{ description: 'field-desc', errorMessage: 'field-error' }}
            >
              <TestControl />
            </TestField>
          </div>
        );
      });

      const { screen, render, userEvent } = await createDOM();
      await render(<Wrapper />);

      const input = getInput(screen);
      expect(input?.getAttribute('aria-invalid')).toBeNull();
      expect(input?.getAttribute('aria-describedby')).toBe('field-desc');

      await userEvent('#toggle', 'click');

      expect(input?.getAttribute('aria-invalid')).toBe('true');
      expect(input?.getAttribute('aria-describedby')).toBe('field-desc field-error');

      await userEvent('#toggle', 'click');

      expect(input?.getAttribute('aria-invalid')).toBeNull();
      expect(input?.getAttribute('aria-describedby')).toBe('field-desc');
    });
  });

  describe('useFieldContext', () => {
    it('Field の外では null を返す', async () => {
      const ContextConsumer = component$(() => {
        const field = useFieldContext();
        return <output id="context-val">{field === null ? 'is-null' : 'not-null'}</output>;
      });

      const { screen, render } = await createDOM();
      await render(<ContextConsumer />);

      expect(screen.querySelector('#context-val')?.textContent).toBe('is-null');
    });
  });
});
