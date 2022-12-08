import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import type { UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import replace from '@rollup/plugin-replace';

import { SvelteKitPWA } from '@vite-pwa/sveltekit';

import { pwaConfigurationFnc } from './pwa-configuration.js';
import assets from './assets.js';

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const { pwaConfiguration, replaceOptions } = await pwaConfigurationFnc(env);

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
  return config;
});
