class SceneObject {
  filename = null
  object3D = null

  offsets = {
    scale: 1,
    rotation: [0, 0, 0],
    position: [0, 0, 0]
  }

  material = {
    color: 0xCCCCCC,
    opacity: 1,
    dithering: true
  }

  constructor (opts = {}) {
    const {
      offsets = {},
      material = {}
    } = opts

    Object.assign(this.offsets, offsets)
    Object.assign(this.material, material)

    if (this.filename) {
      this.loadFile()
    }
  }

  loadFile () {

  }
}

export default SceneObject
