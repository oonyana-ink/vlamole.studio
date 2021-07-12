import { reactive } from 'vue'

class ScrollTracker {
  app = null
  options = {}
  position = reactive({
    x: 0,
    y: 0
  })

  scrollingElement = document.body // document.querySelector('.main-content')

  constructor (app, options = {}) {
    this.app = app
    this.options = options
    this.extendApp()
    this.trackScroll()
  }

  extendApp () {
    this.app.provide('scrollPosition', this.position)
    this.app.provide('scrollingElement', this.scrollingElement)
    this.app.provide('setScrollTop', this.setScrollTop.bind(this))
    this.app.provide('setScrollBehaviour', this.setScrollBehaviour.bind(this))
    this.app.scrollPosition = this.position
  }

  trackScroll () {
    requestAnimationFrame(this.trackScroll.bind(this))

    const { scrollingElement } = this
    const { scrollLeft, scrollTop } = scrollingElement

    if (scrollLeft !== this.position.x || scrollTop !== this.position.y) {
      this.position.x = scrollingElement.scrollLeft
      this.position.y = scrollingElement.scrollTop
    }
  }

  setScrollTop (top) {
    this.scrollingElement.scrollTop = top
  }

  setScrollBehaviour ({ instant = false, smooth = false } = {}) {
    this.scrollingElement.classList.toggle('instant-scroll', instant)
    this.scrollingElement.classList.toggle('smooth-scroll', smooth)
  }
}

export default {
  install (app, options) {
    return new ScrollTracker(app, options)
  }
}
