<template>
  <section
    ref="section"
    class="print section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
    Pring
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="print__background section-background"
      :style="sectionBackgroundStyles"
    />
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
            rotation: ['40deg', '140deg', '0deg'],
            position: [0, 0, 0],
          }
        }
      }
    }
  }
}
</script>
