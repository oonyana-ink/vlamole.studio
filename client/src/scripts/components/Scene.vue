<template>
  <canvas ref="primaryCanvas" />
</template>

<script>
import { mapState } from 'vuex'
import { Scene } from '@/scene'
import { Drone } from '@/models'
export default {
  setup () {

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
      this.scene = new Scene({
        canvas: this.$refs.primaryCanvas,
        pixelRation: window.devicePixelRatio,
        storeState: this.sceneState
      })
      this.drone = new Drone(null, {
        storeState: this.droneState
      })
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
