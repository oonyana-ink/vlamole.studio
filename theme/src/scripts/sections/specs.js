import grid from '../layout/grid'

export const specs = {
  scene: {
    camera: 'orthographic'
  },

  drone: {
    appearance: 'wireframe',
    position: [0, 0, 0],
    rotation: ['90deg', '360deg', '0deg']
  },

  onEnter ({ app }) {
    // app.sceneProxy.set({ scene: this.scene, drone: this.drone })
  }
}
