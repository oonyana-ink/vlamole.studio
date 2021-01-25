const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  entry: {
    hmrClient: 'webpack-hot-middleware/client',
    application: './src/scripts/index.js',
    vendor: './src/scripts/vendor/index.js',
    sceneWorker: './src/scripts/workers/scene-worker.js'
  },
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, 'assets'),
    publicPath: '/assets/'
  },
  optimization: {
    runtimeChunk: 'single'
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // MiniCssExtractPlugin.loader,
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
      },
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
      }
    ]
  },

  plugins: [
    new StylelintPlugin({}),
    new ESLintPlugin({}),
    // new MiniCssExtractPlugin({
    //   filename: 'application.bundle.css',
    //   chunkFilename: '[id].css'
    // }),
    new webpack.HotModuleReplacementPlugin()
  ],

  // devServer: {
  //   contentBase: path.join(__dirname, 'assets'),
  //   contentBasePublicPath: '/assets/',
  //   host: '0.0.0.0',
  //   port: 8989,
  //   proxy: {
  //     '!/assets/**': {
  //       target: 'https://localhost:8383',
  //       secure: false
  //     }
  //   },
  //   disableHostCheck: true,
  //   hot: true,
  //   https: true
  // }
}
