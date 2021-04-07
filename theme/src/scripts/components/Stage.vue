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
      sceneState: 'scene'
    })
  },

  mounted () {
    this.waitForTHREE()
  },

  methods: {
    init () {
      this.scene = new Scene()
      this.drone = new Drone()
      this.scene.attachStore(this.sceneState)
      this.drone.onInit(() => this.drone.attachStore(this.droneState))
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
