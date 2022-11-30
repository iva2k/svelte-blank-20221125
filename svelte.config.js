// import adapter from '@sveltejs/adapter-auto';
import netlify from '@sveltejs/adapter-netlify';
import vercel from '@sveltejs/adapter-vercel';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import assets from './assets.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true,
    scss: { includePaths: ['src', 'node_modules'] }
  }),

  kit: {
    adapter: process.env.VERCEL
      ? vercel()
      : process.env.NETLIFY
      ? netlify()
      : adapter({
          // default options are shown:
          // pages: 'build',
          // assets: 'build',
          // fallback: null,
          // precompress: false
          fallback: 'index.html'
        }),
    // prerender: { entries: [] },
    alias: {
      // Place to add all aliases. Run 'svelte-kit sync' (or npm run postinstall) to update paths in '.svelte-kit/tsconfig.json'.
      // $components: resolve('./src/lib/components')
    },

    vite: () => ({
      plugins: [
        // copy is needed for vite to work in svelte:dev (especially under "tauri dev")
        // All copy commands are duplicated in package.json:scripts.svelte:prebuild, for svelte:dev to work correctly.
        viteStaticCopy({
          targets: assets,
          verbose: true
        })
      ]
    })
  }
};

export default config;
