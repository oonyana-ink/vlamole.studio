/* global IntersectionObserver */
import { interpolate } from 'd3-interpolate'

export default class Section {
  isIntersecting = false
  interpolator = null
  bounds = {
    top: 0,
    height: 0
  }

  constructor (el, opts = {}) {
    const {
      app,
      parent,
      meta = false
    } = opts

    this.el = el
    this.app = app
    this.parent = parent

    this.setupObserver()
    this.app.onScroll(this.trackBounds.bind(this))

    if (meta) {
      this.meta = meta
      this.setupInterpolation()
    }
  }

  setupObserver () {
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      threshold: 0.01
    })
    this.observer.observe(this.el)
  }

  handleIntersection (entries) {
    const [entry] = entries

    this.isIntersecting = entry.isIntersecting
    this.trackBounds()
    this.parent.handleIntersection(this)
  }

  trackBounds () {
    if (!this.isIntersecting) { return }

    const boundingRect = this.el.getBoundingClientRect()
    let key
    let hasChanged = false

    for (key in this.bounds) {
      hasChanged = hasChanged || boundingRect[key] !== this.bounds[key]
      this.bounds[key] = boundingRect[key]
    }

    if (hasChanged) {
      this.parent.sectionBoundsUpdated(this)
    }
  }

  setupInterpolation () {
    const {
      keyframes
    } = this.meta
    this.interpolator = interpolate(keyframes['0%'], keyframes['100%'])
  }

  interpolate (ratios) {
    const { yVisibilityRatio, yPositionRatio } = ratios
    this.el.style.setProperty('--y-visibility-ratio', yVisibilityRatio)
    this.el.style.setProperty('--y-position-ratio', yPositionRatio)
    // if (!this.interpolator) { return }
    // const interpolated = this.interpolator(ratio)
    // console.log(interpolated)
  }
}
