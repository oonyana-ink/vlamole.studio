import Objekt from './objekt'

export default class PropObjekt extends Objekt {
  direction = null

  constructor (model, opts) {
    const { direction } = opts
    super(model)
    this.direction = direction
  }

  update () {
    let rotationIncrement = 0.2
    rotationIncrement = this.direction === 'cw' ? -rotationIncrement : rotationIncrement
    this.rotateYAxis(rotationIncrement)
  }
}
