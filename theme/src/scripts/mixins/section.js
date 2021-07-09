import { watch } from 'vue'

export default {
  inject: ['scrollPosition'],

  data () {
    return {
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
    name () {
      return this.$options.name
    },

    sectionClasses () {
      const {
        yVisibilityRatio
      } = this
      return {
        visible: yVisibilityRatio > 0
      }
    },

    sectionStyles () {
      const {
        yVisibilityRatio,
        yPositionRatio,
        top,
        left
      } = this

      return {
        top: top + 'px',
        left: left + 'px',
        '--y-visibility-ratio': yVisibilityRatio,
        '--y-visibility-percent': Math.ceil(yVisibilityRatio * 100),
        '--y-position-ratio': yPositionRatio
      }
    },

    sectionBackgroundStyles () {
      const {
        yVisibilityRatio,
        yPositionRatio
      } = this
      return {
        '--y-visibility-ratio': yVisibilityRatio,
        '--y-visibility-percent': Math.ceil(yVisibilityRatio * 100),
        '--y-position-ratio': yPositionRatio
      }
    },

    yVisibilityRatio () {
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
      const { calculatedBounds, viewHeight } = this
      const yPositionDiff = viewHeight - calculatedBounds.top
      const yPositionRatio = yPositionDiff / viewHeight
      return yPositionRatio
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
        console.log(this.name, 'isIntersecting')
        // this.trackBounds()
      }
    }
  },

  created () {
    this.afterMountCallbacks = []
    watch(this.scrollPosition, this.handleScroll)
    console.log(this)
    this.$registerSection(this)
  },

  mounted () {
    this.getViewHeight()
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
