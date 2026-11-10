import { qwikVite } from '@builder.io/qwik/optimizer';
import { defaultClientConditions, defaultServerConditions, mergeConfig } from 'vite';

const toExternal = (deps = {}) => Object.keys(deps).map((dep) => new RegExp(`^${dep}(/.*)?$`));

/** @type {import('./index').defineLibraryConfig} */
export function defineLibraryConfig(pkg, overrides = {}) {
  return mergeConfig(
    {
      build: {
        target: 'es2020',
        outDir: 'lib',
        emptyOutDir: true,
        lib: {
          entry: './src/index.ts',
          formats: ['es', 'cjs'],
          fileName: (format, entryName) => `${entryName}.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
        },
        rollupOptions: {
          output: {
            preserveModules: true,
            preserveModulesRoot: 'src',
          },
          external: [
            /^node:.*/,
            /^@builder\.io\/qwik(\/.*)?$/,
            ...toExternal(pkg.dependencies),
            ...toExternal(pkg.peerDependencies),
          ],
        },
      },
      plugins: [qwikVite()],
    },
    overrides,
  );
}

export const SOURCE_CONDITION = '@leve-ui/source';

/** @type {import('./index').sourceResolveConfig} */
export function sourceResolveConfig() {
  return {
    resolve: {
      conditions: [SOURCE_CONDITION, ...defaultClientConditions],
    },
    ssr: {
      resolve: {
        conditions: [SOURCE_CONDITION, ...defaultServerConditions],
      },
    },
  };
}
