const merge = require('webpack-merge');

function buildConfig(configDirs) {
  return merge(
    Object.assign({}, require('./webpack.common.config')(configDirs)),
    {
      output: {
        path: configDirs.BUILD_DIR,
        filename: './bundle.js',
        publicPath: './'
      },
      optimization: {
        minimize: true
      },
    });
}

module.exports = buildConfig;
