<script>
  import Header from '$lib/components/header/Header.svelte';
  import './styles.css';

  import { onMount } from 'svelte';
  // import { defineCustomElements } from '@ionic/pwa-elements/loader'; // Broken -> Directory import '...' is not supported resolving ES modules
  // Use a hack to import:
  import loader from '@ionic/pwa-elements/loader/index.cjs.js';
  onMount(async () => {
    await loader.defineCustomElements(window);
  });
</script>

<div class="app">
  <Header />

  <main>
    <slot />
  </main>

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
