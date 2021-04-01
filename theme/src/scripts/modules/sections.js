/* global IntersectionObserver */

import Section from '@core/section'
import * as sections from '@/sections'

export default class Sections {
  sectionSelector = '.page-section'

  outgoingSection = null
  incomingSection = null
  activeSections = []
  sections = []
  midpoint = {}
  observerOpts = {
    threshold: 0.01
  }

  constructor (opts = {}) {
    const {
      app
    } = opts

    this.app = app
  }

  start () {
    this.setupSections()
    // this.setupObserver()
    this.sections.forEach(section => section.start())
    this.app.onScroll(this.onScroll.bind(this))
  }

  setupObserver () {
    const { observerOpts, handleIntersection } = this
    this.observer = new IntersectionObserver(handleIntersection.bind(this), observerOpts)
    this.sections.forEach(section => {
      this.observer.observe(section.el)
    })
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

  handleIntersection (entries) {
    entries.forEach(entry => {
      const { section } = entry.target
      section.isIntersecting = entry.isIntersecting
      if (section.isIntersecting) {
        this.activeSections.push(section)
      }

      if (entry.intersectionRatio > 0.5) {
        section.setAsFirst()
      }
    })

    this.activeSections = this.activeSections.filter(section => section.isIntersecting)
    this.updateSectionDesignations()
  }

  updateActiveSections () {
    this.activeSections = this.sections.filter(section => section.isIntersecting)
    this.updateSectionDesignations()
  }


  updateSectionDesignations () {
    this.activeSections.forEach(section => {
      if (!section.isGrowing) {
        this.outgoingSection = section
        section.isIncoming = false
      } else {
        this.incomingSection = section
        section.isIncoming = true
      }
    })
  }

  onScroll (scroll) {
    this.sections.forEach(section => section.trackOffset(scroll))
    this.activeSections.forEach(section => section.trackBounds())

    if (this.incomingSection) {
      this.incomingSection.interpolate(this.outgoingSection)
    }
  }

  initSection (...keys) {
    console.log('keys', keys)
  }
}
