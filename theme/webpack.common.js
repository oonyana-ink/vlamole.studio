const path = require('path')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const resolve = {
  alias: {
    '@': path.resolve(__dirname, 'src/scripts'),
    '@styles': path.resolve(__dirname, 'src/styles'),
    '@core': path.resolve(__dirname, 'src/scripts/core'),
    '@components': path.resolve(__dirname, 'src/scripts/components'),
    '@composables': path.resolve(__dirname, 'src/scripts/composables'),
    '@modules': path.resolve(__dirname, 'src/scripts/modules'),
    '@mixins': path.resolve(__dirname, 'src/scripts/mixins'),
    '@sections': path.resolve(__dirname, 'src/scripts/sections'),
    '@utils': path.resolve(__dirname, 'src/scripts/utils'),
    '@svgs': path.resolve(__dirname, 'src/svgs')
  }
}

const rules = {
  vueCompiler: {
    test: /\.vue$/,
    use: [
      { loader: 'vue-loader' },
      { loader: 'vue-svg-inline-loader' }
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

const mainPlugins = [
  new StylelintPlugin({}),
  new ESLintPlugin({}),
  new VueLoaderPlugin()
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
      rules: [
        rules.vueCompiler,
        rules.babelCompiler
      ]
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
