<script lang="ts">
  import { page } from '$app/stores';

  const { message } = $page.error || { message: 'Oops, $page.error is null' };
  const title = `${$page.status}: ${message}`;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<h1>{title}</h1>
{#if false}
  <p>This is `src/routes/+errror.svelte` file.</p>
{/if}
