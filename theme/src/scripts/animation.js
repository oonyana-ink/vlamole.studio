function Animation (opts = {}) {
  const { requestAnimationFrame } = window
  const queue = []

  const methods = {
    start () {
      methods.animate()
    },

    animate () {
      queue.forEach(callback => callback())
      requestAnimationFrame(methods.animate)
    },

    onFrame (callback) {
      queue.push(callback)
    }
  }

  return {
    onFrame: methods.onFrame,
    start: methods.start
  }
}

export default Animation
