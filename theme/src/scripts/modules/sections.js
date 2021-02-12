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
    this.getMidpoint()
  }

  start () {
    this.setupSections()
  }

  setupSections () {
    this.sections = [...document.querySelectorAll(this.sectionSelector)].map(sectionEl => {
      const sectionName = sectionEl.id.replace('shopify-section-', '')
      return new Section(sectionEl, {
        parent: this,
        meta: sections[sectionName],
        app: this.app
      })
    })
  }

  handleIntersection (section) {
    console.log('Sections:handleIntersection', section)
  }

  sectionBoundsUpdated (section) {
    const yVisibilityDiff = section.bounds.top > 0
      ? section.bounds.height - section.bounds.top
      : section.bounds.height + section.bounds.top
    const yPositionDiff = section.bounds.height - section.bounds.top

    const yVisibilityRatio = yVisibilityDiff / window.innerHeight
    const yPositionRatio = yPositionDiff / window.innerHeight
    section.interpolate({ yVisibilityRatio, yPositionRatio })
  }

  getMidpoint () {
    this.midpoint = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }
  }
}
