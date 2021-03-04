import Loader from './loader'

let __LOADER__ = null
const __MODELS__ = []

export default class Model {
  name = null
  object3D = null
  geometry = null
  material = null
  mesh = null

  state = {
    loading: false,
    loaded: false
  }

  meta = {}

  children = []
  callbacks = []

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
        .then(gltf => this.processObject3D(gltf.scene))
    } else if (object3D) {
      this.processObject3D(object3D)
    }

    __MODELS__.push(this)
  }

  get boundingBox () {
    const { __boundsCache } = this
    const now = Date.now()

    if (!__boundsCache.bounds) {
      __boundsCache.bounds = new THREE.Vector3()
    }

    if (!__boundsCache.timestamp || now - __boundsCache.timestamp > __boundsCache.lifetime ) {
      const bbox = new THREE.Box3().setFromObject(this.object3D)
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
    return this.object3D
  }

  set scale (scale) {
    const { scalar: sceneScalar } = this.scene
    let xScale, yScale, zScale

    if (scale instanceof Array) {
      [xScale, yScale, zScale] = scale
    } else if (typeof scale === 'number') {
      xScale = scale
    } else {
      throw "Model[set scale] Only accepts arrays and numbers"
    }

    yScale = yScale || xScale
    zScale = zScale || xScale
    this.object3D.scale.set(xScale / sceneScalar, yScale / sceneScalar, zScale / sceneScalar)
  }

  set size (size) {
    let xSize, ySize, zSize

    if (size instanceof Array) {
      [xSize, ySize, zSize] = size
    } else if (typeof size === 'number') {
      xSize = size
    }

    const {
      x: xBounds,
      y: yBounds,
      z: zBounds
    } = this.boundingBox

    const xScale = xSize / xBounds
    const yScale = ySize ? ySize / yBounds : xScale
    const zScale = zSize ? zSize / zBounds : xScale

    this.scale = [xScale, yScale, zScale]
  }

  processObject3D (object3D) {
    this.object3D = object3D
    this.name = this.name || object3D.name

    if (/^mesh$/i.test(object3D.type)) {
      this.geometry = object3D.geometry
      this.material = object3D.material
      this.mesh = object3D
    }

    if (object3D.modelMeta) {
      this.setMeta(object3D.modelMeta)
    }
    this.processChildren(object3D.children)
    this.applyMeta()

    this.state.loading = false
    this.state.loaded = true
    this.executeCallbacks()
    this.loaded()
  }

  processChildren (children) {
    children.forEach(child => this._processChild(child))
  }

  loaded () {}
  addedToScene () {}

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
    this.object3D[key].set(value)
  }

  set3DProperty(key, x, y, z) {
    if (x instanceof Array) {
      [x, y, z] = x
    }

    this.object3D[key].set(
      this._castValue(x),
      this._castValue(y),
      this._castValue(z)
    )
  }

  add (model) {
    this.children.push(model)
    if (model.isClone) {
      this.model.add(model.model)
    }
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
        case 'rotation':
          this.set3DProperty(key, value)
          break
        case 'size':
          this.size = value
          break
      }
    })
  }

  _processChild (child) {
    const { modelMeta } = child

    if (modelMeta.clone) {
      this._cloneChild(child)
      return
    }

    const ModelClass = modelMeta.class ? modelMeta.class : Model
    const childModel = new ModelClass(child)
    this.add(childModel)
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

  _castValue (value) {
    if (typeof value === 'string') {
      value = /deg$/.test(value) && THREE.Math.degToRad(parseFloat(value))
    }

    return value
  }

  static getByName (name) {
    return __MODELS__.find(model => model.name === name)
  }
}
