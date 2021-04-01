<template>
  <section
    ref="section"
    class="specs section"
    :class="sectionClasses"
    :style="sectionStyles"
  >
    <div class="specs__header data-table">
      <div class="row">
        <div class="col">
          <div class="value">Revision #10123</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label>Ver.</label>
          <div class="value">0.3.1</div>
        </div>
        <div class="col">
          <label>Date</label>
          <div class="value">24/03/2021</div>
        </div>
      </div>
    </div>

    <div class="specs__decoration">
      <div class="dimension x-axis">
        <label>Width:100<span>mm</span></label>
      </div>
      <div class="dimension y-axis">
        <label>Depth:100<span>mm</span></label>
      </div>
      <div class="dimension wheelbase">
        <label>Wheelbase:80<span>mm</span></label>
      </div>
      <div class="dimension prop-size">
        <label>Prop&#8960;:2<span>inch</span></label>
      </div>
      <div class="dimension camera-size">
        <label>Camera:19<span>mm</span></label>
      </div>
      <div class="dimension whoop-pattern">
        <label>Whoop:25.5<span>x</span>25.5<span>mm</span></label>
      </div>
      <div class="dimension micro-pattern">
        <label>Micro:20<span>x</span>20<span>mm</span></label>
      </div>
      <div class="dimension motor-pattern">
        <label>Motor&#8960;:9<span>mm</span></label>
      </div>
    </div>

    <div class="specs__footer data-table">
      <div class="row">
        <div class="col">
          <div class="value">vlamole.studio</div>
        </div>
        <div class="col no-grow">
          <div class="value">{% render "logo.svg" %}</div>
        </div>
        <div class="col">
          <label>Project</label>
          <div class="value">Bateleur</div>
        </div>
        <div class="col">
          <label>Title</label>
          <div class="value">Cinewhoop Frame</div>
        </div>
      </div>
    </div>
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="specs__background section-background"
      :style="sectionBackgroundStyles"
    >
      <div class="specs-grid">
        <div class="grid-border grid-border--top" />
        <div class="grid-border grid-border--bottom" />
      </div>
    </div>
  </teleport>
</template>

<script>
import sectionMixin from '@mixins/section'
export default {
  name: 'Specs',
  mixins: [sectionMixin],
  computed: {
    config () {
      return {
        stage: {
          drone: {
            appearance: 'wireframe',
            position: [0, 0, 0],
            rotation: ['90deg', '360deg', '0deg']
          }
        }
      }
    }
  }
}
</script>