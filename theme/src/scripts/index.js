/* global Worker */
/* eslint-disable import/no-webpack-loader-syntax */

import '../styles/index.scss'
import './grid-overlay.js'

import ScrollPosition from './modules/scroll-position'
import Parallax from './modules/parallax'
import Sections from './modules/sections'
import config from './config'

class App {
  modules = []
  test = 'ping!'

  constructor () {
    this.sceneCanvas = document.querySelector('.scene-canvas')
    this.scrollPosition = new ScrollPosition({ app: this })
    this.parallax = new Parallax({ app: this })
    this.pageSections = new Sections({ app: this })

    this.modules = [
      this.scrollPosition,
      this.parallax,
      this.pageSections
    ]
  }

  start () {
    this.startSceneWorker()
    this.modules.forEach(module => module.start && module.start())
    // this.worker.postMessage({
    //   canvas: this.sceneCanvas
    // }, [this.sceneCanvas])
    // this.scene.add(this.drone)
  }

  startSceneWorker () {
    const offscreenCanvas = this.sceneCanvas.transferControlToOffscreen()

    this.worker = new Worker(`${config.assetsURL}/scene.worker.js`, { type: 'module' })
    this.worker.onmessage = (msg) => console.log('worker msg:', msg)
    this.worker.onmessageerror = (err) => console.log('worker msg err:', err)

    this.worker.postMessage({
      cmd: 'start',
      payload: {
        canvas: offscreenCanvas,
        assetsURL: config.assetsURL,
        width: this.sceneCanvas.clientWidth,
        height: this.sceneCanvas.clientHeight,
        pixelRatio: window.devicePixelRatio
      }
    }, [offscreenCanvas])
  }

  terminateSceneWorker () {
    this.worker.terminate()
  }
}

const app = new App()
app.start()

if (module.hot) {
  module.hot.dispose(() => app.terminateSceneWorker())
  module.hot.accept()
}
