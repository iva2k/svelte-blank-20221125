// import type { SvelteKitPWAOptions, GenerateSWOptions } from '@vite-pwa/sveltekit';
// import type { VitePWAOptions } from 'vite-plugin-pwa';

// import type { RollupReplaceOptions } from '@rollup/plugin-replace';

// /** @type {import('vite-plugin-pwa').VitePWAOptions} */
// ? /** @type {import('@vite-pwa/sveltekit').SvelteKitPWAOptions & import('vite-plugin-pwa').ResolvedVitePWAOptions} */
// ? /** @type {import('@vite-pwa/sveltekit').SvelteKitPWAOptions & Partial<import('vite-plugin-pwa').ResolvedVitePWAOptions>} */
/** @type {import('@vite-pwa/sveltekit').SvelteKitPWAOptions} */
const pwaConfiguration = {
  srcDir: './src',

  // outDir: './.svelte-kit', // broken?
  outDir: './.svelte-kit/output/client',

  mode: 'development',
  // includeManifestIcons: false,
  filename: '', // set programmatically, below
  scope: '/',
  base: '/',

  // For ResolvedVitePWAOptions:
  // swSrc: '',
  // swDest: '',

  // default: selfDestroying: false, // set programmatically, below
  // default: registerType: 'prompt', // safer option than 'autoUpdate', // set programmatically, below

  // default: strategies: 'generateSW', // set programmatically, below
  // for strategies: 'injectManifest' need:
  // injectManifest: {}, // set programmatically, below
  // workbox: {}, // set programmatically, below

  // default: injectRegister: 'auto',
  // default: minify: true,

  devOptions: {
    // enabled: process.env.SW_DEV === 'true',
    enabled: true,
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: '/'
    // deprecated: webManifestUrl: '/manifest.webmanifest'
  },

  includeAssets: [
    // 'favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'
  ],
  manifest: {
    short_name: 'MyApp', // set programmatically, below
    name: 'My Awesome App', // set programmatically, below
    description: 'My Awesome App description',
    start_url: '/',
    scope: '/',
    id: '/', // TODO: (when needed, mid-2023?) It has to match server URL (domain, port, and path)
    // display: 'standalone',
    display: 'fullscreen',
    theme_color: '#000000',
    background_color: '#ffffff',
    icons: [
      {
        src: '/logo.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'any'
      },
      {
        src: '/logo.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable'
      }
    ]
  },
  // useCredentials: true, // Will add `crossorigin="use-credentials"` attribute to <link rel="manifest">, so manifest can be accessed id it sits behind auth
  // if you have shared info in svelte config file put in a separate module and use it also herenr lint
  kit: {
    // base: '',
    // outDir: './.svelte-kit',
    // adapterFallback: 'index.html'
    // trailingSlash: 'never'
  }
};

const claims = process.env.CLAIMS === 'true';
const reload = process.env.RELOAD_SW === 'true';
const sw = process.env.SW === 'true';
const selfDestroying = process.env.SW_DESTROY === 'true';

/** @type {import('@rollup/plugin-replace').RollupReplaceOptions } */
const replaceOptions = {
  __DATE__: new Date().toISOString(),
  __RELOAD_SW__: reload ? 'true' : 'false',
  __UPDATE_CHECK_PERIOD_MS__: JSON.stringify(
    process.env.SW_DEV === 'true' ? 20 * 1000 : 60 * 60 * 1000
  ),
  __SW_DEV__: process.env.SW_DEV === 'true' ? 'true' : 'false',
  preventAssignment: true
};
// console.log('DEBUG pwa-configuration.js replaceOptions=%o', replaceOptions);

/** @typedef {import('workbox-build').InjectManifestOptions} InjectManifestOptions */
/** @typedef {import('workbox-build').GeneratePartial} GeneratePartial */
/** @typedef {import('vite-plugin-pwa').CustomInjectManifestOptions} CustomInjectManifestOptions */
/** @type {Partial<InjectManifestOptions & GeneratePartial>} */
const workboxOrInjectManifestEntry = {
  // vite and SvelteKit are not aligned: pwa plugin will use /\.[a-f0-9]{8}\./ by default: #164 optimize workbox work
  dontCacheBustURLsMatching: /-[a-f0-9]{8}\./,
  // maximumFileSizeToCacheInBytes: 3000000, // Increase max size of assets in manifest
  // To exclue routes, see <https://vite-pwa-org.netlify.app/guide/faq.html#exclude-routes>
  // For background sync, see <https://vite-pwa-org.netlify.app/workbox/generate-sw.html#background-sync>
  globPatterns: ['client/**/*.{js,css,html,ico,json,png,svg,webp,webmanifest,woff,woff2}'], // TODO: (now) Should remove .webmanifest?
  // globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'], // From @vite-pwa/sveltekit example
  // globIgnores: sw ? (claims ? ['**/claims-sw*'] : ['**/prompt-sw*']) : ['**/sw*', '**/workbox-*'], // Not needed, seems the  plugin takes care of that.
  // Before generating the service worker, manifestTransforms entry will allow us to transform the resulting precache manifest. See the manifestTransforms docs for mode details.
  // Here we use it only to log the precache manifest.
  manifestTransforms: [
    // /** @typedef {import('workbox-build').ManifestEntry} ManifestEntry */
    /** @type {import('workbox-build').ManifestTransform} */
    async (manifestEntries) => {
      console.info('Precache Manifest Entries:');
      const manifest = manifestEntries.map((e) => {
        console.info(`  ${JSON.stringify(e)}`);
        return e;
      });
      return { manifest };
    }
  ]
};

if (sw) {
  pwaConfiguration.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts'; // 'src/' is added by the plugin
  pwaConfiguration.strategies = 'injectManifest';
  if (pwaConfiguration.manifest) {
    pwaConfiguration.manifest.name = 'PWA Inject Manifest';
    pwaConfiguration.manifest.short_name = 'PWA Inject';
  }
  pwaConfiguration.injectManifest = workboxOrInjectManifestEntry;
} else {
  workboxOrInjectManifestEntry.mode = 'development';
  workboxOrInjectManifestEntry.sourcemap = process.env.SW_DEV === 'true'; // Enable for service worker during development. No SW sourcemaps for production.
  workboxOrInjectManifestEntry.navigateFallback = '/';
  pwaConfiguration.workbox = workboxOrInjectManifestEntry;
}

if (claims) pwaConfiguration.registerType = 'prompt'; // safer option than 'autoUpdate' (which can lose user data in forms if update happens);

if (selfDestroying) {
  pwaConfiguration.selfDestroying = selfDestroying; // `true` will unregister the service worker.
  // ? pwaConfiguration.swDest = 'dev-dist';
  pwaConfiguration.filename = 'destroy-sw.ts'; // Undocumented feature, Must provide .filename - either existing, or to be created, for .selfDestroying = true.
}

export { pwaConfiguration, replaceOptions };
