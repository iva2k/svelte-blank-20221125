# Blank SvelteKit App + Tauri + Storybook + Prettier + ESLint + Stylelint + Postcss

A cross-platform Desktop / Mobile / Web application starter.

<!-- prettier-ignore -->
|Storybook| [![Netlify Status](https://api.netlify.com/api/v1/badges/90e9b7ab-f139-4ad9-a84b-3501d18d98cb/deploy-status)](https://app.netlify.com/sites/svelte-blank-20221125/deploys) |  [![Vercel Status](https://shields.io/github/deployments/iva2k/svelte-blank-20221125/production?style=flat&label=vercel&logo=vercel)](https://vercel.com/iva2k/svelte-blank-20221125) |
|:-:|:-:|:-:|
|[Chromatic](https://www.chromatic.com/builds?appId=63839ed0e936a148379c5c65)| [App Demo](https://svelte-blank-20221125.netlify.app) |  |

Note: Vercel is not able to install and build this project (Vercel does not support Node 18 yet).

Built with:

- [Svelte](https://svelte.dev) - UI framework
- [Svelte Kit](https://kit.svelte.dev) - UI build system
- [Tauri](https://tauri.studio) - Desktop Application framework
- [Storybook](https://storybook.js.org) - Tool for building UI components and pages in isolation
- [Prettier](https://prettier.io/) - Opinionated Code Formatter
- [ESLint](https://eslint.org) - Pluggable JavaScript linter
- [Stylelint](https://stylelint.io/) - A mighty, modern CSS linter
- [Postcss](https://postcss.org/) - Transforming styles with JS plugins

Continuous Integrations:

- [Chromatic](https://www.chromatic.com) - Storybook Github CI
- [Netlify](https://svelte-blank-20221125.netlify.app) - App Demo

## Install

### Start Your App

To start your app from this project as a template:

```bash
mkdir my-app && cd my-app
npx degit iva2k/svelte-blank-20221125#ui-agnostic
# or
npx degit iva2k/svelte-blank-20221125#ui-bootstrap
# or
npx degit iva2k/svelte-blank-20221125#ui-bulma
# or ... (see other UI framework branches below)
```

### Or Clone the Repo

```bash
git clone https://github.com/iva2k/svelte-blank-20221125.git
cd svelte-blank-20221125
```

## Developing Locally

Please follow the [Tauri Getting Started Guide](https://tauri.studio/en/docs/getting-started/intro#steps) to setup your system with the required Rust toolchain.

This application is built like a typical Node.js application. However, instead of `npm`, [`pnpm`](https://pnpm.io/) is used for package management.

> **Note:** You may use `yarn` or `npm`, but only a `pnpm` lockfile is included, and some scripts call `pnpm` directly and need to be changed to your package manager.

```bash
pnpm install # or npm install
```

### Start development server

```bash
pnpm run svelte:dev

# or start the development server and open the app in a new browser tab
pnpm run svelte:dev -- --open
```

## Building

To create a production version of the web app (to be hosted on a server):

```bash
pnpm run svelte:build
```

To preview the production build of the web app, execute `pnpm run preview`.

To deploy the app, need to install an [adapter](https://kit.svelte.dev/docs/adapters) for the target environment.

## Desktop App

To run desktop app (using Tauri)

```bash
pnpm run dev
```

To create desktop executable:

```bash
pnpm run build
```

## Mobile App

To update mobile app project (Android):

```bash
pnpm run svelte:build
cap open android
```

iOS platform is not installed in this repo, but can easily be added. See [CREATING](./CREATING.md)

## How This App Was Created

See [CREATING](./CREATING.md).

## Styling / UI Components

There are many UI frameworks that work with Svelte / SvelteKit, and choice can be daunting.

<https://bestofsvelte.com/t/ui-library>

<https://sveltesociety.dev/components/>
