<template>
  <HUD />
  <component :is="currentPage" />
  <div id="section-foregrounds" class="section-foregrounds" />
  <div id="section-backgrounds" class="section-backgrounds" />
  <Scrollbar v-if="pageLoaded" />
  <component id="section-styles" is="style" type="text/css" />
</template>

<script>
import { mapState } from 'vuex'
import '@styles/index.scss'
import pages from '@/pages'
import HUD from '@components/HUD.vue'
import Insta from '@components/Insta.vue'
import Nopage from '@components/Nopage.vue'
import Scrollbar from '@components/Scrollbar.vue'
import ProductSelector from '@components/ProductSelector.vue'

const pageLoaders = Object.entries(pages).map(([path, component]) => {
  const pathRegex = new RegExp(`^${path.replace(/\//g, '\/')}`)
  return { test: () => pathRegex.test(location.pathname), path, component }
})

export default {
  components: {
    HUD,
    Insta,
    Nopage,
    Scrollbar,
    ProductSelector,
    ...pages
  },

  computed: {
    ...mapState({
      menuIsOpen: state => state.menu.open,
      pageLoaded: state => state.page.loaded
    }),

    currentPage () {
      const pageComponent = pageLoaders.find(loader => loader.test()) || {}
      if (pageComponent.component instanceof Function) {
        return pageComponent.component()
      } else if (pageComponent.component.setup) {
        return pageComponent.path
      } else {
        return 'Nopage'
      }
    }
  },

  watch: {
    menuIsOpen (menuIsOpen) {
      document.querySelector('#App').classList.toggle('menu-open', menuIsOpen)
    }
  }
}
</script>
