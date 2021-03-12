import Section from '@core/section'
import * as sections from '@/sections'

export default class Sections {
  sectionSelector = '.page-section'

  incomingSection = null
  outgoingSection = null
  sections = []
  midpoint = {}

  constructor (opts = {}) {
    const {
      app
    } = opts

    this.app = app
  }

  start () {
    this.setupSections()
  }

  setupSections () {
    this.sections = [...document.querySelectorAll(this.sectionSelector)].map(sectionEl => {
      const sectionName = sectionEl.id.replace('shopify-section-', '')
      return new Section(sectionEl, {
        name: sectionName,
        parent: this,
        meta: sections[sectionName],
        app: this.app
      })
    })
  }

  handleIntersection (section) {
  }
}
