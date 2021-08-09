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
              <img
                class="marlin-symbols__symbol"
                svg-inline
                src="@svgs/marlin-nozzle.svg"
              >
              <img
                class="marlin-symbols__symbol"
                svg-inline
                src="@svgs/marlin-bed.svg"
              >
              <img
                class="marlin-symbols__symbol"
                svg-inline
                src="@svgs/marlin-fan.svg"
              >
            </div>
          </div>
        </div>
        <div class="sidebar">
          <div class="copy">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          <div class="filament-details">
            <div class="filament-details__roll">
              <img
                svg-inline
                src="@svgs/filament-spindle.svg"
              >
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
import Section from '@components/Section.vue'
import sectionMixin from '@mixins/section'

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
    Section
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
