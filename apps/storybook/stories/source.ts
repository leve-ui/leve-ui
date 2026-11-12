/**
 * Joins a demo's TSX and CSS sources for the Docs "Show code" panel, which
 * accepts a single code string (adr/0031).
 */
export const demoSource = (tsx: string, css: string, cssFile: string) =>
  `${tsx}\n/* ${cssFile} */\n${css}`;
