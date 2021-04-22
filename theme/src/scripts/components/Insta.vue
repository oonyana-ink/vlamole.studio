<template>
  <section
    ref="section"
    class="insta section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
  


    
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="insta__background section-background "
      :style="sectionBackgroundStyles"
    >

    

    </div>
  </teleport>
</template>

<script>
import sectionMixin from '@mixins/section'

export default {
  name: 'Insta',
  mixins: [sectionMixin],

  computed: {
    config () {
      return {
        stage: {
          drone: {
            rotation: ['180deg', '20deg', '180deg'],
            position: [-2, window.innerHeight * -0.75, 0]
          }
        }
      }
    }
  }
}
</script>
