<template>
    <section
        ref="section"
        class="fix section"
        :class="sectionClassses"
        :style="sectionStyles"
    >
      <div class="grid">
        <div class="content grid__column--12">
          <div class="section__copy">

              

            <h1 class="fixxx content grid__row--4">FIX</h1>
           
            <p class="fixxxx content grid__column--6">This frustrating time in a budding pilot’s life is the inspiration behind the Bateleur, a modular 3D printable 2 inch whoop frame. Now the time between a critical failure and being airborne again can be minutes instead of days.critical failure and being airborne again can be minutes instead of days.his frustrating time in a budding pilot’s life is the inspiration behind the Bateleur, a modular 3D printable 2 inch whoop frame. Now the time between a critical failure and being airborne again can be minutes instead of days.critical failure and being airborne again can be minutes instead of days.his frustrating time in a budding pilot’s life is the inspiration behind the Bateleur, a modular 3D printable 2 inch whoop frame. Now the time between a critical failure and being airborne again can be minutes instead of days.critical failure and being airborne again can be minutes instead of days.</p>
          
          
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
    name: 'Fix',
    mixins: [sectionMixin],

    computed: {
        config () {
            return {
                stage: {
                    drone: {
                        rotation: ['0deg', '180deg', '0deg'],
                        position: [window.innerWidth * -0.25, 0, 0]
                    }
                }
            }
        }
    }
}
</script>