<template>
  <section
    ref="section"
    class="fix section"
    :class="sectionClassses"
    :style="sectionStyles"
  >
    <div class="content">
      <div class="grid">
        <div class="grid__column--12">
          <div class="section__copy">
              <div class='title-container'>
                <h3>Fix</h3>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
          </div>
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
import sectionMixin from "@mixins/section";

export default {
  name: "Fix",
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
          drone: {
            float: 0,
            rotation: ["0deg", "180deg", "0deg"],
            position: [0, 0, 0],
            explodedView: 1
          },
        },
      };
    },
  },
};
</script>