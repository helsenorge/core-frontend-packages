const parentBabelConfig = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { typescript: true, runtime: 'automatic' }],
    ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-object-rest-spread',
  ],
};

module.exports = parentBabelConfig;
