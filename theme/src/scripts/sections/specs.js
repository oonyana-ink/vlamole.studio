export const specs = {
  scene: {
    camera: 'orthographic'
  },

  drone: {
    animation: null,
    material: 'edgeLines',
    position: [window.innerWidth * -0.25, 0, 0],
    rotationDegrees: [90, 180, 0],
    scale: [1.4]
  },

  onEnter ({ app }) {
    // app.sceneProxy.set({ scene: this.scene, drone: this.drone })
  }
}
