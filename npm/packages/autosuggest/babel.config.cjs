const parentBabelConfig = require('./node_modules/@helsenorge/library-build/config/babel.config.js');

module.exports = function (api) {
  api.cache(true);

  return {
    presets: parentBabelConfig.presets,
    plugins: parentBabelConfig.plugins,
  };
};
