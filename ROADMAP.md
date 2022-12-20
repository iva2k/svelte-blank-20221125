# ROADMAP

## Plan

1. Organize TypeScript types - qrscanner/settings, etc.
2. Organize app common stuff: settings manager (localStorage/cookis/server), toast interface, layout API - show/hide footer, global drawer(?)
3. UI framework branches - port from 2022-0525
4. Auth?
5. Backend Server (non-SvelteKit)?
6. Push Notifications?
7. Explore turborepo <https://www.npmjs.com/package/turbo>

## Package Updates

1. @sveltejs/kit 1.0.1 (first update to @sveltejs/kit@1.0.0-next.588)
2. @storybook/svelte 6.5.x -> @storybook/sveltekit 7.0.0 <https://www.npmjs.com/package/@storybook/sveltekit>
3. Migrate to Histoire? <https://histoire.dev/guide/svelte3/getting-started.html>

## Ideas

### Auth

SvelteKit-Auth <https://www.npmjs.com/package/sk-auth> is dead as of 2022-06, all latest SvelteKit breaking changes killed it.

See progress in <https://github.com/nextauthjs/next-auth/tree/main/apps/playground-sveltekit> (yes, @next-auth/sveltekit).
