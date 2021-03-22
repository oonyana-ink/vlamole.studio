import Model from './model'

export class Propeller extends Model {
  spinIncrement = Math.PI * 0.01

  set material (material) { console.log('---', material) }
  get material () { return this._material }

  update () {
    const { y: yRotation } = this.rotation
    const { direction } = this.meta
    this.rotation = {
      y: yRotation + (direction === 'CCW' ? this.spinIncrement : this.spinIncrement * -1)
    }
  }
}
