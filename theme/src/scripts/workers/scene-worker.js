/* global self */
import Scene from '../modules/scene'

let scene
console.log('hello from worker')
self.onMessage = function (message) {
  const data = message.data

  scene = new Scene({
    canvas: data.canvas
  })

  console.log(scene)
}

module.hot && module.hot.accept()
