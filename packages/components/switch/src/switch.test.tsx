import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Field } from '@leve-ui/field';
import { describe, expect, it } from 'vitest';
import { Switch } from './index';

describe('Switch', () => {
  it('各パーツが正しい要素と data 属性で描画され、Thumb に aria-hidden、Control に type="button" と role="switch" が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Switch.Root>
        <Switch.Label>Notification setting</Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.HiddenInput />
      </Switch.Root>,
    );

    const root = screen.querySelector('[data-leve-switch]');
    const label = screen.querySelector('[data-leve-switch-label]');
    const control = screen.querySelector('[data-leve-switch-control]');
    const thumb = screen.querySelector('[data-leve-switch-thumb]');
    const hiddenInput = screen.querySelector('[data-leve-switch-hidden-input]');

    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('DIV');
    expect(root?.hasAttribute('data-leve-switch')).toBe(true);

    expect(label).not.toBeNull();
    expect(label?.tagName).toBe('LABEL');
    expect(label?.hasAttribute('data-leve-switch-label')).toBe(true);

    expect(control).not.toBeNull();
    expect(control?.tagName).toBe('BUTTON');
    expect(control?.getAttribute('type')).toBe('button');
    expect(control?.getAttribute('role')).toBe('switch');
    expect(control?.hasAttribute('data-leve-switch-control')).toBe(true);

    expect(thumb).not.toBeNull();
    expect(thumb?.tagName).toBe('SPAN');
    expect(thumb?.getAttribute('aria-hidden')).toBe('true');
    expect(thumb?.hasAttribute('data-leve-switch-thumb')).toBe(true);

    expect(hiddenInput).not.toBeNull();
    expect(hiddenInput?.tagName).toBe('INPUT');
    expect(hiddenInput?.getAttribute('type')).toBe('checkbox');
    expect(hiddenInput?.getAttribute('aria-hidden')).toBe('true');
    expect(hiddenInput?.getAttribute('tabindex')).toBe('-1');
    expect(hiddenInput?.hasAttribute('data-leve-switch-hidden-input')).toBe(true);
  });

  it('デフォルトで未チェック状態となり、aria-checked="false"、全パーツに data-state="unchecked" が付き、HiddenInput はチェックされない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Switch.Root>
        <Switch.Label>Toggle</Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.HiddenInput />
      </Switch.Root>,
    );

    const root = screen.querySelector('[data-leve-switch]');
    const label = screen.querySelector('[data-leve-switch-label]');
    const control = screen.querySelector('[data-leve-switch-control]');
    const thumb = screen.querySelector('[data-leve-switch-thumb]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-switch-hidden-input]');

    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(root?.getAttribute('data-state')).toBe('unchecked');
    expect(label?.getAttribute('data-state')).toBe('unchecked');
    expect(control?.getAttribute('data-state')).toBe('unchecked');
    expect(thumb?.getAttribute('data-state')).toBe('unchecked');
    expect(hiddenInput?.getAttribute('data-state')).toBe('unchecked');
    expect(hiddenInput?.checked).toBe(false);
  });

  it('defaultChecked を指定すると初期状態で aria-checked="true"、data-state="checked"、HiddenInput がチェックされる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Switch.Root defaultChecked>
        <Switch.Label>Toggle</Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.HiddenInput />
      </Switch.Root>,
    );

    const root = screen.querySelector('[data-leve-switch]');
    const label = screen.querySelector('[data-leve-switch-label]');
    const control = screen.querySelector('[data-leve-switch-control]');
    const thumb = screen.querySelector('[data-leve-switch-thumb]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-switch-hidden-input]');

    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(root?.getAttribute('data-state')).toBe('checked');
    expect(label?.getAttribute('data-state')).toBe('checked');
    expect(control?.getAttribute('data-state')).toBe('checked');
    expect(thumb?.getAttribute('data-state')).toBe('checked');
    expect(hiddenInput?.getAttribute('data-state')).toBe('checked');
    expect(hiddenInput?.checked).toBe(true);
  });

  it('Control のクリックで（非制御）トグルし、全パーツの状態と HiddenInput の checked が更新される', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Switch.Root>
        <Switch.Label>Toggle</Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.HiddenInput />
      </Switch.Root>,
    );

    const root = screen.querySelector('[data-leve-switch]');
    const label = screen.querySelector('[data-leve-switch-label]');
    const control = screen.querySelector('[data-leve-switch-control]');
    const thumb = screen.querySelector('[data-leve-switch-thumb]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-switch-hidden-input]');

    await userEvent('[data-leve-switch-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(root?.getAttribute('data-state')).toBe('checked');
    expect(label?.getAttribute('data-state')).toBe('checked');
    expect(control?.getAttribute('data-state')).toBe('checked');
    expect(thumb?.getAttribute('data-state')).toBe('checked');
    expect(hiddenInput?.getAttribute('data-state')).toBe('checked');
    expect(hiddenInput?.checked).toBe(true);

    await userEvent('[data-leve-switch-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(root?.getAttribute('data-state')).toBe('unchecked');
    expect(label?.getAttribute('data-state')).toBe('unchecked');
    expect(control?.getAttribute('data-state')).toBe('unchecked');
    expect(thumb?.getAttribute('data-state')).toBe('unchecked');
    expect(hiddenInput?.getAttribute('data-state')).toBe('unchecked');
    expect(hiddenInput?.checked).toBe(false);
  });

  it('bind:checked で初期値が反映され、クリックで Signal が更新され、外部からの Signal 変更でスイッチが更新される', async () => {
    const Parent = component$(() => {
      const checked = useSignal(false);
      return (
        <>
          <Switch.Root bind:checked={checked}>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.HiddenInput />
          </Switch.Root>
          <span id="signal-value">{checked.value ? 'true' : 'false'}</span>
          <button
            type="button"
            id="external-toggle"
            onClick$={() => {
              checked.value = true;
            }}
          >
            External
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const control = screen.querySelector('[data-leve-switch-control]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-switch-hidden-input]');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('false');
    expect(hiddenInput?.checked).toBe(false);

    await userEvent('[data-leve-switch-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('true');
    expect(hiddenInput?.checked).toBe(true);

    await userEvent('[data-leve-switch-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('false');
    expect(hiddenInput?.checked).toBe(false);

    await userEvent('#external-toggle', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('true');
    expect(hiddenInput?.checked).toBe(true);
  });

  it('クリック時に onCheckedChange$ が新しい値で呼ばれる', async () => {
    const Parent = component$(() => {
      const log = useSignal<boolean[]>([]);
      return (
        <>
          <Switch.Root
            onCheckedChange$={(checked) => {
              log.value = [...log.value, checked];
            }}
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
          <output id="change-log">{log.value.map(String).join(',')}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    await userEvent('[data-leve-switch-control]', 'click');
    expect(screen.querySelector('#change-log')?.textContent).toBe('true');

    await userEvent('[data-leve-switch-control]', 'click');
    expect(screen.querySelector('#change-log')?.textContent).toBe('true,false');
  });

  it('disabled のときは Control と HiddenInput に disabled が付き、全パーツに data-disabled が付き、クリックしてもトグルしない', async () => {
    const Parent = component$(() => {
      const changed = useSignal(false);
      return (
        <>
          <Switch.Root
            disabled
            onCheckedChange$={() => {
              changed.value = true;
            }}
          >
            <Switch.Label>Disabled switch</Switch.Label>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.HiddenInput />
          </Switch.Root>
          <output id="changed-output">{changed.value ? 'yes' : 'no'}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const root = screen.querySelector('[data-leve-switch]');
    const label = screen.querySelector('[data-leve-switch-label]');
    const control = screen.querySelector('[data-leve-switch-control]');
    const thumb = screen.querySelector('[data-leve-switch-thumb]');
    const hiddenInput = screen.querySelector<HTMLInputElement>('[data-leve-switch-hidden-input]');

    expect(control?.hasAttribute('disabled')).toBe(true);
    expect(hiddenInput?.hasAttribute('disabled')).toBe(true);
    expect(root?.hasAttribute('data-disabled')).toBe(true);
    expect(label?.hasAttribute('data-disabled')).toBe(true);
    expect(control?.hasAttribute('data-disabled')).toBe(true);
    expect(thumb?.hasAttribute('data-disabled')).toBe(true);
    expect(hiddenInput?.hasAttribute('data-disabled')).toBe(true);

    await userEvent('[data-leve-switch-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(screen.querySelector('#changed-output')?.textContent).toBe('no');
  });

  it('required のときは Control に aria-required="true"、HiddenInput に required が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Switch.Root required>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.HiddenInput />
      </Switch.Root>,
    );

    const control = screen.querySelector('[data-leve-switch-control]');
    const hiddenInput = screen.querySelector('[data-leve-switch-hidden-input]');

    expect(control?.getAttribute('aria-required')).toBe('true');
    expect(hiddenInput?.hasAttribute('required')).toBe(true);

    const { screen: screenNotReq, render: renderNotReq } = await createDOM();
    await renderNotReq(
      <Switch.Root>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.HiddenInput />
      </Switch.Root>,
    );

    const controlNotReq = screenNotReq.querySelector('[data-leve-switch-control]');
    const hiddenInputNotReq = screenNotReq.querySelector('[data-leve-switch-hidden-input]');
    expect(controlNotReq?.hasAttribute('aria-required')).toBe(false);
    expect(hiddenInputNotReq?.hasAttribute('required')).toBe(false);
  });

  it('Field.Root 内で Label の for と Control の id が一致し、hasDescription で aria-describedby、invalid で aria-invalid と error id、Field の disabled/required が反映される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root invalid hasDescription disabled required>
        <Field.Label>Switch Label</Field.Label>
        <Switch.Root>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.HiddenInput />
        </Switch.Root>
        <Field.Description>Help text</Field.Description>
        <Field.ErrorMessage>Error text</Field.ErrorMessage>
      </Field.Root>,
    );

    const label = screen.querySelector('label');
    const control = screen.querySelector('[data-leve-switch-control]');
    const hiddenInput = screen.querySelector('[data-leve-switch-hidden-input]');
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
      <Switch.Root>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>,
    );

    const control = screen.querySelector('[data-leve-switch-control]');
    expect(control?.getAttribute('id')).toBeTruthy();
  });

  it('class, aria-label, name, value が正しい要素に渡り、Root の独自 props は Root div の DOM 属性にならない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Switch.Root class="root-class" defaultChecked disabled required>
        <Switch.Control class="control-class" aria-label="Toggle notifications">
          <Switch.Thumb class="thumb-class" />
        </Switch.Control>
        <Switch.HiddenInput class="input-class" name="notifications" value="yes" />
      </Switch.Root>,
    );

    const root = screen.querySelector('[data-leve-switch]');
    const control = screen.querySelector('[data-leve-switch-control]');
    const thumb = screen.querySelector('[data-leve-switch-thumb]');
    const hiddenInput = screen.querySelector('[data-leve-switch-hidden-input]');

    expect(root?.getAttribute('class')).toBe('root-class');
    expect(root?.hasAttribute('defaultchecked')).toBe(false);
    expect(root?.hasAttribute('disabled')).toBe(false);
    expect(root?.hasAttribute('required')).toBe(false);

    expect(control?.getAttribute('class')).toBe('control-class');
    expect(control?.getAttribute('aria-label')).toBe('Toggle notifications');

    expect(thumb?.getAttribute('class')).toBe('thumb-class');

    expect(hiddenInput?.getAttribute('class')).toBe('input-class');
    expect(hiddenInput?.getAttribute('name')).toBe('notifications');
    expect(hiddenInput?.getAttribute('value')).toBe('yes');
  });

  it('Control に渡した利用者の onClick$ が呼ばれる（イベント合成）', async () => {
    const Parent = component$(() => {
      const clicked = useSignal(false);
      return (
        <>
          <Switch.Root>
            <Switch.Control
              onClick$={() => {
                clicked.value = true;
              }}
            >
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
          <output id="clicked-state">{clicked.value ? 'yes' : 'no'}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const control = screen.querySelector('[data-leve-switch-control]');
    expect(control?.getAttribute('aria-checked')).toBe('false');
    expect(screen.querySelector('#clicked-state')?.textContent).toBe('no');

    await userEvent('[data-leve-switch-control]', 'click');
    expect(control?.getAttribute('aria-checked')).toBe('true');
    expect(screen.querySelector('#clicked-state')?.textContent).toBe('yes');
  });

  // ADDENDUM (round 2) tests:
  it('Label が正しい要素と data 属性で描画され、id と for が Control の id と一致し、data-state が checked 状態に追従する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Switch.Root>
        <Switch.Label>Toggle label</Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>,
    );

    const label = screen.querySelector('[data-leve-switch-label]');
    const control = screen.querySelector('[data-leve-switch-control]');

    expect(label).not.toBeNull();
    expect(label?.tagName).toBe('LABEL');
    expect(label?.getAttribute('id')).toBeTruthy();
    expect(label?.getAttribute('for')).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(control?.getAttribute('id'));
    expect(label?.getAttribute('data-state')).toBe('unchecked');

    const { screen: screenChecked, render: renderChecked } = await createDOM();
    await renderChecked(
      <Switch.Root defaultChecked>
        <Switch.Label>Toggle label</Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>,
    );

    const labelChecked = screenChecked.querySelector('[data-leve-switch-label]');
    expect(labelChecked?.getAttribute('data-state')).toBe('checked');
  });

  it('Root の ids で Control と Label の id を上書きでき、Root div には ids 属性が出力されず、Control の id 指定は無視される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Switch.Root ids={{ control: 'c', label: 'l' }}>
        <Switch.Label>Custom ID Label</Switch.Label>
        <Switch.Control id="consumer-id-ignored">
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>,
    );

    const root = screen.querySelector('[data-leve-switch]');
    const label = screen.querySelector('[data-leve-switch-label]');
    const control = screen.querySelector('[data-leve-switch-control]');

    expect(control?.getAttribute('id')).toBe('c');
    expect(label?.getAttribute('id')).toBe('l');
    expect(label?.getAttribute('for')).toBe('c');
    expect(root?.hasAttribute('ids')).toBe(false);
  });

  it('Field.Root 内では Switch.Label の id と for が Field の label id / control id と一致する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root ids={{ control: 'field-control-id', label: 'field-label-id' }}>
        <Switch.Root>
          <Switch.Label>Switch Label</Switch.Label>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </Field.Root>,
    );

    const label = screen.querySelector('[data-leve-switch-label]');
    const control = screen.querySelector('[data-leve-switch-control]');

    expect(label?.getAttribute('id')).toBe('field-label-id');
    expect(label?.getAttribute('for')).toBe('field-control-id');
    expect(control?.getAttribute('id')).toBe('field-control-id');
  });

  it('Label と Control の for/id が正しく関連付けられている（ネイティブのクリック連動は E2E で検証）', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Switch.Root>
        <Switch.Label>Clickable Label</Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>,
    );

    const label = screen.querySelector('[data-leve-switch-label]');
    const control = screen.querySelector('[data-leve-switch-control]');

    expect(label?.getAttribute('for')).toBeTruthy();
    expect(control?.getAttribute('id')).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(control?.getAttribute('id'));
  });
});
