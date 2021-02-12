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
    requestAnimationFrame(this.watch.bind(this))

    const { scrollingElement } = document
    const { scrollLeft, scrollTop } = scrollingElement

    if (scrollLeft !== this.position.x || scrollTop !== this.position.y) {
      this.position.x = scrollingElement.scrollLeft
      this.position.y = scrollingElement.scrollTop
      this.update()
      console.log(this.position)
    }
  }

  update () {
    this.callbacks.forEach(callback => callback(this.position))
  }
}
