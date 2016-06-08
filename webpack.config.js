module.exports = {
  entry: {
    a: "./eventPage.js",
    b: "./popup.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].entry.js"
  }
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js/,
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        },
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ],
  },
  resolve: {
    extensions: ['', '.js']
  }
}