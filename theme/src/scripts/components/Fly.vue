<template>
  <section
    ref="section"
    class="fly section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
    <div class="grid">
      <div class="content grid__column--12">
        <div class="section__copy">
          <h2 class="">Smooth flying</h2>
          <p class="fly">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div class="blackbox-sim">
          <label class="title">Simulated Gyro Noise</label>
          <div
            ref="canvasContainer"
            class="canvas-container"
          />
          <label class="key">
            <span class="dark-blue">Pitch</span>
            <span class="blue">Roll</span>
            <span class="orange">Yaw</span>
          </label>
        </div>
      </div>
    </div>
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="fly__background section-background"
      :style="sectionBackgroundStyles"
    >
      <div class="fly__background-title">
        Fly
      </div>
    </div>
  </teleport>
</template>

<script>
import { mapState } from 'vuex'
import sectionMixin from '@mixins/section'
import P5 from 'p5'

export default {
  name: 'Fly',
  mixins: [sectionMixin],

  data () {
    return {
      scrollLabel: ['Flight', 'Dynamics']
    }
  },

  computed: {
    ...mapState({
      droneState: 'drone',
      sceneState: 'scene'
    }),

    config () {
      const { depth: sceneDepth } = this.sceneState
      return {
        stage: {
          drone: {
            appearance: 'shaded',
            rotation: ['0deg', '540deg', '0deg'],
            position: [0, window.innerHeight * -0.25, sceneDepth * 0.3]
          }
        }
      }
    }
  },

  watch: {
    isIntersecting (isIntersecting) {
      if (isIntersecting) {
        this.setupSimulator()
      } else {
        this.removeSimulator()
      }
    }
  },

  methods: {
    setupSimulator () {
      const { canvasContainer } = this.$refs
      const { clientWidth, clientHeight } = canvasContainer
      const noiseHeight = 50
      const pointSize = 4
      const inc = 0.1
      let frame = 0
      let xOffset = 0
      let start = 0

      this.p5 = new P5((p) => {
        p.setup = () => {
          p.resizeCanvas(clientWidth, clientHeight)
        }

        p.draw = () => {
          frame += 1
          if (frame % 2 !== 1) { return }
          if (!this.isIntersecting) { return }
          let x, y
          p.clear()
          p.noStroke()
          p.fill('#2e2e61')
          xOffset = start
          for (x = pointSize; x < clientWidth; x += pointSize * 2) {
            y = Math.round(clientHeight / 2 + p.noise(xOffset) * noiseHeight)
            p.ellipse(x, y, pointSize, pointSize)
            xOffset += inc
          }

          p.fill('#6cd0e0')
          xOffset = start + clientWidth * 0.25
          for (x = pointSize; x < clientWidth; x += pointSize * 2) {
            y = Math.round(clientHeight / 2 + p.noise(xOffset) * noiseHeight)
            p.ellipse(x, y, pointSize, pointSize)
            xOffset += inc
          }

          p.fill('#fb5902')
          xOffset = start + clientWidth
          for (x = pointSize; x < clientWidth; x += pointSize * 2) {
            y = Math.round(clientHeight / 2 + p.noise(xOffset) * noiseHeight)
            p.ellipse(x, y, pointSize, pointSize)
            xOffset += inc
          }
          start += inc * 0.2
        }
      }, canvasContainer)
    },

    removeSimulator () {
      this.p5 && this.p5.remove()
    }
  }
}
</script>
