// There are errors in many online sources that give wrong information about prerender and ssr.

// Let SvelteKit decide to prerender for each page by default:
// export const prerender = 'auto';
export const prerender = true;
// As of @sveltejs/kit 1.0.0-next.563, pages with actions (e.g. sub-routes) throw error in `vite build`.
// Each such route should set prerender = false if needed in `src/routes/**/+page.ts`.

// Setting ssr = false (which is recommended for SPA in docs) breaks all server-side routes
// (generated pages have no content, therefore SPA does not load).
// We let SvelteKit render all routes on server, so deep links will still work:
export const ssr = true;
