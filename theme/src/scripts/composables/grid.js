import { reactive, ref } from 'vue'
class Grid {
  app = null
  options = {}
  rem = 0
  resizeTimeout = null
  grids = {}

  grid = reactive({
    resizing: false,
    columnCount: 0,
    margin: 0,
    gutter: 0,
    columnWidth: 0
  })

  get columnCount () { return 12 }
  get margin () { return window.innerWidth * 0.06 }
  get gutter () { return this.rem }
  get columnWidth () {
    return (window.innerWidth - (this.margin * 2) - ((this.columnCount - 1) * this.gutter)) / this.columnCount
  }


  constructor (app, options = {}) {
    this.app = app
    this.options = options

    this.calculateGrid()
    this.getREM()
    this.extendApp()
    this.watchWindow()
  }

  extendApp () {
    this.app.provide('grid', this.grid)
    this.app.provide('gridWidth', this.gridWidth.bind(this))
  }

  calculateGrid () {
    this.grid.columnCount = this.columnCount
    this.grid.margin = this.margin
    this.grid.columnWidth = this.columnWidth
    for (let cols in this.grids) {
      let newWidth = this.columnsWidth(cols)
      this.grids[cols].value = newWidth
    }
  }

  gridWidth ({ cols }) {
    if (!this.grids[cols]) {
      this.grids[cols] = ref(this.columnsWidth(cols))
    }

    return this.grids[cols]
  }

  columnsWidth (count) {
    return this.grid.columnWidth * count + this.grid.gutter * (count - 1)
  }

  getREM () {
    return window.getComputedStyle(document.body, null).getPropertyValue('font-size')
  }

  watchWindow () {
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  handleResize () {
    this.grid.resizing = true
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }
    this.resizeTimeout = setTimeout(() => {
      this.grid.resizing = false
      this.calculateGrid()
    }, 300)
  }
}

export default {
  install (app, options) {
    return new Grid(app, options)
  }
}
