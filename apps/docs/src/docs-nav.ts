import { stripLocale } from './i18n/locales';

/**
 * Sidebar navigation of the docs pages (adr/0032).
 * Only pages that exist are listed; add a page here when it is written.
 * Hrefs have no locale; links add it with `localizeHref` (src/i18n/locales.ts).
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
    title: 'Overview',
    items: [
      { title: 'Introduction', href: '/overview/introduction/' },
      { title: 'Getting Started', href: '/overview/getting-started/' },
      { title: 'Styling', href: '/overview/styling/' },
      { title: 'Forms', href: '/overview/forms/' },
      { title: 'Controlled & Uncontrolled', href: '/overview/controlled-uncontrolled/' },
      { title: 'Accessibility', href: '/overview/accessibility/' },
      { title: 'Roadmap', href: '/overview/roadmap/' },
      { title: 'FAQ', href: '/overview/faq/' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'All components', href: '/components/' },
      { title: 'Accordion', href: '/components/accordion/' },
      { title: 'Alert', href: '/components/alert/' },
      { title: 'Avatar', href: '/components/avatar/' },
      { title: 'Breadcrumb', href: '/components/breadcrumb/' },
      { title: 'Checkbox', href: '/components/checkbox/' },
      { title: 'Collapsible', href: '/components/collapsible/' },
      { title: 'Field', href: '/components/field/' },
      { title: 'Fieldset', href: '/components/fieldset/' },
      { title: 'Label', href: '/components/label/' },
      { title: 'Meter', href: '/components/meter/' },
      { title: 'Progress', href: '/components/progress/' },
      { title: 'Radio Group', href: '/components/radio-group/' },
      { title: 'Separator', href: '/components/separator/' },
      { title: 'Switch', href: '/components/switch/' },
      { title: 'Tabs', href: '/components/tabs/' },
      { title: 'Toggle', href: '/components/toggle/' },
      { title: 'Toggle Group', href: '/components/toggle-group/' },
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
