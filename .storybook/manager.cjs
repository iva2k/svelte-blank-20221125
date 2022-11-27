import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import yourTheme from './YourTheme.cjs';

addons.setConfig({
  // theme: themes.dark
  theme: yourTheme
});
