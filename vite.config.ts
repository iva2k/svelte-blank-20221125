import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import type { UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import basicSsl from '@vitejs/plugin-basic-ssl';
import replace from '@rollup/plugin-replace';

import { SvelteKitPWA } from '@vite-pwa/sveltekit';

import { pwaConfigurationFnc } from './pwa-configuration.js';
import assets from './assets.js';

// [iva2k] pnpm adds a ton of environmental variables "npm_..." and fork() in @sveltejs/kit chokes with "spawn ENAMETOOLONG" error.
// @see https://github.com/sveltejs/kit/issues/8081
// Removing all "npm_*" variables solves the issue:
// const pre_env = process.env;
process.env = Object.fromEntries(
  Object.entries(process.env).filter((x) => !x[0].startsWith('npm_'))
);
// console.log('DEBUG [spawn ENAMETOOLONG error] len(process.env)=%o, len(filtered)=%o, filtered=%o', JSON.stringify({ ...pre_env }).length, JSON.stringify({ ...process.env }).length, JSON.stringify({ ...process.env }));

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const { pwaConfiguration, replaceOptions } = await pwaConfigurationFnc(env);

  const plugins = [
    // basicSsl(),
    sveltekit(),
    SvelteKitPWA(pwaConfiguration),
    replace(replaceOptions),

    // copy is needed for vite to work in dev (especially under "tauri:dev")
    // All copy commands are duplicated in package.json:scripts.svelte:prebuild, for dev to work correctly.
    viteStaticCopy({
      targets: assets
    })
  ];
  // Playwright does not handle https, see https://github.com/microsoft/playwright/issues/16460
  if (!process.env.NO_HTTPS) plugins.unshift(basicSsl());

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
    preview: {
      https: !process.env.NO_HTTPS
    },
    plugins,
    test: {
      include: ['src/**/*.{test,spec}.{js,ts}']
    }
  };
  return config;
});
