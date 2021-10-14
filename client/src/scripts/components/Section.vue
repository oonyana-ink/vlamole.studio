<template>
  <section
    ref="section"
    class="section"
    :class="sectionClasses">

    <slot></slot>

    <teleport to="#section-foregrounds" v-if="hasForeground">
      <div
        class="section-foreground"
        :class="`${name}__foreground`"
      >
        <slot name="foreground"></slot>
      </div>
    </teleport>

    <teleport to="#section-backgrounds">
      <div
        ref="background"
        class="section-background"
        :class="`${name}__background`"
      >
        <slot name='background'></slot>
      </div>
    </teleport>

    <teleport to="#section-styles">
      {{ sectionStyles }}
    </teleport>
  </section>
</template>

<script>
import { watch } from 'vue'

export default {
  inject: ['scrollPosition'],

  props: {
    name: String,
    config: Object,
    scrollLabel: String
  },

  data () {
    return {
      scrollblocks: [],
      additionalScrollableHeight: 0,
      scrollTop: 0,
      viewHeight: 0,
      top: 0,
      left: 0,
      prevYVisibilityRatio: 0,
      isIntersecting: false,
      isGrowing: false,
      bounds: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        offsetTop: 0,
        offsetHeight: 0
      }
    }
  },

  computed: {
    // name () {
    //   return this.$options.name
    // },

    hasForeground () {
      return !!this.$slots.foreground
    },

    sectionClasses () {
      const {
        name,
        yVisibilityRatio
      } = this
      return {
        [name]: true,
        visible: yVisibilityRatio > 0
      }
    },

    sectionStyles () {
      const {
        yVisibilityRatio,
        yPositionRatio,
        top,
        left,
        name
      } = this
      const {
        height
      } = this.bounds

      return `
        .section.${name},
        .${name}__foreground.section-foreground  {
          top: ${top}px;
          left: ${left}px;
          --y-visibility-ratio: ${yVisibilityRatio};
          --y-visibility-percent: ${Math.ceil(yVisibilityRatio * 100)};
          --y-position-ratio: ${yPositionRatio}
        }

        .${name}__background.section-background {
          --y-visibility-ratio: ${yVisibilityRatio};
          --y-visibility-percent: ${Math.ceil(yVisibilityRatio * 100)};
          --y-position-ratio: ${yPositionRatio};
        }

        .${name}__foreground.section-foreground {
          height: ${height}px;
        }
      `
    },

    yVisibilityRatio () {
      if (!this.isIntersecting) { return 0 }
      const { viewHeight } = this
      const {
        top: sectionTop,
        height: sectionHeight,
        bottom: sectionBottom
      } = this.calculatedBounds

      const currentlyVisible = sectionTop >= viewHeight || sectionBottom <= 0
        ? 0
        : sectionTop > 0
          ? sectionBottom < viewHeight
            ? sectionHeight
            : viewHeight - sectionTop
          : sectionBottom > viewHeight
            ? viewHeight
            : sectionBottom
      const yVisibilityRatio = Math.min(1, Math.max(0, currentlyVisible / viewHeight))

      this.isGrowing = this.prevYVisibilityRatio < yVisibilityRatio
      this.prevYVisibilityRatio = yVisibilityRatio

      if (this.isGrowing) {
        document.body.setAttribute('incoming-section', this.name.toLowerCase())
        document.body.style.setProperty('--incoming-y-visibility-ratio', yVisibilityRatio)
      } else {
        document.body.setAttribute('outgoing-section', this.name.toLowerCase())
        document.body.style.setProperty('--outgoing-y-visibility-ratio', yVisibilityRatio)
      }

      return yVisibilityRatio
    },

    yPositionRatio () {
      const { calculatedBounds, viewHeight, bounds } = this
      const yPositionDiff = viewHeight - calculatedBounds.top
      const yPositionRatio = yPositionDiff / viewHeight
      return Math.min(yPositionRatio, (bounds.height/viewHeight) + 1)
    },

    calculatedBounds () {
      const {
        top, height, left
      } = this.bounds
      const { scrollTop } = this
      return {
        top: top - scrollTop,
        height: height,
        bottom: top - scrollTop + height,
        left
      }
    }
  },

  watch: {
    isIntersecting (isIntersecting) {
      if (isIntersecting) {
        // this.trackBounds()
      }
    }
  },

  created () {
    this.afterMountCallbacks = []
    watch(this.scrollPosition, this.handleScroll)
    this.$registerSection(this)
  },

  mounted () {
    this.getScrollblocks()
    this.getViewHeight()
    this.processHeights()
    this.getPosition()
    this.trackBounds({ force: true })
    this.trackOffset()
    this.afterMountCallbacks.forEach(callback => callback())
    // window.requestIdleCallback(() => this.trackBounds())
  },

  methods: {
    afterMount (callback) {
      this.afterMountCallbacks.push(callback)
    },

    getScrollblocks () {
      this.scrollblocks = this.$el.querySelectorAll('.scrollblock')
      this.additionalScrollableHeight = Array.from(this.scrollblocks).reduce((sum, block) => sum + block.scrollHeight, 0)
    },

    processHeights () {
      const { additionalScrollableHeight } = this
      const {
        background,
        section
      } = this.$refs
      const backgroundHeight = background.offsetHeight
      const sectionHeight = section.offsetHeight + additionalScrollableHeight
      section.style.height = `${sectionHeight}px`
      background.style.height = `${Math.max(backgroundHeight, sectionHeight)}px`
    },

    getPosition () {
      const { background: el } = this.$refs
      this.top = el.offsetTop
      this.left = el.offsetLeft
    },

    getViewHeight () {
      this.viewHeight = window.innerHeight
    },

    handleScroll () {
      this.trackOffset()
      // this.trackBounds()
    },

    trackOffset () {
      const { viewHeight, bounds } = this
      // const { background: el } = this.$refs
      // const { offsetTop, offsetHeight } = el
      const scrollTop = this.scrollPosition.y
      const scrollBottom = scrollTop + viewHeight
      const offsetBottom = bounds.offsetTop + bounds.offsetHeight
      this.isIntersecting = scrollBottom > bounds.offsetTop && scrollTop < offsetBottom
      this.scrollTop = scrollTop
      if (this.isIntersecting) {
        this.processScrollblocks()
      }
    },

    processScrollblocks () {
      const { calculatedBounds } = this
    },

    trackBounds ({ force } = {}) {
      if (!this.isIntersecting && !force) { return }
      const { background: el } = this.$refs
      const boundingRect = el.getBoundingClientRect()
      const newBounds = {}
      let key
      for (key in this.bounds) {
        newBounds[key] = ['offsetTop', 'offsetHeight'].includes(key) ? el[key] : boundingRect[key]
      }
      this.bounds = newBounds
    }
  }
}
</script>