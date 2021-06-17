<template>
  <header class="header">
    <div class="header__content">
      <div class="header__left-side">
        <div class="logo">
          <img
            svg-inline
            src="@svgs/logo.svg"
          >
        </div>
        <div class="logotype">
          vlamole.studio<span class="breadcrumb">bateleur</span>
        </div>
      </div>
      <div class="header__right-side">
        <div class="menu-toggle" @click="toggleMenu()" />
        <div class="cart icon">
          <img
            svg-inline
            src="@svgs/cart.svg"
          >
        </div>
      </div>
    </div>
  </header>

  <MainMenu />

  <footer class="footer">
    <div class="footer__content">
      <div class="footer__left-side">
        <a class="social-icon icon">
          <img
            svg-inline
            src="@svgs/instagram.svg"
          >
        </a>
        <a class="social-icon icon">
          <img
            svg-inline
            src="@svgs/twitter.svg"
          >
        </a>
        <div class="small-print">
          <div>&copy; 2021 vlamole.studio | Terms &amp; Conditions | Privacy Policy</div>
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
import MainMenu from '@components/MainMenu.vue'
import { mapMutations } from 'vuex'

export default {
  components: {
    MainMenu
  },

  data () {
    return {
      ctaLabelIndex: 0
    }
  },

  mounted () {
    setInterval(() => this.ctaLabelIndex = this.ctaLabelIndex === 0 ? 1 : 0, 4000)
  },

  methods: {
    ...mapMutations({
      toggleSelector: 'product/toggleSelector',
      toggleMenu: 'menu/toggle'
    })
  }
};
</script>