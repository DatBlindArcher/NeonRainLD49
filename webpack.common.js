const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'output.js'
  },
  resolve: {
    alias: {
        process: 'process/browser',
        stream: "stream-browserify",
        zlib: "browserify-zlib"
    },
    fallback: {
      "crypto": require.resolve('crypto-browserify')
    }
  },
  plugins: [
      new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
      }),
  ],
  module: {
    rules: [{
      test: /\.m?js$/,
      include: /(ape-ecs|\/src)/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
};