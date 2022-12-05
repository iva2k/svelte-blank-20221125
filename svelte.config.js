// import adapter from '@sveltejs/adapter-auto';
import netlify from '@sveltejs/adapter-netlify';
import vercel from '@sveltejs/adapter-vercel';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true,
    scss: { includePaths: ['src', 'node_modules'] }
  }),

  kit: {
    // base: '',
    // outDir: './.svelte-kit',
    // ? adapterFallback: 'index.html',
    // trailingSlash: false,
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
    }
  },

  vitePlugin: {
    // exclude: ['./node_modules/**']
    // experimental options
    // experimental: {}
  }
};

export default config;
