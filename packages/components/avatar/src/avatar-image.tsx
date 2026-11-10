import {
  $,
  component$,
  type PropsOf,
  useContext,
  useSignal,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import { avatarContextId } from './avatar-context';

export type AvatarImageProps = PropsOf<'img'>;

export const AvatarImage = component$<AvatarImageProps>(({ onLoad$, onError$, ...props }) => {
  const context = useContext(avatarContextId);
  const imageRef = useSignal<HTMLImageElement>();

  useTask$(({ track }) => {
    const src = track(() => props.src);
    context.status.value = src ? 'loading' : 'error';
  });

  // SSR 後、Qwik の再開前に読み込みが完了していた場合の補正
  // biome-ignore lint/correctness/noQwikUseVisibleTask: DOM の img.complete を参照する必要があるため
  useVisibleTask$(
    () => {
      const image = imageRef.value;
      if (!image?.complete) return;
      context.status.value = image.naturalWidth > 0 ? 'loaded' : 'error';
    },
    { strategy: 'document-ready' },
  );

  const handleLoad$ = $(() => {
    context.status.value = 'loaded';
  });
  const handleError$ = $(() => {
    context.status.value = 'error';
  });

  return (
    // biome-ignore lint/a11y/useAltText: headless のため alt は利用者が props で渡す
    // biome-ignore lint/correctness/useImageSize: width / height は利用者が props で渡す
    <img
      {...props}
      ref={imageRef}
      data-leve-avatar-image=""
      data-state={context.status.value}
      hidden={context.status.value !== 'loaded'}
      onLoad$={[handleLoad$, onLoad$]}
      onError$={[handleError$, onError$]}
    />
  );
});
