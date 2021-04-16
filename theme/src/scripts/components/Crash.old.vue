<template>
  <section
    ref="section"
    class="crash section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
    <div class="content">
      <div
        ref="canvasContainer"
        class="impact-forces"
      />
    </div>
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="crash__background section-background"
      :style="sectionBackgroundStyles"
    >
      <ScrollTrigger
        :is-active="isIntersecting"
        name="scroll-trigger"
        threshold="0.5"
        @trigger="handleTrigger"
      />
    </div>
  </teleport>
</template>

<script>
import { interpolateRgbBasis } from 'd3-interpolate'
import sectionMixin from '@mixins/section'
import P5 from 'p5'
import ScrollTrigger from './ScrollTrigger.vue'

export default {
  name: 'Crash',
  components: {
    ScrollTrigger
  },
  mixins: [sectionMixin],

  computed: {
    config () {
      return {
        stage: {
          drone: {
            rotation: ['0deg', '90deg', '90deg'],
            position: [0, 0, 0]
          }
        }
      }
    }
  },

  watch: {
    isIntersecting (isIntersecting) {
      if (isIntersecting) {
        this.setupImpactForces()
      } else {
        this.removeImpactForces()
      }
    }
  },

  methods: {
    handleTrigger () {

    },
    setupImpactForces () {
      const { canvasContainer } = this.$refs
      const { clientWidth, clientHeight } = canvasContainer
      const steps = 80
      const PIStep = (Math.PI * 0.988) / steps
      const props = [
        {number: 1, x: clientWidth * 0.29, y: clientWidth * 0.29, arcStart: Math.PI * 1.25, arcEnd: Math.PI * 1.4},
        {number: 2, x: clientWidth * 0.71, y: clientWidth * 0.29, arcStart: Math.PI * 1.6, arcEnd: Math.PI * 1.75},
        {number: 3, x: clientWidth * 0.71, y: clientWidth * 0.71, arcStart: Math.PI * 0.25, arcEnd: Math.PI * 0.4},
        {number: 4, x: clientWidth * 0.29, y: clientWidth * 0.71, arcStart: Math.PI * 0.6, arcEnd: Math.PI * 0.75},
      ]
      const arcX = clientWidth * 0.71
      const arcY = clientHeight * 0.29
      const arcW = clientWidth * 0.4
      let lastPropNumber = 0
      const getRandomProp = () => {
        const prop = shuffledProps.pop()
        if (shuffledProps.length === 0) {
          lastPropNumber = prop.number
          shuffledProps = shuffleProps()
        }
        return prop
      }
      const getRandomFloat = (min, max) => Math.random() * (max - min) + min
      const getRandomStart = ({ arcStart, arcEnd }) =>  getRandomFloat(arcStart, arcEnd)
      const shuffleProps = () => {
        let array = props.map(prop => prop)
        let currentIndex = array.length
        let temporaryValue, randomIndex

        while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex)
          currentIndex -= 1

          temporaryValue = array[currentIndex]
          array[currentIndex] = array[randomIndex]
          array[randomIndex] = temporaryValue
        }
        console.log(array[0].number, lastPropNumber)
        if (array[0].number === lastPropNumber) {
          array = shuffleProps()
        }
        return array
      }
      const colorInterpolator = interpolateRgbBasis(['#ffe500', '#fb5902', '#fb5902', '#2e2e61', '#6cd0e0', '#6cd0e0'])
      let shuffledProps = shuffleProps()
      let currentProp = getRandomProp()
      let currentStart = getRandomStart(currentProp)
      // let arcStart = Math.PI

      let i = 0
      if (window.p) { window.p.remove() }
      let jStart = 0
      let inDelay = false

      this.p5 = new P5((p) => {
        p.setup = () => {
          p.pixelDensity(3)
          p.resizeCanvas(clientWidth, clientHeight)
          window.p = p
        }


        p.draw = () => {
          if (jStart > steps) {
            if (!inDelay) {
              const delay = Math.floor(2000 * getRandomFloat(0.2, 1))
              setTimeout(() => {
                currentProp = getRandomProp()
                currentStart = getRandomStart(currentProp)
                i = 0
                jStart = 0
                inDelay = false
              }, delay)
              inDelay = true
            }
            return
          }

          p.clear()
          p.noFill()

          // p.strokeCap(p.SQUARE)
          const arcStart = currentStart
          let strokeWeight
          let circ
          let color
          if (i + steps * 0.5 > steps) {
            jStart = (i + steps * 0.5) - steps
          }
          for (let k = 0; k < 2; k++) {
            for (let j = jStart; j <= Math.min(i, steps); j++) {
              strokeWeight = p.map(j, steps, 0, 20, 50)
              circ = arcW - (40 - strokeWeight)
              color = colorInterpolator(j / steps)
              color = p.color(color)
              color.setAlpha(Math.floor(255 * 0.25))
              // color.setAlpha(p.map(j, jStart, i, 0, Math.floor(((steps - jStart) / steps) * 255)))
              p.strokeWeight(strokeWeight)
              p.stroke(color)
              p.arc(currentProp.x, currentProp.y, circ, circ, arcStart + (j * PIStep), arcStart + ((j + 1) * PIStep))
              p.arc(currentProp.x, currentProp.y, circ, circ, arcStart - ((j + 1) * PIStep), arcStart - (j * PIStep))
            }

            i++
          }
        }
      }, canvasContainer)
    },

    removeImpactForces () {

    }
  }
}
</script>
