# ROADMAP

## Plan

1. Organize TypeScript types - Image, qrscanner/settings, etc.
2. Organize app common stuff: settings manager (localStorage/cookis/server), toast interface, layout API - show/hide footer, global drawer(?)
3. UI framework branches - port from 2022-0525
4. Auth?
5. Backend Server (non-SvelteKit)?
6. Push Notifications?

## Ideas

### Auth

SvelteKit-Auth <https://www.npmjs.com/package/sk-auth> is dead as of 2022-06, all latest SvelteKit breaking changes killed it.

See progress in <https://github.com/nextauthjs/next-auth/tree/main/apps/playground-sveltekit> (yes, @next-auth/sveltekit).
