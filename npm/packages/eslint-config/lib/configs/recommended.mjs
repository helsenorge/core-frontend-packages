import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactAccessibility from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import globals from 'globals';

import helsenorgeRules from '../rules.cjs';

const allJsExtensions = 'js,mjs,cjs,ts,mts,cts,jsx,tsx,mtsx,mjsx';
export const supportedFileTypes = `**/*{${allJsExtensions}}`;
export const testFiles = ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'];

const config = [
  'eslint:recommended',
  {
    files: [supportedFileTypes],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react: reactPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { modules: true, jsx: true },
        jsxPragma: null, // useful for typescript x react@17 https://github.com/jsx-eslint/eslint-plugin-react/blob/8cf47a8ac2242ee00ea36eac4b6ae51956ba4411/index.js#L165-L179
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...typescriptPlugin.configs['eslint-recommended'].overrides[0].rules,
      ...typescriptPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...helsenorgeRules,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  {
    files: testFiles,
    plugins: {
      'testing-library': testingLibraryPlugin,
    },
    rules: {
      ...testingLibraryPlugin.configs.react.rules,
    },
  },
  {
    files: [supportedFileTypes],
    ignores: testFiles,
    plugins: {
      'jsx-a11y': reactAccessibility,
    },
    rules: reactAccessibility.configs.recommended.rules,
  },
  prettierConfig,
];

export default config;
