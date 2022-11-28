import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'pnpm run svelte:build:only && pnpm run svelte:preview', // TODO: (blocked by upstream) having "pnpm run svelte:build" calls "cap sync android", which hits a bug with no extension windows command file crashing in node --experimental-loader. Current workaround is to remove `cap` from playwright.
    port: 4173,
    timeout: 120 * 1000
  },
  testDir: 'tests'
};

export default config;
