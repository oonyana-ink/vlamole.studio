<template>
  <section
    ref="section"
    class="nopage section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
  
  <div class="grid">
        <div class="content grid__column--12">
          <div class="section__copy">

              

            <h1 class="nohead content grid__row--4">404</h1>
           
            
          
          
          </div>
        
        </div>
      </div>


    
  </section>

   <teleport to="#section-backgrounds">
        <div
            ref="background"
            class="fix__background section-background"
            :style="sectionBackgroundStyles"
        >
            Background
        </div>
    </teleport>
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