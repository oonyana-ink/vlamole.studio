/* global IntersectionObserver */
export default class PageSection {
  el = null

  constructor (pageEl, opts = {}) {
    const {
      app
    } = opts

    this.el = pageEl
    this.app = app
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      threshold: 0.01
    })
    this.observer.observe(this.el)
  }

  handleIntersection (entries, observer) {
    const [pageEntry] = entries
    console.log(pageEntry, this.el)
  }
}
