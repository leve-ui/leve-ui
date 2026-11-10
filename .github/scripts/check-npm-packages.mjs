#!/usr/bin/env node
/**
 * Fails if any public workspace package does not exist on npm yet.
 *
 * npm trusted publishing can only be configured for existing packages, so a
 * new package must be bootstrapped by a maintainer before the release PR is
 * merged (adr/0020). Runs in CI on the release PR branch.
 */
import { existsOnNpm, publicPackages } from './workspace.mjs';

const missing = publicPackages().filter((p) => !existsOnNpm(p.name));

if (missing.length === 0) {
  console.log('✔ All public packages exist on npm.');
  process.exit(0);
}

const command = `pnpm package:bootstrap ${missing.map((p) => p.name).join(' ')}`;

console.error('✖ These packages do not exist on npm yet, so the release would fail:\n');
for (const p of missing) console.error(`  - ${p.name}`);
console.error(
  `\nA maintainer must bootstrap them before merging the release PR:\n\n  ${command}\n`,
);
if (process.env.GITHUB_ACTIONS) {
  console.log(
    `::error title=Unpublished packages::Run "${command}" before merging the release PR.`,
  );
}
process.exit(1);
