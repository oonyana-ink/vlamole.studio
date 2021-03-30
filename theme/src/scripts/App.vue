<template>
  <HUD />
  <div id="section-backgrounds" />
  <Stage />
  <Hero />
  <Intro />
</template>

<script>
import '@styles/index.scss'
import { inject, watch } from 'vue'
import HUD from '@components/HUD.vue'
import Stage from '@components/Stage.vue'
import Hero from '@components/Hero.vue'
import Intro from '@components/Intro.vue'

export default {
  components: {
    HUD,
    Stage,
    Hero,
    Intro
  },

  mounted () {
    console.log('::::', this)
  }
}
</script>
