import Cameras from './cameras'
import Lights from './lights'
import utils from '../utils'

export class Scene {
  $el = null
  canvas = null

  scene = null
  renderer = null
  cameras = null
  lights = null

  state = {
    store: null
  }

  configs = {
    scalar: 2,
    renderer: {
      alpha: true,
      antialias: true
    }
  }

  frame = 0

  _models = []
  readyCallbacks = []

  constructor () {
    this.scene = new THREE.Scene()
  }

  get pxDepth () {
    return this._depth / this.scalar
  }

  get depth () {
    return this._depth
  }

  get scalar () {
    return this.configs.scalar
  }

  get width () {
    return this.canvas.clientWidth
  }

  get height () {
    return this.canvas.clientHeight
  }

  get activeCamera () {
    return this.cameras.activeCamera
  }

  mount (canvas) {
    this.canvas = canvas
    this.configs.renderer.canvas = canvas
    this.renderer = new THREE.WebGLRenderer(this.configs.renderer)
    this.cameras = new Cameras({ scene: this })
    this.renderer.setSize(this.width, this.height)

    this._calcDepth()

    this.lights = new Lights({ scene: this })
    this.activeCamera.position.z = this.pxDepth
  }

  attachStore (store) {
    this.state.store = store
  }

  render () {
    this.frame += 1
    this.renderer.render(this.scene, this.activeCamera)
    this._models.forEach(model => model._update(this.frame))
    requestAnimationFrame(() => this.render())
  }

  add (model) {
    model.scene = this
    this._models.push(model)
    if (model.isLoading) {
      model.onLoad(() => {
        this.scene.add(model.model)
        this.checkIfReady()
      })
    } else {
      this.scene.add(model.model)
      this.checkIfReady()
    }
  }

  checkIfReady () {
    const isReady = this._models.filter(model => model.isLoading).length === 0
    if (isReady) {
      this.ready()
    }
  }

  ready () {
    this.render()
    while (this.readyCallbacks.length > 0) {
      const readyCallback = this.readyCallbacks.shift()
      readyCallback(this)
    }
  }

  onReady (callback) {
    this.readyCallbacks.push(callback)
  }

  addLight (light) {
    this.scene.add(light)
  }

  _calcDepth () {
    this._depth = utils.findScreenDepth(this.activeCamera, this.renderer)
    this.state.store.depth = this._depth
  }

  fog (renderFog) {
    const { position } = this.cameras.activeCamera
    const drone = this._models.find(model => model.name === 'Drone')
    const { height } = drone.boundingBox
    const droneHeight = height / this.scalar
    if (!this.scene.fog && renderFog) {
      this.scene.fog = new THREE.Fog(0x2e2e61, position.z - droneHeight / 2, position.z + droneHeight * 0.3)
    } else if (this.scene.fog && !renderFog) {
      this.scene.fog = null
    }
  }
}
