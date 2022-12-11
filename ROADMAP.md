# ROADMAP

## Plan

1. hooks.server.js
2. PWA - offline error handling ("page not available offline, please connect to Internet"),
   need resolution of open issue <https://github.com/sveltejs/kit/issues/8080>
3. UI framework branches - port from 2022-0525
4. Make QR scan work in browser?
5. Auth?
6. Backend Server (non-SvelteKit)?

## Ideas

### Auth

SvelteKit-Auth <https://www.npmjs.com/package/sk-auth> is dead as of 2022-06, all latest SvelteKit breaking changes killed it.

See progress in <https://github.com/nextauthjs/next-auth/tree/main/apps/playground-sveltekit> (yes, @next-auth/sveltekit).
