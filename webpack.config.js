const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background.js',
    contentScript: './src/content.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'openAI_API_KEY': JSON.stringify(env.openAI_API_KEY),
    })
  ]
};