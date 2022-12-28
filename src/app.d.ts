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
// import { User } from '$lib/types';

// One way to overcome that is:
// declare global {  namespace App {
declare namespace App {
  // interface Error {}
  interface Locals {
    // Another way is to use import() function:
    //      user: import('$lib/types').User | null;
    // userid: string;
    // buildDate: string;
    // periodicUpdates: boolean;

    // user is populated from the session cookie
    user: import('firebase-admin/auth').DecodedIdToken | null;
  }
  interface PageData {
    // we're making user a property of session in case it needs to contain other things
    // it would be possible, for instance, to have use preferences set even if not auth'd
    session: import('$lib/types').Session;
  }
  // interface Platform {}
}
// }
