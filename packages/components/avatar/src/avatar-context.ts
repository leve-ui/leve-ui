import { createContextId, type Signal } from '@builder.io/qwik';

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarContext {
  status: Signal<ImageLoadingStatus>;
}

export const avatarContextId = createContextId<AvatarContext>('leve-ui.avatar');
