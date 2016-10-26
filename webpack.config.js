var webpack = require('webpack');

module.exports = {
  entry: {
    "handlib": "./src/index.js",
    "handlib.min": "./src/index.js",
  },
  output: {
    path: 'dist',
    filename: '[name].js',
    library: 'handlib',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json'
    }]
  },
  devtool: "source-map",
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
  ]
};
