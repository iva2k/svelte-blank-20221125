<script lang="ts">
  import SEO from '$lib/components/seo/SEO.svelte';

  import {
    ogSquareImageSrc,
    ogImageSrc,
    twitterImageSrc,
    featuredImageSrc,
    altDescription
  } from '$lib/assets/home/index';

  import Counter from '$lib/components/counter/Counter.svelte';
  import welcome from '$lib/images/svelte-welcome.webp';
  import welcome_fallback from '$lib/images/svelte-welcome.png';
  const welcomeSize = { width: 2048, height: 495 };
  import website from '$lib/config/website';

  const { author, siteUrl, description } = website;

  let title = 'Home';
  const breadcrumbs = [
    {
      name: 'Home',
      slug: ''
    }
  ];
  let metadescription = description;
  const featuredImageAlt = altDescription;
  const featuredImage = {
    url: featuredImageSrc,
    alt: featuredImageAlt,
    width: 672,
    height: 448,
    caption: 'Home page'
  };
  const ogImage = {
    url: ogImageSrc,
    alt: featuredImageAlt
  };
  const ogSquareImage = {
    url: ogSquareImageSrc,
    alt: featuredImageAlt
  };

  const twitterImage = {
    url: twitterImageSrc,
    alt: featuredImageAlt
  };
  const entityMeta = {
    url: `${siteUrl}/`,
    faviconWidth: 512,
    faviconHeight: 512,
    caption: author
  };
  const seoProps = {
    title,
    slug: '',
    entityMeta,
    datePublished: '2022-12-09T16:06:55.000Z', // ISO8601 (new Date()).toISOString()
    lastUpdated: '2022-12-09T16:06:55.000Z', // ISO8601 (new Date()).toISOString()
    breadcrumbs,
    metadescription,
    featuredImage,
    ogImage,
    ogSquareImage,
    twitterImage
  };
</script>

<SEO {...seoProps} />

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <h1>
    <span class="welcome">
      <picture>
        <source
          width={welcomeSize.width}
          height={welcomeSize.height}
          srcset={welcome}
          type="image/webp"
        />
        <img
          loading="lazy"
          decoding="async"
          width={welcomeSize.width}
          height={welcomeSize.height}
          src={welcome_fallback}
          alt="Welcome"
        />
      </picture>
    </span>

    to your new<br />SvelteKit app
  </h1>

  <h2>
    try editing <strong>src/routes/+page.svelte</strong>
  </h2>

  <Counter />
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }
</style>
