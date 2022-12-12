<script lang="ts">
  import { onMount } from 'svelte';

  import Favicon from '$lib/components/favicon/Favicon.svelte';
  import Offline from '$lib/components/offline/Offline.svelte';
  import DarkMode from '$lib/components/darkmode/DarkMode.svelte';
  import Header from '$lib/components/header/Header.svelte';
  import './styles.css';
  import { loadIonicPWAElements } from '$lib/utils.cjs';

  // BEGIN load 'vanilla-lazyload' lib
  import type { ILazyLoadInstance } from 'vanilla-lazyload';
  let lazyloadInstance: ILazyLoadInstance;
  import lazyload from 'vanilla-lazyload';
  import { browser } from '$app/environment';
  onMount(() => {
    if (browser) {
      lazyloadInstance = new lazyload();
      lazyloadInstance?.update();
    }
  });
  // END load 'vanilla-lazyload' lib

  onMount(async () => {
    await loadIonicPWAElements(window);
  });

  let isDarkMode: boolean;

  // Favicon params:
  const pngFavicons = [
    { sizes: '32x32', href: '/favicon-32x32.png', imgSize: 32 },
    { sizes: '16x16', href: '/favicon-16x16.png', imgSize: 16 },
    { sizes: '48x48', href: '/favicon-48x48.png', imgSize: 48 },
    { sizes: '192x192', href: '/icon-192x192.png', imgSize: 192 } // For Android Devices
  ];
  const svgFavicon = undefined; // TODO: '/favicon.svg';
  const icoFavicon = undefined; // TODO: '/favicon.ico';

  const touchFavicons = [
    { sizes: '167x167', href: '/apple-icon-167x167.png', imgSize: 167 }, // For iPad
    { sizes: '180x180', href: '/apple-icon-180x180.png', imgSize: 180 } // For iPhone
  ];
</script>

<div class="app">
  <Favicon {pngFavicons} {svgFavicon} {icoFavicon} {touchFavicons} />

  <Header --corner-right-width="8em">
    <DarkMode bind:isDarkMode>
      <svelte:fragment let:data>
        <label>
          {isDarkMode ? '🔆' : '🌙'}
          <input
            id="cb1"
            type="checkbox"
            label={isDarkMode ? '🔆' : '🌙'}
            checked={isDarkMode}
            on:change={data.onToggle}
          />
        </label>
      </svelte:fragment>
    </DarkMode>
  </Header>

  <main>
    <slot />
  </main>

  <Offline />

  <footer>
    <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
