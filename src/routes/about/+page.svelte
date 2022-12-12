<script lang="ts">
  import SEO from '$lib/components/seo/SEO.svelte';
  import website from '$lib/config/website';
  const { siteTitle } = website;
  const pageTitle = 'About';
  const pageCaption = 'About page';
  const seoProps = { pageTitle, pageCaption, slug: 'about' };
</script>

<SEO {...seoProps} />

<div class="text-column">
  <h1>About this app</h1>

  <p>
    This is a {siteTitle} app built with <a href="https://kit.svelte.dev">SvelteKit</a>. You can
    make your own by typing the following into your command line and following the prompts:
  </p>

  <pre>npm create svelte@latest</pre>

  <p>
    The page you're looking at is purely static HTML, with no client-side interactivity needed.
    Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
    the devtools network panel and reloading.
  </p>

  <p>
    The <a href="/sverdle">Sverdle</a> page illustrates SvelteKit's data loading and form handling. Try
    using it with JavaScript disabled!
  </p>
</div>
