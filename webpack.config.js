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
      }
    ]
  },
  resolve: {
    alias: {
      Actions: path.resolve(__dirname, 'actions'),
      Util: path.resolve(__dirname, 'util'),
      Reducers: path.resolve(__dirname, 'reducers'),
      Components: path.resolve(__dirname, 'Components'),
      Stylesheets: path.resolve(__dirname, 'stylesheets')
    },
    extensions: ['.js', 'jsx', '.css', '.scss']
  }
};
