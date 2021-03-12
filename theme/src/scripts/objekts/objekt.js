import THREE from '@vendor/three.import'

export default class Objekt {
  _priv = {
    gltf: null,
    animations: null,
    models: {
      default: null
    },
    group: null
  }

  animations = []
  childObjekts = []
  models = {
    default: null
  }

  offsets = {
    position: () => [0, 0, 0],
    rotation: () => [0, 0, 0],
    scale: 1
  }

  constructor ({ model }) {
    this.setModel(model)
  }

  get model () {
    return this._priv.models.default
  }

  setModel (model) {
    this._priv.models.default = model
  }

  onLoad (gltf) {
    const { _priv } = this
    _priv.gltf = gltf
    _priv.models.default = gltf.scene.clone()
    _priv.animations = gltf.animations
    this.loaded = true
    return this
  }

  onProgress () {
  }

  onLoadError (error) {
  }

  update () {
    this.childObjekts.forEach(childObjekt => childObjekt.update())
  }

  setPosition (x, y, z, { scaled = false } = {}) {
    if (x instanceof Array) { [x, y, z] = x }
    const { model, offsets } = this
    const { canvasScalar } = this.scene.canvasBounds
    const [xOffset, yOffset, zOffset] = offsets.position()
    this.position = {
      x: x + xOffset,
      y: y + yOffset,
      z: z + zOffset
    }
    model.position.set(
      this.position.x * canvasScalar,
      this.position.y * canvasScalar,
      this.position.z * canvasScalar
    )
  }

  setRotation (x, y, z) {
    if (x instanceof Array) { [x, y, z] = x }
    const { model, offsets } = this
    const [xOffset, yOffset, zOffset] = offsets.rotation()

    model.rotation.set(x + xOffset, y + yOffset, z + zOffset)
  }

  setRotationDegrees (x, y, z) {
    if (x instanceof Array) { [x, y, z] = x }
    const xRad = THREE.Math.degToRad(x)
    const yRad = THREE.Math.degToRad(y)
    const zRad = THREE.Math.degToRad(z)

    this.setRotation(xRad, yRad, zRad)
  }

  setScalePx (scalePx, opts = {}) {
    const {
      saveAsOffset = false
    } = opts
    const { canvasScalar } = this.scene.canvasBounds

    this.model.scale.set(1, 1, 1)
    this.bbox = this.bbox || new THREE.Box3().setFromObject(this.model)
    this.sizeV = this.sizeV || new THREE.Vector3()
    this.bbox.getSize(this.sizeV)

    const scaledPx = (scalePx / this.sizeV.x) * canvasScalar
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
    const { y, z } = this.position
    this.setPosition(value, y, z)
  }

  positionYAxis (value) {
    const { x, z } = this.position
    this.setPosition(x, value, z)
  }

  positionZAxis (value) {
    const { x, y } = this.position
    this.setPosition(x, y, value)
  }

  generateEdgeGeometry (child, color = 0xffffff) {
    const edges = new THREE.EdgesGeometry(child.geometry, 60)
    const lineMaterial = new THREE.LineBasicMaterial({
      linewidth: 1,
      color
    })
    const edgeLines = new THREE.LineSegments(edges, lineMaterial)
    edgeLines.name = child.name
    edgeLines.computeLineDistances()
    edgeLines.position.set(child.position.x, child.position.y, child.position.z)
    edgeLines.rotation.set(child.rotation.x, child.rotation.y, child.rotation.z)

    return edgeLines
  }
}
