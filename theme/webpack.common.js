const path = require('path')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const resolve = {
  alias: {
    '@': path.resolve(__dirname, 'src/scripts'),
    '@objekts': path.resolve(__dirname, 'src/scripts/objekts'),
    '@vendor': path.resolve(__dirname, 'src/scripts/vendor'),
    '@core': path.resolve(__dirname, 'src/scripts/core')
  }
}

const rules = {
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

const mainPlugins = [
  new StylelintPlugin({}),
  new ESLintPlugin({})
]

module.exports = {
  main: {
    resolve,
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].chunk.js',
      path: path.resolve(__dirname, 'assets'),
      publicPath: '/assets/'
    },

    module: {
      rules: [rules.babelCompiler]
    },

    plugins: mainPlugins
  },

  workers: {
    entry: {
      scene: './src/scripts/workers/scene-worker.js'
    },
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