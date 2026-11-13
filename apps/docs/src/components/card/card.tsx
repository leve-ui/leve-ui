import { component$, type PropsOf, Slot } from '@builder.io/qwik';
import { css } from 'styled-system/css';

export type CardVariant = 'default' | 'white' | 'glow' | 'subtle';

export interface CardRootProps extends PropsOf<'div'> {
  variant?: CardVariant;
  hoverable?: boolean;
}

const cardBaseStyles = css({
  position: 'relative',
  borderRadius: 'xl',
  p: '6',
  transition:
    'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
});

const variantStyles: Record<CardVariant, string> = {
  default: css({
    bg: 'bg-canvas',
    border: '1px solid',
    borderColor: 'border-default',
    color: 'fg-default',
  }),
  white: css({
    bg: 'white',
    color: 'slate.900',
    border: '1px solid',
    borderColor: 'slate.200',
    _dark: {
      bg: 'white',
      color: 'slate.900',
      borderColor: 'slate.200',
      boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
    },
  }),
  glow: css({
    bg: 'bg-canvas',
    border: '1px solid',
    borderColor: 'accent-default',
    color: 'fg-default',
    _hover: {
      borderColor: 'accent-default',
    },
  }),
  subtle: css({
    bg: 'bg-subtle',
    border: '1px solid',
    borderColor: 'border-subtle',
    color: 'fg-default',
  }),
};

const hoverableStyles = css({
  _hover: {
    transform: 'translateY(-2px)',
  },
});

export const CardRoot = component$<CardRootProps>(
  ({ variant = 'default', hoverable = false, ...props }) => {
    return (
      <div
        {...props}
        class={[cardBaseStyles, variantStyles[variant], hoverable && hoverableStyles, props.class]}
      >
        <Slot />
      </div>
    );
  },
);

export type CardHeaderProps = PropsOf<'div'>;

export const CardHeader = component$<CardHeaderProps>((props) => {
  return (
    <div
      {...props}
      class={[
        css({
          display: 'flex',
          flexDirection: 'column',
          gap: '1',
          mb: '4',
        }),
        props.class,
      ]}
    >
      <Slot />
    </div>
  );
});

export type CardTitleProps = PropsOf<'h3'>;

export const CardTitle = component$<CardTitleProps>((props) => {
  return (
    <h3
      {...props}
      class={[
        css({
          fontSize: 'lg',
          fontWeight: 'bold',
          lineHeight: 'snug',
          color: 'inherit',
        }),
        props.class,
      ]}
    >
      <Slot />
    </h3>
  );
});

export type CardDescriptionProps = PropsOf<'p'>;

export const CardDescription = component$<CardDescriptionProps>((props) => {
  return (
    <p
      {...props}
      class={[
        css({
          fontSize: 'sm',
          color: 'fg-muted',
          lineHeight: 'relaxed',
        }),
        props.class,
      ]}
    >
      <Slot />
    </p>
  );
});

export type CardContentProps = PropsOf<'div'>;

export const CardContent = component$<CardContentProps>((props) => {
  return (
    <div {...props} class={props.class}>
      <Slot />
    </div>
  );
});

export type CardFooterProps = PropsOf<'div'>;

export const CardFooter = component$<CardFooterProps>((props) => {
  return (
    <div
      {...props}
      class={[
        css({
          display: 'flex',
          alignItems: 'center',
          gap: '3',
          mt: '6',
          pt: '4',
          borderTop: '1px solid',
          borderColor: 'border-subtle',
        }),
        props.class,
      ]}
    >
      <Slot />
    </div>
  );
});

export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
