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

  data () {
    const arcSteps = 80
    const arcStep = (Math.PI * 0.988) / arcSteps

    return {
      arcSteps,
      arcStep,
      arcOpacity: Math.floor(255 * 0.75),
      currentProp: null,
      currentArcStart: 0,
      currentArcFrame: 0,
      currentArcStep: 0,
      minArcThickness: 20,
      maxArcThickness: 50,
      inDelay: false
      _shuffledProps: [],
    }
  }

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
    },

    shuffledProps () {
      const { _shuffledProps } = this
      if (_shuffledProps.length === 0) {
        this._shuffledProps = this.shuffleProps()
      }
      return this._shuffledProps
    },

    randomProp () {
        const prop = this.shuffledProps.pop()
        return prop
    },

    props () {
      const { clientWidth, clientHeight } = this.$refs.canvasContainer
      return [
        { number: 1, x: clientWidth * 0.29, y: clientHeight * 0.29, arcStart: Math.PI * 1.25, arcEnd: Math.PI * 1.4 },
        { number: 2, x: clientWidth * 0.71, y: clientHeight * 0.29, arcStart: Math.PI * 1.6, arcEnd: Math.PI * 1.75 },
        { number: 3, x: clientWidth * 0.71, y: clientHeight * 0.71, arcStart: Math.PI * 0.25, arcEnd: Math.PI * 0.4 },
        { number: 4, x: clientWidth * 0.29, y: clientHeight * 0.71, arcStart: Math.PI * 0.6, arcEnd: Math.PI * 0.75 },
      ]
    },

    randomArcStart () {
      const { arcStart, arcEnd } = this.currentProp
      return this.getRandomFloat(arcStart, arcEnd)
    },

    arcCircumference () {
      const { clientWidth } = this.$refs.canvasContainer
      return clientWidth * 0.4
    },

    arcColor () {
      return interpolateRgbBasis(['#ffe500', '#fb5902', '#fb5902', '#2e2e61', '#6cd0e0', '#6cd0e0'])
    }
  },

  watch: {
    isIntersecting (isIntersecting) {
      if (!isIntersecting) {
        this.removeImpactForces()
      }
    }
  },

  methods: {
    handleTrigger () {
      this.setupImpactForces()
    },

    shuffledProps () {
      const { currentProp, props } = this

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

      if (array[0].number === currentProp.number) {
        array = shuffleProps()
      }

      return array
    },

    getRandomFloat (min, max) { return Math.random() * (max - min) + min },

    setupImpactForces () {
      const { props, waveSteps, waveStep } = this
      const { canvasContainer } = this.$refs
      const { clientWidth, clientHeight } = canvasContainer
      this.currentProp = this.getRandomProp()
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

          p.strokeCap(p.SQUARE)
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
              color.setAlpha(Math.floor(255 * 0.75))
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

    forceWave () {
      if (this.currentArcStep > this.arcSteps) {
        return this.resetArc()
      }

      const {
        p5,
        arcSteps,
        arcStep,
        arcCircumference,
        arcOpacity,
        currentArcStep,
        currentArcStart,
        currentArcFrame,
        currentProp,
        minArcThickness,
        maxArcThickness
      } = this

      let stepWeight, innerCirc, stepColor

      if (currentArcFrame + arcSteps * 0.5 > arcSteps) {
        this.currentFrameStep = (currentArcFrame + arcSteps * 0.5) - arcSteps
      }

      p5.strokeCap(p5.SQUARE)
      p5.noFill()

      for (let k = 0; k < 2; k++) {
        for (let j = this.currentFrameStep; j <= Math.min(currentArcFrame, arcSteps); j++) {
          stepWeight = p5.map(j, arcSteps, 0, minArcThickness, maxArcThickness)
          innerCirc = arcCircumference - (maxArcThickness - stepWeight)
          stepColor = this.color(j / arcSteps)
          stepColor = p5.color(stepColor)
          stepColor.setAlpha(arcOpacity)

          p5.strokeWeight(stepWeight)
          p5.stroke(stepColor)
          p5.arc(
            currentProp.x,
            currentProp.y,
            innerCirc,
            innerCirc,
            currentArcStart + (j * arcStep),
            currentArcStart + ((j + 1) * arcStep)
          )
          p5.arc(
            currentProp.x,
            currentProp.y,
            innerCirc,
            innerCirc,
            currentArcStart - ((j + 1) * arcStep),
            currentArcStart - (j * arcStep)
          )
        }
      }
      this.currentArcFrame++
    },

    resetArc () {
      if (this.inDelay) { return }

      const delay = Math.floor(2000 * getRandomFloat(0.2, 1))
      setTimeout(() => {
        this.currentProp = this.randomProp
        this.currentArcStart = this.randomArcStart
        this.currentArcFrame = 0
        this.currentArcStep = 0
        this.inDelay = false
      }, delay)

      this.inDelay = true
    },

    removeImpactForces () {

    }
  }
}
</script>
