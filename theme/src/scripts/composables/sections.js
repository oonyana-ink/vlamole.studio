import { watch, inject } from 'vue'
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
    this.options = options
    this.extendApp()
  }

  extendApp () {
    this.app.config.globalProperties.$registerSection = this.registerSection.bind(this)
    this.app.config.globalProperties.$registerStage = this.registerStage.bind(this)
  }

  registerSection (section) {
    this.sections.push(section)
    this.watch(section)
  }

  registerStage (stage) {
    this.stage = stage
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
    console.log('updateSections')
    this.sections.forEach(section => {
      if (section.activeUnwatch) { section.activeUnwatch() }
      section.activeUnwatch = null
    })
    this.activeSections = this.sections.filter(section => section.isIntersecting)
    this.incomingSection = section.isGrowing ? section : this.sections.find(section => section.isGrowing)
    this.outgoingSection = !section.isGrowing ? section : this.sections.find(section => !section.isGrowing)
    this.activeSections.forEach(section => {
      section.activeUnwatch = watch([
        () => section.yVisiblityRatio,
        () => section.yPositionRatio
      ], this.interpolateSections.bind(this))
    })
  }

  interpolateSections () {
    console.log('interpolateSections', this.activeSections.map(section => section.name + JSON.stringify(section.config)))
  }
}

export default {
  install (app, options) {
    return new Sections(app, options)
  }
}
