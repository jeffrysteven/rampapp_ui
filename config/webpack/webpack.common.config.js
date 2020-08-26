const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function buildConfig(configDirs) {
  return {
    entry: {
      index: ["@babel/polyfill", configDirs.APP_DIR + '/index.jsx'],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.css']
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]__[hash:base64:5]'
                },
                sourceMap: true,
                importLoaders: 1,
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: ['/node _modules/']
        },
      ]
    },
    /*externals : {
      react: 'react',
      reactDom: 'react-dom'
    },*/
    plugins: [
      new MiniCssExtractPlugin({
        filename: "index.css",
        chunkFilename: "index.css"
      }),
      new HtmlWebpackPlugin({
        template: configDirs.APP_DIR + '/index.html'
      }),
    ],
  };
}

module.exports = buildConfig;
