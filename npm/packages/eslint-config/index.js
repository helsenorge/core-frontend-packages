// @ts-check

import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
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
    files: defaultFiles,
    settings: {
      react: {
        version: 'detect',
      },
    },
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat['jsx-runtime'],
  },
  {
    files: defaultFiles,
    extends: [js.configs.recommended, tseslint.configs.recommended, 'react-hooks/recommended'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    rules: {
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
  // https://github.com/prettier/eslint-config-prettier
  eslintConfigPrettier,
];

export default defineConfig([...configs, globalIgnores(defaultIgnores)]);
