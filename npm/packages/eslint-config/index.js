// @ts-check

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import testingLibrary from 'eslint-plugin-testing-library';
import tseslint from 'typescript-eslint';

import rules from './rules.js';

export const defaultFiles = ['**/*.[jt]s?(x)'];
export const testFiles = ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'];

export const configs = [
  // https://typescript-eslint.io/getting-started/
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // React
  {
    files: defaultFiles,
    // https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#configuration-new-eslintconfigjs
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: defaultFiles,
    ...reactPlugin.configs.flat['jsx-runtime'],
  },
  // Helsenorge custom config
  {
    files: defaultFiles,
    plugins: { import: importPlugin },
    rules,
  },
  // Tests
  {
    files: testFiles,
    // https://github.com/testing-library/eslint-plugin-testing-library?tab=readme-ov-file#react
    ...testingLibrary.configs['flat/react'],
  },
  // Accessibility
  {
    files: defaultFiles,
    ignores: testFiles,
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y?tab=readme-ov-file#usage---flat-config-eslintconfigjs
    ...jsxA11y.flatConfigs.recommended,
  },
  // https://typescript-eslint.io/users/what-about-formatting/#suggested-usage---prettier
  prettierConfig,
];

export default tseslint.config(...configs);
