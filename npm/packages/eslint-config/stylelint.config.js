import { fileURLToPath } from 'node:url';

const tokensDir = fileURLToPath(new URL('.', import.meta.resolve('@helsenorge/designsystem-react/scss/supernova/styles/colors.css')));

/** @type {import('stylelint').Config} */
export default {
  extends: 'stylelint-config-standard-scss',
  referenceFiles: `${tokensDir}*.css`,
  rules: {
    // @todo V41 Endre til error
    'no-unknown-custom-properties': [true, { severity: 'warning' }],
    'selector-class-pattern': null,
    'function-name-case': [
      'lower',
      {
        ignoreFunctions: ['getSpacer'],
      },
    ],
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['4xs', '3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
      },
    ],
  },
};
