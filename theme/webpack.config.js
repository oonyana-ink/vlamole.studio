const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/scripts/index.js',
  mode: 'development',
  output: {
    filename: 'application.js',
    path: path.resolve(__dirname, 'assets')
  },

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
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ]
      }
    ]
  },

  plugins: [
    new StylelintPlugin({}),
    new ESLintPlugin({}),
    new MiniCssExtractPlugin({
      filename: 'application.css',
      chunkFilename: '[id].css'
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, 'assets'),
    host: '0.0.0.0',
    port: 8989,
    disableHostCheck: true,
    proxy: {
      '!^/assets': process.env.SHOPIFY_STORE
    }
  }
}