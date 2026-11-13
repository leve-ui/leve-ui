import { component$ } from '@builder.io/qwik';
import { css } from 'styled-system/css';
import type { ComponentDoc } from '../../../scripts/generate-props';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/use-locale';

// Generated from the `<Name><Part>Props` types by scripts/generate-props.ts (adr/0032)
const docs = import.meta.glob<ComponentDoc>('../../generated/props/*.json', {
  import: 'default',
  eager: true,
});

function findComponent(component: string) {
  const entry = Object.entries(docs).find(([path]) => path.endsWith(`/${component}.json`));
  return entry?.[1];
}

/** Renders `code` spans written with backticks in JSDoc. */
function inlineCode(text: string) {
  return text
    .split(/`([^`]+)`/)
    .map((chunk, i) => (i % 2 === 1 ? <code key={i}>{chunk}</code> : chunk));
}

/** Puts the element name, as code, in place of `{element}` in a translated sentence. */
function withElement(sentence: string, element: string) {
  const [before, after = ''] = sentence.split('{element}');
  return (
    <>
      {before}
      <code>{`<${element}>`}</code>
      {after}
    </>
  );
}

export type PropsTableProps = {
  /** The package directory name, e.g. `avatar` or `radio-group` */
  component: string;
  /** The part name, e.g. `Root` */
  part: string;
};

const chipStyles = css({
  display: 'inline-block',
  fontFamily: 'mono',
  fontSize: '13px',
  lineHeight: '1.5',
  px: '1.5',
  borderRadius: 'sm',
  bg: 'accent-subtle',
  color: 'accent-text',
  whiteSpace: 'nowrap',
});

const monoStyles = css({
  fontFamily: 'mono',
  fontSize: '13px',
  color: 'fg-default',
  wordBreak: 'break-word',
});

const descriptionStyles = css({
  mt: '1',
  mb: 0,
  color: 'fg-muted',
  whiteSpace: 'pre-line',
});

/**
 * The props of one part. Lists only the props declared by leve-ui, and notes
 * the element whose attributes are also accepted.
 * Usage in MDX: `<PropsTable component="avatar" part="Root" />`
 */
export const PropsTable = component$<PropsTableProps>(({ component, part }) => {
  const locale = useLocale();
  const doc = findComponent(component);
  const partDoc = doc?.parts[part];
  if (!doc || !partDoc) {
    throw new Error(`PropsTable: "${component}" has no part "${part}"`);
  }

  const elementNote = partDoc.element && (
    <p class={css({ fontSize: '14px' })}>
      {withElement(t(locale, 'Also accepts all {element} attributes.'), partDoc.element)}
    </p>
  );

  if (partDoc.props.length === 0) {
    return (
      <p class={css({ fontSize: '14px' })}>
        {t(locale, 'No props of its own.')}
        {partDoc.element && (
          <> {withElement(t(locale, 'Accepts all {element} attributes.'), partDoc.element)}</>
        )}
      </p>
    );
  }

  return (
    <>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">{t(locale, 'Prop')}</th>
              <th scope="col">{t(locale, 'Default')}</th>
              <th scope="col">{t(locale, 'Type')}</th>
            </tr>
          </thead>
          <tbody>
            {partDoc.props.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <span class={chipStyles}>
                    {prop.name}
                    {prop.required && (
                      <>
                        <span aria-hidden="true">*</span>
                        <span class={css({ srOnly: true })}> ({t(locale, 'required')})</span>
                      </>
                    )}
                  </span>
                </td>
                <td>
                  {prop.default ? (
                    <span class={monoStyles}>{prop.default}</span>
                  ) : (
                    <span class={css({ color: 'fg-subtle' })}>–</span>
                  )}
                </td>
                <td>
                  <span class={monoStyles}>{prop.type}</span>
                  {prop.description && (
                    <p class={descriptionStyles}>{inlineCode(t(locale, prop.description))}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {elementNote}
    </>
  );
});
