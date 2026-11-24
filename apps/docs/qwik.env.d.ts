// This file can be used to add references for global types like `vite/client`.

// Add global `vite/client` types. For more info, see: https://vitejs.dev/guide/features#client-types
/// <reference types="vite/client" />

// Source files highlighted with shiki at build time (vite/highlight.ts)
declare module '*?highlight' {
  const html: string;
  export default html;
}

// @builder.io/partytown@0.10.3 omits integration/index.d.ts in the published package
declare module '@builder.io/partytown/integration' {
  export interface PartytownConfig {
    debug?: boolean;
    forward?: (string | [string, { preserveBehavior?: boolean }])[];
    lib?: string;
    loadScriptsOnMainThread?: (string | RegExp)[];
    nonce?: string;
    resolveUrl?: (url: URL, location: Location, type: string) => URL | undefined;
    sandboxParent?: string;
    swPath?: string;
  }

  export const SCRIPT_TYPE = 'text/partytown';
  export function partytownSnippet(config?: PartytownConfig): string;
}
