/* global IntersectionObserver */
import { interpolate } from 'd3-interpolate'
import { easeCubicInOut } from 'd3-ease'

export default class Section {
  interpolator = null
  direction = 'in'
  currentVisibilityEndpoint = 0
  prevYPositionRatio = 0
  _isIntersecting = false
  _isIncoming = false
  _isGrowing = false

  $els = {}

  bounds = {
    top: 0,
    height: 0
  }

  ratios = {
    yVisibilityRatio: 0,
    yPositionRatio: 0,
    prevYVisibilityRatio: 0
  }

  _meta = {}

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
    this.el.section = this

    if (meta) {
      this._meta = meta
    }

    this.trackOffset(this.app.scroll.position)
    this.trackBounds({ force: true })
  }

  set isIntersecting (isIntersecting) {
    const hasChanged = this._isIntersecting !== isIntersecting
    if (!hasChanged) { return }
    this._isIntersecting = isIntersecting
    this.handleIntersection()
    this.parent.updateActiveSections()
  }

  get isIntersecting () {
    return this._isIntersecting
  }

  set isIncoming (isIncoming) {
    const hasChanged = this._isIncoming !== isIncoming
    if (!hasChanged) { return }
    this._isIncoming = isIncoming
    if (this._isIncoming) {
      this.setupInterpolation()
    } else {
      this.removeInterpolation()
    }
  }

  get isIncoming () {
    return this._isIncoming
  }

  set isGrowing (isGrowing) {
    const hasChanged = this._isGrowing !== isGrowing
    if (!hasChanged) { return }
    this._isGrowing = isGrowing
    this.parent.updateSectionDesignations()
  }

  get isGrowing () {
    return this._isGrowing
  }

  get meta () {
    return this._processMeta()
  }

  start () {
    if (this.ratios.yVisibilityRatio > 0.5) { this.setAsFirst() }
  }

  handleIntersection () {
    if (this.isIntersecting) {
      this.el.classList.add('visible')
      this.meta.onEnter && this.meta.onEnter(this)
    } else {
      this.el.classList.remove('visible')
      this.meta.onLeave && this.meta.onLeave(this)
    }
  }

  trackOffset (scroll) {
    const { el } = this
    const { offsetTop, offsetHeight } = el
    const { innerHeight } = window
    const scrollTop = scroll.y
    const scrollBottom = scrollTop + innerHeight
    const offsetBottom = offsetTop + offsetHeight
    this.isIntersecting = scrollBottom > offsetTop && scrollTop < offsetBottom
  }

  trackBounds ({ force = false } = {}) {

    if (!this.isIntersecting && !force) { return }

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

    this.isGrowing = yVisibilityRatio > this.ratios.prevYVisibilityRatio
    this.ratios = {
      yVisibilityRatio,
      yPositionRatio,
      prevYVisibilityRatio: yVisibilityRatio
    }

    this.el.style.setProperty('--y-visibility-ratio', yVisibilityRatio)
    this.el.style.setProperty('--y-visibility-percent', Math.ceil(yVisibilityRatio * 100))
    this.el.style.setProperty('--y-position-ratio', yPositionRatio)
    if (this.isIncoming) {
      document.body.setAttribute('incoming-section', this.name)
      document.body.style.setProperty('--incoming-y-visibility-ratio', yVisibilityRatio)
    } else {
      document.body.setAttribute('outgoing-section', this.name)
      document.body.style.setProperty('--outgoing-y-visibility-ratio', yVisibilityRatio)
    }
  }

  setupInterpolation () {
    const {
      drone: droneMeta
    } = this.meta
    const {
      drone: droneModel
    } = this.app

    const metaKeys = Object.keys(droneMeta)
    const vectorKeys = metaKeys.filter(key => ['rotation', 'position'].includes(key))
    const vectors = droneModel.getArraysInObject(vectorKeys)
    const otherKeys = []
    const metaVectors = {}
    let state = null

    metaKeys.forEach(key => {
      if (vectorKeys.includes(key)) {
        metaVectors[key] = droneMeta[key]
      } else if (key === 'state') {
        state = droneMeta.state
      } else {
        otherKeys.push(key)
      }
    })

    if (state) {
      droneModel.setState(state)
    }


    this.interpolator = {
      exec: interpolate(vectors, metaVectors),
      otherKeys
    }
  }

  removeInterpolation () {
    this.interpolator = false
  }

  interpolate (outgoingSection) {
    const { interpolator } = this
    if (!outgoingSection || !interpolator) { return }
    const { drone } = this.app
    const { yVisibilityRatio } = this.ratios
    const { drone: incomingDroneMeta } = this.meta
    const { drone: outgoingDroneMeta } = outgoingSection.meta

    const otherInterpolations = {}
    interpolator.otherKeys.forEach((key) => {
      otherInterpolations[key] = {
        from: outgoingDroneMeta[key],
        to: incomingDroneMeta[key]
      }
    })

    if (interpolator) {
      const easedRatio = easeCubicInOut(yVisibilityRatio)
      drone.set(interpolator.exec(easedRatio))
      drone.interpolate(otherInterpolations, easedRatio)
    }

    // this.parent.updateSectionDesignations()
  }

  setAsFirst () {
    this.trackBounds()
    this.app.drone.set(this.meta.drone)
  }

  _processMeta () {
    const processedMeta = {
      drone: {}
    }
    if (this._meta.drone) {
      Object.entries(this._meta.drone).forEach(([key, value]) => {
        processedMeta.drone[key] = value instanceof Function ? value(this) : value
      })
    }
    return processedMeta
  }
}
