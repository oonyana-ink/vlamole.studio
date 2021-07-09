<template>
  <div class='main-menu'>
    <div class="logo">
      <img
        svg-inline
        src='@svgs/logo.svg'
      >
    </div>

    <nav>
      <ul>
        <li
          v-for='link in menu.links'
          :key='link.url'>
          <a :href='link.url'>{{ link.title }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: window.vlamole.menus['main-menu']
    }
  }
}
</script>