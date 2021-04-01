<template>
  <HUD />
  <div id="section-backgrounds" />
  <Stage />
  <Hero />
  <Intro />
  <Specs />
</template>

<script>
import '@styles/index.scss'
import { inject, watch } from 'vue'
import HUD from '@components/HUD.vue'
import Stage from '@components/Stage.vue'
import Hero from '@components/Hero.vue'
import Intro from '@components/Intro.vue'
import Specs from '@components/Specs.vue'

export default {
  components: {
    HUD,
    Stage,
    Hero,
    Intro,
    Specs
  }
}
</script>
