import '../src/routes/styles.css';
// import { themes } from '@storybook/theming';
import yourTheme from './YourTheme.cjs';

export const parameters = {
  // for '@storybook/theming':
  docs: {
    // theme: themes.dark
    theme: yourTheme
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  // for 'storybook-addon-themes':
  themes: {
    default: 'twitter',
    list: [
      { name: 'twitter', class: 'theme-twt', color: '#00aced' },
      { name: 'facebook', class: 'theme-fb', color: '#3b5998' }
    ]
  }
};
