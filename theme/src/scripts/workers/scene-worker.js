/* global self */

import Scene from '@objekts/scene-objekt'
import Drone from '@objekts/drone-objekt'

const worker = self
class Worker {
  ready = false
  setQueue = []

  constructor () {
    this.setup()
  }

  setup () {
    worker.onmessage = (message) => {
      this[message.data.cmd](message.data.payload)
    }
  }

  start (opts) {
    this.scene = new Scene(opts)
    this.drone = new Drone()
    this.scene.add(this.drone)
    this.waitUntilReady()
  }

  waitUntilReady () {
    this.ready = this.scene.ready && this.drone.ready
    console.log('ready', this.ready)
    if (!this.ready) {
      setTimeout(() => { this.waitUntilReady() }, 500)
    } else {
      this.init()
    }
  }

  init () {
    this.setQueue.forEach(opts => this.set(opts))
  }

  set (opts) {
    if (this.ready) {
      opts.drone && this.drone.set(opts.drone)
      opts.scene && this.scene.set(opts.scene)
    } else {
      this.setQueue.push(opts)
    }
  }
}

export default new Worker()
