import { component$, isDev } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city';
import { QwikPartytown } from './components/partytown/partytown';
import { RouterHead } from './components/router-head/router-head';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/600.css';
import '@fontsource/roboto/700.css';
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import './global.css';

const themeInitScript = `
  (function() {
    try {
      var t = localStorage.getItem('theme');
      var isDark = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {}
  })();
`;

const gtmInitScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
`;

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <QwikPartytown forward={['dataLayer.push']} />
        <script
          async
          type="text/partytown"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-KPZ3H69D"
        />
        <script type="text/partytown" dangerouslySetInnerHTML={gtmInitScript} />
        <script dangerouslySetInnerHTML={themeInitScript} />
        {!isDev && <link rel="manifest" href={`${import.meta.env.BASE_URL}manifest.json`} />}
        <RouterHead />
      </head>
      <body>
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
