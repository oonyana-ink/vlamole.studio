// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
const path = require('path')

module.exports = {
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
    '@objekts': path.resolve(__dirname, 'src/scripts/objekts'),
    '@vendor': path.resolve(__dirname, 'src/scripts/vendor'),
    '@svgs': path.resolve(__dirname, 'src/svgs')
  },
  mount: {
    public: '/',
    src: '/dist'
    /* ... */
  },
  exclude: [
    '**/public/assets/**/*'
  ],
  plugins: [
    /* ... */
    '@snowpack/plugin-sass',
    '@snowpack/plugin-vue',
    ['snowpack-vue-svg-plugin', {
      svgo: true,
      svgoConfig: {
        plugins: [
          { name: "removeViewBox", active: false }
        ]
      }
    }]
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  routes: [
    {
      match: 'routes',
      src: '.*',
      dest: '/index.html',
    },
  ]
};
