<template>
  <header class="header">
    <div class="header__content">
      <div class="header__left-side">
        <div class="logo">
          <SVG svg="logo" />
        </div>
        <div class="logotype">
          vlamole.studio<span class="breadcrumb">bateleur</span>
        </div>
      </div>
      <div class="header__right-side">
        <div class="menu-toggle" @click="toggleMenu" />
        <div class="cart icon">
          <SVG svg="cart" />
        </div>
      </div>
    </div>
  </header>

  <MainMenu />

  <footer class="footer">
    <div class="footer__content">
      <div class="footer__left-side">
        <a class="social-icon icon">
          <SVG svg="instagram" />
        </a>
        <a class="social-icon icon">
          <SVG svg="twitter" />
        </a>
        <div class="small-print">
          <div>
            &copy; 2021 vlamole.studio
            <a
              v-for="link in footerMenu.links"
              :key="link.url"
              :href="link.url"
            >
              {{ link.title }}
            </a>
          </div>
        </div>
      </div>

      <div class="footer_right-side">
        <a
          class="button primary-cta"
          :label-index="ctaLabelIndex"
          @click="toggleSelector(true)"
        >
          <span>Get One</span>
          <span>Make One</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapMutations } from 'vuex'

import SVG from '@components/SVG.vue'
import MainMenu from '@components/MainMenu.vue'

export default {
  components: {
    MainMenu,
    SVG
  },

  data () {
    return {
      ctaLabelIndex: 0,
      footerMenu: [] //window.vlamole.menus.footer
    }
  },

  mounted () {
    setInterval(() => {
      this.ctaLabelIndex = this.ctaLabelIndex === 0 ? 1 : 0
    }, 4000)
  },

  methods: {
    ...mapMutations({
      toggleSelector: 'product/toggleSelector',
      toggleMenu: 'menu/toggle'
    })
  }
};
</script>