const path = require("path");

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: { main: path.resolve(__dirname, "src/main.js") },

  plugins: [
    new CopyWebpackPlugin({ patterns: [{ from: "src/index.html", to: "." }] }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
      extensions: [".js", ".jsx"]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    hot: false,
    watchContentBase: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    disableHostCheck: true,
    transportMode: {
      client: path.resolve(__dirname, "devserverclient.js"),
      server: "ws",
    },
    injectClient: false,
    injectHot: false,
    port: 9000,
  },
  output: {
    filename: "main.js",
    chunkFilename: "[name].[chunkhash:8].chunk.js",
    path: path.resolve(__dirname, "dist"),
  },
};
