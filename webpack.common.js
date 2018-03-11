const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    background: './background.js',
    popup: './popup.js'
  },
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        query: {
          presets: [
            'es2015',
            'react'
          ]
        }
      },
      // Stylesheet loading is handled differently depending on environment
      // see configs in webpack.dev.js and webpack.prod.js for style loaders
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          },
          {
            loader: 'react-svg-loader',
            query: {
              jsx: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      Actions: path.resolve(__dirname, 'actions'),
      Components: path.resolve(__dirname, 'Components'),
      Images: path.resolve(__dirname, 'images'),
      Reducers: path.resolve(__dirname, 'reducers'),
      Stylesheets: path.resolve(__dirname, 'stylesheets'),
      Util: path.resolve(__dirname, 'util')

    },
    extensions: ['.js', 'jsx', '.css', '.scss']
  },
  plugins: [
    new HtmlWebpackPlugin({
      excludeChunks: ['background'],
      filename: 'popup.html',
      inject: 'head',
      template: 'popup.html'
    })
  ]
};
