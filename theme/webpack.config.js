const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const mode = process.env.MODE || 'development'
const resolve = {
  alias: {
    '@': path.resolve(__dirname, 'src/scripts'),
    '@objekts': path.resolve(__dirname, 'src/scripts/objekts'),
    '@vendor': path.resolve(__dirname, 'src/scripts/vendor'),
    '@core': path.resolve(__dirname, 'src/scripts/core')
  }
}

const rules = {
  sassCompiler: {
    test: /\.s[ac]ss$/i,
    use: [
      (mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader'),
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

const mainEntries = {
  hmrClient: 'webpack-hot-middleware/client',
  application: './src/scripts/index.js',
  vendor: './src/scripts/vendor/index.js'
}

const mainPlugins = [
  new StylelintPlugin({}),
  new ESLintPlugin({})
]

if (mode === 'production') {
  delete mainEntries.hmrClient
  mainPlugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    })
  )
} else {
  mainPlugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}


module.exports = {
  main: {
    entry: mainEntries,
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

    plugins: mainPlugins
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