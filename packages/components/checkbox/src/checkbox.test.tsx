import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Field } from '@leve-ui/field';
import { describe, expect, it } from 'vitest';
import { Checkbox, type CheckboxCheckedState } from './index';

describe('Checkbox', () => {
  it('各パーツが正しい要素と data 属性で描画され、Indicator に aria-hidden、Control に type="button" と role="checkbox" が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Checkbox.Root>
        <Checkbox.Label>Accept terms</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>,
    );

    const root = screen.querySelector('[data-leve-checkbox]');
    const label = screen.querySelector('[data-leve-checkbox-label]');
    const control = screen.querySelector('[data-leve-checkbox-control]');
    const indicator = screen.querySelector('[data-leve-checkbox-indicator]');
    const hiddenInput = screen.querySelector('[data-leve-checkbox-hidden-input]');

    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('DIV');
    expect(root?.hasAttribute('data-leve-checkbox')).toBe(true);

    expect(label).not.toBeNull();
    expect(label?.tagName).toBe('LABEL');
    expect(label?.hasAttribute('data-leve-checkbox-label')).toBe(true);

    expect(control).not.toBeNull();
    expect(control?.tagName).toBe('BUTTON');
    expect(control?.getAttribute('type')).toBe('button');
    expect(control?.getAttribute('role')).toBe('checkbox');
    expect(control?.hasAttribute('data-leve-checkbox-control')).toBe(true);

    expect(indicator).not.toBeNull();
    expect(indicator?.tagName).toBe('SPAN');
    expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    expect(indicator?.hasAttribute('data-leve-checkbox-indicator')).toBe(true);
    expect(indicator?.textContent).toBe('✓');

    expect(hiddenInput).not.toBeNull();
    expect(hiddenInput?.tagName).toBe('INPUT');
    expect(hiddenInput?.getAttribute('type')).toBe('checkbox');
    expect(hiddenInput?.getAttribute('aria-hidden')).toBe('true');
    expect(hiddenInput?.getAttribute('tabindex')).toBe('-1');
    expect(hiddenInput?.hasAttribute('data-leve-checkbox-hidden-input')).toBe(true);
  });

  it('デフォルトで未チェック状態となり、aria-checked="false"、全パーツに data-state="unchecked" が付き、HiddenInput はチェックされない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Checkbox.Root>
        <Checkbox.Label>Accept terms</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>,
    );

    const root = screen.querySelector('[data-leve-checkbox]');
    const label = screen.querySelector('[data-leve-checkbox-label]');
    const control = screen.querySelector('[data-leve-checkbox-control]');
    const indicator = screen.querySelector('[data-leve-checkbox-indicator]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-checkbox-hidden-input]');

    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(root?.getAttribute('data-state')).toBe('unchecked');
    expect(label?.getAttribute('data-state')).toBe('unchecked');
    expect(control?.getAttribute('data-state')).toBe('unchecked');
    expect(indicator?.getAttribute('data-state')).toBe('unchecked');
    expect(hiddenInput?.getAttribute('data-state')).toBe('unchecked');
    expect(hiddenInput?.checked).toBe(false);
    expect(hiddenInput?.indeterminate).toBe(false);
  });

  it('defaultChecked={true} を指定すると初期状態で aria-checked="true"、data-state="checked"、HiddenInput がチェックされる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Checkbox.Root defaultChecked={true}>
        <Checkbox.Label>Accept terms</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>,
    );

    const root = screen.querySelector('[data-leve-checkbox]');
    const label = screen.querySelector('[data-leve-checkbox-label]');
    const control = screen.querySelector('[data-leve-checkbox-control]');
    const indicator = screen.querySelector('[data-leve-checkbox-indicator]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-checkbox-hidden-input]');

    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(root?.getAttribute('data-state')).toBe('checked');
    expect(label?.getAttribute('data-state')).toBe('checked');
    expect(control?.getAttribute('data-state')).toBe('checked');
    expect(indicator?.getAttribute('data-state')).toBe('checked');
    expect(hiddenInput?.getAttribute('data-state')).toBe('checked');
    expect(hiddenInput?.checked).toBe(true);
    expect(hiddenInput?.indeterminate).toBe(false);
  });

  it('defaultChecked="indeterminate" を指定すると初期状態で aria-checked="mixed"、全パーツに data-state="indeterminate" が付き、HiddenInput の indeterminate が true になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Checkbox.Root defaultChecked="indeterminate">
        <Checkbox.Label>Select all</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>-</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>,
    );

    const root = screen.querySelector('[data-leve-checkbox]');
    const label = screen.querySelector('[data-leve-checkbox-label]');
    const control = screen.querySelector('[data-leve-checkbox-control]');
    const indicator = screen.querySelector('[data-leve-checkbox-indicator]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-checkbox-hidden-input]');

    expect(control?.getAttribute('aria-checked')).toBe('mixed');
    expect(root?.getAttribute('data-state')).toBe('indeterminate');
    expect(label?.getAttribute('data-state')).toBe('indeterminate');
    expect(control?.getAttribute('data-state')).toBe('indeterminate');
    expect(indicator?.getAttribute('data-state')).toBe('indeterminate');
    expect(hiddenInput?.getAttribute('data-state')).toBe('indeterminate');
    expect(hiddenInput?.checked).toBe(false);
    expect(hiddenInput?.indeterminate).toBe(true);
  });

  it('Control のクリックで（非制御）トグルし、全パーツの状態と HiddenInput の checked が更新される', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Checkbox.Root>
        <Checkbox.Label>Accept terms</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>,
    );

    const root = screen.querySelector('[data-leve-checkbox]');
    const label = screen.querySelector('[data-leve-checkbox-label]');
    const control = screen.querySelector('[data-leve-checkbox-control]');
    const indicator = screen.querySelector('[data-leve-checkbox-indicator]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-checkbox-hidden-input]');

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(root?.getAttribute('data-state')).toBe('checked');
    expect(label?.getAttribute('data-state')).toBe('checked');
    expect(control?.getAttribute('data-state')).toBe('checked');
    expect(indicator?.getAttribute('data-state')).toBe('checked');
    expect(hiddenInput?.getAttribute('data-state')).toBe('checked');
    expect(hiddenInput?.checked).toBe(true);
    expect(hiddenInput?.indeterminate).toBe(false);

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(root?.getAttribute('data-state')).toBe('unchecked');
    expect(label?.getAttribute('data-state')).toBe('unchecked');
    expect(control?.getAttribute('data-state')).toBe('unchecked');
    expect(indicator?.getAttribute('data-state')).toBe('unchecked');
    expect(hiddenInput?.getAttribute('data-state')).toBe('unchecked');
    expect(hiddenInput?.checked).toBe(false);
    expect(hiddenInput?.indeterminate).toBe(false);
  });

  it('indeterminate 状態からクリックすると checked になり、もう一度クリックすると unchecked になる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Checkbox.Root defaultChecked="indeterminate">
        <Checkbox.Label>Select all</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>-</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>,
    );

    const control = screen.querySelector('[data-leve-checkbox-control]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-checkbox-hidden-input]');

    expect(control?.getAttribute('aria-checked')).toBe('mixed');
    expect(hiddenInput?.indeterminate).toBe(true);

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(control?.getAttribute('data-state')).toBe('checked');
    expect(hiddenInput?.checked).toBe(true);
    expect(hiddenInput?.indeterminate).toBe(false);

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(control?.getAttribute('data-state')).toBe('unchecked');
    expect(hiddenInput?.checked).toBe(false);
    expect(hiddenInput?.indeterminate).toBe(false);
  });

  it('bind:checked で初期値が反映され、クリックで Signal が更新され、外部からの Signal 変更（indeterminate を含む）でチェックボックスが更新される', async () => {
    const Parent = component$(() => {
      const checked = useSignal<CheckboxCheckedState>(false);
      return (
        <>
          <Checkbox.Root bind:checked={checked}>
            <Checkbox.Control>
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
          <span id="signal-value">{String(checked.value)}</span>
          <button
            type="button"
            id="set-indeterminate"
            onClick$={() => {
              checked.value = 'indeterminate';
            }}
          >
            Indeterminate
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const control = screen.querySelector('[data-leve-checkbox-control]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-checkbox-hidden-input]');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('false');
    expect(hiddenInput?.checked).toBe(false);

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('true');
    expect(hiddenInput?.checked).toBe(true);

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('false');
    expect(hiddenInput?.checked).toBe(false);

    await userEvent('#set-indeterminate', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('mixed');
    expect(control?.getAttribute('data-state')).toBe('indeterminate');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('indeterminate');
    expect(hiddenInput?.indeterminate).toBe(true);
    expect(hiddenInput?.checked).toBe(false);

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('true');
    expect(hiddenInput?.checked).toBe(true);
    expect(hiddenInput?.indeterminate).toBe(false);
  });

  it('クリック時に onCheckedChange$ が新しい値で呼ばれる（indeterminate からは true）', async () => {
    const Parent = component$(() => {
      const log = useSignal<CheckboxCheckedState[]>([]);
      return (
        <>
          <Checkbox.Root
            defaultChecked="indeterminate"
            onCheckedChange$={(checked) => {
              log.value = [...log.value, checked];
            }}
          >
            <Checkbox.Control>
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
          </Checkbox.Root>
          <output id="change-log">{log.value.map(String).join(',')}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(screen.querySelector('#change-log')?.textContent).toBe('true');

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(screen.querySelector('#change-log')?.textContent).toBe('true,false');
  });

  it('disabled のときは Control と HiddenInput に disabled が付き、全パーツに data-disabled が付き、クリックしてもトグルしない', async () => {
    const Parent = component$(() => {
      const changed = useSignal(false);
      return (
        <>
          <Checkbox.Root
            disabled
            onCheckedChange$={() => {
              changed.value = true;
            }}
          >
            <Checkbox.Label>Disabled checkbox</Checkbox.Label>
            <Checkbox.Control>
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
          <output id="changed-output">{changed.value ? 'yes' : 'no'}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const root = screen.querySelector('[data-leve-checkbox]');
    const label = screen.querySelector('[data-leve-checkbox-label]');
    const control = screen.querySelector('[data-leve-checkbox-control]');
    const indicator = screen.querySelector('[data-leve-checkbox-indicator]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-checkbox-hidden-input]');

    expect(control?.hasAttribute('disabled')).toBe(true);
    expect(hiddenInput?.hasAttribute('disabled')).toBe(true);
    expect(root?.hasAttribute('data-disabled')).toBe(true);
    expect(label?.hasAttribute('data-disabled')).toBe(true);
    expect(control?.hasAttribute('data-disabled')).toBe(true);
    expect(indicator?.hasAttribute('data-disabled')).toBe(true);
    expect(hiddenInput?.hasAttribute('data-disabled')).toBe(true);

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(screen.querySelector('#changed-output')?.textContent).toBe('no');
  });

  it('required のときは Control に aria-required="true"、HiddenInput に required が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Checkbox.Root required>
        <Checkbox.Control>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>,
    );

    const control = screen.querySelector('[data-leve-checkbox-control]');
    const hiddenInput = screen.querySelector('[data-leve-checkbox-hidden-input]');

    expect(control?.getAttribute('aria-required')).toBe('true');
    expect(hiddenInput?.hasAttribute('required')).toBe(true);

    const { screen: screenNotReq, render: renderNotReq } = await createDOM();
    await renderNotReq(
      <Checkbox.Root>
        <Checkbox.Control>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>,
    );

    const controlNotReq = screenNotReq.querySelector('[data-leve-checkbox-control]');
    const hiddenInputNotReq = screenNotReq.querySelector('[data-leve-checkbox-hidden-input]');
    expect(controlNotReq?.hasAttribute('aria-required')).toBe(false);
    expect(hiddenInputNotReq?.hasAttribute('required')).toBe(false);
  });

  it('Field.Root 内で Label の for と Control の id が一致し、hasDescription で aria-describedby、invalid で aria-invalid と error id、Field の disabled/required が反映される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root invalid hasDescription disabled required>
        <Field.Label>Checkbox Label</Field.Label>
        <Checkbox.Root>
          <Checkbox.Control>
            <Checkbox.Indicator>✓</Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
        <Field.Description>Help text</Field.Description>
        <Field.ErrorMessage>Error text</Field.ErrorMessage>
      </Field.Root>,
    );

    const label = screen.querySelector('label');
    const control = screen.querySelector('[data-leve-checkbox-control]');
    const hiddenInput = screen.querySelector('[data-leve-checkbox-hidden-input]');
    const description = screen.querySelector('[data-leve-field-description]');
    const errorMessage = screen.querySelector('[data-leve-field-error-message]');

    expect(label?.getAttribute('for')).toBeTruthy();
    expect(control?.getAttribute('id')).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(control?.getAttribute('id'));

    const describedBy = control?.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(describedBy).toContain(description?.getAttribute('id'));
    expect(describedBy).toContain(errorMessage?.getAttribute('id'));

    expect(control?.getAttribute('aria-invalid')).toBe('true');
    expect(control?.hasAttribute('disabled')).toBe(true);
    expect(control?.getAttribute('aria-required')).toBe('true');
    expect(hiddenInput?.hasAttribute('disabled')).toBe(true);
    expect(hiddenInput?.hasAttribute('required')).toBe(true);
  });

  it('Field 外では Control に自動で id が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Checkbox.Root>
        <Checkbox.Control>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
      </Checkbox.Root>,
    );

    const control = screen.querySelector('[data-leve-checkbox-control]');
    expect(control?.getAttribute('id')).toBeTruthy();
  });

  it('class, aria-label, name, value が正しい要素に渡り、Root の独自 props は Root div の DOM 属性にならない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Checkbox.Root class="root-class" defaultChecked disabled required>
        <Checkbox.Control class="control-class" aria-label="Accept terms">
          <Checkbox.Indicator class="indicator-class">✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput class="input-class" name="terms" value="accepted" />
      </Checkbox.Root>,
    );

    const root = screen.querySelector('[data-leve-checkbox]');
    const control = screen.querySelector('[data-leve-checkbox-control]');
    const indicator = screen.querySelector('[data-leve-checkbox-indicator]');
    const hiddenInput = screen.querySelector('[data-leve-checkbox-hidden-input]');

    expect(root?.getAttribute('class')).toBe('root-class');
    expect(root?.hasAttribute('defaultchecked')).toBe(false);
    expect(root?.hasAttribute('disabled')).toBe(false);
    expect(root?.hasAttribute('required')).toBe(false);

    expect(control?.getAttribute('class')).toBe('control-class');
    expect(control?.getAttribute('aria-label')).toBe('Accept terms');

    expect(indicator?.getAttribute('class')).toBe('indicator-class');

    expect(hiddenInput?.getAttribute('class')).toBe('input-class');
    expect(hiddenInput?.getAttribute('name')).toBe('terms');
    expect(hiddenInput?.getAttribute('value')).toBe('accepted');
  });

  it('Control に渡した利用者の onClick$ が呼ばれる（イベント合成）', async () => {
    const Parent = component$(() => {
      const clicked = useSignal(false);
      return (
        <>
          <Checkbox.Root>
            <Checkbox.Control
              onClick$={() => {
                clicked.value = true;
              }}
            >
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
          </Checkbox.Root>
          <output id="clicked-state">{clicked.value ? 'yes' : 'no'}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const control = screen.querySelector('[data-leve-checkbox-control]');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(screen.querySelector('#clicked-state')?.textContent).toBe('no');

    await userEvent('[data-leve-checkbox-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(screen.querySelector('#clicked-state')?.textContent).toBe('yes');
  });

  it('Label が正しい要素と data 属性で描画され、id と for が Control の id と一致し、data-state が追従する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Checkbox.Root>
        <Checkbox.Label>Terms label</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
      </Checkbox.Root>,
    );

    const label = screen.querySelector('[data-leve-checkbox-label]');
    const control = screen.querySelector('[data-leve-checkbox-control]');

    expect(label).not.toBeNull();
    expect(label?.tagName).toBe('LABEL');
    expect(label?.getAttribute('id')).toBeTruthy();
    expect(label?.getAttribute('for')).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(control?.getAttribute('id'));
    expect(label?.getAttribute('data-state')).toBe('unchecked');

    const { screen: screenChecked, render: renderChecked } = await createDOM();
    await renderChecked(
      <Checkbox.Root defaultChecked={true}>
        <Checkbox.Label>Terms label</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
      </Checkbox.Root>,
    );

    const labelChecked = screenChecked.querySelector('[data-leve-checkbox-label]');
    expect(labelChecked?.getAttribute('data-state')).toBe('checked');

    const { screen: screenIndet, render: renderIndet } = await createDOM();
    await renderIndet(
      <Checkbox.Root defaultChecked="indeterminate">
        <Checkbox.Label>Terms label</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>-</Checkbox.Indicator>
        </Checkbox.Control>
      </Checkbox.Root>,
    );

    const labelIndet = screenIndet.querySelector('[data-leve-checkbox-label]');
    expect(labelIndet?.getAttribute('data-state')).toBe('indeterminate');
  });

  it('Root の ids で Control と Label の id を上書きでき、Root div には ids 属性が出力されず、Control の id 指定は無視される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Checkbox.Root ids={{ control: 'c', label: 'l' }}>
        <Checkbox.Label>Custom ID Label</Checkbox.Label>
        <Checkbox.Control id="consumer-id-ignored">
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
      </Checkbox.Root>,
    );

    const root = screen.querySelector('[data-leve-checkbox]');
    const label = screen.querySelector('[data-leve-checkbox-label]');
    const control = screen.querySelector('[data-leve-checkbox-control]');

    expect(control?.getAttribute('id')).toBe('c');
    expect(label?.getAttribute('id')).toBe('l');
    expect(label?.getAttribute('for')).toBe('c');
    expect(root?.hasAttribute('ids')).toBe(false);
  });

  it('Field.Root 内では Checkbox.Label の id と for が Field の label id / control id と一致する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root ids={{ control: 'field-control-id', label: 'field-label-id' }}>
        <Checkbox.Root>
          <Checkbox.Label>Checkbox Label</Checkbox.Label>
          <Checkbox.Control>
            <Checkbox.Indicator>✓</Checkbox.Indicator>
          </Checkbox.Control>
        </Checkbox.Root>
      </Field.Root>,
    );

    const label = screen.querySelector('[data-leve-checkbox-label]');
    const control = screen.querySelector('[data-leve-checkbox-control]');

    expect(label?.getAttribute('id')).toBe('field-label-id');
    expect(label?.getAttribute('for')).toBe('field-control-id');
    expect(control?.getAttribute('id')).toBe('field-control-id');
  });

  describe('form reset', () => {
    async function dispatchReset(
      form: HTMLFormElement,
      screen: HTMLElement,
      userEvent: Awaited<ReturnType<typeof createDOM>>['userEvent'],
    ) {
      const event = form.ownerDocument.createEvent('Event');
      event.initEvent('reset', true, true);
      form.dispatchEvent(event);
      await new Promise<void>((resolve) => setTimeout(resolve, 25));
      await userEvent(screen, 'noop');
    }

    it('form reset で非制御チェックボックスが defaultChecked=false に戻り onCheckedChange$ が呼ばれる', async () => {
      const Parent = component$(() => {
        const log = useSignal<CheckboxCheckedState[]>([]);
        return (
          <div>
            <form id="checkbox-reset-form">
              <Checkbox.Root onCheckedChange$={(val) => (log.value = [...log.value, val])}>
                <Checkbox.Control>
                  <Checkbox.Indicator>✓</Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.HiddenInput name="agree" />
              </Checkbox.Root>
            </form>
            <output id="log">{log.value.map(String).join(',')}</output>
          </div>
        );
      });

      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      const control = screen.querySelector('[data-leve-checkbox-control]');
      const hiddenInput = screen.querySelector(
        '[data-leve-checkbox-hidden-input]',
      ) as HTMLInputElement;
      const form = screen.querySelector('#checkbox-reset-form') as HTMLFormElement;

      await userEvent('[data-leve-checkbox-control]', 'click');
      expect(control?.getAttribute('aria-checked')).toBe('true');
      expect(hiddenInput.checked).toBe(true);

      await dispatchReset(form, screen, userEvent);

      expect(control?.getAttribute('aria-checked')).toBe('false');
      expect(control?.getAttribute('data-state')).toBe('unchecked');
      expect(hiddenInput.checked).toBe(false);
      expect(hiddenInput.indeterminate).toBe(false);
      expect(screen.querySelector('#log')?.textContent).toBe('true,false');
    });

    it('form reset で defaultChecked=true / "indeterminate" に戻る', async () => {
      const { screen: screenTrue, render: renderTrue, userEvent: userTrue } = await createDOM();
      await renderTrue(
        <form id="checkbox-true-form">
          <Checkbox.Root defaultChecked={true}>
            <Checkbox.Control>
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.HiddenInput name="agree" />
          </Checkbox.Root>
        </form>,
      );

      const controlTrue = screenTrue.querySelector('[data-leve-checkbox-control]');
      const hiddenTrue = screenTrue.querySelector(
        '[data-leve-checkbox-hidden-input]',
      ) as HTMLInputElement;
      const formTrue = screenTrue.querySelector('#checkbox-true-form') as HTMLFormElement;

      await userTrue('[data-leve-checkbox-control]', 'click');
      expect(controlTrue?.getAttribute('aria-checked')).toBe('false');

      await dispatchReset(formTrue, screenTrue, userTrue);

      expect(controlTrue?.getAttribute('aria-checked')).toBe('true');
      expect(hiddenTrue.checked).toBe(true);
      expect(hiddenTrue.indeterminate).toBe(false);

      const { screen: screenIndet, render: renderIndet, userEvent: userIndet } = await createDOM();
      await renderIndet(
        <form id="checkbox-indet-form">
          <Checkbox.Root defaultChecked="indeterminate">
            <Checkbox.Control>
              <Checkbox.Indicator>-</Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.HiddenInput name="select-all" />
          </Checkbox.Root>
        </form>,
      );

      const controlIndet = screenIndet.querySelector('[data-leve-checkbox-control]');
      const hiddenIndet = screenIndet.querySelector(
        '[data-leve-checkbox-hidden-input]',
      ) as HTMLInputElement;
      const formIndet = screenIndet.querySelector('#checkbox-indet-form') as HTMLFormElement;

      await userIndet('[data-leve-checkbox-control]', 'click');
      expect(controlIndet?.getAttribute('aria-checked')).toBe('true');
      expect(hiddenIndet.indeterminate).toBe(false);

      await dispatchReset(formIndet, screenIndet, userIndet);

      expect(controlIndet?.getAttribute('aria-checked')).toBe('mixed');
      expect(controlIndet?.getAttribute('data-state')).toBe('indeterminate');
      expect(hiddenIndet.checked).toBe(false);
      expect(hiddenIndet.indeterminate).toBe(true);
    });

    it('制御モード（bind:checked）では form reset しても状態が変わらず HiddenInput が同期される', async () => {
      const Parent = component$(() => {
        const checked = useSignal<CheckboxCheckedState>(true);
        const log = useSignal<CheckboxCheckedState[]>([]);
        return (
          <div>
            <form id="checkbox-controlled-form">
              <Checkbox.Root
                bind:checked={checked}
                onCheckedChange$={(val) => (log.value = [...log.value, val])}
              >
                <Checkbox.Control>
                  <Checkbox.Indicator>✓</Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.HiddenInput name="agree" />
              </Checkbox.Root>
            </form>
            <output id="log">{log.value.map(String).join(',')}</output>
          </div>
        );
      });

      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      const control = screen.querySelector('[data-leve-checkbox-control]');
      const hiddenInput = screen.querySelector(
        '[data-leve-checkbox-hidden-input]',
      ) as HTMLInputElement;
      const form = screen.querySelector('#checkbox-controlled-form') as HTMLFormElement;

      hiddenInput.checked = false;
      await dispatchReset(form, screen, userEvent);

      expect(control?.getAttribute('aria-checked')).toBe('true');
      expect(hiddenInput.checked).toBe(true);
      expect(screen.querySelector('#log')?.textContent).toBe('');
    });

    it('form 属性で外部 form と関連付けた場合や preventDefault() が正しく扱われる', async () => {
      const { screen, render, userEvent } = await createDOM();
      await render(
        <div>
          <form id="external-checkbox-form" />
          <Checkbox.Root>
            <Checkbox.Control>
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.HiddenInput name="ext" form="external-checkbox-form" />
          </Checkbox.Root>
        </div>,
      );

      const control = screen.querySelector('[data-leve-checkbox-control]');
      const form = screen.querySelector('#external-checkbox-form') as HTMLFormElement;

      await userEvent('[data-leve-checkbox-control]', 'click');
      expect(control?.getAttribute('aria-checked')).toBe('true');

      let shouldPrevent = true;
      form.addEventListener('reset', (event) => {
        if (shouldPrevent) event.preventDefault();
      });
      await dispatchReset(form, screen, userEvent);
      expect(control?.getAttribute('aria-checked')).toBe('true');

      shouldPrevent = false;
      await dispatchReset(form, screen, userEvent);
      expect(control?.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('Checkbox.Group', () => {
    it('role="group" と data-leve-checkbox-group が描画され、独自 props が DOM に漏れない', async () => {
      const { screen, render } = await createDOM();
      await render(
        <Checkbox.Group
          aria-label="Toppings"
          class="my-group"
          defaultValue={['cheese']}
          name="toppings"
          disabled={false}
          readOnly={false}
          invalid={false}
          maxSelectedValues={2}
          onValueChange$={() => {}}
        >
          <Checkbox.Root value="cheese">
            <Checkbox.Control>
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label>Cheese</Checkbox.Label>
          </Checkbox.Root>
        </Checkbox.Group>,
      );

      const group = screen.querySelector('[data-leve-checkbox-group]');
      expect(group).not.toBeNull();
      expect(group?.tagName).toBe('DIV');
      expect(group?.getAttribute('role')).toBe('group');
      expect(group?.getAttribute('aria-label')).toBe('Toppings');
      expect(group?.getAttribute('class')).toBe('my-group');
      expect(group?.hasAttribute('defaultValue')).toBe(false);
      expect(group?.hasAttribute('name')).toBe(false);
      expect(group?.hasAttribute('disabled')).toBe(false);
      expect(group?.hasAttribute('readOnly')).toBe(false);
      expect(group?.hasAttribute('invalid')).toBe(false);
      expect(group?.hasAttribute('maxSelectedValues')).toBe(false);
    });

    it('非制御モード（defaultValue / onValueChange$）で複数選択を管理できる', async () => {
      const Parent = component$(() => {
        const log = useSignal<string[]>([]);
        return (
          <div>
            <Checkbox.Group
              defaultValue={['a']}
              onValueChange$={(val) => {
                log.value = val;
              }}
            >
              <Checkbox.Root value="a">
                <Checkbox.Control data-test="a">
                  <Checkbox.Indicator>✓</Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label>A</Checkbox.Label>
              </Checkbox.Root>
              <Checkbox.Root value="b">
                <Checkbox.Control data-test="b">
                  <Checkbox.Indicator>✓</Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label>B</Checkbox.Label>
              </Checkbox.Root>
            </Checkbox.Group>
            <output id="log">{log.value.join(',')}</output>
          </div>
        );
      });

      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      const controlA = screen.querySelector('[data-test="a"]');
      const controlB = screen.querySelector('[data-test="b"]');

      expect(controlA?.getAttribute('aria-checked')).toBe('true');
      expect(controlB?.getAttribute('aria-checked')).toBe('false');

      await userEvent('[data-test="b"]', 'click');
      expect(controlA?.getAttribute('aria-checked')).toBe('true');
      expect(controlB?.getAttribute('aria-checked')).toBe('true');
      expect(screen.querySelector('#log')?.textContent).toBe('a,b');

      await userEvent('[data-test="a"]', 'click');
      expect(controlA?.getAttribute('aria-checked')).toBe('false');
      expect(controlB?.getAttribute('aria-checked')).toBe('true');
      expect(screen.querySelector('#log')?.textContent).toBe('b');
    });

    it('制御モード（bind:value）で外部 Signal と同期する', async () => {
      const Parent = component$(() => {
        const selected = useSignal<string[]>(['b']);
        return (
          <div>
            <Checkbox.Group bind:value={selected}>
              <Checkbox.Root value="a">
                <Checkbox.Control data-test="a">
                  <Checkbox.Indicator>✓</Checkbox.Indicator>
                </Checkbox.Control>
              </Checkbox.Root>
              <Checkbox.Root value="b">
                <Checkbox.Control data-test="b">
                  <Checkbox.Indicator>✓</Checkbox.Indicator>
                </Checkbox.Control>
              </Checkbox.Root>
            </Checkbox.Group>
            <button
              type="button"
              id="set-btn"
              onClick$={() => {
                selected.value = ['a'];
              }}
            >
              Set A
            </button>
            <output id="val">{selected.value.join(',')}</output>
          </div>
        );
      });

      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      const controlA = screen.querySelector('[data-test="a"]');
      const controlB = screen.querySelector('[data-test="b"]');

      expect(controlA?.getAttribute('aria-checked')).toBe('false');
      expect(controlB?.getAttribute('aria-checked')).toBe('true');

      await userEvent('[data-test="a"]', 'click');
      expect(screen.querySelector('#val')?.textContent).toBe('b,a');
      expect(controlA?.getAttribute('aria-checked')).toBe('true');

      await userEvent('#set-btn', 'click');
      expect(controlA?.getAttribute('aria-checked')).toBe('true');
      expect(controlB?.getAttribute('aria-checked')).toBe('false');
    });

    it('Group の name と Root の value が HiddenInput に引き継がれる', async () => {
      const { screen, render } = await createDOM();
      await render(
        <Checkbox.Group name="items" defaultValue={['one']}>
          <Checkbox.Root value="one">
            <Checkbox.Control>
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.HiddenInput data-input="one" />
          </Checkbox.Root>
          <Checkbox.Root value="two" name="custom-two">
            <Checkbox.Control>
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.HiddenInput data-input="two" />
          </Checkbox.Root>
        </Checkbox.Group>,
      );

      const inputOne = screen.querySelector('[data-input="one"]') as HTMLInputElement;
      const inputTwo = screen.querySelector('[data-input="two"]') as HTMLInputElement;

      expect(inputOne.getAttribute('name')).toBe('items');
      expect(inputOne.getAttribute('value')).toBe('one');
      expect(inputOne.checked).toBe(true);

      expect(inputTwo.getAttribute('name')).toBe('custom-two');
      expect(inputTwo.getAttribute('value')).toBe('two');
      expect(inputTwo.checked).toBe(false);
    });

    it('Group の disabled / readOnly / invalid が配下のパーツに伝播し、操作をブロックする', async () => {
      const { screen, render, userEvent } = await createDOM();
      await render(
        <div>
          <Checkbox.Group disabled defaultValue={['a']} data-group="disabled">
            <Checkbox.Root value="a">
              <Checkbox.Control data-test="disabled-a">
                <Checkbox.Indicator>✓</Checkbox.Indicator>
              </Checkbox.Control>
            </Checkbox.Root>
          </Checkbox.Group>

          <Checkbox.Group readOnly defaultValue={['a']} data-group="readonly">
            <Checkbox.Root value="a" data-root="readonly-a">
              <Checkbox.Control data-test="readonly-a">
                <Checkbox.Indicator>✓</Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.Label data-label="readonly-a">A</Checkbox.Label>
            </Checkbox.Root>
          </Checkbox.Group>

          <Checkbox.Group invalid data-group="invalid">
            <Checkbox.Root value="a" data-root="invalid-a">
              <Checkbox.Control data-test="invalid-a">
                <Checkbox.Indicator>✓</Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.Label data-label="invalid-a">A</Checkbox.Label>
            </Checkbox.Root>
          </Checkbox.Group>
        </div>,
      );

      const disabledGroup = screen.querySelector('[data-group="disabled"]');
      const disabledControl = screen.querySelector('[data-test="disabled-a"]') as HTMLButtonElement;
      expect(disabledGroup?.getAttribute('aria-disabled')).toBe('true');
      expect(disabledGroup?.hasAttribute('data-disabled')).toBe(true);
      expect(disabledControl.disabled).toBe(true);

      const readonlyGroup = screen.querySelector('[data-group="readonly"]');
      const readonlyRoot = screen.querySelector('[data-root="readonly-a"]');
      const readonlyControl = screen.querySelector('[data-test="readonly-a"]');
      const readonlyLabel = screen.querySelector('[data-label="readonly-a"]');
      expect(readonlyGroup?.getAttribute('aria-readonly')).toBe('true');
      expect(readonlyGroup?.hasAttribute('data-readonly')).toBe(true);
      expect(readonlyRoot?.hasAttribute('data-readonly')).toBe(true);
      expect(readonlyControl?.getAttribute('aria-readonly')).toBe('true');
      expect(readonlyControl?.hasAttribute('data-readonly')).toBe(true);
      expect(readonlyLabel?.hasAttribute('data-readonly')).toBe(true);

      await userEvent('[data-test="readonly-a"]', 'click');
      expect(readonlyControl?.getAttribute('aria-checked')).toBe('true');

      const invalidGroup = screen.querySelector('[data-group="invalid"]');
      const invalidRoot = screen.querySelector('[data-root="invalid-a"]');
      const invalidControl = screen.querySelector('[data-test="invalid-a"]');
      const invalidLabel = screen.querySelector('[data-label="invalid-a"]');
      expect(invalidGroup?.getAttribute('aria-invalid')).toBe('true');
      expect(invalidGroup?.hasAttribute('data-invalid')).toBe(true);
      expect(invalidRoot?.hasAttribute('data-invalid')).toBe(true);
      expect(invalidControl?.getAttribute('aria-invalid')).toBe('true');
      expect(invalidControl?.hasAttribute('data-invalid')).toBe(true);
      expect(invalidLabel?.hasAttribute('data-invalid')).toBe(true);
    });

    it('maxSelectedValues に達すると未選択項目のみ disabled になり、選択解除で復帰する', async () => {
      const { screen, render, userEvent } = await createDOM();
      await render(
        <Checkbox.Group defaultValue={['a']} maxSelectedValues={2}>
          <Checkbox.Root value="a">
            <Checkbox.Control data-test="a">
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
          </Checkbox.Root>
          <Checkbox.Root value="b">
            <Checkbox.Control data-test="b">
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
          </Checkbox.Root>
          <Checkbox.Root value="c">
            <Checkbox.Control data-test="c">
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Control>
          </Checkbox.Root>
        </Checkbox.Group>,
      );

      const controlA = screen.querySelector('[data-test="a"]') as HTMLButtonElement;
      const controlB = screen.querySelector('[data-test="b"]') as HTMLButtonElement;
      const controlC = screen.querySelector('[data-test="c"]') as HTMLButtonElement;

      expect(controlB.disabled).toBe(false);
      expect(controlC.disabled).toBe(false);

      await userEvent('[data-test="b"]', 'click');
      expect(controlA.getAttribute('aria-checked')).toBe('true');
      expect(controlB.getAttribute('aria-checked')).toBe('true');
      expect(controlA.disabled).toBe(false);
      expect(controlB.disabled).toBe(false);
      expect(controlC.disabled).toBe(true);
      expect(controlC.hasAttribute('data-disabled')).toBe(true);

      await userEvent('[data-test="a"]', 'click');
      expect(controlA.getAttribute('aria-checked')).toBe('false');
      expect(controlC.disabled).toBe(false);
    });

    it('Field.Root 内で Group に状態と aria-describedby が伝播し、配下の Control の ID が重複しない', async () => {
      const { screen, render } = await createDOM();
      await render(
        <Field.Root hasDescription invalid readOnly>
          <Field.Label>Options</Field.Label>
          <Checkbox.Group>
            <Checkbox.Root value="a">
              <Checkbox.Control data-test="a">
                <Checkbox.Indicator>✓</Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.Label>A</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root value="b">
              <Checkbox.Control data-test="b">
                <Checkbox.Indicator>✓</Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.Label>B</Checkbox.Label>
            </Checkbox.Root>
          </Checkbox.Group>
          <Field.Description>Select at least one.</Field.Description>
          <Field.ErrorMessage>Required</Field.ErrorMessage>
        </Field.Root>,
      );

      const group = screen.querySelector('[data-leve-checkbox-group]');
      const desc = screen.querySelector('[data-leve-field-description]');
      const err = screen.querySelector('[data-leve-field-error-message]');
      const controlA = screen.querySelector('[data-test="a"]');
      const controlB = screen.querySelector('[data-test="b"]');

      expect(group?.getAttribute('aria-describedby')).toBe(`${desc?.id} ${err?.id}`);
      expect(group?.getAttribute('aria-invalid')).toBe('true');
      expect(group?.getAttribute('aria-readonly')).toBe('true');

      expect(controlA?.id).toBeTruthy();
      expect(controlB?.id).toBeTruthy();
      expect(controlA?.id).not.toBe(controlB?.id);
      expect(controlA?.hasAttribute('aria-describedby')).toBe(false);
      expect(controlB?.hasAttribute('aria-describedby')).toBe(false);
      expect(controlA?.getAttribute('aria-invalid')).toBe('true');
      expect(controlA?.getAttribute('aria-readonly')).toBe('true');
    });

    it('form reset で Group が defaultValue に戻り、全 HiddenInput が同期される', async () => {
      function dispatchReset(
        form: HTMLFormElement,
        screen: HTMLElement,
        userEvent: Awaited<ReturnType<typeof createDOM>>['userEvent'],
      ) {
        const event = form.ownerDocument.createEvent('Event');
        event.initEvent('reset', true, true);
        form.dispatchEvent(event);
        return new Promise<void>((resolve) => setTimeout(resolve, 25)).then(() =>
          userEvent(screen, 'noop'),
        );
      }

      const Parent = component$(() => {
        const log = useSignal<string[]>([]);
        return (
          <div>
            <form id="group-reset-form">
              <Checkbox.Group
                name="choices"
                defaultValue={['a']}
                onValueChange$={(val) => {
                  log.value = val;
                }}
              >
                <Checkbox.Root value="a">
                  <Checkbox.Control data-test="a">
                    <Checkbox.Indicator>✓</Checkbox.Indicator>
                  </Checkbox.Control>
                  <Checkbox.HiddenInput data-input="a" />
                </Checkbox.Root>
                <Checkbox.Root value="b">
                  <Checkbox.Control data-test="b">
                    <Checkbox.Indicator>✓</Checkbox.Indicator>
                  </Checkbox.Control>
                  <Checkbox.HiddenInput data-input="b" />
                </Checkbox.Root>
              </Checkbox.Group>
            </form>
            <output id="log">{log.value.join(',')}</output>
          </div>
        );
      });

      const { screen, render, userEvent } = await createDOM();
      await render(<Parent />);

      const form = screen.querySelector('#group-reset-form') as HTMLFormElement;
      const controlA = screen.querySelector('[data-test="a"]');
      const controlB = screen.querySelector('[data-test="b"]');
      const inputA = screen.querySelector('[data-input="a"]') as HTMLInputElement;
      const inputB = screen.querySelector('[data-input="b"]') as HTMLInputElement;

      await userEvent('[data-test="b"]', 'click');
      expect(controlB?.getAttribute('aria-checked')).toBe('true');
      expect(inputB.checked).toBe(true);

      await dispatchReset(form, screen, userEvent);

      expect(controlA?.getAttribute('aria-checked')).toBe('true');
      expect(controlB?.getAttribute('aria-checked')).toBe('false');
      expect(inputA.checked).toBe(true);
      expect(inputB.checked).toBe(false);
      expect(screen.querySelector('#log')?.textContent).toBe('a');
    });
  });
});
