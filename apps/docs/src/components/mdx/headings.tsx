import { component$, type PropsOf, Slot } from '@builder.io/qwik';
import { css } from 'styled-system/css';

const anchorStyles = css({
  ml: '2',
  color: 'fg.subtle',
  textDecoration: 'none',
  opacity: 0,
  transition: 'opacity 0.15s ease',
  _focusVisible: { opacity: 1 },
  '*:hover > &': { opacity: 1 },
});

const h2Styles = css({
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  color: 'fg.default',
  pt: '10',
  mt: 0,
  mb: '4',
  scrollMarginTop: '16',
});

const h3Styles = css({
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '1.4',
  color: 'fg.default',
  mt: '8',
  mb: '3',
  scrollMarginTop: '20',
});

/** h2 with a "#" link to itself (ids are added by rehype-slug) */
export const H2 = component$<PropsOf<'h2'>>((props) => (
  <h2 {...props} class={h2Styles}>
    <Slot />
    {props.id && (
      <a href={`#${props.id}`} class={anchorStyles} aria-label="Link to this section">
        #
      </a>
    )}
  </h2>
));

export const H3 = component$<PropsOf<'h3'>>((props) => (
  <h3 {...props} class={h3Styles}>
    <Slot />
    {props.id && (
      <a href={`#${props.id}`} class={anchorStyles} aria-label="Link to this section">
        #
      </a>
    )}
  </h3>
));
