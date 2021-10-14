class Grid {
  rem = 0

  constructor () {
    this.getREM()
  }

  get columnCount () { return 12 }
  get margin () { return window.innerWidth * 0.06 }
  get gutter () { return this.rem }
  get columnWidth () {
    return (window.innerWidth - (this.margin * 2) - ((this.columnCount - 1) * this.gutter)) / this.columnCount
  }

  columnsWidth (count) {
    return this.columnWidth * count + this.gutter * (count - 1)
  }

  getREM () {
    return window.getComputedStyle(document.body, null).getPropertyValue('font-size')
  }
}

const grid = new Grid()
export default grid
