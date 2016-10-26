var webpack = require('webpack');

module.exports = {
  entry: './src/index',
  output: {
    path: 'dist',
    filename: 'handlib.js',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json'
    }]
  },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: false,
  //     },
  //     output: {
  //       comments: false,
  //     },
  //   }),
  // ]
};
