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
      { title: msg('Controlled & Uncontrolled'), href: '/overview/controlled-uncontrolled/' },
      { title: msg('Accessibility'), href: '/overview/accessibility/' },
      { title: msg('Roadmap'), href: '/overview/roadmap/' },
      { title: msg('FAQ'), href: '/overview/faq/' },
    ],
  },
  {
    title: msg('Components'),
    items: [
      { title: msg('All components'), href: '/components/' },
      { title: msg('Accordion'), href: '/components/accordion/' },
      { title: msg('Alert'), href: '/components/alert/' },
      { title: msg('Avatar'), href: '/components/avatar/' },
      { title: msg('Breadcrumb'), href: '/components/breadcrumb/' },
      { title: msg('Checkbox'), href: '/components/checkbox/' },
      { title: msg('Collapsible'), href: '/components/collapsible/' },
      { title: msg('Field'), href: '/components/field/' },
      { title: msg('Fieldset'), href: '/components/fieldset/' },
      { title: msg('Label'), href: '/components/label/' },
      { title: msg('Meter'), href: '/components/meter/' },
      { title: msg('Progress'), href: '/components/progress/' },
      { title: msg('Radio Group'), href: '/components/radio-group/' },
      { title: msg('Separator'), href: '/components/separator/' },
      { title: msg('Switch'), href: '/components/switch/' },
      { title: msg('Tabs'), href: '/components/tabs/' },
      { title: msg('Toggle'), href: '/components/toggle/' },
      { title: msg('Toggle Group'), href: '/components/toggle-group/' },
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
