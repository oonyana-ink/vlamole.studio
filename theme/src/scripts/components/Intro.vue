<template>
  <section
    class="intro section"
    :style="sectionStyles"
  >
    <div class="grid">
      <div class="content grid__column--12">
        <div class="section__copy-block">
          <div class="section__copy paragraph">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
          <div class="timeline-toggle-container">
            <label>Timeline</label>
            <div
              class="timeline-toggle"
              :class="timelineStyle"
            >
              <div
                class="timeline-toggle__option"
                @click="updateTimeline('old-timeline')"
              >
                Past
              </div>
              <div
                class="timeline-toggle__option"
                @click="updateTimeline('new-timeline')"
              >
                Future
              </div>
            </div>
          </div>
        </div>
        <div
          class="timeline"
          :class="timelineStyle"
        >
          <div
            class="timeline__span fixed-width"
            data-index="0"
          >
            <div class="timeline__span-label">
              Day 1
            </div>
            <div
              class="timeline__point"
              data-index="0"
            >
              <label>Build</label>
            </div>
            <div
              class="timeline__point taller"
              data-index="1"
            >
              <label>Fly</label>
            </div>
            <div
              class="timeline__point"
              data-index="2"
            >
              <label>Crash</label>
            </div>
          </div>
          <div
            class="timeline__span fixed-width"
            data-index="1"
          >
            <div class="timeline__span-label">
              Day 2
            </div>
            <div
              class="timeline__point"
              data-index="3"
            >
              <label>
                <span class="strike" replace="Print">Order</span> new parts
              </label>
            </div>
          </div>
          <div
            class="timeline__span"
            data-index="2"
          >
            <div class="timeline__span-label">
              Day 3 ~ Day<em>&infin;</em>
            </div>
            <div
              class="timeline__point"
              data-index="4"
            >
              <label>
                <span class="strike">Wait</span>
              </label>
            </div>
            <div
              class="timeline__point"
              data-index="5"
            >
              <label>
                <span class="strike">Wait</span>
              </label>
            </div>
            <div
              class="timeline__point"
              data-index="6"
            >
              <label>
                <span class="strike">Wait</span>
              </label>
            </div>
            <div
              class="timeline__point"
              data-index="7"
            >
              <label>
                <span class="strike">Wait</span>
              </label>
            </div>
            <div
              class="timeline__point"
              data-index="8"
            >
              <label>
                <span class="strike">Wait</span>
              </label>
            </div>
          </div>
          <div
            class="timeline__span fixed-width"
            data-index="3"
          >
            <div class="timeline__span-label">
              <span v-if="timelineStyle === 'old-timeline'">Day<em>&infin;</em> + 1</span>
              <span v-if="timelineStyle === 'new-timeline'">Day 3</span>
            </div>
            <div
              class="timeline__point"
              data-index="9"
            >
              <label>Fix</label>
            </div>
            <div
              class="timeline__point taller"
              data-index="10"
            >
              <label>Fly</label>
            </div>
            <div
              class="timeline__point"
              data-index="11"
            >
              <label>Repeat</label>
            </div>
          </div>
          <div class="timeline__no-wait">
            Wait no more!
          </div>
        </div>
      </div>
    </div>
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="intro__background section-background"
    >
      <ScrollTrigger
        :is-active="isIntersecting"
        name="old-timeline"
        threshold="0.5"
        @trigger.once="handleTrigger"
      />
      <ScrollTrigger
        :is-active="isIntersecting"
        name="new-timeline"
        threshold="0.5"
        @trigger.once="handleTrigger"
      />
    </div>
  </teleport>
</template>

<script>
import { mapState } from 'vuex'
import sectionMixin from '@mixins/section'
import ScrollTrigger from './ScrollTrigger.vue'

export default {
  name: 'Intro',

  components: {
    ScrollTrigger
  },

  mixins: [sectionMixin],
  inject: ['grid', 'gridWidth'],

  data () {
    return {
      timelineStyle: 'hidden-timeline'
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
            position: [this.gridWidth({ cols: -4 }), window.innerHeight * 0.3, sceneDepth * 0.05],
            rotation: ['50deg', '220deg', '0deg']
          }
        }
      }
    }
  },

  methods: {
    handleTrigger (trigger) {
      console.log('TRIGGER!', trigger.name)
      this.updateTimeline(trigger.name)
    },

    updateTimeline (triggerName) {
      this.timelineStyle = triggerName
    }

  }
}
</script>
