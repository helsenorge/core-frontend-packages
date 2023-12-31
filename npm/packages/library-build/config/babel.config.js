const browserslistFromPackageJson = require('./../package.json').browserslist;

const parentBabelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          browsers: browserslistFromPackageJson,
        },
        useBuiltIns: 'usage',
        corejs: 3,
        loose: true,
      },
    ],
    ['@babel/preset-react', { typescript: true }],
    ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-object-rest-spread',
  ],
};

module.exports = parentBabelConfig;
