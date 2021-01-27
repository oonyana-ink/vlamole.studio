const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const mode = 'development'
const resolve = {
  alias: {
    '@objekts': path.resolve(__dirname, 'src/scripts/objekts'),
    '@vendor': path.resolve(__dirname, 'src/scripts/vendor'),
  }
}

const rules = {
  sassCompiler: {
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
  babelCompiler: {
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
}

module.exports = {
  main: {
    entry: {
      hmrClient: 'webpack-hot-middleware/client',
      application: './src/scripts/index.js',
      vendor: './src/scripts/vendor/index.js'
    },
    mode,
    resolve,
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
      rules: [rules.sassCompiler, rules.babelCompiler]
    },

    plugins: [
      new StylelintPlugin({}),
      new ESLintPlugin({}),
      // new MiniCssExtractPlugin({
      //   filename: 'application.bundle.css',
      //   chunkFilename: '[id].css'
      // }),
      new webpack.HotModuleReplacementPlugin()
    ]
  },

  workers: {
    entry: {
      scene: './src/scripts/workers/scene-worker.js'
    },
    mode,
    resolve,
    devtool: false,
    output: {
      filename: '[name].worker.js',
      path: path.resolve(__dirname, 'assets'),
      publicPath: '/assets/'
    },

    module: {
      rules: [rules.babelCompiler]
    },

    plugins: [
      new ESLintPlugin({})
    ]
  }
}