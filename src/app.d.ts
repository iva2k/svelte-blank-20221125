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

// `import` will change this file from ambient to module.
// One way to overcome that is:
// import { User } from '$lib/types';
// declare global {
//   namespace App { ...

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      userid: string;
      // buildDate: string;
      // periodicUpdates: boolean;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
