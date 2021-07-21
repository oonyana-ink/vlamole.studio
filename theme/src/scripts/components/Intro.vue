<template>
  <section
    class="intro section"
    :style="sectionStyles"
  >
    <div class="grid">
      <div class="content grid__column--12">
        <div class="section__copy-block">
          <div class="section__copy title">
            <label>The Past v. The Future</label>
            <h1>
              From<br>forever<br>to now
            </h1>
          </div>
          <div class="section__copy paragraph">
            The wait for new parts after a fatal crash can be the worst. Maybe you were just about to nail that trick,
            or make that gap, and bam! Out of action for what feels like forever. And while you wait for the post man
            to do his many hand-offs and checks and paperwork and what-nots, you somehow have to keep your eagerness to
            feel the freedom of flight in check.
            <br><br>
            If only there was a way that you could reduce that wait time. Maybe a way that you could, I don't know, make
            your own parts? That should shrink the wait time from weeks to hours...right?
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
import config from '@/config'
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
      timelineStyle: 'hidden-timeline',
      scrollLabel: ['The Past',  'vs.',  'The Future']
    }
  },

  computed: {
    ...mapState({
      droneState: 'drone',
      sceneState: 'scene'
    }),

    assetsURL () {
      return config.assetsURL
    },

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
      this.updateTimeline(trigger.name)
    },

    updateTimeline (triggerName) {
      this.timelineStyle = triggerName
    }

  }
}
</script>
