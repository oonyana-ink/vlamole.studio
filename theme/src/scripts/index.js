import '../styles/index.scss'
import './grid-overlay.js'

/* global Worker */
import ScrollPosition from './modules/scroll-position'
import Parallax from './modules/parallax'

console.log('ping!xx!')
class App {

  modules = []
  test = 'ping'
  constructor () {
    // this.scene = new Scene({ app: this, $el: document.getElementById('shopify-section-drone') })
    // this.drone = new Drone({ app: this })
    this.sceneCanvas = document.querySelector('.scene-canvas')
    this.scrollPosition = new ScrollPosition({ app: this })
    this.parallax = new Parallax({ app: this })

    // this.worker = new Worker(`${assetsURL}/sceneWorker.js`, { type: 'module' })

    this.modules = [
      // this.scene,
      // this.drone,
      this.scrollPosition,
      this.parallax
    ]
  }

  start () {
    this.modules.forEach(module => module.start && module.start())
    // this.worker.postMessage({
    //   canvas: this.sceneCanvas
    // }, [this.sceneCanvas])
    // this.scene.add(this.drone)
  }
}

console.log('ping!!xx')
const app = new App()
app.start()
console.log(app)

module.hot && module.hot.accept()
