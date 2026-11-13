import { $, component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Alert, Avatar, Meter, Progress, Separator, Toggle } from '@leve-ui/core';
import { css, cx } from 'styled-system/css';
import { Card } from '../components/card';
import {
  LuArrowRight,
  LuCheck,
  LuCode2,
  LuCopy,
  LuLayers,
  LuPalette,
  LuShieldCheck,
  LuSliders,
  LuSparkles,
  LuTerminal,
} from '../components/icons';

// コードシンタックス用のスタイル
const codeContainerStyles = css({
  mt: '4',
  borderRadius: 'lg',
  bg: '#0f1429',
  border: '1px solid',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.4)',
});

const codeHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: '3.5',
  py: '2',
  bg: 'rgba(255, 255, 255, 0.03)',
  borderBottom: '1px solid',
  borderColor: 'rgba(255, 255, 255, 0.06)',
});

const windowDotsStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5',
});

const dotRed = css({
  w: '2.5',
  h: '2.5',
  borderRadius: 'full',
  bg: '#ff5f56',
  display: 'inline-block',
});

const dotYellow = css({
  w: '2.5',
  h: '2.5',
  borderRadius: 'full',
  bg: '#ffbd2e',
  display: 'inline-block',
});

const dotGreen = css({
  w: '2.5',
  h: '2.5',
  borderRadius: 'full',
  bg: '#27c93f',
  display: 'inline-block',
});

const codeFileNameStyles = css({
  fontSize: 'xs',
  fontFamily: 'mono',
  color: 'rgba(218, 240, 255, 0.7)',
});

const codePreStyles = css({
  p: '3.5',
  fontSize: 'xs',
  fontFamily: 'mono',
  lineHeight: '1.6',
  color: '#e2e8f0',
  overflowX: 'auto',
  m: '0',
});

const codeKeyword = css({ color: '#ac7ef4', fontWeight: 'semibold' });
const codeTag = css({ color: '#009dfd', fontWeight: 'semibold' });
const codeAttr = css({ color: '#daf0ff' });
const codeString = css({ color: '#34d399' });
const codeFn = css({ color: '#60a5fa' });
const codeComment = css({ color: '#64748b', fontStyle: 'italic' });
const codeBool = css({ color: '#f59e0b' });

export default component$(() => {
  const isBookmarked = useSignal(false);
  const progressValue = useSignal(65);
  const installCopied = useSignal(false);

  const copyInstall$ = $(() => {
    navigator.clipboard.writeText('pnpm add @leve-ui/core');
    installCopied.value = true;
    setTimeout(() => {
      installCopied.value = false;
    }, 2000);
  });

  return (
    <div
      class={css({
        maxW: '7xl',
        mx: 'auto',
        px: { base: '4', sm: '6' },
        py: '10',
      })}
    >
      {/* ========================================================= */}
      {/* HERO SECTION                                              */}
      {/* ========================================================= */}
      <section
        id="overview"
        // The hero is dark in both themes: `dark` resolves the tokens inside to their dark values
        class={cx(
          'dark',
          css({
            position: 'relative',
            borderRadius: '3xl',
            overflow: 'hidden',
            p: { base: '8', md: '14', lg: '16' },
            mb: '16',
            bg: 'bg-canvas',
            color: 'white',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(21, 25, 52, 0.5)',
          }),
        )}
      >
        {/* 背景のグラデーション光彩 */}
        <div
          class={css({
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            w: '600px',
            h: '600px',
            borderRadius: 'full',
            bgGradient: 'radial',
            gradientFrom: 'rgba(0, 157, 253, 0.25)',
            gradientTo: 'transparent',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          })}
        />
        <div
          class={css({
            position: 'absolute',
            bottom: '-25%',
            left: '10%',
            w: '500px',
            h: '500px',
            borderRadius: 'full',
            bgGradient: 'radial',
            gradientFrom: 'rgba(172, 126, 244, 0.2)',
            gradientTo: 'transparent',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          })}
        />

        <div
          class={css({
            position: 'relative',
            zIndex: '1',
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '1.2fr 0.8fr' },
            gap: { base: '10', lg: '12' },
            alignItems: 'center',
          })}
        >
          {/* 左カラム: コピーとリンクボタン */}
          <div>
            {/* バッジ */}
            <div
              class={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2',
                px: '3.5',
                py: '1.5',
                borderRadius: 'full',
                bg: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                fontSize: 'xs',
                fontWeight: 'medium',
                color: 'fg-muted',
                mb: '6',
              })}
            >
              <LuSparkles class={css({ color: 'accent-default' })} />
              <span>Headless UI for Qwik</span>
              <span class={css({ color: 'white', opacity: '0.4' })}>|</span>
              <span class={css({ color: 'secondary-default', fontWeight: 'semibold' })}>v0.1</span>
            </div>

            {/* H1 タイトル */}
            <h1
              class={css({
                fontSize: { base: '3xl', sm: '4xl', md: '5xl', lg: '5xl' },
                fontWeight: '800',
                lineHeight: { base: '1.15', md: '1.1' },
                letterSpacing: 'tight',
                mb: '6',
              })}
            >
              The unstyled, accessible UI library for{' '}
              <span
                class={css({
                  bgGradient: 'to-r',
                  gradientFrom: 'accent-default',
                  gradientTo: 'secondary-default',
                  backgroundClip: 'text',
                  color: 'transparent',
                })}
              >
                Qwik
              </span>
            </h1>

            {/* サブテキスト */}
            <p
              class={css({
                fontSize: { base: 'base', md: 'lg' },
                color: 'fg-muted',
                lineHeight: 'relaxed',
                mb: '8',
                maxW: 'xl',
              })}
            >
              Lightweight, fully unstyled, and WAI-ARIA compliant components engineered ground-up
              for Qwik's resumability. Build accessible web applications with 100% styling freedom.
            </p>

            {/* アクションボタン群 */}
            <div
              class={css({
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4',
                alignItems: 'center',
                mb: '8',
              })}
            >
              <a
                href="/docs/overview"
                class={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2',
                  px: '6',
                  py: '3.5',
                  borderRadius: 'xl',
                  bg: 'accent-default',
                  color: 'white',
                  fontWeight: 'semibold',
                  fontSize: 'sm',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 157, 253, 0.4)',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  _hover: {
                    bg: 'accent-text',
                    transform: 'translateY(-1px)',
                  },
                })}
              >
                <span>Getting Started</span>
                <LuArrowRight />
              </a>

              <a
                href="/components"
                class={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2',
                  px: '6',
                  py: '3.5',
                  borderRadius: 'xl',
                  bg: 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  fontWeight: 'semibold',
                  fontSize: 'sm',
                  textDecoration: 'none',
                  border: '1px solid',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease',
                  _hover: {
                    bg: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                })}
              >
                <LuLayers />
                <span>Components</span>
              </a>
            </div>

            {/* インストールコマンド（ワンクリックコピー） */}
            <div
              class={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3',
                px: '4',
                py: '2.5',
                borderRadius: 'lg',
                bg: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                fontSize: 'xs',
                fontFamily: 'mono',
                color: 'fg-muted',
              })}
            >
              <LuTerminal class={css({ color: 'accent-default', flexShrink: 0 })} />
              <span class={css({ userSelect: 'all' })}>pnpm add @leve-ui/core</span>
              <button
                type="button"
                aria-label="Copy install command"
                onClick$={copyInstall$}
                class={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1',
                  ml: '2',
                  p: '1',
                  borderRadius: 'md',
                  color: installCopied.value ? '#34d399' : 'fg-subtle',
                  cursor: 'pointer',
                  bg: 'transparent',
                  border: 'none',
                  transition: 'color 0.15s ease',
                  _hover: { color: 'white' },
                })}
              >
                {installCopied.value ? <LuCheck /> : <LuCopy />}
                {installCopied.value && <span class={css({ fontSize: '2xs' })}>Copied!</span>}
              </button>
            </div>
          </div>

          {/* 右カラム: Hero プレビューカード */}
          <div
            class={css({
              display: { base: 'none', sm: 'block' },
            })}
          >
            <div
              class={css({
                borderRadius: '2xl',
                bg: '#0f1429',
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
                overflow: 'hidden',
              })}
            >
              {/* カードヘッダー */}
              <div
                class={css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: '4',
                  py: '3',
                  bg: 'rgba(255, 255, 255, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                })}
              >
                <div class={windowDotsStyles}>
                  <span class={dotRed} />
                  <span class={dotYellow} />
                  <span class={dotGreen} />
                </div>
                <div
                  class={css({
                    fontSize: 'xs',
                    fontFamily: 'mono',
                    color: 'rgba(218, 240, 255, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5',
                  })}
                >
                  <LuCode2 class={css({ color: 'accent-default' })} />
                  <span>app.tsx</span>
                </div>
              </div>

              {/* カード内コードプレビュー */}
              <pre
                class={css({
                  p: '5',
                  fontSize: 'xs',
                  fontFamily: 'mono',
                  lineHeight: '1.7',
                  color: '#e2e8f0',
                  m: '0',
                })}
              >
                <span class={codeKeyword}>import</span> &#123; component$, useSignal &#125;{' '}
                <span class={codeKeyword}>from</span>{' '}
                <span class={codeString}>'@builder.io/qwik'</span>;{'\n'}
                <span class={codeKeyword}>import</span> &#123; Toggle, Alert &#125;{' '}
                <span class={codeKeyword}>from</span>{' '}
                <span class={codeString}>'@leve-ui/core'</span>;{'\n\n'}
                <span class={codeKeyword}>export default</span>{' '}
                <span class={codeFn}>component$</span>(() =&gt; &#123;{'\n'}
                {'  '}
                <span class={codeKeyword}>const</span> on = <span class={codeFn}>useSignal</span>(
                <span class={codeBool}>true</span>);{'\n\n'}
                {'  '}
                <span class={codeKeyword}>return</span> ({'\n'}
                {'    '}&lt;<span class={codeTag}>Toggle.Root</span>{' '}
                <span class={codeAttr}>bind:pressed</span>=&#123;on&#125;&gt;
                {'\n'}
                {'      '}&#123;on.value ? <span class={codeString}>'Enabled'</span> :{' '}
                <span class={codeString}>'Disabled'</span>&#125;{'\n'}
                {'    '}&lt;/<span class={codeTag}>Toggle.Root</span>&gt;{'\n'}
                {'  '});{'\n'}
                &#125;);
              </pre>

              {/* ライブミニプレビューバー */}
              <div
                class={css({
                  p: '4',
                  bg: 'rgba(255, 255, 255, 0.02)',
                  borderTop: '1px solid',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                })}
              >
                <span class={css({ fontSize: 'xs', color: 'fg-muted' })}>
                  Live Component Preview:
                </span>
                <Toggle.Root
                  bind:pressed={isBookmarked}
                  class={css({
                    px: '3.5',
                    py: '1.5',
                    borderRadius: 'md',
                    fontWeight: 'semibold',
                    fontSize: 'xs',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    bg: 'rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    transition: 'all 0.2s ease',
                    '&[data-state="on"]': {
                      bg: 'accent-default',
                      borderColor: 'accent-default',
                    },
                    _hover: {
                      borderColor: 'accent-default',
                    },
                  })}
                >
                  {isBookmarked.value ? '★ Bookmarked' : '☆ Bookmark'}
                </Toggle.Root>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ABOUT SECTION (CORE PRINCIPLES)                           */}
      {/* ========================================================= */}
      <section id="about" class={css({ mb: '16' })}>
        <div
          class={css({
            textAlign: 'center',
            maxW: '2xl',
            mx: 'auto',
            mb: '12',
          })}
        >
          <div
            class={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.5',
              px: '3',
              py: '1',
              borderRadius: 'full',
              bg: 'bg-muted',
              color: 'accent-default',
              fontSize: 'xs',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              mb: '3',
            })}
          >
            <LuSparkles />
            <span>Core Principles</span>
          </div>
          <h2
            class={css({
              fontSize: { base: '2xl', md: '3xl' },
              fontWeight: '800',
              color: 'fg-default',
              mb: '3',
              letterSpacing: 'tight',
            })}
          >
            Designed for Qwik. Built for Developers.
          </h2>
          <p
            class={css({
              color: 'fg-muted',
              fontSize: { base: 'sm', md: 'base' },
              lineHeight: 'relaxed',
            })}
          >
            A modern foundation that pairs accessibility with total stylistic freedom, engineered
            without compromise.
          </p>
        </div>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: 'repeat(3, 1fr)' },
            gap: '6',
          })}
        >
          {/* Item 1: Headless */}
          <Card hoverable class={css({ display: 'flex', flexDirection: 'column' })}>
            <Card.Header>
              <div
                class={css({
                  w: '11',
                  h: '11',
                  borderRadius: 'xl',
                  bg: 'rgba(0, 157, 253, 0.12)',
                  color: 'accent-default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'xl',
                  mb: '4',
                })}
              >
                <LuPalette />
              </div>
              <div
                class={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: '2.5',
                  py: '0.5',
                  borderRadius: 'full',
                  fontSize: '2xs',
                  fontWeight: 'bold',
                  bg: 'bg-muted',
                  color: 'accent-default',
                  w: 'fit-content',
                  mb: '2',
                })}
              >
                UNSTYLED &amp; FLEXIBLE
              </div>
              <Card.Title>Headless</Card.Title>
              <Card.Description>
                Zero bundled styles or CSS runtime overhead. Every component is completely unstyled,
                giving you 100% freedom to style with Panda CSS, Tailwind, or custom CSS.
              </Card.Description>
            </Card.Header>

            <Card.Content class={css({ mt: 'auto' })}>
              {/* Example Code 1 */}
              <div class={codeContainerStyles}>
                <div class={codeHeaderStyles}>
                  <div class={windowDotsStyles}>
                    <span class={dotRed} />
                    <span class={dotYellow} />
                    <span class={dotGreen} />
                  </div>
                  <span class={codeFileNameStyles}>avatar.tsx</span>
                </div>
                <pre class={codePreStyles}>
                  <span class={codeKeyword}>import</span> &#123; Avatar &#125;{' '}
                  <span class={codeKeyword}>from</span>{' '}
                  <span class={codeString}>'@leve-ui/core'</span>;{'\n\n'}
                  <span class={codeComment}>{'// Fully styleable with class / Panda CSS'}</span>
                  {'\n'}
                  &lt;<span class={codeTag}>Avatar.Root</span> <span class={codeAttr}>class</span>=
                  <span class={codeString}>"avatar-root"</span>&gt;{'\n'}
                  {'  '}&lt;<span class={codeTag}>Avatar.Image</span>{' '}
                  <span class={codeAttr}>src</span>=<span class={codeString}>"/user.jpg"</span>{' '}
                  <span class={codeAttr}>alt</span>=<span class={codeString}>"User"</span> /&gt;
                  {'\n'}
                  {'  '}&lt;<span class={codeTag}>Avatar.Fallback</span>
                  &gt;LU&lt;/
                  <span class={codeTag}>Avatar.Fallback</span>&gt;{'\n'}
                  &lt;/<span class={codeTag}>Avatar.Root</span>&gt;
                </pre>
              </div>
            </Card.Content>
          </Card>

          {/* Item 2: Accessibility */}
          <Card hoverable class={css({ display: 'flex', flexDirection: 'column' })}>
            <Card.Header>
              <div
                class={css({
                  w: '11',
                  h: '11',
                  borderRadius: 'xl',
                  bg: 'rgba(172, 126, 244, 0.12)',
                  color: 'secondary-default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'xl',
                  mb: '4',
                })}
              >
                <LuShieldCheck />
              </div>
              <div
                class={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: '2.5',
                  py: '0.5',
                  borderRadius: 'full',
                  fontSize: '2xs',
                  fontWeight: 'bold',
                  bg: 'bg-muted',
                  color: 'secondary-default',
                  w: 'fit-content',
                  mb: '2',
                })}
              >
                WAI-ARIA APG
              </div>
              <Card.Title>Accessibility</Card.Title>
              <Card.Description>
                Engineered strictly according to the WAI-ARIA Authoring Practices Guide (APG).
                Keyboard navigation, roving tabindex, focus management, and ARIA roles are output
                automatically.
              </Card.Description>
            </Card.Header>

            <Card.Content class={css({ mt: 'auto' })}>
              {/* Example Code 2 */}
              <div class={codeContainerStyles}>
                <div class={codeHeaderStyles}>
                  <div class={windowDotsStyles}>
                    <span class={dotRed} />
                    <span class={dotYellow} />
                    <span class={dotGreen} />
                  </div>
                  <span class={codeFileNameStyles}>alert.tsx</span>
                </div>
                <pre class={codePreStyles}>
                  <span class={codeKeyword}>import</span> &#123; Alert &#125;{' '}
                  <span class={codeKeyword}>from</span>{' '}
                  <span class={codeString}>'@leve-ui/core'</span>;{'\n\n'}
                  <span class={codeComment}>{'// Automatically outputs: role="alert"'}</span>
                  {'\n'}
                  &lt;<span class={codeTag}>Alert.Root</span> <span class={codeAttr}>class</span>=
                  <span class={codeString}>"alert"</span>&gt;{'\n'}
                  {'  '}&lt;<span class={codeTag}>Alert.Title</span>
                  &gt;Notice&lt;/
                  <span class={codeTag}>Alert.Title</span>&gt;{'\n'}
                  {'  '}&lt;<span class={codeTag}>Alert.Description</span>&gt;
                  {'\n'}
                  {'    '}Accessible out of the box.{'\n'}
                  {'  '}&lt;/<span class={codeTag}>Alert.Description</span>&gt;
                  {'\n'}
                  &lt;/<span class={codeTag}>Alert.Root</span>&gt;
                </pre>
              </div>
            </Card.Content>
          </Card>

          {/* Item 3: State Management */}
          <Card hoverable class={css({ display: 'flex', flexDirection: 'column' })}>
            <Card.Header>
              <div
                class={css({
                  w: '11',
                  h: '11',
                  borderRadius: 'xl',
                  bg: 'rgba(0, 108, 233, 0.12)',
                  color: 'accent-text',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'xl',
                  mb: '4',
                })}
              >
                <LuSliders />
              </div>
              <div
                class={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: '2.5',
                  py: '0.5',
                  borderRadius: 'full',
                  fontSize: '2xs',
                  fontWeight: 'bold',
                  bg: 'bg-muted',
                  color: 'accent-default',
                  w: 'fit-content',
                  mb: '2',
                })}
              >
                SIGNALS POWERED
              </div>
              <Card.Title>State Management</Card.Title>
              <Card.Description>
                Complete support for both controlled (<code>bind:*</code>) and uncontrolled (
                <code>default*</code>) modes. Directly binds with Qwik Signals for pinpoint reactive
                DOM updates.
              </Card.Description>
            </Card.Header>

            <Card.Content class={css({ mt: 'auto' })}>
              {/* Example Code 3 */}
              <div class={codeContainerStyles}>
                <div class={codeHeaderStyles}>
                  <div class={windowDotsStyles}>
                    <span class={dotRed} />
                    <span class={dotYellow} />
                    <span class={dotGreen} />
                  </div>
                  <span class={codeFileNameStyles}>toggle.tsx</span>
                </div>
                <pre class={codePreStyles}>
                  <span class={codeKeyword}>const</span> pressed ={' '}
                  <span class={codeFn}>useSignal</span>(<span class={codeBool}>false</span>);
                  {'\n\n'}
                  <span class={codeComment}>{'// Controlled with Qwik Signal'}</span>
                  {'\n'}
                  &lt;<span class={codeTag}>Toggle.Root</span>{' '}
                  <span class={codeAttr}>bind:pressed</span>= &#123;pressed&#125;&gt;{'\n'}
                  {'  '}&#123;pressed.value ? <span class={codeString}>'Active'</span> :{' '}
                  <span class={codeString}>'Inactive'</span>&#125;{'\n'}
                  &lt;/<span class={codeTag}>Toggle.Root</span>&gt;
                </pre>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>

      <Separator.Root class={css({ height: '1px', bg: 'border-default', my: '14' })} />

      {/* ========================================================= */}
      {/* UI COMPONENTS SHOWCASE                                    */}
      {/* ========================================================= */}
      <section id="components" class={css({ mb: '16' })}>
        <div class={css({ mb: '8' })}>
          <div
            class={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.5',
              px: '3',
              py: '1',
              borderRadius: 'full',
              bg: 'bg-muted',
              color: 'accent-default',
              fontSize: 'xs',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              mb: '2',
            })}
          >
            <LuLayers />
            <span>Interactive Demo</span>
          </div>
          <h2
            class={css({
              fontSize: '2xl',
              fontWeight: '800',
              color: 'fg-default',
              mb: '2',
            })}
          >
            UI Components (@leve-ui/core)
          </h2>
          <p class={css({ color: 'fg-muted', fontSize: 'sm' })}>
            Live interactive preview of unstyled components powered by <code>@leve-ui/core</code>{' '}
            and styled with Panda CSS in Light &amp; Dark themes.
          </p>
        </div>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
            gap: '6',
          })}
        >
          {/* Card 1: Alert */}
          <Card hoverable>
            <Card.Title class={css({ mb: '4' })}>Alert</Card.Title>
            <Alert.Root
              class={css({
                bg: 'accent-subtle',
                borderLeft: '4px solid',
                borderColor: 'accent-default',
                p: '4',
                borderRadius: 'md',
                _dark: {
                  bg: 'rgba(0, 157, 253, 0.12)',
                  borderColor: 'accent-default',
                },
              })}
            >
              <Alert.Title
                class={css({
                  fontWeight: 'bold',
                  color: 'accent-text',
                  fontSize: 'sm',
                  mb: '1',
                })}
              >
                Panda CSS Theme Switcher Ready
              </Alert.Title>
              <Alert.Description
                class={css({
                  color: 'gray.700',
                  fontSize: 'xs',
                  lineHeight: 'relaxed',
                  _dark: { color: 'gray.300' },
                })}
              >
                Seamlessly toggle between Light and Dark mode using Panda CSS semanticTokens.
              </Alert.Description>
            </Alert.Root>
          </Card>

          {/* Card 2: Avatar */}
          <Card hoverable>
            <Card.Title class={css({ mb: '4' })}>Avatar</Card.Title>
            <div class={css({ display: 'flex', alignItems: 'center', gap: '4' })}>
              <Avatar.Root
                class={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  w: '12',
                  h: '12',
                  borderRadius: 'full',
                  overflow: 'hidden',
                  border: '2px solid',
                  borderColor: 'accent-default',
                })}
              >
                <Avatar.Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                  alt="User Avatar"
                  width={48}
                  height={48}
                  class={css({ w: 'full', h: 'full', objectFit: 'cover' })}
                />
                <Avatar.Fallback
                  class={css({
                    w: 'full',
                    h: 'full',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bg: 'secondary-default',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 'sm',
                  })}
                >
                  QW
                </Avatar.Fallback>
              </Avatar.Root>

              <Avatar.Root
                class={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  w: '12',
                  h: '12',
                  borderRadius: 'full',
                  overflow: 'hidden',
                  bg: 'secondary-default',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 'sm',
                })}
              >
                <Avatar.Fallback>LU</Avatar.Fallback>
              </Avatar.Root>
            </div>
          </Card>

          {/* Card 3: Toggle */}
          <Card hoverable>
            <Card.Title class={css({ mb: '4' })}>Toggle</Card.Title>
            <div class={css({ display: 'flex', alignItems: 'center', gap: '4' })}>
              <Toggle.Root
                bind:pressed={isBookmarked}
                class={css({
                  px: '4',
                  py: '2',
                  borderRadius: 'lg',
                  fontWeight: 'semibold',
                  fontSize: 'sm',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'border-default',
                  bg: 'bg-muted',
                  color: 'fg-default',
                  transition: 'all 0.2s',
                  '&[data-state="on"]': {
                    bg: 'accent-default',
                    color: 'white',
                    borderColor: 'accent-default',
                  },
                  _hover: {
                    borderColor: 'accent-default',
                  },
                })}
              >
                {isBookmarked.value ? '★ Bookmarked' : '☆ Bookmark'}
              </Toggle.Root>
              <span class={css({ fontSize: 'xs', color: 'fg-muted' })}>
                State: <code>{isBookmarked.value ? 'on' : 'off'}</code>
              </span>
            </div>
          </Card>

          {/* Card 4: Progress & Meter */}
          <Card hoverable>
            <Card.Title class={css({ mb: '4' })}>Progress &amp; Meter</Card.Title>
            <Progress.Root
              value={progressValue.value}
              class={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '2',
              })}
            >
              <div
                class={css({
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'xs',
                  fontWeight: 'semibold',
                  color: 'fg-muted',
                })}
              >
                <Progress.Label>Download Progress</Progress.Label>
                <Progress.ValueText>{progressValue.value}%</Progress.ValueText>
              </div>
              <Progress.Track
                class={css({
                  h: '2.5',
                  bg: 'bg-muted',
                  borderRadius: 'full',
                  overflow: 'hidden',
                })}
              >
                <Progress.Indicator
                  class={css({
                    h: 'full',
                    w: 'var(--leve-progress-percent)',
                    bgGradient: 'to-r',
                    gradientFrom: 'accent-default',
                    gradientTo: 'secondary-default',
                    borderRadius: 'full',
                    transition: 'width 0.3s ease',
                  })}
                />
              </Progress.Track>
            </Progress.Root>

            <div class={css({ mt: '4', display: 'flex', gap: '2' })}>
              <button
                type="button"
                onClick$={() => {
                  progressValue.value = Math.max(0, progressValue.value - 15);
                }}
                class={css({
                  px: '2.5',
                  py: '1',
                  fontSize: 'xs',
                  borderRadius: 'md',
                  bg: 'bg-muted',
                  color: 'fg-default',
                  border: '1px solid',
                  borderColor: 'border-default',
                  cursor: 'pointer',
                  _hover: { bg: 'border-default' },
                })}
              >
                -15%
              </button>
              <button
                type="button"
                onClick$={() => {
                  progressValue.value = Math.min(100, progressValue.value + 15);
                }}
                class={css({
                  px: '2.5',
                  py: '1',
                  fontSize: 'xs',
                  borderRadius: 'md',
                  bg: 'bg-muted',
                  color: 'fg-default',
                  border: '1px solid',
                  borderColor: 'border-default',
                  cursor: 'pointer',
                  _hover: { bg: 'border-default' },
                })}
              >
                +15%
              </button>
            </div>

            <div
              class={css({
                mt: '6',
                pt: '4',
                borderTop: '1px solid',
                borderColor: 'border-default',
              })}
            >
              <Meter.Root
                value={progressValue.value}
                min={0}
                max={100}
                class={css({
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2',
                })}
              >
                <div
                  class={css({
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 'xs',
                    fontWeight: 'semibold',
                    color: 'fg-muted',
                  })}
                >
                  <Meter.Label>System Capacity (Meter)</Meter.Label>
                  <Meter.ValueText>{progressValue.value}%</Meter.ValueText>
                </div>
                <Meter.Track
                  class={css({
                    h: '2',
                    bg: 'bg-muted',
                    borderRadius: 'full',
                    overflow: 'hidden',
                  })}
                >
                  <Meter.Indicator
                    class={css({
                      h: 'full',
                      w: 'var(--leve-meter-percent)',
                      bg: 'accent-text',
                      borderRadius: 'full',
                      transition: 'width 0.3s ease',
                    })}
                  />
                </Meter.Track>
              </Meter.Root>
            </div>
          </Card>
        </div>
      </section>

      <Separator.Root class={css({ height: '1px', bg: 'border-default', my: '14' })} />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'leve-ui — Headless UI for Qwik',
  meta: [
    {
      name: 'description',
      content: 'Unstyled, accessible, and composable UI components built for Qwik with Panda CSS',
    },
  ],
};
