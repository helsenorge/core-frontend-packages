module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'import'],
  rules: {
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 1,
    '@typescript-eslint/no-empty-interface': 1,
    '@typescript-eslint/no-explicit-any': 2,
    'react/jsx-no-literals': 2,
    'no-console': 2,
    'no-debugger': 2,
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'type', 'internal', ['parent', 'sibling'], 'index'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'HNResources',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'HNEntities/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'types/**',
            group: 'type',
          },
          {
            pattern: '../types/**',
            group: 'type',
          },
          {
            pattern: '../../types/**',
            group: 'type',
          },
          {
            pattern: '../../../types/**',
            group: 'type',
          },
          {
            pattern: '../../../../types/**',
            group: 'type',
          },
          {
            pattern: '../../../../../types/**',
            group: 'type',
          },
          {
            pattern: '../../../../../../types/**',
            group: 'type',
          },
          {
            pattern: '../../../../../../../types/**',
            group: 'type',
          },
          {
            pattern: '../../../../../../../../types/**',
            group: 'type',
          },
          {
            pattern: '../../../../../../../../../types/**',
            group: 'type',
          },
          {
            pattern: '../../../../../../../../../../types/**',
            group: 'type',
          },
          {
            pattern: '@helsenorge/designsystem-react/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@helsenorge/toolkit/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@helsenorge/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: './*.scss',
            group: 'sibling',
            position: 'after',
          },
          {
            pattern: './*.css',
            group: 'sibling',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
