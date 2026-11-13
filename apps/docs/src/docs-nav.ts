/**
 * Sidebar navigation of the docs pages (adr/0032).
 * Only pages that exist are listed; add a page here when it is written.
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
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'All components', href: '/components/' },
      { title: 'Avatar', href: '/components/avatar/' },
    ],
  },
];

/** Adds the trailing slash that Qwik City uses for page URLs. */
export function normalizePath(path: string) {
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
