import { Fieldset } from '@leve-ui/fieldset';
import type { Meta, StoryObj } from 'storybook-framework-qwik';

const meta: Meta = {
  title: 'Components/Fieldset',
};

export default meta;

type Story = StoryObj;

const fields = (
  <>
    <label style={{ display: 'block' }}>
      <input type="radio" name="shipping" value="standard" /> Standard
    </label>
    <label style={{ display: 'block' }}>
      <input type="radio" name="shipping" value="express" /> Express
    </label>
  </>
);

export const Default: Story = {
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend>Shipping method</Fieldset.Legend>
      {fields}
    </Fieldset.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <>
      <button type="button">Before</button>
      <Fieldset.Root disabled>
        <Fieldset.Legend>Shipping method</Fieldset.Legend>
        {fields}
      </Fieldset.Root>
      <button type="button">After</button>
    </>
  ),
};
