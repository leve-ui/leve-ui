import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ControlledDemo from './demos/rating-group/controlled';
import controlledSource from './demos/rating-group/controlled?raw';
import controlledCss from './demos/rating-group/controlled.css?raw';
import DefaultDemo from './demos/rating-group/default';
import defaultSource from './demos/rating-group/default?raw';
import defaultCss from './demos/rating-group/default.css?raw';
import DisabledDemo from './demos/rating-group/disabled';
import disabledSource from './demos/rating-group/disabled?raw';
import disabledCss from './demos/rating-group/disabled.css?raw';
import HalfRatingsDemo from './demos/rating-group/half-ratings';
import halfRatingsSource from './demos/rating-group/half-ratings?raw';
import halfRatingsCss from './demos/rating-group/half-ratings.css?raw';
import ReadOnlyDemo from './demos/rating-group/read-only';
import readOnlySource from './demos/rating-group/read-only?raw';
import readOnlyCss from './demos/rating-group/read-only.css?raw';
import WithFieldDemo from './demos/rating-group/with-field';
import withFieldSource from './demos/rating-group/with-field?raw';
import withFieldCss from './demos/rating-group/with-field.css?raw';
import WithFormDemo from './demos/rating-group/with-form';
import withFormSource from './demos/rating-group/with-form?raw';
import withFormCss from './demos/rating-group/with-form.css?raw';
import { demoSource } from './source';

const meta: Meta = {
  title: 'Components/RatingGroup',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <DefaultDemo />,
  parameters: { docs: { source: { code: demoSource(defaultSource, defaultCss, 'default.css') } } },
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: { source: { code: demoSource(controlledSource, controlledCss, 'controlled.css') } },
  },
};

export const HalfRatings: Story = {
  render: () => <HalfRatingsDemo />,
  parameters: {
    docs: {
      source: { code: demoSource(halfRatingsSource, halfRatingsCss, 'half-ratings.css') },
    },
  },
};

export const ReadOnly: Story = {
  render: () => <ReadOnlyDemo />,
  parameters: {
    docs: { source: { code: demoSource(readOnlySource, readOnlyCss, 'read-only.css') } },
  },
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: {
    docs: { source: { code: demoSource(disabledSource, disabledCss, 'disabled.css') } },
  },
};

export const WithField: Story = {
  render: () => <WithFieldDemo />,
  parameters: {
    docs: { source: { code: demoSource(withFieldSource, withFieldCss, 'with-field.css') } },
  },
};

export const WithForm: Story = {
  render: () => <WithFormDemo />,
  parameters: {
    docs: { source: { code: demoSource(withFormSource, withFormCss, 'with-form.css') } },
  },
};
