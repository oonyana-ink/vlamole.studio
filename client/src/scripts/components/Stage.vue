<template>
  <section
    id="stage"
    class="stage"
  >
    <canvas
      ref="primaryCanvas"
      class="primary-canvas"
    />
  </section>

  <teleport to="#section-styles">
    {{ stageStyles }}
  </teleport>
</template>

<script>
import { mapState } from 'vuex'
import { Scene } from '@/scene'
import { Drone } from '@/models'

export default {
  setup () {
    const onReadyCallbacks = []
    return { onReadyCallbacks }
  },

  computed: {
    ...mapState({
      droneState: 'drone',
      sceneState: 'scene',
      stageState: 'stage'
    }),

    stageStyles () {
      const { position } = this.stageState
      return `
        .primary-canvas {
          transform: translate(${position[0]}, ${position[1]});
        }
      `
    }
  },

  mounted () {
    this.waitForTHREE()
  },

  methods: {
    init () {
      this.scene = new Scene()
      this.drone = new Drone()
      this.scene.attachStore(this.$store, 'scene')
      this.drone.onInit(() => this.drone.attachStore(this.$store, 'drone'))
      this.scene.mount(this.$refs.primaryCanvas)
      this.scene.add(this.drone)
      this.scene.onReady(() => {
        this.onReadyCallbacks.forEach(callback => callback())
      })
    },

    onReady (callback) {
      this.onReadyCallbacks.push(callback)
    },

    waitForTHREE () {
      if (!window.THREE) {
        setTimeout(() => { this.waitForTHREE() }, 250)
      } else {
        this.init()
      }
    }
  }
  // mounted () {
  //   this.waitForTHREE()
  // },

  // methods: {
  //   init () {
  //     this.scene = new Scene({
  //       canvas: this.$refs.primaryCanvas,
  //       pixelRation: window.devicePixelRatio
  //     })
  //     this.drone = new Drone()
  //     this.scene.add(this.drone)
  //   },

  //   waitForTHREE () {
  //     if (!window.THREE) {
  //       setTimeout(() => { this.waitForTHREE() }, 250)
  //     } else {
  //       this.init()
  //     }
  //   }
  // }
}
</script>
