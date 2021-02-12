export default class Parallax {
  constructor ({ app }) {
    this.app = app
    this.app.onScroll(this.onScroll.bind(this))
    this.root = document.documentElement
  }

  onScroll ({ x, y }) {
    this.root.style.setProperty('--scroll-y', `${y}px`)
  }
}
