const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = dotenv.config().parsed;

module.exports = {
  mode: 'production',
  entry: {
    popup: ['./src/popup.js', './src/popup.css'], // Adjust the path to match your popup.js file
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'openAI_API_KEY': JSON.stringify(env.openAI_API_KEY),
    }),
    new HtmlWebpackPlugin({
      template: 'src/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};