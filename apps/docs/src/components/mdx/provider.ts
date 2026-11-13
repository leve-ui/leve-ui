import { Demo } from '../demo/demo';
import { H2, H3 } from './headings';

/**
 * Components available in every MDX page (MDX `providerImportSource`, see vite.config.ts).
 * Elements are mapped to styled components; Demo can be used without importing it.
 */
export const useMDXComponents = () => ({
  h2: H2,
  h3: H3,
  Demo,
});
