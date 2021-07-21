<template>
  <Section
    name="hero"
    :config="config"
  >
    <div class='grid'>
      <div class='content grid__column--10 grid__column--offset-1'>
        <div class='title'>
          <span class='the'>THE</span>
          <span class='top'>BATE</span><br/><span class='bottom'>LEUR</span>
          <div class="subtitle" parallax='2'>
            THE IMMORTAL CINEWHOOP FRAME
          </div>
        </div>
      </div>
    </div>

    <template v-slot:background>
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
    </template>
  </Section>
</template>

<script>
import config from '@/config'
import Section from '@components/Section.vue'

export default {
  name: 'Hero',
  inject: ['grid', 'gridWidth'],

  data () {
    return {
      scrollLabel: ['The', 'Bateleur'],
      isIntersecting: true
    }
  },

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
  },

  components: {
    Section
  }
}
</script>
