const { THREE } = window
export default class Objekt {
  model = false
  animations = []
  childObjekts = []

  offsets = {
    position: () => [0, 0, 0],
    rotation: () => [0, 0, 0],
    scale: 1
  }

  constructor (model) {
    this.model = model
  }

  onLoad (gltf) {
    this.model = gltf.scene
    this.animations = gltf.animations
    this.scene.add(this)
    this.loaded()
  }

  onProgress () {
    console.log('onProgress')
  }

  onLoadError (error) {
    console.log('onLoadError', error)
  }

  update () {
    this.childObjekts.forEach(childObjekt => childObjekt.update())
  }

  setPosition (x, y, z) {
    const { model, offsets } = this
    const [xOffset, yOffset, zOffset] = offsets.position()

    model.position.set(x + xOffset, y + yOffset, z + zOffset)
  }

  setRotation (x, y, z) {
    const { model, offsets } = this
    const [xOffset, yOffset, zOffset] = offsets.rotation()

    model.rotation.set(x + xOffset, y + yOffset, z + zOffset)
  }

  setScalePx (scalePx, opts) {
    const {
      saveAsOffset = false
    } = opts
    const bbox = new THREE.Box3().setFromObject(this.model)
    const sizeV = new THREE.Vector3()
    bbox.getSize(sizeV)
    const scaledPx = scalePx / sizeV.x
    this.setScale(scaledPx)

    if (saveAsOffset) {
      this.offsets.scale = scaledPx
    }
  }

  setScale (scaleX, scaleY, scaleZ) {
    const { model } = this
    const { scale: scaleOffset } = this.offsets

    scaleY = scaleY === undefined ? scaleX : scaleY
    scaleZ = scaleZ === undefined ? scaleX : scaleZ

    model.scale.set(scaleX * scaleOffset, scaleY * scaleOffset, scaleZ * scaleOffset)
  }

  rotateXAxis (value, type = 'rad') {
    const xAxis = new THREE.Vector3(1, 0, 0)
    const radian = type === 'rad' ? value : THREE.Math.degToRad(value)
    this.model.rotateOnAxis(xAxis, radian)
  }

  rotateYAxis (value, type = 'rad') {
    const yAxis = new THREE.Vector3(0, 1, 0)
    const radian = type === 'rad' ? value : THREE.Math.degToRad(value)
    this.model.rotateOnAxis(yAxis, radian)
  }

  rotateZAxis (value, type = 'rad') {
    const zAxis = new THREE.Vector3(0, 0, 1)
    const radian = type === 'rad' ? value : THREE.Math.degToRad(value)
    this.model.rotateOnAxis(zAxis, radian)
  }

  positionXAxis (value) {
    const { x, y, z } = this.model.position
    this.setPosition(value, y, z)
  }

  positionYAxis (value) {
    const { x, y, z } = this.model.position
    this.setPosition(x, value, z)
  }

  positionZAxis (value) {
    const { x, y, z } = this.model.position
    this.setPosition(x, y, value)
  }
}
