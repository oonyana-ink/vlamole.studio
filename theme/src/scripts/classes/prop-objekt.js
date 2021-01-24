import Objekt from './objekt'

export default class PropObjekt extends Objekt {
  direction = null

  constructor (model, opts) {
    const { direction } = opts

    super(model)
    this.direction = direction
    console.log('PropObjekt', this)
  }

  update () {
    const rotationIncrement = this.direction === 'cw' ? -0.1 : 0.1
    this.rotateYAxis(rotationIncrement)
  }
}
