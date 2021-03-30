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
        <div class="menu-toggle" />
        <div class="cart icon">
          <img
            svg-inline
            src="@svgs/cart.svg"
          >
        </div>
      </div>
    </div>
  </header>

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
        <a class="button">Build One</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  setup() {},
};
</script>