import {
  component$,
  isServer,
  type PropsOf,
  type QRL,
  Slot,
  useContextProvider,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import { avatarContextId, type ImageLoadingStatus } from './avatar-context';

export type AvatarRootProps = PropsOf<'span'> & {
  /** 画像の読み込み状態が変化したときに呼ばれます */
  onStatusChange$?: QRL<(status: ImageLoadingStatus) => void>;
};

export const AvatarRoot = component$<AvatarRootProps>(({ onStatusChange$, ...props }) => {
  const status = useSignal<ImageLoadingStatus>('idle');

  useContextProvider(avatarContextId, { status });

  useTask$(({ track }) => {
    const current = track(() => status.value);
    if (isServer) return;
    onStatusChange$?.(current);
  });

  return (
    <span {...props} data-levis-avatar="">
      <Slot />
    </span>
  );
});
