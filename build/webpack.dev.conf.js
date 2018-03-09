var path = require('path')
var pkg = require(path.resolve(process.cwd(), './package.json'))

var webpackConfig = {
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(process.cwd(), 'dist'),
    library: `copyNode`,
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }]
    }]
  }
}

module.exports = webpackConfig
