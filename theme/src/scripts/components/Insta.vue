<template>
  <section
    ref="section"
    class="insta section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
    <div class="container">
      <div class="photobox">
        <div class="gallery">
          <figure
            class="gallery__item"
            v-for="(image, index) in productImages"
            :key="`galleryItem${index}`">
            <img src="image" alt="" class="gallery__img">
          </figure>
        </div>
      </div>
    </div>
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="insta__background section-background "
      :style="sectionBackgroundStyles"
    />
  </teleport>
</template>

<script>
import { mapGetters } from 'vuex'
import sectionMixin from '@mixins/section'

export default {
  name: 'Insta',
  mixins: [sectionMixin],

  computed: {
    ...mapGetters({
      productImages: 'product/productImages'
    }),

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
