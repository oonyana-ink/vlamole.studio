import Loader from './loader'

let __LOADER__ = null
const __MODELS__ = []

export default class Model {
  name = null
  container
  object3D = null
  geometry = null
  material = null
  mesh = null
  transformTarget = null

  state = {
    loading: false,
    loaded: false
  }

  meta = {}

  children = []
  callbacks = []

  __size = {
    x: 1, y: 1, z: 1
  }

  __boundsCache = {
    bounds: null,
    timestamp: null,
    lifetime: 100
  }

  constructor (object3D, {
    filename = null
  } = {}) {
    if (filename) {
      if (!__LOADER__) {
        __LOADER__ = new Loader()
      }
      this.state.loading = true
      __LOADER__.loadModel(filename)
        .then(gltf => this.init(gltf.scene))
    } else if (object3D) {
      this.init(object3D)
    }

    __MODELS__.push(this)
  }

  get boundingBox () {
    const { __boundsCache } = this
    const now = Date.now()

    if (!__boundsCache.bounds) {
      __boundsCache.bounds = new THREE.Vector3()
    }

    if (!__boundsCache.timestamp || now - __boundsCache.timestamp > __boundsCache.lifetime) {
      const bbox = new THREE.Box3().setFromObject(this.model)
      bbox.getSize(__boundsCache.bounds)
      __boundsCache.timestamp = now
    }

    const { x, y, z } = __boundsCache.bounds

    return {
      x, y, z,
      width: x,
      height: y,
      depth: z
    }
  }

  get isLoading () {
    return this.state.loading
  }

  get model () {
    return this.transformTarget || this.container || this.object3D
  }

  get scale () {
    return this.model.scale
  }

  set scale (scale) {
    const { scalar: sceneScalar } = this.scene
    let xScale, yScale, zScale

    if (scale instanceof Array) {
      [xScale, yScale, zScale] = scale
    } else if (typeof scale === 'number') {
      xScale = scale
    } else {
      throw new Error('Model[set scale] Only accepts arrays and numbers')
    }

    yScale = yScale || xScale
    zScale = zScale || xScale
    this.model.scale.set(xScale / sceneScalar, yScale / sceneScalar, zScale / sceneScalar)
  }

  get size () {
    return this.__size
  }

  set size (size) {
    const [xSize, ySize, zSize] = this._processXYZ(size)

    const {
      x: xBounds,
      y: yBounds,
      z: zBounds
    } = this.boundingBox

    this.__size = {
      x: xSize,
      y: ySize,
      z: zSize
    }

    console.log(size, this.__size)

    const xScale = xSize / xBounds
    const yScale = ySize ? ySize / yBounds : xScale
    const zScale = zSize ? zSize / zBounds : xScale

    this.scale = [xScale, yScale, zScale]
  }

  get position () {
    return this.model.position
  }

  set position (position) {
    const [xPos, yPos, zPos] = this._processXYZ(position, { current: this.model.position, scaled: true })
    this.model.position.set(xPos, yPos, zPos)
  }

  get rotation () {
    return this.model.rotation
  }

  set rotation (rotation) {
    const [xRotation, yRotation, zRotation] = this._processXYZ(rotation, { current: this.model.rotation })
    this.model.rotation.set(xRotation, yRotation, zRotation)
  }

  init (object3D) {
    if (object3D.modelMeta) {
      this.setMeta(object3D.modelMeta)
    }

    if (this.meta.wireframe) {
      object3D = this.generateWireframe(object3D)
    }

    this.processObject3D(object3D)
    this.processChildren(this.object3D.children)
    this._ensureChildrenAreAdded()

    if (this.meta.useContainer) {
      this.container = new THREE.Group()
      this.container.add(this.object3D)
    }
    this.applyMeta()

    this.state.loading = false
    this.state.loaded = true
    this.executeCallbacks()
    this.loaded()
  }

  processObject3D (object3D) {
    this.object3D = object3D
    this.name = this.name || object3D.name

    if (/^mesh$/i.test(object3D.type)) {
      this.geometry = object3D.geometry
      this.material = object3D.material
      this.mesh = object3D
    }
  }

  generateWireframe (object3D) {
    const geometry = new THREE.EdgesGeometry(object3D.geometry, 10)
    const material = new THREE.LineBasicMaterial({
      linewidth: 1,
      color: 0xff00ff
    })
    const lineSegments = new THREE.LineSegments(geometry, material)
    lineSegments.computeLineDistances()
    return lineSegments
  }

  processChildren (children) {
    children.forEach(child => this._processChild(child))
  }

  onLoad (callback) {
    this.callbacks.push(callback)
    if (this.state.loaded) {
      this.executeCallbacks()
    }
  }

  executeCallbacks () {
    this.callbacks.forEach(callback => callback.call(this))
    this.callbacks = []
  }

  set (key, value) {
    this.model[key].set(value)
  }

  set3DProperty (key, x, y, z) {
    if (x instanceof Function) {
      [x, y, z] = x()
    }
    if (x instanceof Array) {
      [x, y, z] = x
    }

    this.model[key].set(
      this._castValue(x),
      this._castValue(y),
      this._castValue(z)
    )
  }

  add (model) {
    if (!this.children.includes(model)) {
      this.children.add(model)
    }
    this.object3D.add(model.model)
  }

  isChild (possibleChild) {
    const childIndex = this.children.findIndex(child => child === possibleChild)
    return childIndex > -1
  }

  setMeta (meta) {
    Object.assign(this.meta, meta)
  }

  applyMeta () {
    Object.entries(this.meta).forEach(([key, value]) => {
      switch (key) {
      case 'isClone':
        this.isClone = value
        break
      case 'position':
        this.position = value
        break
      case 'rotation':
        this.rotation = value
        break
      case 'size':
        this.size = value
        break
      }
    })
  }

  _update (frame) {
    if (!this.isLoading) {
      this.update(frame)
      this.children.forEach(child => child._update(frame))
    }
  }

  _processChild (child) {
    const { modelMeta = {} } = child

    if (modelMeta.clone) {
      this._cloneChild(child)
      return
    }

    const ModelClass = modelMeta.class ? modelMeta.class : Model
    const childModel = new ModelClass(child)

    this.children.push(childModel)
  }

  _cloneChild (child) {
    const { modelMeta } = child
    modelMeta.clone.forEach((cloneMeta, cloneIndex) => {
      let childClone = child
      if (cloneIndex > 0) {
        childClone = child.clone()
        cloneMeta.isClone = true
      }
      childClone.modelMeta = cloneMeta
      this._processChild(childClone)
    })
  }

  _ensureChildrenAreAdded () {
    this.children.forEach(child => this.add(child))
  }

  _castValue (value) {
    if (typeof value === 'string') {
      value = /deg$/.test(value) && THREE.Math.degToRad(parseFloat(value))
    }

    return value
  }

  _processXYZ (x, y, z, opts = {}) {
    if (x instanceof Object && y instanceof Object) {
      opts = y
    }

    const { current, scaled } = opts
    const scalar = scaled && this.scene ? this.scene.scalar : 1
    const _value = function (value, fallback) {
      return value === undefined ? fallback : value
    }

    let _x = current ? current.x * scalar : x
    let _y = current ? current.y * scalar : y
    let _z = current ? current.z * scalar : z

    if (x instanceof Function) {
      x = x()
      console.log('---->', x)
    }

    if (x instanceof Array) {
      _x = _value(x[0], _x)
      _y = _value(x[1], _y)
      _z = _value(x[2], _z)
    } else if (x instanceof Object) {
      _x = _value(x.x, _x)
      _y = _value(x.y, _y)
      _z = _value(x.z, _z)
    }

    _x = this._castValue(_x)
    _y = this._castValue(_y)
    _z = this._castValue(_z)

    return [
      _x / scalar,
      _y / scalar,
      _z / scalar
    ]
  }

  // NOOPs
  loaded () {}
  addedToScene () {}
  update () {}

  static getByName (name) {
    return __MODELS__.find(model => model.name === name)
  }
}
