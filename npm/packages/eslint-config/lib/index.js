const rules = require('./rules.cjs');

module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'import', 'testing-library', 'jsx-a11y', 'prettier'],
  rules,
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      // Skru på testing-library/react sine regler, men bare i tester.
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
    // Skru på jsx-a11y sine regler, men ikke i tester.
    {
      files: ['*.[jt]s?(x)'],
      excludedFiles: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:jsx-a11y/recommended'],
    },
  ],
};
