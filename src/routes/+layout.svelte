<script lang="ts">
  import { onMount } from 'svelte';

  import Offline from '$lib/components/offline/Offline.svelte';
  import DarkMode from '$lib/components/darkmode/DarkMode.svelte';
  import Header from '$lib/components/header/Header.svelte';
  import './styles.css';
  import { loadIonicPWAElements } from '$lib/utils.cjs';

  // BEGIN load 'vanilla-lazyload' lib
  import type { ILazyLoadInstance } from 'vanilla-lazyload';
  interface CustomDocument extends globalThis.Document {
    lazyloadInstance: ILazyLoadInstance;
  }
  import lazyload from 'vanilla-lazyload';
  import { browser } from '$app/environment';
  const d = document as unknown as CustomDocument;
  if (browser && !d.lazyloadInstance) {
    d.lazyloadInstance = new lazyload();
  }
  onMount(() => {
    if (browser) {
      if (d.lazyloadInstance) {
        d.lazyloadInstance.update();
      }
    }
  });
  // END load 'vanilla-lazyload' lib

  onMount(async () => {
    await loadIonicPWAElements(window);
  });

  let isDarkMode: boolean;
</script>

<div class="app">
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
