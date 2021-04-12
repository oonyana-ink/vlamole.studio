const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const common = require('./webpack.common')

const mainEntries = {
  application: './src/scripts/index.js',
  vendor: './src/scripts/vendor/index.js'
}

const configs = {
  main: merge(common.main, {
    entry: mainEntries,
    mode: 'development',
    devtool: 'source-map',

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
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
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css'
      })
    ]
  })
}

module.exports = configs[process.env.TARGET]
