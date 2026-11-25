import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export interface RatingGroupIds {
  root: string;
}

export interface RatingGroupContext {
  ids: RatingGroupIds;
  count: ReadonlySignal<number>;
  value: ReadonlySignal<number>;
  hoverValue: ReadonlySignal<number | null>;
  setRating$: QRL<(value: number) => Promise<void>>;
  setHover$: QRL<(value: number | null) => Promise<void>>;
  reset$: QRL<() => Promise<void>>;
  allowHalf: ReadonlySignal<boolean>;
  allowClear: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
  readOnly: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
}

export const ratingGroupContextId = createContextId<RatingGroupContext>('leve-ui.rating-group');
