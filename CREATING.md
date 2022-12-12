# Creating: Total App | Blank SvelteKit App

## + Tauri + Capacitor + Storybook + Prettier + ESLint + Stylelint + Postcss + Playwright + Vitest + Netlify + Vercel

This file describes how this app was created.

It is not a tutorial per se, and uses a dense step-by-step language without too much explanation and expects the reader to dive deeper on their own. Making it into a tutorial will yield a thik book, which is not the goal here.

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
# create a new project in my-app, use demo app, TypeScript syntax, ESLint, Prettier, Playwright, Vitest
npm create svelte@latest my-app
cd my-sync
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

### Add Tooling

```bash
pnpm install -D glob rimraf minimist @types/minimist sass shx vite-plugin-static-copy cpy ts-node @types/node @types/glob
```

Add assets copying to svelte.config.js:

```js
+ import { viteStaticCopy } from 'vite-plugin-static-copy';
+ import assets from './assets.js';

const config = {
  ...
  kit: {
    ...
+    vite: () => ({
+      plugins: [
+        // copy is needed for vite to work in svelte:dev (especially under "tauri dev")
+        // All copy commands are duplicated in package.json:scripts.svelte:prebuild, for svelte:dev to work correctly.
+        viteStaticCopy({
+          targets: assets,
+          verbose: true
+        })
+      ]
+    })
  }
};
```

### SvelteKit Prerender ENAMETOOLONG error

// TODO: (now) File issue

Build fails with ENAMETOOLONG in vite prerender. Root cause is if env.private is large (e.g. due to a bunch of "npm\_\*" variables added by pnpm or vite, e.g. contains a bunch of npm_package_devDependencies and other internal npm stuff), it is passed to fork(script, ...) as args, and it cannot handle such a large environment (more than 32kB size).

See "patches/@sveltejs__kit@1.0.0-next.571.patch"

### Issue with imports linting

<https://github.com/sveltejs/kit/issues/1560>

Fix:

Install `eslint-import-resolver-typescript` package for resolving aliases set by "path" in `tsconfig.json`, and install `eslint-plugin-import` package for checking imports:

```bash
pnpm i -D eslint-plugin-import eslint-import-resolver-typescript
```

Add to `.eslintrc.cjs` file:

```cjs
{
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
+    'plugin:import/recommended',
    'prettier'
  ],
  plugins: [
    ...
+    'import'
  ],
  settings: {
+    'import/resolver': {
+      typescript: {}
+    }
    ...
  },
  parserOptions: {
+    project: ['./tsconfig.json', './tsconfig.lint.json'],
+    tsconfigRootDir: './',
    ...
  }
}
```

Create file `tsconfig.lint.json` with:

```json
{
  "extends": "./tsconfig.json",
  "include": ["./playwright.config.ts", "./svelte.config.js", "./tests/**/*.ts"]
}
```

Add few lines to tsconfig.json:

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    ...
+    "outDir": ".types",
+    "paths": {
+      "$app/*": ["./node_modules/@sveltejs/kit/src/runtime/app/*"],
+      "$lib": ["./src/lib"],
+      "$lib/*": ["./src/lib/*"]
+    }
  },
+  "exclude": ["./node_modules/**", ".svelte-kit/**", ".types"]
}
```

Some background info on these changes:

- SvelteKit generates `.svelte-kit/tsconfig.json` which is called by "extend" in `./tsconfig.json`.
- TypeScript does not have a true extend mechanism (it is really just an override).
- There are `include` and `exclude` in `.svelte-kit/tsconfig.json`, so can't add to those. `include` is generated, `exclude` is static, so we can replace `exclude` with low risk of it breaking later (there is still some risk, just keep in mind where to look should anything break after an update).
- This fix uncovers a hidden issue in @sveltejs/kit - there are some missing types in the published package. Run `pnpm run check` or `tsc` to see the "type not found" errors ("outDir" addition above just redirects the files generated by `tsc` command so they don't clash with existing .js files). Filed issue <https://github.com/sveltejs/kit/issues/5114>. Seems to not be happening anymore with @sveltejs/kit@1.0.0-next.561 due to runtime/app stashed under node_modules.

### Issue "Could not detect a supported production environment" when running `pnpm run build`

> Could not detect a supported production environment. See <https://kit.svelte.dev/docs/adapters> to learn how to configure your app to run on the platform of your choosing

Fix:

See [Set Svelte SPA mode](#set-svelte-spa-mode) below.

### Issue

.../node_modules/svelte-preprocess postinstall$ echo "[svelte-preprocess] Don't forget to install the preprocessors packages that will be used: node-sass/sass, stylus, less, postcss & postcss-load-config, coffeescript, pug, etc..."

TODO: (now) Resolve - review packages.

## Additions

### Vitest Coverage

When creating SvelteKit project, choose vitest to be added.

For coverage, add '@vitest/coverage-c8' package:

```bash
pnpm i -D @vitest/coverage-c8
```

Add '/coverage' to .gitignore, .eslintignore, .prettierignore (see sources).

Add some scripts:

```json
// package.json
{
  ...
  "scripts": {
    ...
+    "test:unit": "echo RUN test:unit && vitest run",
+    "test:unit:watch": "echo RUN test:unit:watch && vitest",
+    "test:unit:coverage": "echo RUN test:unit:coverage && vitest run --coverage",
  }
}
```

### Add Playwright Reports

Add few lines to `playwright.config.ts` file so HTML and .json reports are generated:

```js
// playwright.config.ts

...
const config: PlaywrightTestConfig = {
+  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
+  reporter: process.env.CI
+    ? [['dot'], ['json', { outputFile: 'test-results.json' }]]
+    : [['list'], ['json', { outputFile: 'test-results.json' }], ['html', { open: 'on-failure' }]],
  ...
```

### Add Website Config Files

Config files help to organize site-wide settings. SvelteKit and Vite use .env files underneath, and we will build a helper file `$lib/config/website.js` to collect the relevant settings into one abstraction, similar to <https://rodneylab.com/sveltekit-blog-starter/#src-lib>.

Adding such a config would have been an easy task, if not for the Service Worker in the following section, which needs access to the config file from within `vite.config.js` which is loaded during build time, before vite builder and SvelteKit load `.env` files into the environment, because it first determines the settings that choose which environment files to load. Luckily, there is a mechanism in Vite to access the .env settings from `vite.config.js`.

To achieve that, we will convert static config assignments to an async function in `vite.config.js`, so it could use [`loadEnv()`](https://vitejs.dev/config/#environment-variables) and [`defineConfig( async () /> {...})`](https://vitejs.dev/config/#async-config) (see the source of `vite.config.js`) and then make an async wrapper `$lib/src/websiteAsync.js` over sync function in `$lib/src/websiteFnc.js`. The async is needed for await of the import of `$lib/src/websiteFnc.js` inside the function. We will use the async wrapper in the next section for the Service Worker.

This solution creates a small overhead for using `$lib/config/websiteFnc.js`, but we can wrap it in `$lib/config/website.js` which can be simply imported into all other files and desructured to get the needed setting variables:

```js
// `$lib/config/website.js`
import website from '$lib/config/website.js';
const { author, ... } = website;
```

See source file `src/routes/about/+page.svelte` that uses `siteTitle` from the config.

This setup involves 4 files: `.env` (it is listed in .gitignore and is never committed to the repo, see `.env.EXAMPLE`, make a copy and modify it for your site), and 3 files in `$lib/config/`: `website.js`, `websiteFnc.js`, `websiteAsync.js`.

The source of truth / relevant variables are spread between 2 files: `.env` and `$lib/config/websiteFnc.js`. The `.env` file should never be committed to repository since it is intended to contain website secrets. It is more involved to reproduce that file on the server / hosting provider. Most variables for the website are public anyway, and they should be defined in `$lib/config/websiteFnc.js` and commited to the repository. It will limit how many variables will need to be configured on hosting provider, since all variables set in `.env` will need to be configured securely in provider UI.

One more hurdle to overcome is fixing the ESLint rule 'import/no-unresolved' for `$env/static/public` used in `$lib/config/website.js`. But for now the ESLint is shut down with `// eslint-disable-next-line import/no-unresolved`.

### Add SEO

TODO: (soon) Revisit <https://github.com/artiebits/svelte-seo>, maybe it is worth using that? Has reasonable object data types, has keywords & tags. Downside is common params have to be repeated across objects.

If your app or website does not appear in the top search results, very few people will visit it, because 90% of users will not go beyond the first page of search results [[source]](https://www.forbes.com/sites/forbesagencycouncil/2017/10/30/the-value-of-search-results-rankings/). 33% of users will click the first result and 17% the second. You need Google to rank your website high for the users to click on it.

Search Engine Optimisation (SEO) is all about getting your website to appear at the top of search engine results. This SEO component adds some metadata and makes optimizations to get higher search rankings.

Other optimizations are getting higher speed / better UX. SvelteKit provides the fastest performance with PWA/SSR/SSG done right, and no slowdowns from virtual DOM of other popular frameworks. One thing is important for UX and fast loads are lazy loading, so we will add it as an example to the large images. TODO.

```bash
pnpm i -D @types/object-hash object-hash vanilla-lazyload
```

Create `src/lib/components/seo/SEO.svelte` component and few sub-components for generating meta-data for SEO (see sources).

It is worth stressing that there's no way to determine hosting website URL during build / prerendering phase. PUBLIC_SITE_URL variable must be configured so the SEO canonical URL is generated correctly. Site URL's for Netlify and Vercel can be also set in `prerender.origin` in `svelte.config.js`, but they seem to not work as expected (SEO.svelte does not receive `$page.url.origin` other than `http://sveltekit-prerender`).

Credits: [Rodnet Lab: SvelteKit SEO](https://rodneylab.com/sveltekit-seo/)

To add more Schemas, lookup the types on <https://schema.org/docs/full.html> and check what types other sites use.

See the following tools for checking the structured data on your deployed website:

- <https://validator.schema.org>
- <https://developers.google.com/search/docs/appearance/structured-data>
- <https://search.google.com/test/rich-results>
- <https://search.google.com/search-console/welcome>
- <https://developers.facebook.com/tools/debug/> (Must login to use it)

TODO: (soon) Fix FB issue:
Missing Properties | The following required properties are missing: fb:app_id

### Add Service Worker for Offline Operation

Service Worker will allow the app to work in offline mode. See <https://kit.svelte.dev/docs/service-workers> and <https://vite-pwa-org.netlify.app/frameworks/svelte.html>.

In order for the application to work offline, `csr` should NOT be set to false on any of the pages since it will prevent injecting JavaScript into the layout for offline support.

The app has to satisfy PWA Minimal Requirements, see <https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html>.

If your application has forms, we recommend you to change the behavior of automatic reload to use default `prompt` option to allow the user decide when to update the content of the application, otherwise automatic update may clear form data if it decides to update when the user is filling the form.

```bash
pnpm add -D @vite-pwa/sveltekit @types/workbox-build@^5.0.1 vite-plugin-pwa@^0.13.3 workbox-core workbox-build workbox-window workbox-precaching workbox-routing @rollup/plugin-replace
```

Create files and make some changes (see sources):

- Add /dev-dist to .gitignore, .eslintignore, .prettierignore
- Patch @vite-pwa/sveltekit to fix problem with import in TypeScript, see file "patches/@vite-pwa__sveltekit@0.0.1.patch" for a hot-fix.
- Add SvelteKitPWA to "vite.config.ts"
- Create "src/lib/components/offline/Offline.svelte"
- Create "src/lib/components/reloadprompt/ReloadPrompt.svelte"
- Create "src/hook-servers.ts"
- Create "src/claims-sw.ts"
- Create "src/prompt-sw.ts"
- Create "pwa-configuration.js" (no typescript!)
- Add Offline component to "src/routes/+layout.svelte"
- Make `prerender = true` the default in "src/routes/+layout.svelte" - offline precaching needs all routes prerenderd. Dynamic routes won't work offline.
- Remove `csr = false` and `csr = dev` from all "src/routes/\*\*/+page.ts" files
- Add few settings to "netlify.toml"
- Add few settings to "vercel.json", // TODO: (when available) see <https://vite-pwa-org.netlify.app/deployment/vercel.html>

#### Fix Issues

// TODO: (now) File issue:

Error importing from '@vite-pwa/sveltekit' - there is `export default {...}` in @vite-pwa/sveltekit/dist/index.mjs.
Changing it to `export {...}` (removing `default`) fixes the problem.
Use `pnpm patch @vite-pwa/sveltekit`, editing the file in directory created by `pnpm patch`, and creating a patch file with `pnpm patch-commit <path given by pnpm>`.

TODO: (now) Implement "no offline" fallback page - suggest to connect to Internet.

### Create Favicon Component

To encapsulate all favicon-related stuff (and keep the mess out of app.html), create ``$lib/components/favicon/Favicon.svelte` component. Use it from `src/routes/+layout.svelte` file.

Add `badge.ts` to all png favicons.

See source files.

### Add Tauri

Add desktop support using Tauri (version 1.2 as of writing time).

Why not Electron? - Tauri is way way better.

Note: iOS and Android support is promised in Tauri discussions, but not implemented yet as of 2022-11.

```bash
pnpm i -D @tauri-apps/api @tauri-apps/cli
```

Add scripts to package.json:

```json
   {
     scripts {
-      "dev": "vite dev",
-      "build": "vite build",
+      "dev": "tauri dev",
+      "build": "tauri build",
+      "svelte:dev": "vite dev --port 3000",
+      "svelte:build": "vite build",
+      "tauri": "tauri",
     }
   }
```

```bash
pnpm run tauri init
# What is your app name? - svelte-blank-20221125
# What should the window title be? - svelte-blank-20221125
# Where are your web assets (HTML/CSS/JS) located, relative to the "<current dir>/src-tauri/tauri.conf.json" file that will be created? - ../build
# What is the url of your dev server? - http://localhost:3000
# What is your frontend dev command? - pnpm run svelte:dev
# What is your frontend build command? - pnpm run svelte:build
```

#### Change bundle identifier

To remove the issue:

> "Error: You must change the bundle identifier in `tauri.conf.json > tauri > bundle > identifier`. The default value `com.tauri.dev` is not allowed as it must be unique across applications."

Edit file `src-tauri/tauri.conf.json`:

```json
// src-tauri/tauri.conf.json
{
  ...
  "tauri": {
    ...
    "bundle": {
      ...
-      "identifier": "com.tauri.dev",
+      "identifier": "com.iva2k.svelte-blank-20221125",
      ...
```

### Set Svelte SPA mode

For using Tauri and Capacitor (standalone app) - SvelteKit should be set to SPA mode and explicitly opt out of SvelteKit\'s assumption needing a server.

SPA mode is set by using adapter-static and setting `fallback` option, see <https://github.com/sveltejs/kit/tree/master/packages/adapter-static#spa-mode>.

There are errors in many online sources that give wrong information about `prerender` and `ssr` for SPA mode (including SvelteKit's own documentation).

Note: Tauri and Capacitor -based app could still use a server if needed, but they cannot rely on SvelteKit server-side endpoints.

For deploying web apps, we can add and setup necessary adapters as needed (see below).

```bash
pnpm i -D @sveltejs/adapter-static
```

SvelteKit dynamic routes don't work with adapter-static, unless a fallback is set.

```js
// svelte.config.js
- import adapter from '@sveltejs/adapter-auto';
+ import adapter from '@sveltejs/adapter-static';
...
export default {
  kit: {
    ...
+    adapter: adapter({
+      // default options are shown:
+      // pages: 'build',
+      // assets: 'build',
+      // fallback: null,
+      // precompress: false
+      fallback: 'index.html'
+    }),
+    // prerender: { entries: [] },
  }
};
```

Create `src/routes/+layout.ts` to set `prerender` and `ssr`:

```js
// src/routes/+layout.ts

// Let SvelteKit decide to prerender for each page by default:
export const prerender = 'auto';
// As of @sveltejs/kit 1.0.0-next.563, pages with actions (e.g. sub-routes) throw error in `vite build`.
// Each such route should set prerender = false if needed in `src/routes/**/+page.ts`.

// Setting ssr = false (which is recommended for SPA in docs) breaks all server-side routes
// (generated pages have no content, therefore SPA does not load).
// We let SvelteKit render all routes on server, so deep links will still work:
export const ssr = true;
```

Adjust all `src/routes/**+page.ts` files - set prerender = false for pages with action (i.e. having a sub-route), in SvelteKit demo app it is /sverdle:

```js
// src/routes/sverdle/+page.ts

// This page has action (sub-route), so we need to explicitly disable prerender here;
export const prerender = false;
```

### Deploy on Netlify and Vercel

Though it is recommended to use adapter-auto to choose between adapter-netlify and adapter-vercel, it does not fall back to adapter-static, which we need. So we will do it ourselves.

```bash
pnpm i -D @sveltejs/adapter-netlify @sveltejs/adapter-vercel
```

Load adapters in svelte.config.js:

```js
+ import netlify from '@sveltejs/adapter-netlify';
+ import vercel from '@sveltejs/adapter-vercel';
...
const config = {
  ...
  kit: {
    adapter:
+      process.env.VERCEL ? vercel() :
+      process.env.NETLIFY ? netlify() :
      adapter({
        ...
```

See netlify.toml and vercel.json files for other deploy settings.

Storybook (below) is deployed on Chromatic.

### Add Storybook

```bash
## pnpm is a bit tricky with storybook install, use `pnpx` with "-s" flag to skip installing dependencies.
## see https://github.com/storybookjs/storybook/issues/12995#issuecomment-813630999
pnpx sb init -s --builder @storybook/builder-vite
pnpm install
pnpm install -D @storybook/addon-controls @storybook/addon-docs @storybook/addon-svelte-csf
```

Add peer dependencies (some may be already installed):

```bash
pnpm i -D vite @babel/core babel-loader @storybook/builder-webpack5 @storybook/core-common @storybook/addons @storybook/api @storybook/client-api @storybook/client-logger @storybook/node-logger
pnpm i -D @storybook/components @storybook/core-events @storybook/theming
# The React packages were peer dependencies, somehow they leaked into storybook core dependencies:
pnpm i -D react@^17.0.0 react-dom@17.0.0 @mdx-js/react @types/react@^17.0.0 webpack@^5.73.0
# These packages were throwing errors in "build-storybook" script:
pnpm i -D @storybook/preview-web @storybook/addon-backgrounds @storybook/addon-measure @storybook/addon-outline @storybook/channel-postmessage @storybook/channel-websocket
# These packages fix build errors in Storybook/Vite/pnpm
pnpm i -D @prefresh/vite @prefresh/core preact @mdx-js/preact
```

One might ask - why add react et.al.? Storybook uses `react` & `react-dom` for its UI. Some of @storybook/addon-\* packages list them as peer dependencies, but it does not work well in npm package mess and breaks things. Current solution is to add react and all related packages as devDependencies.

Another ongoing problem with Storybook is heavy reliance on webpack4 and slow migration toward webpack5, and further, it impossible to cleanly cut over to vite and remove all webpack versions as of 2022-06.

Disable Storybook telemetry and add Svelte CSF:

```js
// .storybook/main.cjs
module.exports = {
  addons: [
     ...
+    '@storybook/addon-svelte-csf',
     ...
  ],
  core: {
+    disableTelemetry: true, // 👈 Disables telemetry
  }
};
```

Remove example stories and components:

```bash
npx rimraf src/stories
```

### Solve Storybook Issues

#### Preprocess in .storybook/main.cjs

It turned out that storybook `main.cjs` trying to import preprocess from `svelte.config.js` is not viable (import is async, returns Promise, and can't await in top-level .cjs files). The solution was to hard-code same preprocess in `.storybook/main.cjs` same as in `svelte.config.js`.

```js
// .storybook/main.cjs
+ const preprocess = require('svelte-preprocess');
module.exports = {
  ...
  svelteOptions: {
-    preprocess: require('../svelte.config.js').preprocess
+    preprocess: preprocess(),
  },
```

#### Vite $app and $lib aliases

See <https://github.com/storybookjs/storybook/issues/14952>

Add vite config to .storybook/main.cjs:

```js
module.exports = {
+  async viteFinal(config) {
+    config.resolve.alias = {
+      ...config.resolve.alias,
+      // $app: path.resolve('./.svelte-kit/dev/runtime/app')
+      $lib: path.resolve(__dirname, '../src/lib')
+      // $components: path.resolve(__dirname, '../src/lib/components')
+    };
+    return config;
+  },
  ...
};
```

#### Node version

Note: As of 2022-0522 Node 17 and 18 have breaking changes (migrated to ssl3):

- `Error: error:0308010C:digital envelope routines::unsupported`
- <https://github.com/webpack/webpack/issues/14532>
- <https://github.com/storybookjs/storybook/issues/18019>
- <https://github.com/storybookjs/storybook/issues/16555>

One solution would be to use node<17.0.0 in package.json "engines" and engine-strict=true in .npmrc, however...

The problem with node<17.0.0 is it breaks playwright which requires node>17. No solution to use playwright with node<17 yet. Argh!

For all other issues, adding `cross-env NODE_OPTIONS=--openssl-legacy-provider` to all affected scripts (storybook ones) in `package.json` is the only practical solution for now (it opens up old security vulnerabilities in legacy openssl).

```bash
pnpm i -D cross-env
```

TODO: (blocked by upstream) When there's a fix for node>17 and storybook / webpack@4, remove `NODE_OPTIONS=--openssl-legacy-provider` from `package.json`.

#### Using \*.stories.svelte files

An open/unresolved issue is storybook's v6.5.3 storyStoreV7=true not parsing `.stories.svelte` files. And storyStoreV7=false does not load stories at all (no filed issues). So use only `.stories.tsx` for now.

<https://github.com/storybookjs/storybook/issues/16673>

At least, Storybook is working with stories (.tsx, not .svelte) for Counter and Header (after reworking Header into Header + PureHeader).

### Organize Components to src/lib/components

Move Header.svelte to "src/lib/components/header/" and change paths to match in "src/routes/+layout.svelte" file where it is used.

Move Counter.svelte to "src/lib/components/counter/" and change paths to match in "src/routes/+page.svelte" file where it is used.

(See sources).

### Rework Header into Header + PureHeader

Non-pure Header loads $page from $app/store, and it makes it hard to use in Storybook - it will need mocking of $app/stores which is a lot of work and no benefits. Instead we will make PureHeader.

In "src/lib/components/header" copy Header.svelte to PureHeader.svelte, remove `import { page } from '$app/stores';` and replace all usages of $page.pathname to component parameter `pathname` in PureHeader. PureHeader will be usable in Storybook below.

Rework Header.svelte to use PureHeader and pass it the $page.pathname (see sources).

### Rework PureHeader Corners

Add classes "corner-left" and "corner-right" to left and right corners and split their styling, adding "--corner-left-width" and "--corner-right-width" variables, so their sizes can be changed as needed.

Add `<slot />` to the right corner of PureHeader, and move github logo to be slotted into Header>PureHeader in "+layout.svelte".

For styling to apply into the slot elements, add `:global()` clauses to some of styles on PureHeader.

(See sources).

### Add DarkMode Component

See sources - "src/components/darkmode/\*" and edits to "src/routes/+layout.svelte".

Note: DarkMode toggles 'color-scheme' property on \<html\> tag between 'light' and 'dark'/. However, there's no effect visible, as there's no support for dark mode in current "/src/routes/style.css".

There is an unresolved "ParseError" issue <https://github.com/sveltejs/eslint-plugin-svelte3/issues/137> in eslint-plugin-svelte3 which is wrongly closed, causing Lint to fail on ColorSchemeManager class in DarkMode.svelte.

See "patches/eslint-plugin-svelte3@4.0.0.patch" for a hot-fix.

See open issue <https://github.com/sveltejs/kit/issues/8081>

### Add @storybook/addon-a11y

```bash
pnpm i -D @storybook/addon-a11y
```

```js
module.exports = {
  ...
  addons: [
    ...
+   '@storybook/addon-a11y'
  ]
```

### Add Storybook App Theme Switcher Addon

There's a default Storybook theming addon: `@storybook/theming`. It allows control over theming of all parts of Storybook app (UI, docs, preview), but it won't affect the components preview.

To add custom theme to Storybook app, create file .storybook/manager.cjs and .storybook/YourTheme.cjs with the following code:

```js
// .storybook/manager.cjs
import { addons } from '@storybook/addons';
// import { themes } from '@storybook/theming';
import yourTheme from './YourTheme';
addons.setConfig({
  // theme: themes.dark
  theme: yourTheme
});
```

```js
// .storybook/YourTheme.cjs
import { create } from '@storybook/theming';

export default create({
  // base: 'light',
  base: 'dark',
  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://place-hold.it/350x150',
  brandTarget: '_self'

  colorPrimary: 'hotpink',
  colorSecondary: 'deepskyblue',

  // UI
  appBg: 'white',
  appContentBg: 'silver',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: 'black',
  barBg: 'hotpink',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4
});
```

The above will not affect Storybook docs, which have their own theme. To change that, modify .storybook/preview.cjs:

```js
// .storybook/preview.cjs
+ // import { themes } from '@storybook/theming';
+ import yourTheme from './YourTheme.cjs';
export const parameters = {
+  // for '@storybook/theming':
+  docs: {
+    // theme: themes.dark
+    theme: yourTheme
+  },
  ...
};
```

### Add Storybook Theme Switcher Addon

To change themes in Storybook component previews, use an addon [Theme Switcher addon](https://storybook.js.org/addons/storybook-addon-themes). It can coexist with `@storybook/theming`, though will show two identical icons on the toolbar with different menus.

```bash
pnpm i -D storybook-addon-themes
```

Add plugin to Storybook:

```js
// .storybook/main.cjs

module.exports = {
  ...
  addons: [
    ...
+    'storybook-addon-themes'
  ],
  ...
```

Add themes list:

```js
// .storybook/preview.cjs

export const parameters = {
   ...
+  themes: {
+    default: 'twitter',
+    list: [
+      { name: 'twitter', class: 'theme-twt', color: '#00aced' },
+      { name: 'facebook', class: 'theme-fb', color: '#3b5998' }
+    ]
+  }
};
```

The theme only changes class on the root element (which can be chosen to differ from the default \<body\> tag). The actual theme should be provided and can match app theme.

It is possible to load the app theme in .storybook/preview.cjs, just add the CSS file:

```js
// .storybook/preview.cjs
+ import '../src/app.css';
```

### Publish Storybook on Chromatic

Login to [www.chromatic.com](https://www.chromatic.com) and setup yor project, get [YOUR_TOKEN]. Then connect:

```bash
pnpm i -D chromatic
npx chromatic --build-script-name=storybook:build --project-token=[YOUR_TOKEN]
```

Also add project token to the Github repo, see <https://www.chromatic.com/docs/github-actions>:

Go to Settings > Secrets > Actions Secrets > New Repository Secret, then enter Name - CHROMATIC_PROJECT_TOKEN and Secret - [YOUR_TOKEN].

Create file '.github/workflows/chromatic.yml' (see contents in sources).

### Add Prettier & ESLint Rules, Stylelint, Postcss and Autoprefixer

ESLint and Prettier is already part of Svelte Kit installation, so some of the packages below are already present.

#### Stylelint and additional ESLint rules (Storybook)

```bash
pnpm install -D stylelint @ronilaukkarinen/stylelint-a11y stylelint-config-standard stylelint-config-recommended
pnpm install -D eslint-plugin-storybook
```

Note: stylelint-a11y original creator / maintainer is AWOL, using an updated and maintained fork.

Edit `.eslintrc.cjs` file:

```js
// .eslintrc.cjs
module.exports = {
  ...
  extends: [
     'eslint:recommended',
     'plugin:@typescript-eslint/recommended',
     'plugin:import/recommended',
+    'plugin:storybook/recommended',
     'prettier'
  ],
  ...
  parserOptions: {
     project: ['./tsconfig.json', './tsconfig.lint.json'],
     tsconfigRootDir: './',
     sourceType: 'module',
     ecmaVersion: 2020,
+    extraFileExtensions: ['.svelte']
  },
  ...
+  rules: {
+    'import/no-mutable-exports': 'off'
+  }
};
```

#### Postcss, Autoprefixer

Autoprefixer is a PostCSS plugin to parse CSS and add vendor prefixes to CSS rules using values from [Can I Use](https://caniuse.com/). It is recommended by Google and used in Twitter and Alibaba.

```bash
pnpm install -D postcss postcss-cli postcss-import postcss-nesting postcss-html autoprefixer
```

Add file `postcss.config.cjs` with the following contents:

```js
const autoprefixer = require('autoprefixer');

const config = {
  plugins: {
    'postcss-import': {},
    'postcss-nesting': {},
    autoprefixer
  }
};

module.exports = config;
```

Enable postcss & scss in svelte.config.js:

```js
import preprocess from 'svelte-preprocess';
const config = {
  preprocess: preprocess({
    postcss: true,
    scss: { includePaths: ['src', 'node_modules'] }
  }),
  ...
```

#### Prettier and additional Stylelint rules

```bash
pnpm install -D prettier stylelint-config-prettier stylelint-config-html
```

#### Create Stylelint configuration

Add file `.stylelintrc.json`:

```json
// .stylelintrc.json
{
  ... see file in the repo
}
```

#### VSCode formatOnSave

VSCode can format all documents on save, and it should match Stylelint & Prettier.

Some issues can be with VSCode user settings that are not visible right away. If saving any files and then running `pnpm format` shows those files as changed in the process, check "editor.defaultFormatter" for that file type.

For example, VSCode would re-format .json files differently. It turns out VSCode was using different JSON formatter set in user settings, and ignored top-level "editor.defaultFormatter". To fix that, add `jsonc` and `json` settings to `.vscode/settings.json` file as shown below.

Add the following to `.vscode/settings.json` file (if not already there):

```json
// .vscode/settings.json
{
+  "editor.defaultFormatter": "esbenp.prettier-vscode",
+  "editor.formatOnSave": true,
+  "editor.formatOnPaste": true,
+  "editor.formatOnType": false,
+  "editor.codeActionsOnSave": {
+    "source.fixAll.eslint": true,
+    "source.fixAll.html": true
+  },
+  "eslint.validate": ["svelte"],
+  "editor.tokenColorCustomizations": {
+    "[Svelte]": {
+      "textMateRules": [
+        {
+          "settings": {
+            "foreground": "#569CD6" // any color you like
+          },
+          "scope": "support.class.component.svelte" // scope name you want to adjust highlighting for
+        }
+      ]
+    }
+  },
+  "svelte.enable-ts-plugin": true,
+  "javascript.format.enable": false,
+  "files.insertFinalNewline": true,
+  "files.trimFinalNewlines": false,
+  "[json]": {
+    "editor.defaultFormatter": "esbenp.prettier-vscode"
+  },
+  "[jsonc]": {
+    "editor.defaultFormatter": "esbenp.prettier-vscode"
+  },
+  "[svelte]": {
+    "editor.defaultFormatter": "svelte.svelte-vscode"
+  },
+  "[html]": {
+    "editor.defaultFormatter": "vscode.html-language-features"
+  }
}
```

### Add Capacitor

Capcitor has 2 largely independent parts that we could use:

1. Plugins to use native functionality on various platforms
2. Build apps for mobile platforms - iOS, Android

Use of Capacitor \#1 native functionality (like Camera, GPS, etc.) can be very handy for some apps.

Since Tauri has no iOS/Android build support (it's in development), we can use Capacitor \#2 to bridge that gap. Once Tauri implements iOS/Android build support, we can revisit \#2, and keep Capacitor just for \#1.

We will target QR code scanning as a very usefull feature for \#1.

#### Setup

The following setup is based on `@sveltejs/adapter-static` which puts output to 'build' folder by default (beware that other adapters place output files into different location).

First, install pre-requisites per <https://capacitorjs.com/docs/getting-started/environment-setup>.

Then, install VSCode extension:

```bash
code --install-extension ionic.ionic
```

Add Capacitor to the project:

```bash
pnpm install @capacitor/core
pnpm install -D @capacitor/cli
# use npx vs. pnpx with cap as pnpx won't run cap (or call cap directly, without npx):
npx cap init svelte-blank-20221125 com.iva2k.svelteblank20221125 --web-dir=build
```

Add few scripts for convenince:

```json
// package.json
{
  ...
  "scripts": {
     ...
+    "android:open": "cap open android",
+    "android:dev": "cap run android",
```

##### Add Android platform

```bash
pnpm install @capacitor/android
npx cap add android
```

##### Add iOS platform

```bash
pnpm install @capacitor/ios
npx cap add ios
```

Now we can use Capacitor plugins for native functionality.

#### Add Geolocation

For a quick example, add Geolocation:

```bash
pnpm install @capacitor/geolocation
npx cap sync
```

Create `src/routes/geolocation/+page.svelte`:

```js
// src/routes/geolocation/+page.svelte

<script lang="ts">
  import { Geolocation, type Position } from '@capacitor/geolocation';

  let loc: Position | null = null;
  async function getCurrentPosition() {
    const res = await Geolocation.getCurrentPosition();
    loc = res;
  }
</script>

<div>
  <h1>Geolocation</h1>
  <p>Your location is:</p>
  <p>Latitude: {loc?.coords.latitude}</p>
  <p>Longitude: {loc?.coords.longitude}</p>

  <button on:click={getCurrentPosition}>Get Current Location</button>
</div>
```

Add the page to the PureHeader links:

```js
<header>
  ...
  <nav>
    ...
    <ul>
      ...
+      <li aria-current={pathname === '/geolocation' ? 'page' : undefined}>
+        <a href="/geolocation">Geolocation</a>
+      </li>
        ...
```

Add option to PureHeader.stories.tsx:

```tsx
export default {
  ...
  argTypes: {
    pathname: {
-      options: ['/', '/about'],
+      options: ['/', '/about', '/geolocation'],
    ...
```

For Android, add permissions to "android/app/src/main/AndroidManifest.xml" file:

```xml
<manifest ...>
  ...
+  <!-- Geolocation API -->
+  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
+  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
+  <uses-feature android:name="android.hardware.location.gps" />
</manifest>
```

For iOS, add usage description to "ios/App/App/Info.plist" file:

```xml
<dict>
+  <key>NSLocationAlwaysUsageDescription</key>
+  <string>To be able to use location services when app is in the background</string>
+  <key>NSLocationWhenInUseUsageDescription</key>
+  <string>To be able to use location services when app is running</string>
</dict>
```

#### Add QR Code Scanner

For the QR Code scanner feature, we will use [@capacitor-community/barcode-scanner](https://github.com/capacitor-community/barcode-scanner) plugin.

Note that web platform is not yet supported [#31](https://github.com/capacitor-community/barcode-scanner/issues/31) (it looks quite simple to implement - use some existing lib like zxing on top of web camera and submit a PR).

There are also other plugins to try (sith web platform support):

- see <https://github.com/xulihang/capacitor-plugin-dynamsoft-barcode-reader/tree/main/example>
- see <https://www.npmjs.com/package/qr-scanner>
- see <https://github.com/zxing-js/library>

Because of the fact that the Scanner View will be rendered behind the WebView, we have to call `hideBackground()` to make the WebView and the \<html\> element transparent. Every other element that needs transparency, we will have to handle ourself.

The elements are made transparent by adding `background: 'transparent';` in the \<style\> section.

```bash
pnpm install @capacitor-community/barcode-scanner
npx cap sync
```

Create `src/routes/qrscanner.svelte`:

```js
// See src/routes/qrscanner.svelte file in repo
```

Add the page to the PureHeader links:

```js
<header>
  ...
  <nav>
    ...
    <ul>
      ...
+      <li aria-current={pathname === '/qrscanner' ? 'page' : undefined}>
+        <a href="/qrscanner">QR Scanner</a>
+      </li>
```

Add option to PureHeader.stories.tsx:

```tsx
export default {
  ...
  argTypes: {
    pathname: {
-      options: ['/', '/about', '/geolocation'],
+      options: ['/', '/about', '/geolocation', 'qrscanner'],
    ...
```

For Android, add permissions to "android/app/src/main/AndroidManifest.xml" file:

```xml
<manifest
  xmlns:android="http://schemas.android.com/apk/res/android"
+  xmlns:tools="http://schemas.android.com/tools"
  package="com.example">

  <application
    ...
+    android:hardwareAccelerated="true"
  >
  </application>
  ...
+  <!-- QR Scanner -->
+  <uses-permission android:name="android.permission.CAMERA" />
+  <uses-sdk tools:overrideLibrary="com.google.zxing.client.android" />
</manifest>
```

For iOS, add usage description to "ios/App/App/Info.plist" file:

```xml
<dict>
+  <key>NSCameraUsageDescription</key>
+  <string>To be able to scan barcodes</string>
</dict>
```

#### Using PWA Elements

Some Capacitor plugins (such as Camera, Toast) need custom UI elements. May need to add @ionic/pwa-elements to the project (this project does not have that done, and @capacitor-community/barcode-scanner seems to be working just fine without it):

```bash
pnpm install @ionic/pwa-elements
```

A typical installation involves importing the package and registering the elements, or adding a script tag to the \<head\> of the index.html for the app

```js
// src/routes/+layout.svelte
<script lang="ts">
  ...
+  import { onMount } from 'svelte';
+  // import { defineCustomElements } from '@ionic/pwa-elements/loader'; // Broken -> Directory import '...' is not supported resolving ES modules
+  // Use a hack to import:
+  import loader from '@ionic/pwa-elements/loader/index.cjs.js';
+  onMount(async () => {
+    await loader.defineCustomElements(window);
+  });
  ...
```

Note: `svelte-check` throws error for no type definition in `import loader ...`. See `src/lib/utils.cjs` that shuts this error up.

#### Interesting Capacitor Community Plugins

- @capacitor-community/bluetooth-le
- @capacitor-community/camera-preview
- @capacitor-community/keep-awake

#### Fix Issues With Capacitor

None to fix.

### Lighthouse metrics

Run Lighthouse and other web tests at <https://www.webpagetest.org>

TODO: (now) Improve Lighthouse: Does not set a theme color for the address bar.Failures: No `<meta name="theme-color">` tag found.
The browser address bar can be themed to match your site.
<https://developer.chrome.com/docs/lighthouse/pwa/splash-screen/?utm_source=lighthouse&utm_medium=wpt>
