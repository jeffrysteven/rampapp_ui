const webpack = require('webpack');
const merge = require('webpack-merge');

function buildConfig(configDirs, API_URL) {
  return merge(
    Object.assign({}, require('./webpack.common.config')(configDirs)),
    {
      devServer: {
        historyApiFallback: true,
        port: 8001,
      },
      optimization: {
        minimize: false
      },
      plugins: [
        new webpack.DefinePlugin({'process.env.API_URL': `"${API_URL}"` })
      ],
    });
}

module.exports = buildConfig;
