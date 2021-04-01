<template>
  <section
    ref="section"
    class="hero section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
    <div class='grid'>
      <div class='content grid__column--10 grid__column--offset-1'>
        <div class='title'>
          <span class='top'>BATE</span><br/><span class='bottom'>LEUR</span>
          <div class="subtitle" parallax='2'>
            THE IMMORTAL WHOOP FRAME
          </div>
        </div>
      </div>
    </div>
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="hero__background section-background"
      :style="sectionBackgroundStyles"
    >
      <video
        class="background-video"
        playsinline
        autoplay
        muted
        loop
      >
        <source
          src="/assets/clouds-bg.mp4"
          type="video/mp4"
        >
      </video>
    </div>
  </teleport>
</template>

<script>
import { inject, watch } from 'vue'
import sectionMixin from '@mixins/section'
import { hero as heroSection } from '@sections/hero'
import { mapState } from 'vuex'

export default {
  name: 'Hero',
  mixins: [sectionMixin],
  inject: ['grid', 'gridWidth'],

  data () {
    return {
      gridColWidth: 0
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
            rotation: ['40deg', '140deg', '0deg'],
            position: [this.gridWidth({ cols: 3 }), 0, 0],
            size: [this.gridWidth({ cols: 6 })]
          }
        }
      }
    }
  }
}
</script>
