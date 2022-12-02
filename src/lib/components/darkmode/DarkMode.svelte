<script lang="ts">
  export let isDarkMode = false;

  const STORAGE_KEY = 'ag-color-scheme';
  class ColorSchemeManager {
    private constructor(_window: Window, _document: Document) {
      this.window = _window;
      this.document = _document;
      this.setColorScheme(this.getSavedOrDefaultColorScheme());
    }

    static getInstance(_window: Window, _document: Document) {
      const w = _window as unknown as { colorSchemeManager: ColorSchemeManager };
      if (w && _document) {
        if (!w.colorSchemeManager) {
          w.colorSchemeManager = new ColorSchemeManager(_window, _document);
        }
        return w.colorSchemeManager;
      }
    }

    getSavedOrDefaultColorScheme() {
      // First checks localStorage then system preferences
      return (
        localStorage.getItem(STORAGE_KEY) ||
        (this.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      );
    }

    setStoredColorScheme(colorScheme: string | undefined) {
      if (colorScheme && this.document) {
        localStorage.setItem(STORAGE_KEY, colorScheme);
      }
    }

    getCurrentColorScheme() {
      if (this.document) {
        return this.document.firstElementChild?.getAttribute('color-scheme');
      }
    }

    setColorScheme(colorScheme: string | undefined) {
      if (colorScheme && this.document) {
        this.document.firstElementChild?.setAttribute('color-scheme', colorScheme);
      }
    }
  }

  import { onMount } from 'svelte';

  let colorSchemeManager: ColorSchemeManager | undefined;
  let isMounted = false; // Hide theme controls until fully mounted.
  onMount(async () => {
    colorSchemeManager = ColorSchemeManager.getInstance(window, document);
    const setTheme = colorSchemeManager?.getSavedOrDefaultColorScheme();
    isDarkMode = setTheme === 'dark';
    colorSchemeManager?.setColorScheme(setTheme);
    isMounted = true;
  });

  const onToggleDarkMode = () => {
    // Toggle current color mode
    const setTheme = colorSchemeManager?.getCurrentColorScheme() === 'dark' ? 'light' : 'dark';
    isDarkMode = setTheme === 'dark';
    colorSchemeManager?.setColorScheme(setTheme);
    // Update the store (only from user choice)
    colorSchemeManager?.setStoredColorScheme(setTheme);
  };

  // Pass data to the slot
  let data = { onToggle: onToggleDarkMode };
</script>

<svelte:head>
  <script lang="ts">
    // To avoid "Flash of White", we start theme loading as soon as document head using <svelte:head>
    // TODO: (when needed) For even better UX, implement cookie-based store and ssr / server-side rendering with light/dark mode.

    if (document) {
      // Only run this on the client, NOT in SSR mode.
      // Unfortunately we can't reuse ColorSchemeManager here (it's inaccessible).
      // So we replicate 2 necessary methods here.
      const STORAGE_KEY = 'ag-color-scheme';
      function getSavedOrDefaultColorScheme() {
        // First checks localStorage then system preferences
        return (
          localStorage.getItem(STORAGE_KEY) ||
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        );
      }
      function setColorScheme(colorScheme: string | undefined) {
        if (colorScheme && document) {
          document.firstElementChild?.setAttribute('color-scheme', colorScheme);
        }
      }
      setColorScheme(getSavedOrDefaultColorScheme());
    }
  </script>
</svelte:head>

{#if isMounted}
  <slot {data}>
    <!-- Slot Fallback -->
    <!-- <Input id="c2" type="switch" label={isDarkMode ? '🔆' : '🌙'} checked={isDarkMode} on:change={onToggleDarkMode} /> -->
    <label>
      {isDarkMode ? '🔆' : '🌙'}
      <input
        id="c3"
        type="checkbox"
        label={isDarkMode ? '🔆' : '🌙'}
        checked={isDarkMode}
        on:change={onToggleDarkMode}
      />
    </label>
  </slot>
{/if}
