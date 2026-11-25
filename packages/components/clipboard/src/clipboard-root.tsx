import {
  $,
  component$,
  type PropsOf,
  type QRL,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { announce, dataAttr } from '@leve-ui/utils';
import { clipboardContextId } from './clipboard-context';

export type ClipboardRootProps = PropsOf<'div'> & {
  /** The text value to copy to the clipboard. */
  value: string;
  /**
   * Duration in milliseconds before `copied` resets to `false`.
   * @default 2000
   */
  timeout?: number;
  /**
   * Message announced to screen readers via the live region when copied.
   * @default 'Copied to clipboard'
   */
  copiedAnnouncement?: string;
  /** Callback invoked with the copied value when copying succeeds. */
  onCopy$?: QRL<(value: string) => void>;
  /** Callback invoked when the copied state changes. */
  onStatusChange$?: QRL<(copied: boolean) => void>;
};

const resetTimers = new Map<string, ReturnType<typeof setTimeout>>();

function clearResetTimer(key: string) {
  const existing = resetTimers.get(key);
  if (existing !== undefined) {
    clearTimeout(existing);
    resetTimers.delete(key);
  }
}

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand fallback when Clipboard API is unavailable or denied
    }
  }

  if (typeof document === 'undefined' || !document.body) return false;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  } finally {
    document.body.removeChild(textarea);
  }
  return ok;
}

/**
 * Container for clipboard controls. Manages the copy action, timed `copied` state,
 * and screen reader live region announcement.
 *
 * There is no WAI-ARIA APG pattern for clipboard widgets; this component uses a native
 * `<button type="button">` trigger and announces copy confirmation via `@leve-ui/utils` `announce()`.
 */
export const ClipboardRoot = component$<ClipboardRootProps>(
  ({
    value,
    timeout = 2000,
    copiedAnnouncement = 'Copied to clipboard',
    onCopy$,
    onStatusChange$,
    ...restProps
  }) => {
    const copied = useSignal(false);
    const timerKey = useId();
    const valueSignal = useComputed$(() => value);
    const timeoutSignal = useComputed$(() => timeout);
    const announcementSignal = useComputed$(() => copiedAnnouncement);

    // biome-ignore lint/correctness/noQwikUseVisibleTask: clean up any pending reset timer on unmount
    useVisibleTask$(
      ({ cleanup }) => {
        cleanup(() => clearResetTimer(timerKey));
      },
      { strategy: 'document-ready' },
    );

    const copy$ = $(async () => {
      const val = valueSignal.value;
      const ok = await copyText(val);
      if (!ok) return;

      copied.value = true;
      announce(announcementSignal.value);
      await onCopy$?.(val);
      await onStatusChange$?.(true);

      clearResetTimer(timerKey);
      const duration = timeoutSignal.value;
      if (Number.isFinite(duration) && duration >= 0) {
        const handle = setTimeout(() => {
          resetTimers.delete(timerKey);
          copied.value = false;
          void onStatusChange$?.(false);
        }, duration);
        resetTimers.set(timerKey, handle);
      }
    });

    useContextProvider(clipboardContextId, {
      value: valueSignal,
      copied,
      copy$,
    });

    return (
      <div
        {...restProps}
        data-leve-clipboard=""
        data-state={copied.value ? 'copied' : 'idle'}
        data-copied={dataAttr(copied.value)}
      >
        <Slot />
      </div>
    );
  },
);
