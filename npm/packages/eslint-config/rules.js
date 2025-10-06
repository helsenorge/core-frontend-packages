export default {
  // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/recommended.ts
  '@typescript-eslint/explicit-function-return-type': 'warn',
  // https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js
  'arrow-body-style': 'off',
  'no-console': 'error',
  'prefer-arrow-callback': 'off',
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/index.js
  'react/display-name': 'warn',
  'react/jsx-no-literals': 'error',
  'react/no-danger': 'error',
  'import/no-duplicates': ['error', { 'prefer-inline': true, considerQueryString: true }],
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
  // https://typescript-eslint.io/rules/no-import-type-side-effects/
  '@typescript-eslint/no-import-type-side-effects': 'error',
};
