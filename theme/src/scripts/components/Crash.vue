<template>
  <section
    ref="section"
    class="crash section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="crash__background section-background"
      :style="sectionBackgroundStyles"
    />
  </teleport>
</template>

<script>
import sectionMixin from '@mixins/section'
export default {
  name: 'Crash',
  mixins: [sectionMixin],

  computed: {
    config () {
      return {
        stage: {
          drone: {
            rotation: ['0deg', '90deg', '90deg'],
            position: [0, 0, 0]
          }
        }
      }
    }
  }
}
</script>
