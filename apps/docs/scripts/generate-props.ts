/**
 * Generates the props tables of the docs site from the exported
 * `<Name><Part>Props` types of every component (adr/0032).
 *
 * - Only props declared by leve-ui are listed. Props inherited from
 *   `PropsOf<'element'>` are summarized by the element name.
 * - Descriptions come from the JSDoc of each prop, defaults from `@default`.
 *
 * Output: src/generated/props/<name>.json (git-ignored)
 * Run: node scripts/generate-props.ts
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export type PropDoc = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
};

export type PartDoc = {
  /** `Avatar.Root` */
  name: string;
  /** The element whose attributes are also accepted, e.g. `div` */
  element?: string;
  props: PropDoc[];
};

export type ComponentDoc = {
  /** `Avatar` */
  name: string;
  /** `@leve-ui/avatar` */
  packageName: string;
  parts: Record<string, PartDoc>;
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const componentsDir = join(root, 'packages/components');
const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../src/generated/props');

function parse(file: string) {
  return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
}

/** Collapses whitespace in a type so that it fits in a table cell. */
function typeText(node: ts.TypeNode | undefined, source: ts.SourceFile) {
  return node ? node.getText(source).replace(/\s+/g, ' ').replace(/^\| /, '').trim() : 'unknown';
}

function commentText(comment: string | ts.NodeArray<ts.JSDocComment> | undefined) {
  if (comment === undefined) return '';
  if (typeof comment === 'string') return comment;
  return comment.map((c) => c.getText()).join('');
}

function readProp(member: ts.PropertySignature, source: ts.SourceFile): PropDoc {
  const name = member.name.getText(source).replace(/^['"]|['"]$/g, '');
  const docs = ts.getJSDocCommentsAndTags(member).filter(ts.isJSDoc);
  const description = docs
    .map((doc) => commentText(doc.comment))
    .join('\n')
    .trim()
    // Join wrapped lines, but keep list items ("- ...") on their own lines
    .replace(/\n(?!- )/g, ' ');
  const defaultTag = ts.getJSDocTags(member).find((tag) => tag.tagName.text === 'default');
  const defaultValue = defaultTag ? commentText(defaultTag.comment).trim() : undefined;
  return {
    name,
    type: typeText(member.type, source),
    required: !member.questionToken,
    ...(defaultValue ? { default: defaultValue } : {}),
    description,
  };
}

/** Reads `type XProps = PropsOf<'el'> & { ... }` (also `Omit<PropsOf<'el'>, ...>`). */
function readPropsType(file: string, typeName: string) {
  const source = parse(file);
  let found: ts.TypeAliasDeclaration | undefined;
  source.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === typeName) found = node;
  });
  if (!found) throw new Error(`${typeName} was not found in ${file}`);

  const element = found.type.getText(source).match(/PropsOf<'([a-z0-9]+)'>/)?.[1];
  const literals: ts.TypeLiteralNode[] = [];
  function visit(node: ts.TypeNode) {
    if (ts.isTypeLiteralNode(node)) literals.push(node);
    else if (ts.isIntersectionTypeNode(node)) node.types.forEach(visit);
    else if (ts.isParenthesizedTypeNode(node)) visit(node.type);
  }
  visit(found.type);

  const props = literals
    .flatMap((literal) => literal.members.filter(ts.isPropertySignature))
    .map((member) => readProp(member, source));
  return { element, props };
}

function readComponent(dir: string): ComponentDoc | undefined {
  const srcDir = join(componentsDir, dir, 'src');
  const indexFile = join(srcDir, 'index.ts');
  const index = parse(indexFile);
  const pkg = JSON.parse(readFileSync(join(componentsDir, dir, 'package.json'), 'utf8'));

  let namespace: string | undefined;
  const propsTypes: { typeName: string; file: string }[] = [];
  index.forEachChild((node) => {
    if (!ts.isExportDeclaration(node) || !node.moduleSpecifier) return;
    const from = (node.moduleSpecifier as ts.StringLiteral).text;
    if (node.exportClause && ts.isNamespaceExport(node.exportClause)) {
      namespace = node.exportClause.name.text;
      return;
    }
    if (node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const el of node.exportClause.elements) {
        if (el.name.text.endsWith('Props')) {
          propsTypes.push({ typeName: el.name.text, file: join(srcDir, `${from}.tsx`) });
        }
      }
    }
  });
  if (!namespace) return undefined;

  const parts: Record<string, PartDoc> = {};
  for (const { typeName, file } of propsTypes) {
    const part = typeName.slice(namespace.length, -'Props'.length);
    // Skip helper types such as AccordionHeaderLevel that are not `<Name><Part>Props`
    if (!typeName.startsWith(namespace) || part === '') continue;
    parts[part] = { name: `${namespace}.${part}`, ...readPropsType(file, typeName) };
  }
  return { name: namespace, packageName: pkg.name, parts };
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

let count = 0;
for (const dir of readdirSync(componentsDir).sort()) {
  const doc = readComponent(dir);
  if (!doc) continue;
  writeFileSync(join(outDir, `${dir}.json`), `${JSON.stringify(doc, null, 2)}\n`);
  count++;
}
console.log(`generate-props: wrote ${count} files to ${outDir}`);
