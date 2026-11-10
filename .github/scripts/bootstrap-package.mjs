#!/usr/bin/env node
/**
 * Bootstraps new packages on npm so that the Release workflow can publish them
 * with trusted publishing (adr/0020). For maintainers only; AI agents must not run this.
 *
 * For each package that does not exist on npm yet:
 *   1. build it (and its dependencies)
 *   2. publish its current version (0.0.0) as a placeholder
 *   3. register .github/workflows/release.yml as its trusted publisher
 *   4. require 2FA and disallow tokens for publishing
 *
 * Usage:
 *   pnpm package:bootstrap                    # all public packages missing on npm
 *   pnpm package:bootstrap @levis-ui/dialog   # specific packages
 *   pnpm package:bootstrap --dry-run          # print what would run
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsOnNpm, publicPackages, sortByDependencies } from './workspace.mjs';

const WORKFLOW_FILE = 'release.yml';
const MIN_NPM = [11, 15, 0];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const requested = args.filter((a) => !a.startsWith('--'));

const fail = (message) => {
  console.error(`✖ ${message}`);
  process.exit(1);
};

const run = (cmd, cmdArgs) => {
  console.log(`\n$ ${cmd} ${cmdArgs.join(' ')}`);
  if (dryRun) return;
  const result = spawnSync(cmd, cmdArgs, { stdio: 'inherit' });
  if (result.status !== 0) fail(`Command failed: ${cmd} ${cmdArgs.join(' ')}`);
};

// ---------- preflight ----------
const npmVersion = execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim();
const [major, minor, patch] = npmVersion.split('.').map(Number);
const tooOld =
  major < MIN_NPM[0] ||
  (major === MIN_NPM[0] && (minor < MIN_NPM[1] || (minor === MIN_NPM[1] && patch < MIN_NPM[2])));
if (tooOld) {
  fail(`npm ${MIN_NPM.join('.')} or later is required for "npm trust" (found ${npmVersion}).`);
}

const all = publicPackages();
const unknown = requested.filter((name) => !all.some((p) => p.name === name));
if (unknown.length) fail(`Not a public workspace package: ${unknown.join(', ')}`);

const candidates = requested.length ? all.filter((p) => requested.includes(p.name)) : all;
const targets = sortByDependencies(candidates.filter((p) => !existsOnNpm(p.name)));

for (const p of candidates) {
  if (!targets.includes(p)) console.log(`• ${p.name} already exists on npm, skipping.`);
}
if (targets.length === 0) {
  console.log('✔ Nothing to bootstrap.');
  process.exit(0);
}

// A dependency that is not on npm yet must be bootstrapped in the same run.
for (const p of targets) {
  for (const dep of Object.keys(p.pkg.dependencies ?? {})) {
    const internal = all.find((q) => q.name === dep);
    if (internal && !targets.includes(internal) && !existsOnNpm(dep)) {
      fail(`${p.name} depends on ${dep}, which is not on npm. Bootstrap ${dep} as well.`);
    }
  }
}

if (!dryRun) {
  const whoami = spawnSync('npm', ['whoami'], { encoding: 'utf8' });
  if (whoami.status !== 0) fail('Not logged in to npm. Run "npm login" first.');
  console.log(`Logged in to npm as ${whoami.stdout.trim()}.`);
}

console.log(`\nBootstrapping: ${targets.map((p) => `${p.name}@${p.version}`).join(', ')}`);

// ---------- bootstrap ----------
for (const p of targets) {
  const repo = /github\.com[/:]([^/]+\/[^/.]+)/.exec(p.pkg.repository?.url ?? '')?.[1];
  if (!repo) fail(`${p.name}: "repository.url" in package.json must point to GitHub.`);

  console.log(`\n━━ ${p.name} ━━`);
  run('pnpm', ['exec', 'turbo', 'run', 'build', `--filter=${p.name}`]);
  run('pnpm', ['--filter', p.name, 'publish', '--access', 'public', '--no-git-checks']);
  run('npm', [
    'trust',
    'github',
    p.name,
    '--file',
    WORKFLOW_FILE,
    '--repo',
    repo,
    '--allow-publish',
    '--yes',
  ]);
  run('npm', ['access', 'set', 'mfa=publish', p.name]);
}

console.log(
  `\n✔ Done. Future versions are published by the Release workflow.\n  Verify on npmjs.com: Settings → Trusted Publisher (${WORKFLOW_FILE}) and Publishing access.`,
);
