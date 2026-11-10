import { defineLibraryConfig } from '@levis-ui/vite-config';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig(defineLibraryConfig(pkg));
