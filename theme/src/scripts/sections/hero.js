export const hero = {
  els: {
    backgroundVideo: '.background-video'
  },

  scene: {
    camera: 'perspective'
  },

  drone: {
    animation: 'float',
    material: 'default',
    position: [window.innerWidth * 0.2, 0, 0],
    scalePx: window.innerWidth * 0.35,
    rotationDegrees: [40, -40, 0]
  },

  onEnter ({ $els, app }) {
    // app.sceneProxy.set({ scene: this.scene, drone: this.drone })
    $els.backgroundVideo.play()
  },

  onLeave (section) {
    const {
      $els
    } = section

    $els.backgroundVideo.pause()
  }
}
