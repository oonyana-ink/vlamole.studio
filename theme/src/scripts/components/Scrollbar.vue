<template>
  <div class="scroll-bar">
    <div
      ref="track"
      class="scroll-bar__track"
      @mouseenter="setScrollActive(true)"
      @mouseleave="setScrollActive(false)"
    >
      <div
        :style="scrollbarThumbStyles"
        class="scroll-bar__thumb"
        @mousedown="startScrollDrag($event)"
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
  inject: ['scrollPosition', 'scrollingElement', 'sections', 'setScrollTop', 'setScrollBehaviour'],
  data () {
    return {
      isMounted: false,
      scrollScalar: 0,
      viewHeight: 0,
      scrollingElementHeight: 0,
      trackHeight: 0,
      scrollDrag: false,
      scrollDragStart: {
        clientY: 0,
        scrollY: 0
      }
    }
  },

  computed: {
    ...mapState({
      pageLoaded: (state) => state.page.loaded
    }),

    scrollbarThumbBounds () {
      if (!this.isMounted) { return { height: 0, top: 0 } }

      const {
        scrollPosition,
        scrollingElement,
        scrollScalar,
        viewHeight,
        trackHeight,
        scrollingElementHeight
      } = this

      const {
        y: scrollTop
      } = scrollPosition

      return {
        height: ((viewHeight/ scrollingElementHeight) * trackHeight) - 5,
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
      if (!this.pageLoaded || !this.isMounted) { return [] }
      const { scrollScalar } = this
      return this.sections.map(section => {
        const { bounds } = section
        console.log('scrollSections', section, bounds)
        section.markerStyle = {
          top: section.top * scrollScalar + 'px',
          height: (bounds.height * scrollScalar) - 5 + 'px'
        }
        return section
      })
    }
  },

  mounted () {
    this.sections.forEach(section => section.trackBounds())
    this.isMounted = true
    this.getViewHeight()
    this.getComponentHeights()
    this.getScrollScalar()
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
    },

    getScrollScalar () {
      if (!this.isMounted) { return 1 }
      const { scrollingElement } = this
      const { track } = this.$refs
      this.scrollScalar = this.trackHeight / this.scrollingElementHeight
    },

    getViewHeight () {
      this.viewHeight = window.innerHeight
    },

    getComponentHeights () {
      this.scrollingElementHeight = this.scrollingElement.scrollHeight
      this.trackHeight = this.$refs.track.clientHeight
    },

    startScrollDrag ($event) {
      const { dragScroll, stopScrollDrag } = this
      this.scrollDrag = true;
      this.scrollDragStart = {
        clientY: $event.clientY,
        scrollY: this.scrollPosition.y
      };
      this.setScrollBehaviour({ instant: true })
      window.addEventListener('mousemove', dragScroll)
      window.addEventListener('mouseup', stopScrollDrag)
    },

    stopScrollDrag () {
      const { dragScroll, stopScrollDrag } = this
      this.scrollDrag = false
      window.removeEventListener('mousemove', dragScroll)
      window.removeEventListener('mouseup', stopScrollDrag)
      this.setScrollBehaviour({ smooth: true })
      this.setScrollActive(false)
    },

    dragScroll ($event) {
      const {
        scrollDragStart,
        scrollingElementHeight,
        trackHeight
      } = this
      this.scrollOffset = $event.clientY - this.scrollDragStart.clientY
      this.setScrollTop(this.scrollDragStart.scrollY + scrollingElementHeight * (this.scrollOffset / trackHeight))
    },

    setScrollActive (active) {
      this.scrollingElement.classList.toggle('scroll-active', this.scrollDrag || active)
    }
  }

}
</script>
