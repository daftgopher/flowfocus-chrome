var path = require('path');

module.exports = {
  entry: {
    background: './background.js',
    popup: './popup.js'
  },
  output: {
    path: 'app',
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
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
            }
          },
          'sass-loader'
        ]
      },
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
  }
};
