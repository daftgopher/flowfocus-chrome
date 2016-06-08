module.exports = {
  entry: {
    eventPage: "./eventPage.js",
    popup: "./popup.js"
  },
  output: {
    path: "app",
    filename: "[name].js"
  },
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