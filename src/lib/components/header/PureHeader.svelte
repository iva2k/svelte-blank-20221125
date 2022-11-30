<script lang="ts">
  import logo from '$lib/images/svelte-logo.svg';

  export let pathname = '/';
</script>

<header>
  <div class="corner corner-left">
    <a href="https://kit.svelte.dev">
      <img src={logo} alt="SvelteKit" />
    </a>
  </div>

  <nav>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <ul>
      <li aria-current={pathname === '/' ? 'page' : undefined}>
        <a href="/">Home</a>
      </li>
      <li aria-current={pathname === '/about' ? 'page' : undefined}>
        <a href="/about">About</a>
      </li>
      <li aria-current={pathname.startsWith('/sverdle') ? 'page' : undefined}>
        <a href="/sverdle">Sverdle</a>
      </li>
      <li aria-current={pathname === '/geolocation' ? 'page' : undefined}>
        <a href="/geolocation">Geolocation</a>
      </li>
      <li aria-current={pathname === '/qrscanner' ? 'page' : undefined}>
        <a href="/qrscanner">QR Scanner</a>
      </li>
    </ul>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
    </svg>
  </nav>

  <div class="corner corner-right">
    <slot />
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }

  .corner-left {
    width: var(--corner-left-width, '3em');
    height: 3em;
  }
  .corner-right {
    width: var(--corner-right-width, '3em');
    height: 3em;
  }

  .corner a,
  .corner :global(a) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .corner img,
  .corner :global(img) {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  nav {
    display: flex;
    justify-content: center;
    --background: rgba(255, 255, 255, 0.7);
  }

  svg {
    width: 2em;
    height: 3em;
    display: block;
  }

  path {
    fill: var(--background);
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li[aria-current='page']::before {
    --size: 6px;
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color-theme-1);
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover,
  a:focus,
  .corner :global(a:hover),
  .corner :global(a:focus) {
    color: var(--color-theme-1);
  }
</style>
