import { watch } from 'vue'
import Loader from './loader'

let __LOADER__ = null
const __MODELS__ = []

export default class Model {
  name = null
  container = null
  object3D = null
  _geometry = null
  _material = null
  _mesh = null

  state = {
    loading: false,
    loaded: false
  }
  store = null

  meta = {}
  groups = {}

  children = []
  loadCallbacks = []
  initCallbacks = []

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

    if (!__boundsCache.bounds) {
      __boundsCache.bounds = this._getBounds(this.model)
    }

    const { x, y, z } = __boundsCache.bounds

    return {
      x,
      y,
      z,
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
    return [this.__size.x]
  }

  set size (size) {
    const [xSize, ySize, zSize] = this._processXYZ(size)

    const {
      x: xBounds,
      y: yBounds,
      z: zBounds
    } = this.boundingBox

    this.__size = new THREE.Vector3(xSize, ySize, zSize)

    const xScale = xSize / xBounds
    const yScale = ySize ? ySize / yBounds : xScale
    const zScale = zSize ? zSize / zBounds : xScale

    this.scale = [xScale, yScale, zScale]
  }

  get position () {
    return this.model.position.clone().multiplyScalar(this.scene.scalar)
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

  get rotationDegrees () {
    return {
      x: THREE.MathUtils.radToDeg(this.rotation.x),
      y: THREE.MathUtils.radToDeg(this.rotation.y),
      z: THREE.MathUtils.radToDeg(this.rotation.z)
    }
  }

  set rotationDegrees (rotationDegrees) {
    const [xRotation, yRotation, zRotation] = this._processXYZ(rotationDegrees, { current: this.rotationDegrees })
    this.rotation = [
      THREE.MathUtils.degToRad(xRotation),
      THREE.MathUtils.degToRad(yRotation),
      THREE.MathUtils.degToRad(zRotation)
    ]
  }

  get material () {
    return this._material
  }

  set material (material) {
    if (material.class) {
      const MaterialClass = material.class
      this._material = new MaterialClass()
      this._mesh.material = this._material
      delete material.class
    }

    Object.entries(material).forEach(([key, value]) => {
      if (this._material[key].set) {
        this._material[key].set(value)
      } else {
        this._material[key] = value
      }
    })
  }

  get transformTarget () {
    return this._transformTarget
  }

  set transformTarget (target) {
    this._transformTarget = typeof target === 'string'
      ? target === 'default'
        ? null
        : this[target]
      : target
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

  attachStore (store, stateKey) {
    this.state = store.state[stateKey]
    this.store = store
    watch(() => this.state.updated, this.updateFromStore.bind(this))
    this.updateFromStore()
  }

  processObject3D (object3D) {
    this.object3D = object3D
    this.name = this.name || object3D.name
    this._geometry = object3D.geometry
    this._material = object3D.material
    this._mesh = object3D
  }

  generateWireframe (object3D, opts = {}) {
    const {
      material: materialOpts = {}
    } = opts

    if (object3D.type === 'LineSegments') { return object3D.clone() }
    if (object3D.type === 'Group') {
      const clonedGroup = new THREE.Group()
      object3D.children.forEach(child => {
        const wireframeChild = this.generateWireframe(child)
        clonedGroup.name = child.name
        wireframeChild.rotation.set(child.rotation.x, child.rotation.y, child.rotation.z)
        wireframeChild.position.set(child.position.x, child.position.y, child.position.z)
        wireframeChild.material.transparent = true
        wireframeChild.material.opacity = 0
        wireframeChild.material.color.set(0xffffff)
        clonedGroup.add(wireframeChild)
      })
      return clonedGroup
    }

    const geometry = new THREE.EdgesGeometry(object3D.geometry, 30)
    const material = new THREE.LineBasicMaterial(Object.assign({
      linewidth: 1,
      color: 0xff00ff
    }, materialOpts))
    const lineSegments = new THREE.LineSegments(geometry, material)
    lineSegments.computeLineDistances()
    lineSegments.name = object3D.name

    return lineSegments
  }

  processChildren (children) {
    children.forEach(child => this._processChild(child))
  }

  onLoad (callback) {
    this.loadCallbacks.push(callback)
    if (this.state.loaded) {
      this.executeCallbacks()
    }
  }

  executeCallbacks () {
    while (this.initCallbacks.length > 0) {
      const initCallback = this.initCallbacks.shift()
      initCallback(this)
    }

    while (this.loadCallbacks.length > 0) {
      const loadCallback = this.loadCallbacks.shift()
      loadCallback(this)
    }
  }

  set (key, value) {
    if (key instanceof Object) {
      return Object.entries(key).forEach(([key, value]) => this.set(key, value))
    }

    if (this[key]) {
      this[key] = value
    }
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
      case 'material':
        this.material = value
        break
      }
    })
  }

  onInit (callback) {
    this.initCallbacks.push(callback)
  }

  getArraysInObject (keys) {
    const arrayObject = {}
    keys.forEach(key => {
      if (key in this) {
        arrayObject[key] = this[key].toArray ? this[key].toArray() : this[key]
        if (key === 'rotation') {
          arrayObject[key][0] = `${THREE.MathUtils.radToDeg(arrayObject[key][0])}deg`
          arrayObject[key][1] = `${THREE.MathUtils.radToDeg(arrayObject[key][1])}deg`
          arrayObject[key][2] = `${THREE.MathUtils.radToDeg(arrayObject[key][2])}deg`
        }
      }
    })
    return arrayObject
  }

  interpolate (interpolations, ratio) {
    Object.entries(interpolations).forEach(([key, interpolation]) => {
      try {
        this[`${key}Interpolator`](interpolation, ratio)
      } catch (e) {
        console.error(`Unable to execute ${key}Interpolator`, e)
      }
    })
  }

  setState (state) {
    Object.assign(this.state, state)
  }

  updateFromStore () {
    this.position = this.state.position
    this.rotation = this.state.rotation
    this.size = this.state.size
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

    childModel.parent = this
    childModel.scene = this.scene
    this.object3D.remove(child)

    if (modelMeta.group) {
      if (!this.groups[modelMeta.group]) {
        const group = {
          name: modelMeta.group,
          models: [],
          _group: new THREE.Group(),
          add (model) {
            this.models.push(model)
            this._group.add(model.model)
          }
        }
        group._group.name = modelMeta.group
        this.groups[modelMeta.group] = group
        this.object3D.add(group._group)
      }

      this.groups[modelMeta.group].add(childModel)
    } else {
      this.object3D.add(childModel.model)
    }

    child._model = childModel
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
      this.processChild(childClone)
      this._processChild(childClone)
    })
  }

  _ensureChildrenAreAdded () {
    // this.children.forEach(child => this.add(child))
  }

  _castValue (value) {
    if (typeof value === 'string') {
      value = (/deg$/.test(value) && THREE.Math.degToRad(parseFloat(value))) ||
              (/cw$/.test(value) && (parseInt(value)/100) * this.scene.width)
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
      x = x(this)
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

  _getBounds (object3D) {
    const bbox = new THREE.Box3().setFromObject(object3D)
    const bounds = new THREE.Vector3()
    bbox.getSize(bounds)
    return bounds
  }

  // NOOPs
  loaded () {}
  addedToScene () {}
  update () {}

  static getByName (name) {
    return __MODELS__.find(model => model.name === name)
  }
}
