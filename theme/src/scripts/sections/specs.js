export const specs = {
  scene: {
    camera: 'orthographic'
  },

  drone: {
    animation: null,
    material: 'edgeLines',
    position: [0, 0, 0],
    rotationDegrees: [90, 180, 0]
  },

  onEnter ({ app }) {
    app.sceneProxy.set({ scene: this.scene, drone: this.drone })
  }
}
