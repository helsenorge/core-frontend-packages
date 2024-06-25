const parentBabelConfig = require('./node_modules/@helsenorge/library-build/config/babel.config.cjs');

module.exports = function (api) {
  api.cache(true);

  return {
    presets: parentBabelConfig.presets,
    plugins: parentBabelConfig.plugins,
  };
};
