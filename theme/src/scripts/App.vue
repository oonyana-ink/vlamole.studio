<template>
  <HUD />
  <div id="section-backgrounds" />
  <Stage />
  <Hero />
  <Intro />
  <Specs />
  <Fly />
  <Crash />
</template>

<script>
import '@styles/index.scss'
import { inject, watch } from 'vue'
import HUD from '@components/HUD.vue'
import Stage from '@components/Stage.vue'
import Hero from '@components/Hero.vue'
import Intro from '@components/Intro.vue'
import Specs from '@components/Specs.vue'
import Fly from '@components/Fly.vue'
import Crash from '@components/Crash.vue'

export default {
  components: {
    HUD,
    Stage,
    Hero,
    Intro,
    Specs,
    Fly,
    Crash
  }
}
</script>
