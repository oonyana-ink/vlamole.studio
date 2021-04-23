<template>
  <section
    ref="section"
    class="print section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
    <div class="grid">
      <div class="content grid__column--12">
        <div class="section__copy">
          <h1 class="title">PRINT</h1>
          <div class="print-head">
            <div class="filament" />
          </div>
          <div class="copy">
            <p class="grid__column--3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <p class="grid__column--3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="print__background section-background"
      :style="sectionBackgroundStyles"
    >
      <div class="build-plate-grid" />
    </div>
  </teleport>
</template>

<script>
import sectionMixin from '@mixins/section'
export default {
  name: 'Print',
  mixins: [sectionMixin],

  computed: {
    config () {
      return {
        stage: {
          drone: {
            appearance: 'shaded',
            rotation: ['0deg', '540deg', '180deg'],
            position: [0, window.innerHeight * -0.25, 0],
          }
        }
      }
    }
  }
}
</script>
