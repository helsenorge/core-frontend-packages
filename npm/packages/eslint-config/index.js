// @ts-check

import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import rules from './rules.js';

export const defaultFiles = ['**/*.[jt]s?(x)'];
export const defaultIgnores = ['**/dist/**', '**/lib/**', '**/public/**', '**/build/**', '**/coverage/**'];
export const testFiles = ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'];

export const configs = [
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: defaultFiles,
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...rules,
    },
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

export default defineConfig([...configs, globalIgnores(defaultIgnores)]);
