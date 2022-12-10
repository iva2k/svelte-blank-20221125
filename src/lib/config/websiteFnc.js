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
  const {
    PUBLIC_CONTACT_EMAIL,
    PUBLIC_FACEBOOK_AUTHOR_PAGE,
    PUBLIC_FACEBOOK_PAGE,
    PUBLIC_GITHUB_PAGE,
    PUBLIC_LINKEDIN_PROFILE,
    PUBLIC_SITE_URL,
    PUBLIC_TELEGRAM_USERNAME,
    PUBLIC_TIKTOK_USERNAME,
    PUBLIC_TWITTER_USERNAME,
    PUBLIC_TWITTER_USER_ID,
    PUBLIC_WIRE_USERNAME
  } = env ?? {};

  const facebookPageName = PUBLIC_FACEBOOK_PAGE;
  const facebookAuthorPageName = PUBLIC_FACEBOOK_AUTHOR_PAGE;

  const website = {
    author: 'iva2k',
    ogLanguage: 'en_US',
    siteLanguage: 'en-US',
    siteTitle: 'Total App SvelteKit',
    siteShortTitle: 'Total App',
    description: 'My Awesome App description',
    themeColor: '#000000',
    backgroundColor: '#ffffff',

    siteUrl: PUBLIC_SITE_URL,
    contactEmail: PUBLIC_CONTACT_EMAIL,
    facebookAuthorPage: `https://www.facebook.com/${facebookAuthorPageName}`,
    facebookAuthorPageName,
    facebookPage: `https://www.facebook.com/${facebookPageName}`,
    facebookPageName,
    githubPage: PUBLIC_GITHUB_PAGE,
    linkedinProfile: PUBLIC_LINKEDIN_PROFILE,
    telegramUsername: PUBLIC_TELEGRAM_USERNAME,
    tiktokUsername: PUBLIC_TIKTOK_USERNAME,
    twitterUsername: PUBLIC_TWITTER_USERNAME,
    twitterUserId: PUBLIC_TWITTER_USER_ID,
    wireUsername: PUBLIC_WIRE_USERNAME
  };
  return website;
};
export { websiteFnc as default };
