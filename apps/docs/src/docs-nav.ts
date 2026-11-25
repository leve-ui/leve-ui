import { stripLocale } from './i18n/locales';
import { msg } from './i18n/translate';

/**
 * Sidebar navigation of the docs pages (adr/0032).
 * Only pages that exist are listed; add a page here when it is written.
 * Hrefs have no locale; links add it with `localizeHref` (src/i18n/locales.ts).
 * Titles are English, marked with `msg()` and translated where they are rendered.
 */
export type NavItem = {
  title: string;
  href: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const docsNav: NavSection[] = [
  {
    title: msg('Overview'),
    items: [
      { title: msg('Introduction'), href: '/overview/introduction/' },
      { title: msg('Getting Started'), href: '/overview/getting-started/' },
      { title: msg('Styling'), href: '/overview/styling/' },
      { title: msg('Forms'), href: '/overview/forms/' },
      {
        title: msg('Controlled & Uncontrolled'),
        href: '/overview/controlled-uncontrolled/',
      },
      { title: msg('Accessibility'), href: '/overview/accessibility/' },
      { title: msg('Roadmap'), href: '/overview/roadmap/' },
      { title: msg('FAQ'), href: '/overview/faq/' },
    ],
  },
  {
    title: msg('Components'),
    items: [
      { title: msg('All components'), href: '/components/' },
      { title: 'Accordion', href: '/components/accordion/' },
      { title: 'Alert', href: '/components/alert/' },
      { title: 'Avatar', href: '/components/avatar/' },
      { title: 'Breadcrumb', href: '/components/breadcrumb/' },
      { title: 'Checkbox', href: '/components/checkbox/' },
      { title: 'Clipboard', href: '/components/clipboard/' },
      { title: 'Collapsible', href: '/components/collapsible/' },
      { title: 'Combobox', href: '/components/combobox/' },
      { title: 'Context Menu', href: '/components/context-menu/' },
      { title: 'Dialog', href: '/components/dialog/' },
      { title: 'Drawer', href: '/components/drawer/' },
      { title: 'Field', href: '/components/field/' },
      { title: 'Fieldset', href: '/components/fieldset/' },
      { title: 'Hover Card', href: '/components/hover-card/' },
      { title: 'Label', href: '/components/label/' },
      { title: 'Menu', href: '/components/menu/' },
      { title: 'Meter', href: '/components/meter/' },
      { title: 'Password Input', href: '/components/password-input/' },
      { title: 'Popover', href: '/components/popover/' },
      { title: 'Progress', href: '/components/progress/' },
      { title: 'Radio Group', href: '/components/radio-group/' },
      { title: 'Separator', href: '/components/separator/' },
      { title: 'Switch', href: '/components/switch/' },
      { title: 'Tabs', href: '/components/tabs/' },
      { title: 'Toast', href: '/components/toast/' },
      { title: 'Toggle', href: '/components/toggle/' },
      { title: 'Toggle Group', href: '/components/toggle-group/' },
      { title: 'Toolbar', href: '/components/toolbar/' },
      { title: 'Tooltip', href: '/components/tooltip/' },
    ],
  },
];

/** Removes the locale and adds the trailing slash that Qwik City uses for page URLs. */
export function normalizePath(pathname: string) {
  const path = stripLocale(pathname);
  return path.endsWith('/') ? path : `${path}/`;
}

/** All nav items in reading order, used for the previous / next links. */
export function flatNav(): NavItem[] {
  return docsNav.flatMap((section) => section.items);
}

/** Finds the section and item for a pathname. */
export function findNavItem(pathname: string) {
  const path = normalizePath(pathname);
  for (const section of docsNav) {
    const item = section.items.find((i) => i.href === path);
    if (item) return { section, item };
  }
  return undefined;
}

/** The previous and next pages of a pathname in nav order. */
export function getPrevNext(pathname: string) {
  const items = flatNav();
  const index = items.findIndex((i) => i.href === normalizePath(pathname));
  if (index === -1) return { prev: undefined, next: undefined };
  return { prev: items[index - 1], next: items[index + 1] };
}
