#!/usr/bin/env node
/**
 * 新しいコンポーネントパッケージの雛形を生成し、leve-ui / storybook に登録します。
 *
 * 使い方:
 *   node .agents/skills/create-component/scripts/scaffold.mjs <name> [part,part,...]
 *   例) node .agents/skills/create-component/scripts/scaffold.mjs dialog trigger,content,title,close
 *
 * - <name>  kebab-case のコンポーネント名（例: dialog, radio-group）
 * - parts   Root 以外のパーツ名（kebab-case、カンマ区切り）。Root は常に生成されます。
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const fail = (message) => {
  console.error(`✖ ${message}`);
  process.exit(1);
};

const [name, partsArg = ''] = process.argv.slice(2);
if (!name) fail('コンポーネント名を指定してください（例: scaffold.mjs dialog trigger,content）');
if (!KEBAB.test(name)) fail(`コンポーネント名は kebab-case にしてください: ${name}`);

const parts = partsArg
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);
for (const part of parts) {
  if (!KEBAB.test(part)) fail(`パーツ名は kebab-case にしてください: ${part}`);
  if (part === 'root') fail('root は自動で生成されるため指定不要です');
}
if (new Set(parts).size !== parts.length) fail('パーツ名が重複しています');

const pkgDir = join(ROOT, 'packages/components', name);
if (existsSync(pkgDir)) fail(`既に存在します: ${relative(ROOT, pkgDir)}`);

const pascal = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const Name = pascal(name);
const pkgName = `@leve-ui/${name}`;

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path, data) => writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
const sortObject = (obj) =>
  Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

// バージョンは @leve-ui/utils に揃える
const utilsPkg = readJson(join(ROOT, 'packages/utils/package.json'));
const versions = utilsPkg.devDependencies;

const created = [];
const write = (path, content) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  created.push(relative(ROOT, path));
};

// ---------- package ----------
mkdirSync(pkgDir, { recursive: true });
writeJson(join(pkgDir, 'package.json'), {
  name: pkgName,
  version: '0.0.0',
  description: `Headless, WAI-ARIA compliant ${Name} component for Qwik. Bring your own styles.`,
  homepage: 'https://github.com/leve-ui/leve-ui#readme',
  bugs: { url: 'https://github.com/leve-ui/leve-ui/issues' },
  repository: {
    type: 'git',
    url: 'git+https://github.com/leve-ui/leve-ui.git',
    directory: `packages/components/${name}`,
  },
  license: 'MIT',
  type: 'module',
  sideEffects: false,
  main: './lib/index.qwik.cjs',
  module: './lib/index.qwik.mjs',
  qwik: './lib/index.qwik.mjs',
  types: './lib-types/index.d.ts',
  exports: {
    '.': {
      '@leve-ui/source': './src/index.ts',
      types: './lib-types/index.d.ts',
      import: './lib/index.qwik.mjs',
      require: './lib/index.qwik.cjs',
    },
  },
  files: ['lib', 'lib-types'],
  keywords: ['qwik', 'headless-ui', 'accessibility', 'wai-aria', name],
  scripts: {
    build: 'pnpm build:lib && pnpm build:types',
    'build:lib': 'vite build --mode lib',
    'build:types': 'tsc -p tsconfig.build.json',
    typecheck: 'tsc --noEmit',
    test: 'vitest run',
  },
  dependencies: {
    '@leve-ui/utils': 'workspace:*',
  },
  peerDependencies: {
    '@builder.io/qwik': utilsPkg.peerDependencies['@builder.io/qwik'],
  },
  devDependencies: {
    '@builder.io/qwik': versions['@builder.io/qwik'],
    '@leve-ui/tsconfig': 'workspace:*',
    '@leve-ui/vite-config': 'workspace:*',
    typescript: versions.typescript,
    vite: versions.vite,
    vitest: versions.vitest,
  },
});
created.push(relative(ROOT, join(pkgDir, 'package.json')));

// npm はパッケージのフォルダ内の LICENSE だけを同梱するため、ルートの LICENSE をコピーする
copyFileSync(join(ROOT, 'LICENSE'), join(pkgDir, 'LICENSE'));
created.push(relative(ROOT, join(pkgDir, 'LICENSE')));

write(
  join(pkgDir, 'tsconfig.json'),
  `${JSON.stringify(
    {
      extends: '@leve-ui/tsconfig/library.json',
      compilerOptions: { noEmit: true, emitDeclarationOnly: false },
      include: ['src', '*.config.ts'],
    },
    null,
    2,
  )}\n`,
);
write(
  join(pkgDir, 'tsconfig.build.json'),
  `${JSON.stringify(
    {
      extends: '@leve-ui/tsconfig/library.json',
      compilerOptions: { rootDir: 'src', declarationDir: 'lib-types' },
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    },
    null,
    2,
  )}\n`,
);
write(
  join(pkgDir, 'vite.config.ts'),
  `import { defineLibraryConfig } from '@leve-ui/vite-config';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig(defineLibraryConfig(pkg));
`,
);
write(
  join(pkgDir, 'vitest.config.ts'),
  `import { qwikVite } from '@builder.io/qwik/optimizer';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [qwikVite()],
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
`,
);

// ---------- src ----------
const src = join(pkgDir, 'src');
const allParts = ['root', ...parts];

write(
  join(src, `${name}-context.ts`),
  `import { createContextId } from '@builder.io/qwik';

// TODO: パーツ間で共有する状態（Signal など）を定義する
export type ${Name}Context = Record<string, never>;

export const ${name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())}ContextId = createContextId<${Name}Context>('leve-ui.${name}');
`,
);

const contextVar = `${name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())}ContextId`;

write(
  join(src, `${name}-root.tsx`),
  `import { component$, type PropsOf, Slot, useContextProvider } from '@builder.io/qwik';
import { ${contextVar} } from './${name}-context';

export type ${Name}RootProps = PropsOf<'div'>;

/**
 * TODO: 対応する APG パターンを確認し、要素・role・aria-* を決める
 * https://www.w3.org/WAI/ARIA/apg/patterns/
 */
export const ${Name}Root = component$<${Name}RootProps>((props) => {
  useContextProvider(${contextVar}, {});

  return (
    <div {...props} data-leve-${name}="">
      <Slot />
    </div>
  );
});
`,
);

for (const part of parts) {
  const Part = pascal(part);
  write(
    join(src, `${name}-${part}.tsx`),
    `import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { ${contextVar} } from './${name}-context';

export type ${Name}${Part}Props = PropsOf<'div'>;

// TODO: APG パターンに合わせて要素・role・aria-* を決める
export const ${Name}${Part} = component$<${Name}${Part}Props>((props) => {
  useContext(${contextVar});

  return (
    <div {...props} data-leve-${name}-${part}="">
      <Slot />
    </div>
  );
});
`,
  );
}

write(
  join(src, `${name}.ts`),
  `${allParts.map((p) => `export { ${Name}${pascal(p)} as ${pascal(p)} } from './${name}-${p}';`).join('\n')}\n`,
);

write(
  join(src, 'index.ts'),
  `export * as ${Name} from './${name}';
${allParts.map((p) => `export type { ${Name}${pascal(p)}Props } from './${name}-${p}';`).join('\n')}
`,
);

const jsxTree = (indent) =>
  [
    `${indent}<${Name}.Root>`,
    ...parts.map((p) => `${indent}  <${Name}.${pascal(p)}>${pascal(p)}</${Name}.${pascal(p)}>`),
    `${indent}</${Name}.Root>`,
  ].join('\n');

write(
  join(src, `${name}.test.tsx`),
  `import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { ${Name} } from './index';

describe('${Name}', () => {
  it('すべてのパーツが data 属性付きで描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
${jsxTree('      ')},
    );

    expect(screen.querySelector('[data-leve-${name}]')).not.toBeNull();
${parts.map((p) => `    expect(screen.querySelector('[data-leve-${name}-${p}]')).not.toBeNull();`).join('\n')}
  });

  // TODO: role / aria-* / data-state / props の受け渡しのテストを追加する（write-tests スキル参照）
});
`,
);

// ---------- story / e2e ----------
write(
  join(ROOT, 'apps/storybook/stories', `${name}.stories.tsx`),
  `import { ${Name} } from '${pkgName}';
import type { Meta, StoryObj } from 'storybook-framework-qwik';

const meta: Meta = {
  title: 'Components/${Name}',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
${jsxTree('    ')}
  ),
};
`,
);

// Storybook は title を小文字化して ID にする（Components/RadioGroup → components-radiogroup）
const storyId = `components-${Name.toLowerCase()}--default`;
write(
  join(ROOT, 'apps/e2e/tests', `${name}.spec.ts`),
  `import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('${Name}', () => {
  test('描画される', async ({ page }) => {
    await gotoStory(page, '${storyId}');
    await expect(page.locator('[data-leve-${name}]')).toBeVisible();
  });

  // TODO: APG のキーボード操作・フォーカス移動のテストを追加する（write-tests スキル参照）
});
`,
);

// ---------- 登録 ----------
const levePkgPath = join(ROOT, 'packages/leve-ui/package.json');
const levePkg = readJson(levePkgPath);
levePkg.dependencies = sortObject({ ...levePkg.dependencies, [pkgName]: 'workspace:*' });
writeJson(levePkgPath, levePkg);

const leveIndexPath = join(ROOT, 'packages/leve-ui/src/index.ts');
const leveIndex = readFileSync(leveIndexPath, 'utf8');
const exportLine = `export * from '${pkgName}';`;
if (!leveIndex.includes(exportLine)) {
  const lines = leveIndex.trimEnd().split('\n');
  const exports = lines.filter((l) => l.startsWith('export * from'));
  const others = lines.filter((l) => !l.startsWith('export * from'));
  writeFileSync(leveIndexPath, `${[...others, ...[...exports, exportLine].sort()].join('\n')}\n`);
}

const sbPkgPath = join(ROOT, 'apps/storybook/package.json');
const sbPkg = readJson(sbPkgPath);
sbPkg.devDependencies = sortObject({ ...sbPkg.devDependencies, [pkgName]: 'workspace:*' });
writeJson(sbPkgPath, sbPkg);

// README の Packages 表に行を追加する
const readmePath = join(ROOT, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
if (!readme.includes(`[\`${pkgName}\`]`)) {
  const lines = readme.split('\n');
  const header = lines.findIndex((l) => l.startsWith('| Package |'));
  if (header !== -1) {
    let last = header + 1;
    while (lines[last + 1]?.startsWith('|')) last++;
    lines.splice(
      last + 1,
      0,
      `| [\`${pkgName}\`](./packages/components/${name}) | TODO: one-line description |`,
    );
    writeFileSync(readmePath, lines.join('\n'));
  }
}

console.log(`✔ ${pkgName} を生成しました\n`);
console.log('作成したファイル:');
for (const f of created) console.log(`  + ${f}`);
console.log('\n更新したファイル:');
console.log('  ~ packages/leve-ui/package.json');
console.log('  ~ packages/leve-ui/src/index.ts');
console.log('  ~ apps/storybook/package.json');
console.log('  ~ README.md（Packages 表。説明文の TODO を書き換えること）');
console.log('\n次に実行してください: pnpm install && pnpm check:fix');
