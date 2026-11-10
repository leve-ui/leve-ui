// Shared helpers for release scripts.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Returns public (non-private) workspace packages: { name, version, dir, pkg }. */
export function publicPackages() {
  const list = JSON.parse(
    execFileSync('pnpm', ['ls', '-r', '--depth', '-1', '--json'], { encoding: 'utf8' }),
  );
  return list
    .filter((p) => !p.private)
    .map((p) => {
      const pkg = JSON.parse(readFileSync(join(p.path, 'package.json'), 'utf8'));
      return { name: p.name, version: p.version, dir: p.path, pkg };
    });
}

/** Whether the package name exists on the npm registry. */
export function existsOnNpm(name) {
  const result = spawnSync('npm', ['view', name, 'name', '--json'], { encoding: 'utf8' });
  if (result.status === 0) return true;
  if (/E404|404 Not Found/.test(`${result.stdout}${result.stderr}`)) return false;
  throw new Error(`Failed to query npm for ${name}:\n${result.stderr}`);
}

/** Sorts packages so that internal dependencies come first. */
export function sortByDependencies(packages) {
  const byName = new Map(packages.map((p) => [p.name, p]));
  const sorted = [];
  const visited = new Set();
  const visit = (p) => {
    if (visited.has(p.name)) return;
    visited.add(p.name);
    const deps = { ...p.pkg.dependencies, ...p.pkg.peerDependencies };
    for (const dep of Object.keys(deps)) {
      const internal = byName.get(dep);
      if (internal) visit(internal);
    }
    sorted.push(p);
  };
  for (const p of packages) visit(p);
  return sorted;
}
