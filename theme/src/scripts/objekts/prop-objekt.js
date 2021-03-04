import Objekt from './objekt'

export default class PropObjekt extends Objekt {
  direction = null

  constructor (model, opts) {
    super(model)
    const { direction, meta } = opts
    if (model.type !== 'LineSegments') {
      const edgeLines = this.generateEdgeGeometry(model, meta.color)
      model.material.visible = false
      model.setToRemove = true
      this.edgeLines = edgeLines
    }

    // this.model.objekt = this

    this.direction = direction
  }

  update () {
    // let rotationIncrement = 0.05
    // rotationIncrement = this.direction === 'cw' ? -rotationIncrement : rotationIncrement
    // this.rotateYAxis(rotationIncrement)
  }
}
