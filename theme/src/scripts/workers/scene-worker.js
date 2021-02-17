/* global self */

import Scene from '@objekts/scene-objekt'
import Drone from '@objekts/drone-objekt'

const worker = self
class Worker {
  constructor () {
    this.setup()
  }

  setup () {
    worker.onmessage = (message) => {
      this[message.data.cmd](message.data.payload)
    }
  }

  start (opts) {
    const scene = new Scene(opts)
    const drone = new Drone()
    scene.add(drone)
  }
}

export default new Worker()
