<script lang="ts">
  import DarkMode from '$lib/components/darkmode/DarkMode.svelte';
  import Header from '$lib/components/header/Header.svelte';
  import './styles.css';

  import { onMount } from 'svelte';
  import { loadIonicPWAElements } from '$lib/utils.cjs';
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
