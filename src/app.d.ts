/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="@vite-pwa/sveltekit" />
/// <reference types="@vite-pwa/sveltekit/dist" />
/// <reference types="@vite-pwa/sveltekit/dist/index.d.ts" />

declare const __DATE__: string;
declare const __RELOAD_SW__: string;
declare const __UPDATE_CHECK_PERIOD_MS__: string;

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Locals {
    userid: string;
    buildDate: string;
    periodicUpdates: boolean;
  }
}
