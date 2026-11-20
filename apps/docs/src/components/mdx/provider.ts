import { Demo } from '../demo/demo';
import { DemoGallery } from '../docs/demo-gallery';
import { Install } from '../docs/install';
import { PropsTable } from '../props-table/props-table';
import { H2, H3 } from './headings';
import { A } from './link';

/**
 * Components available in every MDX page (MDX `providerImportSource`, see vite.config.ts).
 * Elements are mapped to styled components; Demo, DemoGallery, Install and PropsTable can be used without importing them.
 */
export const useMDXComponents = () => ({
  a: A,
  h2: H2,
  h3: H3,
  Demo,
  DemoGallery,
  Install,
  PropsTable,
});
