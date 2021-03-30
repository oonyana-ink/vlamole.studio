import grid from '../layout/grid'

export const hero = {
  els: {
    backgroundVideo: '.background-video'
  },

  scene: {
    camera: 'perspective'
  },

  drone: {
    // animation: 'float',
    // material: 'default',
    appearance: 'shaded',
    rotation: ['40deg', '140deg', '0deg'],
    position: ({ app }) => [grid.columnsWidth(3), 0, app.scene.depth * 0.15],
    size: () => [grid.columnsWidth(6)]
  },

  keyframes: {
    '0%': {
      drone: {
        rotation: ['40deg', '140deg', '360deg'],
      }
    },
    '100%': {
      drone: {
        rotation: ['40deg', '140deg', '0deg']
      }
    }
  },

  onEnter ({ $els, app }) {
    console.log('hero.onEnter')

    // app.sceneProxy.set({ scene: this.scene, drone: this.drone })
    $els.backgroundVideo.play()
  },

  onLeave ({ $els }) {
    console.log('hero:onLeave')
    $els.backgroundVideo.pause()
  }
}
