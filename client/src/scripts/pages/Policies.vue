<template>
  <section
    ref="section"
    class="section section--auto-height section-policy"
    v-html="policy"
    :class="sectionClasses"
    :style="sectionStyles" />
  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="section-background section-background--auto-height section-policy__background"
      :style="backgroundStyles" />
  </teleport>
</template>

<script>
import { mapMutations } from 'vuex'
import sectionMixin from "@mixins/section"

export default {
  name: 'Policy',
  mixins: [sectionMixin],
  data() {
    return {
      sectionHeight: 0,
      policy: window.vlamole.initialContent,
    };
  },

  computed: {
    backgroundStyles () {
      return {
        height: this.sectionHeight + 'px'
      }
    }
  },

  mounted () {
    this.getSectionHeight()
    this.setPageLoaded(true)
    this.$nextTick(() => this.trackBounds({ force: true }))
  },

  methods: {
    ...mapMutations({
      setPageLoaded: 'page/setLoaded'
    }),

    getSectionHeight () {
      this.sectionHeight = this.$refs.section.offsetHeight;
    }
  }
};
</script>