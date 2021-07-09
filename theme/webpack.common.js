const path = require('path')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const RemovePlugin = require('remove-files-webpack-plugin')

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
  new RemovePlugin({
    before: {
      test: [
        {
          folder: 'assets',
          method: (path) => {
            return /(bundle|chunk)\.(j|cs)s(\.map)?$/.test(path)
          }
        }
      ]
    },
    watch: {
      test: [
        {
          folder: 'assets',
          method: (path) => {
            return /(bundle|chunk)\.(j|cs)s(\.map)?$/.test(path)
          }
        }
      ]
    }
  }),
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
      publicPath: '/assets/',
      clean: {
        keep (asset) {
          return !/bundle\.js(\.map)?$/.test(asset)
        }
      }
    },

    module: {
      rules: [
        rules.vueCompiler,
        rules.babelCompiler
      ]
    },

    plugins: mainPlugins
  }
}
