const { merge } = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.common')

const mainEntries = {
  hmrClient: 'webpack-hot-middleware/client',
  application: './src/scripts/index.js',
  vendor: './src/scripts/vendor/index.js'
}

module.exports = {
  main: merge(common.main, {
    entry: mainEntries,
    mode: 'development',
    optimization: {
      runtimeChunk: 'single'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }]
              ],
              plugins: ['@babel/plugin-proposal-class-properties']
            }
          }
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                url: false
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })
}
