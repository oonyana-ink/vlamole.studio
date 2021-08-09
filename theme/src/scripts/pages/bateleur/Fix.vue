<template>
  <Section
    name="fix"
    ref="section"
    :config="config"
    :scrollLabel="scrollLabel">
    <div class="content">
      <div class="content__pane">
        <h3>Easy Fixing</h3>
      </div>
      <div class="content__pane"></div>
      <div class="content__pane">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
    <template v-slot:background>
    </template>
  </Section>
</template>

<script>
import Section from '@components/Section.vue'
import sectionMixin from "@mixins/section"

export default {
  name: "Fix",
  components: {
    Section
  },
  mixins: [sectionMixin],

  data () {
    return {
      scrollLabel: ['Easy', 'Fixing']
    }
  },

  computed: {
    config() {
      return {
        stage: {
          default: {
            position: ['-7vw', '-3vh']
          }
        },
        drone: {
          default: {
            float: 0,
            rotation: ["0deg", "180deg", "0deg"],
            position: [0, 0, window.innerHeight * -0.1],
            explodedView: 1
          }
        }
      };
    },
  },
}
</script>