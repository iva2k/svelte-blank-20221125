module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:storybook/recommended',
    'prettier'
  ],
  plugins: ['svelte3', '@typescript-eslint', 'import'],
  ignorePatterns: ['*.cjs'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  settings: {
    'import/resolver': {
      typescript: {}
    },
    'svelte3/typescript': () => require('typescript')
  },
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.lint.json'],
    tsconfigRootDir: './',
    sourceType: 'module',
    ecmaVersion: 2022,
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  rules: {
    'import/no-mutable-exports': 'off'
  }
};
