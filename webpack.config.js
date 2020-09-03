const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: { main: path.resolve(__dirname, 'src/idp', 'main.js') },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: [ ['@babel/preset-env', { targets: { chrome: "66", firefox: "67", ios: "11", safari: "13" } }] ] }
        }
      },
    ]
  },
  resolve: {
    aliasFields: ['browser'],
  },
  plugins: [
      new CopyWebpackPlugin({ patterns: [
        { from: './node_modules/@ampproject/worker-dom/dist/amp/worker/worker.mjs', to: './v0.idp-framework.eth/domworker.mjs' },
        { from: './node_modules/@ampproject/worker-dom/dist/amp/worker/worker.js', to: './v0.idp-framework.eth/domworker.js' },
        { from: './src/idp/sw.js', to: './sw.js' },
        { from: './src/static', to: '.'}
      ]})
  ],

  output: {
    filename: 'v0.idp-framework.eth/main.js',
    chunkFilename: 'v0.idp-framework.eth/[name].[chunkhash:8].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
}