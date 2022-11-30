import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import assets from './assets.js';

const config: UserConfig = {
  plugins: [
    sveltekit(),

    // copy is needed for vite to work in svelte:dev (especially under "tauri dev")
    // All copy commands are duplicated in package.json:scripts.svelte:prebuild, for svelte:dev to work correctly.
    viteStaticCopy({
      targets: assets,
      verbose: true
    })
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
};

export default config;
