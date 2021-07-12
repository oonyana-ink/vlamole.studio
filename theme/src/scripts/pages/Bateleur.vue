<template>
  <Stage />
  <Hero />
  <Intro />
  <Specs />
  <Fly />
  <Crash />
  <Print />
  <Fix />
  <ProductSelector />
</template>

<script>
import { mapMutations } from 'vuex'

import Page from '@mixins/page'
import Stage from '@components/Stage.vue'
import Hero from '@components/Hero.vue'
import Intro from '@components/Intro.vue'
import Specs from '@components/Specs.vue'
import Fly from '@components/Fly.vue'
import Crash from '@components/Crash.vue'
import Print from '@components/Print.vue'
import Fix from '@components/Fix.vue'
import ProductSelector from '@components/ProductSelector.vue'

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
    Fix,
  },

  mounted () {
    this.showProductSelectorCTA(true)
  },

  methods: {
    ...mapMutations({
      'showProductSelectorCTA': 'product/showSelectorCTA'
    })
  }
}
</script>