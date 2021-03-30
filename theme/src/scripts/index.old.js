/* eslint-disable import/no-webpack-loader-syntax */

import '../styles/index.scss'
import './grid-overlay.js'

import ScrollPosition from './modules/scroll-position'
import Parallax from './modules/parallax'
import Sections from './modules/sections'
import { Scene } from './scene'
import { Drone } from './models'

class App {
  modules = []
  test = 'ping!'
  models = {
    drone: null,
    wireframe: null
  }

  get scroll () {
    return this.scrollPosition
  }

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

    this.waitForTHREE()
  }

  init () {
    this.scene = new Scene({
      canvas: this.sceneCanvas,
      pixelRatio: window.devicePixelRatio
    })
    this.scene.onReady(this.start.bind(this))
    this.drone = new Drone()
    this.scene.add(this.drone)
  }

  start () {
    console.log('START!')
    this.modules.forEach(module => module.start && module.start())
    // this.wireframe = new Drone({ wireframe: true })

    // this.scene.load(this.drone)
    // this.scene.load(this.wireframe)

    // this.sceneProxy = new SceneProxy({ scene: this.scene, drone: this.drone })
    // this.waitUntilReady()
    // this.worker.postMessage({
    //   canvas: this.sceneCanvas
    // }, [this.sceneCanvas])
    // this.scene.add(this.drone)
  }

  // waitUntilReady () {
  //   this.ready = this.scene.ready && this.drone.ready
  //   console.log('ready', this.ready)
  //   if (!this.ready) {
  //     setTimeout(() => { this.waitUntilReady() }, 500)
  //   } else {
  //     this.sceneProxy.init()
  //   }
  // }

  waitForTHREE () {
    if (!window.THREE) {
      setTimeout(() => { this.waitForTHREE() }, 250)
    } else {
      this.init()
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

export const app = new App()

// if (module.hot) {
//   module.hot.dispose(() => app.terminateSceneWorker())
//   module.hot.accept()
// }
