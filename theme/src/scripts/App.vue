<template>
  <HUD />
  <div id="section-backgrounds" class="section-backgrounds" />
  <Stage />
  <Hero />
  <Intro />
  <Specs />
  <Fly />
  <Crash />
  <Print />
  <Fix />
  <Insta />
  <Nopage />

  <Scrollbar />
  <ProductSelector />
</template>

<script>
import { mapState } from 'vuex'
import '@styles/index.scss'
import HUD from '@components/HUD.vue'
import Stage from '@components/Stage.vue'
import Hero from '@components/Hero.vue'
import Intro from '@components/Intro.vue'
import Specs from '@components/Specs.vue'
import Fly from '@components/Fly.vue'
import Crash from '@components/Crash.vue'
import Print from '@components/Print.vue'
import Fix from '@components/Fix.vue'
import Insta from  '@components/Insta.vue'
import Nopage from  '@components/Nopage.vue';
import Scrollbar from '@components/Scrollbar.vue'
import ProductSelector from '@components/ProductSelector.vue'

export default {
  components: {
    HUD,
    Stage,
    Hero,
    Intro,
    Specs,
    Fly,
    Crash,
    Print,
    Fix,
    Insta,
    Nopage,
    Scrollbar,
    ProductSelector
  },

  computed: {
    ...mapState({
      menuIsOpen: state => state.menu.open
    })
  },

  watch: {
    menuIsOpen (menuIsOpen) {
      console.log(this);
      document.querySelector('#App').classList.toggle('menu-open', menuIsOpen)
    }
  }
}
</script>
