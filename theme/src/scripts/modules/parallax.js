export default class Parallax {
  $els = []

  constructor ({ app }) {
    this.app = app
    this.app.onScroll(this.onScroll.bind(this))
  }

  onScroll ({ x, y }) {
    console.log('parallax', x, y)
  }
}
