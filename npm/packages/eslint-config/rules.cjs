module.exports = {
  'react/no-danger': 'error',
  'prettier/prettier': 'error',
  'arrow-body-style': 'off',
  'prefer-arrow-callback': 'off',
  '@typescript-eslint/ban-types': 'warn',
  '@typescript-eslint/explicit-function-return-type': 'warn',
  '@typescript-eslint/no-empty-interface': 'warn',
  '@typescript-eslint/no-explicit-any': 'error',
  'react/jsx-no-literals': 'error',
  'react/display-name': 'warn',
  'react/jsx-uses-react': 'off',
  'react/react-in-jsx-scope': 'off',
  'no-console': 'error',
  'no-debugger': 'error',
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
};
