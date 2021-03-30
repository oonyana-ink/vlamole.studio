<template>
  <canvas ref="primaryCanvas" />
</template>

<script>
import { Scene } from '@/scene'
import { Drone } from '@/models'
export default {
  setup () {

  },

  mounted () {
    this.waitForTHREE()
  },

  methods: {
    init () {
      this.scene = new Scene({
        canvas: this.$refs.primaryCanvas,
        pixelRation: window.devicePixelRatio
      })
      this.drone = new Drone()
      this.scene.add(this.drone)
    },

    waitForTHREE () {
      if (!window.THREE) {
        setTimeout(() => { this.waitForTHREE() }, 250)
      } else {
        this.init()
      }
    }
  }
}
</script>
