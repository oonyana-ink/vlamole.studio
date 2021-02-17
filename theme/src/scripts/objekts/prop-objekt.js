import Objekt from './objekt'

export default class PropObjekt extends Objekt {
  direction = null

  constructor (model, opts) {
    const { direction, parent, meta } = opts
    super(model)
    const edgeLines = this.generateEdgeGeometry(model, meta.color)
    this.model = edgeLines
    parent.model.add(edgeLines)
    this.direction = direction
  }

  update () {
    let rotationIncrement = 0.05
    rotationIncrement = this.direction === 'cw' ? -rotationIncrement : rotationIncrement
    this.rotateYAxis(rotationIncrement)
  }
}
