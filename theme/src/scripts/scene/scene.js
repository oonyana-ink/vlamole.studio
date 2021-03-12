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

  configs = {
    scalar: 2,
    renderer: {
      alpha: true,
      antialias: true
    }
  }

  frame = 0

  __models = []

  constructor ({
    $el,
    canvas
  }) {
    this.$el = $el
    this.canvas = canvas
    this.configs.renderer.canvas = canvas

    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer(this.configs.renderer)
    this.cameras = new Cameras({ scene: this })
    this.renderer.setSize(this.width, this.height)

    this._calcDepth()

    this.lights = new Lights({ scene: this })
    this.activeCamera.position.z = this.pxDepth

    this.render()
  }

  get pxDepth () {
    return this._depth / this.scalar
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

  render () {
    this.frame += 1
    this.renderer.render(this.scene, this.activeCamera)
    this.__models.forEach(model => model._update(this.frame))
    requestAnimationFrame(() => this.render())
  }

  add (model) {
    model.scene = this
    this.__models.push(model)
    console.log('Scene:add', model, model.isLoading)
    if (model.isLoading) {
      model.onLoad(() => {
        this.scene.add(model.model)
      })
    } else {
      this.scene.add(model.model)
    }

    this.render()
  }

  addLight (light) {
    this.scene.add(light)
  }

  _calcDepth () {
    this._depth = utils.findScreenDepth(this.activeCamera, this.renderer)
  }
}
