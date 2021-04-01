import { watch } from 'vue'

export default {
  inject: ['scrollPosition'],

  data () {
    return {
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
        left: 0
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
        visible: yVisibilityRatio > 0,
      }
    },

    sectionStyles () {
      const {
        top,
        left,
        yVisibilityRatio,
        yPositionRatio
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
      const { bounds } = this
      const yVisibilityDiff = bounds.top > 0
        ? bounds.height - bounds.top
        : bounds.height + bounds.top
      const yVisibilityRatio = Math.min(1, Math.max(0, yVisibilityDiff / window.innerHeight))
      this.isGrowing = this.prevYVisibilityRatio < yVisibilityRatio
      this.prevYVisibilityRatio = yVisibilityRatio
      return yVisibilityRatio
    },

    yPositionRatio () {
      const { bounds } = this
      const yPositionDiff = bounds.height - bounds.top
      const yPositionRatio = yPositionDiff / window.innerHeight
      return yPositionRatio
    }
  },

  watch: {
    isIntersecting (isIntersecting) {
      if (isIntersecting) {
        this.trackBounds()
      }
    },

    isGrowing (isGrowing) {
      this.setStage()
    }
  },

  created () {
    this.afterMountCallbacks = []
    console.log('created')
    watch(this.scrollPosition, this.handleScroll)
    this.$registerSection(this)
  },

  mounted () {
    // this.trackOffset()
    this.getPosition()
    this.trackOffset()
    this.trackBounds({ force: true })
    this.afterMountCallbacks.forEach(callback => callback())
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

    handleScroll () {
      this.trackOffset()
      this.trackBounds()
    },

    trackOffset () {
      const { background: el } = this.$refs
      const { offsetTop, offsetHeight } = el
      const { innerHeight } = window
      const scrollTop = this.scrollPosition.y
      const scrollBottom = scrollTop + innerHeight
      const offsetBottom = offsetTop + offsetHeight
      this.isIntersecting = scrollBottom > offsetTop && scrollTop < offsetBottom
    },

    trackBounds ({ force } = {}) {
      if (!this.isIntersecting && !force) { return }
      const { background: el } = this.$refs
      const boundingRect = el.getBoundingClientRect()
      const newBounds = {}
      let key

      for (key in this.bounds) {
        newBounds[key] = boundingRect[key]
      }

      this.bounds = newBounds
    },

    setStage () {
      console.log(this.config.stage)
    }
  }

}
