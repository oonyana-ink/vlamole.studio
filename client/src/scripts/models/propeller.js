import Model from './model'

export class Propeller extends Model {
  spinIncrement = Math.PI * 0.01

  update () {
    const { y: yRotation } = this.rotation
    const { direction } = this.meta
    this.rotation = {
      y: yRotation + (direction === 'CCW' ? this.spinIncrement : this.spinIncrement * -1)
    }
  }
}
