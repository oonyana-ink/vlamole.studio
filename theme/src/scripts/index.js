/* eslint-disable import/no-webpack-loader-syntax */

import '../styles/index.scss'
import './grid-overlay.js'

import ScrollPosition from './modules/scroll-position'
import Parallax from './modules/parallax'
import Sections from './modules/sections'
import SceneProxy from './modules/scene-proxy'
import config from './config'
import Scene from '@objekts/scene-objekt'
import Drone from '@objekts/drone-objekt'

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
    this.modules.forEach(module => module.start && module.start())
    this.scene = new Scene({
      canvas: this.sceneCanvas,
      assetsURL: config.assetsURL,
      width: this.sceneCanvas.clientWidth,
      height: this.sceneCanvas.clientHeight,
      pixelRatio: window.devicePixelRatio
    })
    this.drone = new Drone()
    this.scene.add(this.drone)

    this.sceneProxy = new SceneProxy({ scene: this.scene, drone: this.drone })
    this.waitUntilReady()
    // this.worker.postMessage({
    //   canvas: this.sceneCanvas
    // }, [this.sceneCanvas])
    // this.scene.add(this.drone)
  }

  waitUntilReady () {
    this.ready = this.scene.ready && this.drone.ready
    console.log('ready', this.ready)
    if (!this.ready) {
      setTimeout(() => { this.waitUntilReady() }, 500)
    } else {
      this.sceneProxy.init()
    }
  }

  // startSceneWorker () {
  //   const offscreenCanvas = this.sceneCanvas.transferControlToOffscreen()

  //   this.sceneWorker = new Worker(`${config.assetsURL}/scene.worker.js`, { type: 'module' })
  //   this.sceneWorker.postMessage({
  //     cmd: 'start',
  //     payload: {
  //       canvas: offscreenCanvas,
  //       assetsURL: config.assetsURL,
  //       width: this.sceneCanvas.clientWidth,
  //       height: this.sceneCanvas.clientHeight,
  //       pixelRatio: window.devicePixelRatio
  //     }
  //   }, [offscreenCanvas])
  // }

  // terminateSceneWorker () {
  //   this.sceneWorker.terminate()
  // }
}

const app = new App()
app.start()

// if (module.hot) {
//   module.hot.dispose(() => app.terminateSceneWorker())
//   module.hot.accept()
// }
