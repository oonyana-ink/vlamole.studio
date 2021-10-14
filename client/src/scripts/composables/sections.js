import { watch, reactive } from 'vue'

const BREAKPOINTS = [
  ['default', Infinity],
  ['phone', 480]
]

class Sections {
  app = null
  options = {}
  stage = null
  activeSections = []
  incomingSection = null
  outgoingSection = null
  sections = reactive([])

  constructor (app, options = {}) {
    this.app = app
    this.store = options.store
    this.options = options
    this.extendApp()
  }

  extendApp () {
    this.app.config.globalProperties.$registerSection = this.registerSection.bind(this)
    this.app.config.globalProperties.$registerStage = this.registerStage.bind(this)
    this.app.provide('sections', this.sections)
  }

  registerSection (section) {
    section.afterMount(() => {
      this.sections.push(section)
      this.watch(section)
      this.setInitialState(section)
    })
  }

  registerStage (stage) {
    this.stage = stage
    this.stage.onReady(this.setInitialState.bind(this))
  }

  watch (section) {
    watch([
      () => section.isIntersecting,
      () => section.isGrowing
    ],
    () => {
      this.updateSections(section)
    })
  }

  updateSections (section) {
    this.sections.forEach(section => {
      if (section.unwatch) { section.unwatch() }
      section.unwatch = null
      section.interpolators = null
    })

    this.activeSections = this.sections.filter(section => section.isIntersecting)
    this.incomingSection = section.isGrowing
      ? section
      : this.activeSections.find(section => section.isGrowing) ||
        this.incomingSection
    this.outgoingSection = !section.isGrowing
      ? section
      : this.activeSections.find(section => !section.isGrowing) ||
        this.outgoingSection

    this.prepareIncomingSection()
  }

  prepareIncomingSection () {
    if (!this.incomingSection || !this.outgoingSection) { return }

    const {
      incomingSection
    } = this

    incomingSection.unwatch = watch([
      () => incomingSection.yVisibilityRatio
    ], () => {
      this.interpolateSections()
    })

    this.interpolateSections()
  }

  setInitialState () {
    let initialSection = this.sections.find(section => section.yVisibilityRatio > 0.5)
    initialSection = initialSection || this.sections[0]
    this.applyConfig(initialSection)
  }

  breakpointConfig (config) {
    let breakpointConfig = {}
    BREAKPOINTS
      .filter(([breakpointKey, breakpoint]) => window.innerWidth < breakpoint && config[breakpointKey] !== undefined)
      .forEach(([breakpointKey, _]) => Object.assign(breakpointConfig, config[breakpointKey]));
    return breakpointConfig
  }

  interpolateSections () {
    const {
      breakpointConfig
    } = this
    const {
      yVisibilityRatio,
      config: incomingConfig
    } = this.incomingSection
    const {
      config: outgoingConfig
    } = this.outgoingSection

    const easedRatio = yVisibilityRatio // easeCubicInOut(yVisibilityRatio)
    Object.keys(incomingConfig).forEach(key => {
      this.store.commit(`${key}/interpolate`, {
        outgoingState: breakpointConfig(outgoingConfig[key]),
        incomingState: breakpointConfig(incomingConfig[key]),
        easedRatio
      })
    })
  }

  applyConfig (section) {
    const {
      breakpointConfig
    } = this
    if (!section.config) { return }
    Object.entries(section.config).forEach(([key, config]) => {
      this.store.commit(`${key}/apply`, breakpointConfig(config))
    })
  }
}

export default {
  install (app, options) {
    return new Sections(app, options)
  }
}
