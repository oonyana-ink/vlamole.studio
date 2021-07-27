<template>
  <Section
    name="print"
    ref="section"
    :config="config"
    :scrollLabel="scrollLabel"
  >
    <div class="grid">
      <div class="content grid__column--12">
        <div class="title">
          <h1>PRINT</h1>
          <h3>It Yourself</h3>
          <div class="print-head">
            <div class="filament" />
          </div>
        </div>
        <div class="sidebar">
          <div class="copy">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>
    </div>

    <template v-slot:background>
      <div class="build-plate-grid" />
    </template>
  </Section>
</template>

<script>
import Section from '@components/Section.vue'
import sectionMixin from '@mixins/section'
export default {
  name: 'Print',
  mixins: [sectionMixin],
  components: {
    Section
  },

  data () {
    return {
      scrollLabel: ['Print It', 'Yourself']
    }
  },

  computed: {
    config () {
      return {
        stage: {
          default: {
            position: ['-14.3vw', '0vh']
          }
        },
        drone: {
          default: {
            appearance: 'shaded',
            rotation: ['0deg', '540deg', '180deg'],
            position: [0, window.innerHeight * -0.25, 0],
            float: 0
          }
        }
      }
    }
  }
}
</script>
