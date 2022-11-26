# Creating: Blank SvelteKit App + Tauri + Capacitor + Storybook + Prettier + ESLint + Stylelint + Postcss

This file describes how this app was created.

## Software Mantra

### DRY

DRY - Don't-Repeat-Yourself. Knowledge should always reside in a single place. If code of more than 3 steps is repeated twice, maybe... if thrice - for sure refactor it so it resides in a single place and used from there. DRY is avoiding knowledge duplication (and splintering) and reducing the repetition of code patterns in favor of abstractions and avoiding redundancy. It also can be explained as SST - Single-SourceOf-Truth principle - "every piece of knowledge must have a single, unambiguous, authoritative representation within a system". Code can still be duplicated - it is sometimes a judgement call for balancing with other principles.

### KISS

KISS - Keep-It-Simple,Stupid. Keep the code simple and clear, making it easy to understand. If code needs comments, think hard - the code can probably be simplified by renaming, restructuring, breaking up.

## Prerequisites

Please follow the [Tauri Getting Started Guide](https://tauri.studio/en/docs/getting-started/intro#steps) to setup your system with the required Rust toolchain.

## create-svelte

Svelte scaffolding is set up by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

```bash
# create a new project in my-app, use TypeScript syntax, add ESLint, Prettier, Playwright
npm create svelte@latest my-app
cd my-app
pnpm install
git init && git add -A && git commit -m "Initial commit" # (optional)
```

## Developing Locally

This application is built like a typical Node.js application. However, instead of `npm`, [`pnpm`](https://pnpm.io/) is used for package management.

> **Note:** You may use `yarn` or `npm`, but only a `pnpm` lockfile is included.

### Start development server

```bash
pnpm run dev

# or start the development server and open the app in a new browser tab
pnpm run dev -- --open
```

## Fix Issues That Might Come Up

Run `pnpm run XXX` replacing XXX for each of the scripts in `package.json`. It's a good idea to fix all errors and warnings that might come up, and re-check after each major addition.
