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



    <div class="container">
      <div class="photobox">
            <div class="gallery">
                <figure class="gallery__item gallery__item--1">
                    <img src="https://images.pexels.com/photos/4587956/pexels-photo-4587956.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="Gallery image 1" class="gallery__img">
                </figure>
                <figure class="gallery__item gallery__item--2">
                    <img src="https://images.pexels.com/photos/4587956/pexels-photo-4587956.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="Gallery image 2" class="gallery__img">
                </figure>
                <figure class="gallery__item gallery__item--3">
                    <img src="https://images.pexels.com/photos/4587956/pexels-photo-4587956.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="Gallery image 3" class="gallery__img">
                </figure>
                <figure class="gallery__item gallery__item--4">
                    <img src="https://images.pexels.com/photos/4587956/pexels-photo-4587956.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="Gallery image 4" class="gallery__img">
                </figure>
                <figure class="gallery__item gallery__item--5">
                    <img src="https://images.pexels.com/photos/4587956/pexels-photo-4587956.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="Gallery image 5" class="gallery__img">
                </figure>
                <figure class="gallery__item gallery__item--6">
                    <img src="https://images.pexels.com/photos/4587956/pexels-photo-4587956.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="Gallery image 6" class="gallery__img">
                </figure>
                </div>
            </div>
        </div>

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
