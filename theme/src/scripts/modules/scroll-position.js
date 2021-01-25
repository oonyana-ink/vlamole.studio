const { requestAnimationFrame } = window

export default class ScrollPosition {
  callbacks = []

  position = {
    x: 0,
    y: 0
  }

  constructor ({ app }) {
    app.onScroll = this.onScroll.bind(this)
  }

  start () {
    this.watch()
  }

  onScroll (callback) {
    this.callbacks.push(callback)
  }

  watch () {
    const { scrollingElement } = document
    const { scrollLeft, scrollTop } = scrollingElement

    if (scrollLeft !== this.position.x || scrollTop !== this.position.y) {
      this.position.x = scrollingElement.scrollLeft
      this.position.y = scrollingElement.scrollTop
      this.update()
    }

    requestAnimationFrame(this.watch.bind(this))
  }

  update () {
    this.callbacks.forEach(callback => callback(this.position))
  }
}
