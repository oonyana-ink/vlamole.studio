<template>
  <Section
    name="crash"
    ref="section"
    :config="config"
    :scrollLabel="scrollLabel"
  >
    <div class="content">
      <div class="content-container">
        <div class="section__sidebar">
          <div class="panel" />
          <div class="panel" />
          <div class="panel" />
        </div>
        <div class="section__copy">
          <div class="title">
            <label>Impact Handling</label>
            <h2>
              Absolute<br>
              Armour
            </h2>
          </div>
          <p>
            Designed to house all of the delicate bits inside itself. Your flight stack, receiver, RX antennas,
            VTX cable, camera, and battery cable are all tucked snuggly inside the belly of this beast.
            <br><br>
            And on the outside?...well...the outside of the frame is an exoskeleton designed to dissipate, and absorb, impact forces,
            while ensuring that import structual parts are saved from the brunt of the crash forces. In the end your drone
            should be able to stay in the air crash after crash after crash.
          </p>
        </div>
      </div>
    </div>

    <template v-slot:foreground>
      <div
        ref="canvasContainer"
        class="impact-forces"
      />
    </template>

    <template v-slot:background>
      <ScrollTrigger
        :is-active="isIntersecting"
        name="scroll-trigger"
        threshold="0.75"
        @trigger="handleTrigger"
      />
    </template>
  </Section>
</template>

<script>
import { easeCubicOut, easeCubicIn } from 'd3-ease'
import { interpolateRgbBasis } from 'd3-interpolate'
import Section from '@components/Section.vue'
import sectionMixin from '@mixins/section'
import P5 from 'p5'
import ScrollTrigger from '@components/ScrollTrigger.vue'

export default {
  name: 'Crash',
  components: {
    ScrollTrigger,
    Section
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
      inDelay: false,
      particleSize: 60,
      particleLifespan: 40,
      shuffledProps: [],
      impactParticles: [],
      impactTrajectory: {},
      scrollLabel: ['Impact', 'Handling']
    }
  },

  computed: {
    config () {
      return {
        stage: {
          default: {
            position: ['22vw', '0vh']
          }
        },
        drone: {
          default: {
            rotation: ['0deg', '630deg', '-90deg'],
            position: [0, 0, 0]
          }
        }
      }
    },

    props () {
      const { clientWidth, clientHeight } = this.$refs.canvasContainer
      const propOffset = 0.33
      return [
        { number: 1, x: clientWidth * propOffset, y: clientHeight * propOffset, arcStart: Math.PI * 1.1, arcEnd: Math.PI * 1.6 },
        { number: 2, x: clientWidth * (1 - propOffset), y: clientHeight * propOffset, arcStart: Math.PI * 1.4, arcEnd: Math.PI * 1.9 },
        { number: 3, x: clientWidth * (1 - propOffset), y: clientHeight * (1 - propOffset), arcStart: Math.PI * 0.1, arcEnd: Math.PI * 0.6 },
        { number: 4, x: clientWidth * propOffset, y: clientHeight * (1 - propOffset), arcStart: Math.PI * 0.4, arcEnd: Math.PI * 0.9 },
      ]
    },

    randomArcStart () {
      const { arcStart, arcEnd } = this.currentProp
      return this.getRandomFloat(arcStart, arcEnd)
    },

    arcDiameter () {
      const { clientWidth } = this.$refs.canvasContainer
      return clientWidth * 0.32
    },

    arcRadius () {
      return this.arcDiameter * 0.5
    },

    arcColor () {
      return interpolateRgbBasis(['#ffe500', '#fb5902', '#fb5902', '#2e2e61', '#6cd0e0', '#6cd0e0'])
    },

    particleColor () {
      return interpolateRgbBasis(['#6cd0e0', '#2e2e61'])
      // return interpolateRgbBasis(['#ffe500', '#fb5902', '#bd0c2a'])
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
      console.log('handleTrigger')
      this.setupImpactForces()
    },

    getRandomProp () {
      if (this.shuffledProps.length === 0) {
        this.shuffledProps = this.shuffleProps()
      }

      const prop = this.shuffledProps.pop()
      return prop
    },

    shuffleProps () {
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

      if (currentProp && array[0].number === currentProp.number) {
        array = this.shuffleProps()
      }

      return array
    },

    getRandomFloat (min, max) { return Math.random() * (max - min) + min },

    setupImpactForces () {
      const { canvasContainer } = this.$refs
      const { clientWidth, clientHeight } = canvasContainer

      this.p5 = new P5((p) => {
        p.setup = () => {
          p.pixelDensity(3)
          p.resizeCanvas(clientWidth, clientHeight)
          this.shuffleProps()
        }

        p.draw = () => {
          p.clear()
          if (!this.currentProp || this.currentArcStep > this.arcSteps) {
            return this.reset()
          }

          if (!this.impactTrajectory.hasCompleted) {
            this.drawImpactTrajectory()
          }

          if (this.impactTrajectory.hasImpacted) {
            this.drawImpactParticles()
            this.drawForceWave()
          }
        }
      }, canvasContainer)
    },

    generateImpactTrajectory () {
      const {
        currentArcStart,
        currentProp,
        arcRadius
      } = this
      const travelDistance = arcRadius
      const position = (distance) => ({
        x: Math.cos(currentArcStart) * (arcRadius + (travelDistance - distance)) + currentProp.x,
        y: Math.sin(currentArcStart) * (arcRadius + (travelDistance - distance)) + currentProp.y
      })

      this.impactTrajectory = {
        distanceTravelled: 0,
        hasImpacted: false,
        travelSpeed: 15,
        travelDistance,
        position
      }
    },

    drawImpactTrajectory () {
      const {
        p5,
        currentArcStart
      } = this

      const {
        travelDistance,
        distanceTravelled,
        position,
        travelSpeed
      } = this.impactTrajectory


      if (distanceTravelled >= travelDistance) {
        this.impactTrajectory.hasImpacted = true
        return
      }

      const side = 100
      const halfSide = side / 2
      const centerY = Math.tan(30 * Math.PI / 180) * halfSide
      const midLine = Math.tan(60 * Math.PI / 180) * halfSide
      const pos = position(distanceTravelled)
      const progress = distanceTravelled / travelDistance
      const color = p5.color(this.arcColor(1 - progress))
      color.setAlpha(255 * easeCubicIn(progress))

      p5.push()
      p5.noStroke()
      // p5.fill('#fb5902')
      p5.fill(color)
      p5.translate(pos.x, pos.y)
      p5.rotate(currentArcStart - Math.PI)
      p5.triangle(
        -centerY, -halfSide,
        midLine - centerY, 0,
        -centerY, halfSide
      )
      p5.pop()

      this.impactTrajectory.distanceTravelled = distanceTravelled + travelSpeed
    },

    drawForceWave () {
      const {
        p5,
        arcSteps,
        arcStep,
        arcDiameter,
        arcOpacity,
        currentArcStart,
        currentArcFrame,
        currentProp,
        minArcThickness,
        maxArcThickness
      } = this

      let stepWeight, innerCirc, stepColor

      if (this.currentArcFrame + arcSteps * 0.5 > arcSteps) {
        this.currentArcStep = (currentArcFrame + arcSteps * 0.5) - arcSteps
      }

      p5.strokeCap(p5.SQUARE)
      p5.noFill()

      for (let k = 0; k < 3; k++) {
        for (let j = this.currentArcStep; j <= Math.min(this.currentArcFrame, arcSteps); j++) {
          stepWeight = p5.map(j, arcSteps, 0, minArcThickness, maxArcThickness)
          innerCirc = arcDiameter - (maxArcThickness - stepWeight)
          stepColor = this.arcColor(j / arcSteps)
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

        this.currentArcFrame++
      }
    },

    generateImpactParticles () {
      const {
        p5,
        currentArcStart,
        currentProp,
        arcRadius,
        particleSize,
        particleLifespan
      } = this

      const particleCount = 5
      let vel, pos, acc, velMag
      let rotationDir = 1
      for (let i = 0; i < particleCount; i++) {
        pos = p5.createVector(
          (arcRadius * Math.cos(currentArcStart)) + currentProp.x,
          (arcRadius * Math.sin(currentArcStart)) + currentProp.y
        )
        vel = pos.copy()
        vel.setHeading(p5.map(
          i,
          0,
          particleCount - 1,
          (currentArcStart - Math.PI * 0.5) + this.getRandomFloat(Math.PI * -0.1, Math.PI * 0.1),
          (currentArcStart + Math.PI * 0.5) + this.getRandomFloat(Math.PI * -0.1, Math.PI * 0.1)
        ))
        velMag = 5
        vel.setMag(velMag)
        acc = vel.copy()
        acc.setMag(1)
        rotationDir = rotationDir * -1

        this.impactParticles.push({
          velMag: velMag,
          pos,
          vel,
          acc,
          rotationDir,
          lifeSpan: particleLifespan,
          rotation: 0,
          trianglePoints: [
            this.getRandomFloat(particleSize * -0.5, particleSize * 0.5),
            this.getRandomFloat(particleSize * -0.1, particleSize * -0.5),
            this.getRandomFloat(particleSize * -0.5, particleSize * -0.1),
            this.getRandomFloat(particleSize * 0.1, particleSize * 0.5),
            this.getRandomFloat(particleSize * 0.1, particleSize * 0.5),
            this.getRandomFloat(particleSize * 0.1, particleSize * 0.5)
          ]
        })
      }
    },

    drawImpactParticles () {
      const {
        p5,
        particleSize,
        particleLifespan
      } = this

      const deadParticleIndexes = []

      this.impactParticles.forEach((particle, index) => {
        p5.push()
        const linearProgress = particle.lifeSpan / particleLifespan
        const progress = easeCubicOut(linearProgress)
        let color = this.particleColor(1 - linearProgress)
        color = p5.color(color)
        // color.setAlpha(255 * progress)
        p5.noStroke()
        p5.fill(color)
        // particle.vel.add(particle.acc)
        particle.pos.add(particle.vel)
        particle.vel.setMag(particle.velMag * progress)
        p5.translate(particle.pos.x + particleSize * 0.5, particle.pos.y + particleSize * 0.5)
        p5.rotate(particle.rotation * particle.rotationDir)
        p5.scale(progress)
        p5.triangle.apply(p5, particle.trianglePoints)
        particle.lifeSpan -= 1
        particle.rotation += Math.PI * 0.05

        if (particle.lifeSpan <= 0) {
          deadParticleIndexes.push(index)
        }
        p5.pop()
      })

      deadParticleIndexes.forEach(index => this.impactParticles.splice(index, 1))
    },

    reset () {
      if (this.inDelay) { return }

      const delay = Math.floor(1000 * this.getRandomFloat(0.2, 1))
      setTimeout(() => {
        this.currentProp = this.getRandomProp()
        this.currentArcStart = this.randomArcStart
        this.currentArcFrame = 0
        this.currentArcStep = 0
        this.inDelay = false
        this.impactParticles = []
        this.generateImpactTrajectory()
        this.generateImpactParticles()
      }, delay)

      this.inDelay = true
    },

    removeImpactForces () {
      if (this.p5) {
        this.p5.remove()
        this.reset()
      }
    }
  }
}
</script>
