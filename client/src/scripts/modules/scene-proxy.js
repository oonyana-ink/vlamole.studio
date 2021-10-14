export default class SceneProxy {
  ready = false
  setQueue = []

  constructor (opts) {
    const {
      scene,
      drone
    } = opts

    this.scene = scene
    this.drone = drone
  }

  set (opts) {
    if (this.ready) {
      opts.drone && this.drone.set(opts.drone)
      opts.scene && this.scene.set(opts.scene)
    } else {
      this.setQueue.push(opts)
    }
  }

  init () {
    this.ready = true
    this.setQueue.forEach(opts => this.set(opts))
  }
}
