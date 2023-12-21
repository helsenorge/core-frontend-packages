module.exports = {
  extends: 'stylelint-config-standard-scss',
  rules: {
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
