import { Demo } from '../demo/demo';
import { PropsTable } from '../props-table/props-table';
import { H2, H3 } from './headings';

/**
 * Components available in every MDX page (MDX `providerImportSource`, see vite.config.ts).
 * Elements are mapped to styled components; Demo and PropsTable can be used without importing them.
 */
export const useMDXComponents = () => ({
  h2: H2,
  h3: H3,
  Demo,
  PropsTable,
});
