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
            THE IMMORTAL CINEWHOOP FRAME
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
        v-if="isIntersecting"
        class="background-video"
        playsinline
        autoplay
        muted
        loop
      >
        <source
          :src="`${ assetsURL }/clouds-bg.mp4`"
          type="video/mp4"
        >
      </video>
    </div>
  </teleport>
</template>

<script>
import config from '@/config'
import sectionMixin from '@mixins/section'

export default {
  name: 'Hero',
  mixins: [sectionMixin],
  inject: ['grid', 'gridWidth'],

  computed: {
    assetsURL () {
      return config.assetsURL
    },

    config () {
      return {
        stage: {
          drone: {
            appearance: 'shaded',
            rotation: ['40deg', '140deg', '0deg'],
            position: [this.gridWidth({ cols: 2.5 }), 0, 0],
            size: [this.gridWidth({ cols: 6 })]
          }
        }
      }
    }
  }
}
</script>
