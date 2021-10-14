<template>
  <Section
    ref='section'
    name="hero"
    :config="config"
    :scrollLabel="scrollLabel"
  >
    <div class='grid'>
      <div class='content grid__column--10 grid__column--offset-1'>
        <div class="title">
          <div class="title__copy">
            <span class='top'>BATE</span><br/><span class='bottom'>LEUR</span>
            <div class="subtitle" parallax='2'>
              THE IMMORTAL CINEWHOOP FRAME
            </div>
          </div>
          <div class="title__drone">
            <div class="title__drone-label">
              Fig 1. Drone in flight
            </div>
            <div class="title__drone-background" />
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
import Section from '@components/Section.vue'
import sectionMixin from '@mixins/section'

export default {
  name: 'Hero',
  inject: ['grid', 'gridWidth'],
  mixins: [sectionMixin],

  data () {
    return {
      scrollLabel: ['The', 'Bateleur'],
    }
  },

  computed: {
    config () {
      return {
        stage: {
          default: {
            position: ['22vw', '0vh']
          },
          phone: {
            position: ['2vw', '15vh']
          }
        },
        drone: {
          default: {
            appearance: 'shaded',
            rotation: ['40deg', '160deg', '0deg'],
            position: [0, 0, 0],
            size: ['80cw']
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
