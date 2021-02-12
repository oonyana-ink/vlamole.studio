const webpack = require('webpack')
const webpackConfig = require('./webpack.prod')

const buildCallback = function (configKey) {
  return function (err) {
    if (!err) {
      console.log(`${configKey} build done!`)
    } else {
      console.log(err)
    }
  }
}

console.log('--- Building main')
console.log(webpackConfig.main)
webpack(webpackConfig.main, buildCallback('main'))
// console.log('--- Building workers')
// webpack(webpackConfig.workers, buildCallback('workers'))
