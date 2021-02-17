import THREE from '@vendor/three.import'

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

  get model () {
    return this.model
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
    const { y, z } = this.model.position
    this.setPosition(value, y, z)
  }

  positionYAxis (value) {
    const { x, z } = this.model.position
    this.setPosition(x, value, z)
  }

  positionZAxis (value) {
    const { x, y } = this.model.position
    this.setPosition(x, y, value)
  }

  generateEdgeGeometry (child, color = 0xffffff) {
    const edges = new THREE.EdgesGeometry(child.geometry, 60)
    const lineMaterial = /qpropeller/i.test(child.name)
      ? new THREE.LineDashedMaterial({
        transparent: true,
        dashSize: 3,
        gapSize: 2,
        color
      })
      : new THREE.LineBasicMaterial({
        linewidth: 2,
        color
      })
    const edgeLines = new THREE.LineSegments(edges, lineMaterial)
    edgeLines.computeLineDistances()
    edgeLines.position.set(child.position.x, child.position.y, child.position.z)
    edgeLines.rotation.set(child.rotation.x, child.rotation.y, child.rotation.z)
    child.material.visible = false

    return edgeLines
  }
}
