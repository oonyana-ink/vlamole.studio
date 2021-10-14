<template>
  <Section
    name="print"
    ref="section"
    :config="config"
    :scrollLabel="scrollLabel"
  >
    <div class="grid">
      <div class="content grid__column--12">
        <div class="title">
          <h1>PRINT</h1>
          <h3>It Yourself</h3>
          <div class="print-head">
            <div class="filament" />
          </div>
          <div class="marlin-symbols">
            <div class="marlin-symbols__left">
              <SVG class="marlin-symbols__symbol" svg="marlin-nozzle" />
              <SVG class="marlin-symbols__symbol" svg="marlin-bed" />
              <SVG class="marlin-symbols__symbol" svg="marlin-nozzle" />
            </div>
          </div>
        </div>
        <div class="sidebar">
          <div class="copy scrollblock">
            <p>
              <b>The Bateleur.</b> A fully 3D printable cinewhoop frame, designed to be simple to print and tough to break.
            </p>
            <p>
              <b>Choose your material.</b>
              If you like to print in PLA, go for it. Want the core to be stronger and comfortable with carbon infused filaments? You are in luck!
              Want to print the propguards in the ultra tough Nylon or ABS? Be our guest. Whatever the material or combination of materials, you are free
              to explore and experiment.
            </p>
            <p>
              <b>Choose your material.</b>
              If you like to print in PLA, go for it. Want the core to be stronger and comfortable with carbon infused filaments? You are in luck!
              Want to print the propguards in the ultra tough Nylon or ABS? Be our guest. Whatever the material or combination of materials, you are free
              to explore and experiment.
            </p>
          </div>

          <div class="filament-details">
            <div class="filament-details__roll">
              <SVG svg="filament-spindle" />
            </div>
            <div
              class="filament-details__swatches"
              :aux-index="droneColor.aux.activeIndex"
              :core-index="droneColor.core.activeIndex"
            >
              <div
                v-for="color in filamentColor.colors"
                :key="color"
                class="color-swatch"
                :style="`background-color: ${color}`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-slot:background>
      <div class="build-plate-grid" />
    </template>

    <teleport to="#section-styles">
      .print {
        --filament-color: {{ filamentColor.current }};
      }
    </teleport>
  </Section>
</template>

<script>
import { interpolate } from 'd3-interpolate'
import { mapState, mapMutations } from 'vuex'

import sectionMixin from '@mixins/section'
import Section from '@components/Section.vue'
import SVG from '@components/SVG.vue'


const FILAMENT_COLORS = [
  '#220e7c',
  '#00a297',
  '#f1a133',
  '#f3662b',
  '#ff1a70'
]

export default {
  name: 'Print',
  components: {
    Section,
    SVG
  },
  mixins: [sectionMixin],

  data () {
    return {
      scrollLabel: ['Print It', 'Yourself'],
      fadeColors: false,
      filamentColor: {
        activeIndex: 0,
        fromIndex: 0,
        toIndex: 1,
        current: '#6cd0e0',
        colors: FILAMENT_COLORS
      },
      fadeStep: 0,
      maxFadeSteps: 100,
      droneColor: {
        targets: ['aux', 'core'],
        targetIndex: 0,
        aux: {
          fromIndex: 0,
          toIndex: 0,
          activeIndex: 0,
          firstFade: true
        },
        core: {
          fromIndex: 0,
          toIndex: 0,
          activeIndex: 0,
          firstFade: true
        }
      }
    }
  },

  computed: {
    ...mapState({
      droneColors: state => state.drone.baseColors
    }),
    config () {
      return {
        stage: {
          default: {
            position: ['-14.7vw', '0vh']
          }
        },
        drone: {
          default: {
            appearance: 'shaded',
            rotation: ['0deg', '540deg', '180deg'],
            position: [0, window.innerHeight * -0.25, 0],
            float: 0
          }
        }
      }
    }
  },

  watch: {
    isIntersecting (isIntersecting) {
      if (isIntersecting) {
        this.fadeColors = true
        this.fadeFilamentColors()
      } else {
        this.fadeColors = false
      }
    }
  },

  methods: {
    ...mapMutations({
      droneApplyColors: 'drone/applyColors'
    }),

    fadeFilamentColors () {
      const {
        filamentColor,
        fadeStep,
        maxFadeSteps,
        droneColor
      } = this
      const fadeRatio = fadeStep / maxFadeSteps
      const droneColorTargetKey = droneColor.targets[droneColor.targetIndex]
      const droneColorTarget = droneColor[droneColorTargetKey]

      filamentColor.current = interpolate(
        FILAMENT_COLORS[filamentColor.fromIndex],
        FILAMENT_COLORS[filamentColor.toIndex]
      )(fadeRatio)

      droneColorTarget.activeIndex = fadeRatio >= 0.4 ? filamentColor.toIndex : droneColorTarget.fromIndex

      const droneFromColor = droneColorTarget.firstFade ? this.droneColors[droneColorTargetKey] : FILAMENT_COLORS[droneColorTarget.fromIndex]
      this.droneApplyColors({
          [droneColorTargetKey]: interpolate(
            droneFromColor,
            FILAMENT_COLORS[filamentColor.toIndex]
          )(fadeRatio)
      })

      this.fadeStep += 1
      if (this.fadeStep > maxFadeSteps) {
        this.setColorIndexes()
        this.fadeStep = 0
        if (this.fadeColors) {
          setTimeout(() => this.fadeFilamentColors(), 3000)
        }
      } else {
        requestAnimationFrame(() => this.fadeFilamentColors())
      }
    },

    setColorIndexes () {
      const {
        droneColor,
        filamentColor
      } = this

      droneColor[droneColor.targets[droneColor.targetIndex]].firstFade = false
      filamentColor.fromIndex = filamentColor.toIndex

      filamentColor.toIndex = this.randomIndex(FILAMENT_COLORS.length, filamentColor.toIndex)
      droneColor.targetIndex = this.randomIndex(droneColor.targets.length, droneColor.targetIndex)

      const droneColorTarget  = droneColor[droneColor.targets[droneColor.targetIndex]]
      droneColorTarget.fromIndex = droneColorTarget.toIndex
      droneColorTarget.toIndex = filamentColor.toIndex
    },

    randomIndex (arrayLength, currentIndex) {
      let randomIndex = currentIndex
      while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * arrayLength)
      }
      return randomIndex
    }
  }
}
</script>
