<template>
  <Section
    ref="section"
    name="specs"
    :config="config"
    :scrollLabel="scrollLabel"
  >
    <div class="specs__content">
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

      <div class="specs__copy">
        <p>
          <strong>Designed to be simple.</strong>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div class="specs-list">
          <h2>Frame Specifications</h2>
          <div v-for="spec in specs" class="row">
            <div class="col">{{ spec[0] }}</div>
            <div class="col">{{ spec[1] }}</div>
          </div>
        </div>
      </div>

      <div class="specs__decoration">
        <div class="dimension x-axis">
          <label>Width:127<span>mm</span></label>
        </div>
        <div class="dimension y-axis">
          <label>Depth:127<span>mm</span></label>
        </div>
        <div class="dimension wheelbase">
          <label>Wheelbase:97<span>mm</span></label>
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

      <div class="specs__hardware">
        <h2>Required Hardware</h2>
        <div class="hardware-list">
          <div
            v-for="item in hardware"
            class="hardware-list__item">
            <SVG svg="screw" />
            <label>{{ `${item[1]} x ${item[0]}` }}</label>
          </div>
        </div>
      </div>

      <div class="specs__footer data-table">
        <div class="row">
          <div class="col">
            <label>Studio</label>
            <div class="value">vlamole.studio</div>
          </div>
          <div class="col no-grow">
            <div class="value">
              <img
                svg-inline
                src="@svgs/logo.svg"
              >
            </div>
          </div>
          <div class="col">
            <label>Project</label>
            <div class="value">Bateleur</div>
          </div>
          <div class="col">
            <label>Style</label>
            <div class="value">Cinewhoop Frame</div>
          </div>
        </div>
      </div>
    </div>

    <template v-slot:background>
      <div class="specs-grid">
        <div class="grid-border grid-border--top" />
        <div class="grid-border grid-border--bottom" />
      </div>
    </template>
  </Section>
</template>

<script>
import sectionMixin from '@mixins/section'
import Section from "@components/Section.vue"
import SVG from '@components/SVG.vue'

export default {
  name: 'Specs',
  mixins: [sectionMixin],

  data () {
    return {
      scrollLabel: ['Frame', 'Specs'],
      specs: [
        ['Prop. Size', '2"'],
        ['Weight', '< 100g'],
        ['Width', '100mm'],
        ['Depth', '100mm'],
        ['Camera Width', '19mm'],
        ['FC Mounts', '20x20mm & 25x25mm'],
        ['Moto Mounts', '9mm'],
        ['Battery', '2s & 3s']
      ],

      hardware: [
        ['m4', '8'],
        ['m6', '10'],
        ['m12', '12'],
        ['m24', '4']
      ]
    }
  },

  computed: {
    config () {
      return {
        stage: {
          default: {
            position: ['0vw', '-4.6vh']
          }
        },
        drone: {
          default: {
            appearance: 'wireframe',
            position: [0, 0, 0],
            rotation: ['90deg', '360deg', '0deg']
          }
        }
      }
    }
  },

  components: {
    Section,
    SVG
  }
}
</script>