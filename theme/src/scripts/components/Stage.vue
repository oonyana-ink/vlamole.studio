<template>
  <section
    id="stage"
    class="stage"
  >
    <Scene />
  </section>
</template>

<script>
import Scene from '@components/Scene.vue'

export default {
  components: {
    Scene
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