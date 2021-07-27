<template>
  <Stage />
  <Hero />
  <Print />
  <Intro />
  <Specs />
  <Fly />
  <Crash />
  <Fix />
  <ProductSelector />
</template>

<script>
import Page from '@mixins/page'
import Stage from '@components/Stage.vue'
import Hero from './bateleur/Hero.vue'
import Intro from './bateleur/Intro.vue'
import Specs from './bateleur/Specs.vue'
import Fly from './bateleur/Fly.vue'
import Crash from './bateleur/Crash.vue'
import Print from '@components/Print.vue'
import Fix from '@components/Fix.vue'

export default {
  mixins: [Page],
  components: {
    Stage,
    Hero,
    Intro,
    Specs,
    Fly,
    Crash,
    Print,
    // Fix,
  }
}
</script>