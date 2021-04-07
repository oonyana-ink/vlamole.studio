import { easeCubicInOut } from 'd3-ease'
import { watch } from 'vue'

class Sections {
  app = null
  options = {}
  stage = null
  activeSections = []
  incomingSection = null
  outgoingSection = null
  sections = []

  constructor (app, options = {}) {
    this.app = app
    this.store = options.store
    this.options = options
    this.extendApp()
  }

  extendApp () {
    this.app.config.globalProperties.$registerSection = this.registerSection.bind(this)
    this.app.config.globalProperties.$registerStage = this.registerStage.bind(this)
  }

  registerSection (section) {
    section.afterMount(() => this.setInitialState(section))
    this.sections.push(section)
    this.watch(section)
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
    this.incomingSection = section.isGrowing ? section : this.activeSections.find(section => section.isGrowing)
    this.outgoingSection = !section.isGrowing ? section : this.activeSections.find(section => !section.isGrowing)

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
  }

  setInitialState () {
    const initialSection = this.sections.find(section => section.yVisibilityRatio > 0.5)
    this.applyConfig(initialSection)
  }

  interpolateSections () {
    const {
      yVisibilityRatio,
      config: incomingConfig
    } = this.incomingSection
    const {
      config: outgoingConfig
    } = this.outgoingSection

    const easedRatio = easeCubicInOut(yVisibilityRatio)
    Object.keys(incomingConfig.stage).forEach(key => {
      this.store.commit(`${key}/interpolate`, {
        outgoingState: outgoingConfig.stage[key],
        incomingState: incomingConfig.stage[key],
        easedRatio
      })
    })
  }

  applyConfig (section) {
    Object.entries(section.config.stage).forEach(([key, value]) => {
      this.store.commit(`${key}/apply`, value)
    })
  }
}

export default {
  install (app, options) {
    return new Sections(app, options)
  }
}
