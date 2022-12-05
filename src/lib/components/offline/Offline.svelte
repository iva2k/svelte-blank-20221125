<script lang="ts">
  // eslint-disable-next-line import/no-unresolved
  import { pwaInfo } from 'virtual:pwa-info';
  import { onMount } from 'svelte';
  import type { ComponentType } from 'svelte';

  // replaced dynamically
  // const date = '__DATE__';
  // const enableSwDev = '__SW_DEV__';

  let ReloadPrompt: ComponentType | undefined;
  onMount(async () => {
    pwaInfo &&
      (ReloadPrompt = (await import('$lib/components/reloadprompt/ReloadPrompt.svelte')).default);
  });

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
  {@html webManifest}
</svelte:head>

{#if ReloadPrompt}
  <svelte:component this={ReloadPrompt} />
{/if}
