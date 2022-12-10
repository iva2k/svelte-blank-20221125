<script lang="ts">
  import {
    ogSquareImageSrc,
    ogImageSrc,
    twitterImageSrc,
    featuredImageSrc,
    altDescription
  } from '$lib/assets/home/index';

  import website from '$lib/config/website';
  import { VERTICAL_LINE_ENTITY } from '$lib/constants/entities';
  import OpenGraph from './OpenGraph.svelte';
  import SchemaOrg from './SchemaOrg.svelte';
  import Twitter from './Twitter.svelte';
  import { page } from '$app/stores';

  const {
    author,
    entity,
    facebookAuthorPage,
    facebookPage,
    ogLanguage,
    siteLanguage,
    siteShortTitle,
    siteTitle,
    siteUrl: siteUrlConfig,
    githubPage,
    linkedinProfile,
    telegramUsername,
    tiktokUsername,
    twitterUsername
  } = website;

  // siteUrlConfig can be empty if `website` pulls from a missing or misconfigured .env,
  // causing all sorts of troubles, including failing build (prerender stage crashing with "/undefined/").
  // Protect ourselves:
  let siteUrl;
  if ($page.url.origin === 'http://sveltekit-prerender') {
    // We are in prerender on the server
    siteUrl = siteUrlConfig;
  } else {
    siteUrl = siteUrlConfig || $page.url.origin || '/';
  }
  // console.log('DEBUG: origin=%o, $page.url.origin=%o, siteUrlConfig=%o, siteUrl=%o, $page.url.pathname=%o', origin, $page.url.origin, siteUrlConfig, siteUrl, $page.url.pathname);
  console.log(
    'DEBUG: process.env.PUBLIC_SITE_URL=%o, $page.url.origin=%o, siteUrlConfig=%o, siteUrl=%o, $page.url.pathname=%o',
    process.env.PUBLIC_SITE_URL,
    $page.url.origin,
    siteUrlConfig,
    siteUrl,
    $page.url.pathname
  );

  export let article = false;
  export let breadcrumbs: { name: string; slug: string }[] = [];
  export let entityMeta: {
    url: string;
    faviconWidth: number;
    faviconHeight: number;
    caption?: string;
  } | null = null;
  export let lastUpdated: string;
  export let datePublished: string;
  export let metadescription: string;
  export let slug: string;
  export let timeToRead = 0;
  export let title: string;

  // imported props with fallback defaults
  export let featuredImage = {
    url: featuredImageSrc,
    alt: altDescription,
    width: 672,
    height: 448,
    caption: 'Home page'
  };
  export let ogImage = {
    url: ogImageSrc,
    alt: altDescription
  };
  export let ogSquareImage = {
    url: ogSquareImageSrc,
    alt: altDescription
  };
  export let twitterImage = {
    url: twitterImageSrc,
    alt: altDescription
  };

  const pageTitle = `${siteTitle} ${VERTICAL_LINE_ENTITY} ${title}`;
  const canonicalUrl = siteUrl ? (slug ? `${siteUrl}/${slug}` : siteUrl) : '/';
  const openGraphProps = {
    article,
    datePublished,
    lastUpdated,
    image: ogImage,
    squareImage: ogSquareImage,
    metadescription,
    ogLanguage,
    pageTitle,
    siteTitle,
    url: canonicalUrl,
    ...(article ? { datePublished, lastUpdated, facebookPage, facebookAuthorPage } : {})
  };
  const schemaOrgProps = {
    article,
    author,
    breadcrumbs,
    datePublished,
    entity,
    lastUpdated,
    entityMeta,
    featuredImage,
    metadescription,
    siteLanguage,
    siteTitle,
    siteTitleAlt: siteShortTitle,
    siteUrl,
    title: pageTitle,
    url: canonicalUrl,
    facebookPage,
    githubPage,
    linkedinProfile,
    telegramUsername,
    tiktokUsername,
    twitterUsername
  };
  const twitterProps = {
    article,
    author,
    twitterUsername,
    image: twitterImage,
    timeToRead,
    doOgOverride: false
  };
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={metadescription} />
  <meta
    name="robots"
    content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
  />
  {#if canonicalUrl}
    <link rel="canonical" href={canonicalUrl} />
  {/if}

  {#if process.env.VERCEL}
    <meta name="google-site-verification" content="BXO06YUfaqiMbQ-FgBPqQAgWB7giDX-pLEDSz89vUng" />
  {/if}
</svelte:head>

<Twitter {...twitterProps} />
<OpenGraph {...openGraphProps} />
<SchemaOrg {...schemaOrgProps} />
