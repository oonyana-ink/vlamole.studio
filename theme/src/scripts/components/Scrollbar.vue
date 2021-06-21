<template>
  <div class="scroll-bar">
    <div
      ref="track"
      class="scroll-bar__track"
    >
      <div
        :style="scrollbarThumbStyles"
        class="scroll-bar__thumb"
      />
      <div
        v-for="section in scrollSections"
        :key="section.name"
        :style="section.markerStyle"
        class="scroll-bar__section-marker"
        @click="scrollTo($event, section)"
      >
        <label>{{ sectionLabel(section) }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  inject: ['scrollPosition', 'scrollingElement', 'sections', 'setScrollTop'],
  data () {
    return {
      isMounted: false
    }
  },

  computed: {
    ...mapState({
      pageLoaded: (state) => state.page.loaded
    }),

    scrollScalar () {
      if (!this.isMounted) { return 1 }

      const {
        scrollingElement
      } = this
      const {
        track
      } = this.$refs

      return track.clientHeight / scrollingElement.scrollHeight
    },

    scrollbarThumbBounds () {
      if (!this.isMounted) { return { height: 0, top: 0 } }

      const {
        scrollPosition,
        scrollingElement,
        scrollScalar
      } = this

      const {
        y: scrollTop
      } = scrollPosition

      const {
        track
      } = this.$refs

      return {
        height: ((window.innerHeight / scrollingElement.scrollHeight) * track.clientHeight) - 5,
        top: scrollTop * scrollScalar
      }
    },

    scrollbarThumbStyles () {
      const { scrollbarThumbBounds } = this
      return {
        height: scrollbarThumbBounds.height + 'px',
        top: scrollbarThumbBounds.top + 'px'
      }
    },

    scrollSections () {
      if (!this.pageLoaded) { return [] }
      const { scrollScalar } = this
      return this.sections.map(section => {
        const { bounds } = section
        section.markerStyle = {
          top: section.top * scrollScalar + 'px',
          height: (bounds.height * scrollScalar) - 5 + 'px'
        }
        console.log({ section })
        return section
      })
    }
  },

  mounted () {
    this.isMounted = true
  },

  methods: {

    sectionLabel (section) {
      return section.scrollLabel || section.name
    },

    scrollTo ($event, section) {
      const { scrollScalar, scrollbarThumbBounds } = this
      const { offsetY } = $event
      const { top } = section

      this.setScrollTop(((offsetY - (scrollbarThumbBounds.height / 2)) / scrollScalar) + top)
    }
  }

}
</script>
