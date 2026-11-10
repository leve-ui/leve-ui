import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { avatarContextId } from './avatar-context';

export type AvatarFallbackProps = PropsOf<'span'>;

/** 画像が読み込まれていない間（読み込み中・エラー・src 未指定）に表示されます */
export const AvatarFallback = component$<AvatarFallbackProps>((props) => {
  const context = useContext(avatarContextId);

  if (context.status.value === 'loaded') return null;

  return (
    <span {...props} data-levis-avatar-fallback="" data-state={context.status.value}>
      <Slot />
    </span>
  );
});
