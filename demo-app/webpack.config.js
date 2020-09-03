const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: { main: path.resolve(__dirname, 'main.js') },

   plugins: [
      new CopyWebpackPlugin({ patterns: [
        { from: './index.html', to: '.'}
       ]})
   ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: false,
    watchContentBase: true,
    headers: {'Access-Control-Allow-Origin': '*'},
    disableHostCheck: true,
    transportMode: {
      client: path.resolve(__dirname, 'devserverclient.js'),
      server: 'ws'
    },
    injectClient: true,
    injectHot: false,
    port: 9000
  },
  output: {
    filename: 'main.js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    path: path.resolve(__dirname, 'dist'),
  }
}