/* global IntersectionObserver */
import { interpolate } from 'd3-interpolate'

export default class Section {
  isIntersecting = false
  interpolator = null
  direction = 'in'
  currentVisibilityEndpoint = 0
  prevYPositionRatio = 0

  $els = {}

  bounds = {
    top: 0,
    height: 0
  }

  ratios = {
    yVisibilityRatio: 0,
    yPositionRatio: 0
  }

  meta = {}

  constructor (el, opts = {}) {
    const {
      app,
      parent,
      name,
      meta = false
    } = opts

    this.name = name
    this.el = el
    this.app = app
    this.parent = parent

    if (meta) {
      this.meta = meta
      this.processMeta()
      this.setupInterpolation()
    }

    this.setupObserver()
    this.app.onScroll(this.trackBounds.bind(this))
  }

  setupObserver () {
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      threshold: 0.01
    })
    this.observer.observe(this.el)
  }

  processMeta () {
    if (this.meta.els) {
      Object.entries(this.meta.els).forEach(([key, selector]) => { this.$els[key] = document.querySelector(selector) })
    }
  }

  handleIntersection (entries) {
    const [entry] = entries
    this.isIntersecting = entry.isIntersecting
    this.trackBounds()

    if (this.isIntersecting) {
      this.el.classList.add('visible')
      this.meta.onEnter && this.meta.onEnter(this)
    } else {
      this.el.classList.remove('visible')
      this.meta.onLeave && this.meta.onLeave(this)
    }

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
      this.updateRatios()
    }
  }

  updateRatios () {
    const { bounds } = this
    const yVisibilityDiff = bounds.top > 0
      ? bounds.height - bounds.top
      : bounds.height + bounds.top
    const yPositionDiff = bounds.height - bounds.top
    const yVisibilityRatio = Math.min(1, Math.max(0, yVisibilityDiff / window.innerHeight))
    const yPositionRatio = yPositionDiff / window.innerHeight

    this.prevYPositionRatio = this.ratios.yPositionRatio

    if (yPositionRatio !== 1) {
      const movingIn = (
        (yPositionRatio > this.prevYPositionRatio && yPositionRatio < 1) ||
        (yPositionRatio < this.prevYPositionRatio && yPositionRatio > 1)
      )
      this.direction = movingIn ? 'in' : 'out'
    }

    this.ratios = {
      yVisibilityRatio,
      yPositionRatio
    }

    this.interpolate()
  }

  setupInterpolation () {
    const {
      keyframes
    } = this.meta
    if (!keyframes) { return }
    this.interpolator = interpolate(keyframes['0%'], keyframes['100%'])
  }

  interpolate () {
    const { yVisibilityRatio, yPositionRatio } = this.ratios
    this.el.style.setProperty('--y-visibility-ratio', yVisibilityRatio)
    this.el.style.setProperty('--y-position-ratio', yPositionRatio)
  }
}
