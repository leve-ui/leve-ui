#!/usr/bin/env node
/**
 * Publish script for the Release workflow (changesets/action "publish-script").
 *
 * Skips publishing while any public package does not exist on npm yet, because
 * trusted publishing cannot work until a maintainer runs "pnpm package:bootstrap"
 * (adr/0020, adr/0023). Without this guard, every push to main would fail the
 * Release workflow with ENEEDAUTH until all packages are bootstrapped.
 *
 * The release PR is still protected by the "Publish readiness" check, so a
 * release cannot be merged while packages are missing.
 */
import { spawnSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { existsOnNpm, publicPackages } from './workspace.mjs';

const missing = publicPackages().filter((p) => !existsOnNpm(p.name));

if (missing.length > 0) {
  const names = missing.map((p) => p.name).join(' ');
  const message = `Skipped publishing: ${missing.length} package(s) are not on npm yet (${names}). Run "pnpm package:bootstrap" to publish them for the first time.`;

  console.log(message);
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::warning title=Publishing skipped::${message}`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Publishing skipped\n\nThese packages are not on npm yet:\n\n${missing
        .map((p) => `- \`${p.name}\``)
        .join(
          '\n',
        )}\n\nA maintainer must run \`pnpm package:bootstrap\` before anything is published.\n`,
    );
  }
  process.exit(0);
}

const result = spawnSync('pnpm', ['release'], { stdio: 'inherit' });
process.exit(result.status ?? 1);
