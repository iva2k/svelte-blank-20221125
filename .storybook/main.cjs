const preprocess = require('svelte-preprocess');
const path = require('path');

module.exports = {
  // webpackFinal: async (config) => {
  //   // config.module.rules.push({
  //   //   test: [/\.stories\.js$/, /index\.js$/],
  //   //   use: [require.resolve('@storybook/source-loader')],
  //   //   include: [path.resolve(__dirname, '../src')],
  //   //   enforce: 'pre'
  //   // });
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     // $app: path.resolve('./.svelte-kit/dev/runtime/app')
  //     $lib: path.resolve(__dirname, '../src/lib')
  //     // $components: path.resolve(__dirname, '../src/lib/components')
  //   };
  //   return config;
  // },
  async viteFinal(config, { configType }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      // $app: path.resolve('./.svelte-kit/dev/runtime/app')
      $lib: path.resolve(__dirname, '../src/lib')
      // $components: path.resolve(__dirname, '../src/lib/components')
    };
    return config;
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-svelte-csf',
    '@storybook/addon-a11y',
    'storybook-addon-themes'
  ],
  framework: '@storybook/svelte',
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true
  },
  svelteOptions: {
    preprocess: preprocess()
  },
  features: {
    // storyStoreV7: false // Disable on-demand stories loading. Not loading any stories in storybook v6.5.3. Still broken in 6.5.13.
    storyStoreV7: true // Enable on-demand stories loading. Not loading .stories.svelte in storybook v6.5.3
  }
};
