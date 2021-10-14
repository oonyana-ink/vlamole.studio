<template>
  <section
    ref="section"
    class="nopage section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
  <h1>no page</h1>
  </section>
</template>

<script>
import sectionMixin from '@mixins/section'

export default {
  name: 'Nopage',
  mixins: [sectionMixin],

  computed: {
    config () {
      return {
        stage: {
          drone: {
            rotation: ['100deg', '280deg', '200deg'],
            position: [2, window.innerHeight * 0.2, 0.1]
          }
        }
      }
    }
  }
}
</script>