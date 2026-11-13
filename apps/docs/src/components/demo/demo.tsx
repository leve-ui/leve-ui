import { component$ } from '@builder.io/qwik';
import { css } from 'styled-system/css';
import { CollapsedDemoCode, DemoCode, type DemoFile } from './demo-code';
import { demoSources } from './demo-highlighted';
import { demoComponents } from './demo-sources';

export type DemoProps = {
  /** `<component>/<story>`, e.g. `avatar/default` (apps/storybook/stories/demos) */
  id: string;
  /** Hide the code behind a "Show code" toggle (used for Examples) */
  collapsed?: boolean;
};

const previewStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minH: '220px',
  p: '8',
  bg: 'bg.canvas',
  color: 'fg.default',
  overflowX: 'auto',
});

/**
 * A live demo with its TSX and CSS sources in tabs.
 * Usage in MDX: `<Demo id="avatar/default" />`
 */
export const Demo = component$<DemoProps>(({ id, collapsed = false }) => {
  const story = id.split('/')[1];
  const DemoComponent = demoComponents[`${id}.tsx`];
  if (!DemoComponent) {
    throw new Error(`Demo "${id}" was not found in apps/storybook/stories/demos`);
  }

  const files = [`${story}.tsx`, `${story}.css`]
    .map((file, i) => ({ file, html: demoSources[`${id}${i === 0 ? '.tsx' : '.css'}`] }))
    .filter((f): f is DemoFile => typeof f.html === 'string');

  return (
    <div
      data-docs-demo={id}
      class={css({
        my: '6',
        border: '1px solid',
        borderColor: 'border.default',
        borderRadius: 'xl',
        overflow: 'hidden',
      })}
    >
      <div class={previewStyles}>
        <DemoComponent />
      </div>
      {collapsed ? (
        <CollapsedDemoCode name={id} files={files} />
      ) : (
        <DemoCode name={id} files={files} />
      )}
    </div>
  );
});
