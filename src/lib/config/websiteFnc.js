/** Use this file to get site-wide settings:
 * import websiteFnc from '$lib/config/websiteFnc.js';
 * import { env } from '$env/static/public';
 * const { author, ogLanguage, siteLanguage, siteTitle, siteTitleAlt } = websiteFnc(env);
 */

// Do not use this file in `vite.config.js`, instead use "./websiteAsync.js".
// For regular modules, it is easier to use "./website.js".

const websiteFnc = (
  // /** @type {Record<string, string> | undefined} */
  /** @type {Record<string, string>} */
  env
) => {
  const { PUBLIC_SITE_URL, VERCEL, NETLIFY } = env ?? {};

  const entity = 'IVA2K';
  const author = 'iva2k';
  const ogLanguage = 'en_US';
  const siteLanguage = 'en-US';
  const siteTitle = 'Total App - SvelteKit template';
  const siteShortTitle = 'Total App';
  const description = 'Total App - starter application template built with SvelteKit.';
  const themeColor = '#000000';
  const backgroundColor = '#ffffff';
  const contactEmail = 'iva2k@yahoo.com';
  const facebookPageName = 'iva2k';
  const facebookAuthorPageName = 'iva2k';
  const githubPage = 'iva2k';
  const linkedinProfile = 'iva2k';
  const telegramUsername = 'iva2k';
  const tiktokUsername = '@iva2k';
  const twitterUsername = 'iva2k';
  const twitterUserId = '1234567890';
  const wireUsername = '@iva2k';
  const githubRepo = 'https://github.com/iva2k/svelte-blank-20221125';
  const websiteUrlBase = 'https://svelte-blank-20221125.iva2k.com';
  const websiteUrlNetlify = 'https://svelte-blank-20221125.netlify.app';
  const websiteUrlVercel = 'https://svelte-blank-20221125.vercel.app';
  const websiteUrl = NETLIFY ? websiteUrlNetlify : VERCEL ? websiteUrlVercel : websiteUrlBase;

  const googleSiteVerificationNetlify = '';
  const googleSiteVerificationVercel = 'BXO06YUfaqiMbQ-FgBPqQAgWB7giDX-pLEDSz89vUng';

  const website = {
    siteUrl: PUBLIC_SITE_URL,
    isNetlify: NETLIFY,
    isVercel: VERCEL,

    entity,
    author,
    ogLanguage,
    siteLanguage,
    siteTitle,
    siteShortTitle,
    description,
    themeColor,
    backgroundColor,
    contactEmail,
    facebookAuthorPageName,
    facebookPageName,
    githubPage,
    linkedinProfile,
    telegramUsername,
    tiktokUsername,
    twitterUsername,
    twitterUserId,
    wireUsername,
    googleSiteVerificationNetlify,
    googleSiteVerificationVercel,
    githubRepo,
    websiteUrlBase,
    websiteUrl
  };
  console.log('DEBUG websiteFnc.js website=%o, env=%o', website, env);
  return website;
};
export { websiteFnc as default };
