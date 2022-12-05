import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import replace from '@rollup/plugin-replace';

// import { VitePWA } from 'vite-plugin-pwa';
// const SvelteKitPWA = VitePWA;
import { SvelteKitPWA } from '@vite-pwa/sveltekit'; // TODO: (now) broken package, import does not work!
// import { SvelteKitPWA } from './node_modules/@vite-pwa/sveltekit/dist';

import { pwaConfiguration, replaceOptions } from './pwa-configuration.js';
import assets from './assets.js';

const config: UserConfig = {
  logLevel: 'info',
  build: {
    minify: false
  },
  define: {
    __DATE__: JSON.stringify(new Date().toISOString()),
    __RELOAD_SW__: JSON.stringify(false),
    __UPDATE_CHECK_PERIOD_MS__: JSON.stringify(20000) // in milli-seconds, 20s for testing purposes
  },
  plugins: [
    sveltekit(),
    SvelteKitPWA(pwaConfiguration),
    replace(replaceOptions),

    // copy is needed for vite to work in svelte:dev (especially under "tauri dev")
    // All copy commands are duplicated in package.json:scripts.svelte:prebuild, for svelte:dev to work correctly.
    viteStaticCopy({
      targets: assets
    })
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
};

// console.log('DEBUG vite.config.ts config.define=%o', config.define);

export default config;
