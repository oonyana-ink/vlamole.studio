import { assetsURL } from '../config'
import utils from '../utils'

const { THREE } = window

export default class Scene {
  // DOM
  $el = null

  // Three.js objects
  scene = null
  camera = null
  renderer = null
  dracoLoader = null
  gltfLoader = null
  orbitControls = null

  // Properties
  debugging = false
  screenDepth = null

  options = {
    renderer: {
      alpha: true,
      antialias: true
    },
    camera: {
      fov: 40,
      near: 0.1,
      far: 10000
    },
    dracoLoader: {
      decorderPath: `${assetsURL}/`
    },
    grid: {
      size: 2000,
      divisions: 20
    }
  }

  lights = [
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.7,
      position: ({ canvasWidth, canvasHeight, canvasDepth }) => [canvasWidth * 0.5, canvasHeight * 1, canvasDepth],
      debugColor: 0xff0000 // Red
    },
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.5,
      position: ({ canvasHeight, canvasDepth }) => [0, -canvasHeight, -canvasDepth * 0.5],
      debugColor: 0x00ff00 // Green
    },
    {
      Type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.5,
      position: ({ canvasWidth, canvasHeight, canvasDepth }) => [-canvasDepth, -canvasHeight * 0, canvasDepth * 0.5],
      debugColor: 0x0000ff // Blue
    },
    {
      Type: THREE.AmbientLight,
      color: 0xffffff,
      intensity: 0.2,
      debugColor: 0xff00ff // Magenta
    }
  ]

  debuggingGeometry = {
    grid: null,
    camera: null,
    lights: [],
    cache: {
      camera: null
    }
  }

  models = []
  frame = 0

  constructor (opts = {}) {
    const { $el } = opts

    this.$el = $el

    this.setupScene()
    this.setupCamera()
    this.setupRenderer()

    this.calculateScreenDepth()

    this.setupGLTFLoader()
    this.setupLights()

    this.update()
    this.animate()

    this.setupDebugging()
  }

  get canvasBounds () {
    return {
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
      canvasDepth: this.screenDepth
    }
  }

  setupScene () {
    this.scene = new THREE.Scene()
  }

  setupCamera () {
    const { fov, near, far } = this.options.camera
    const { canvasWidth, canvasHeight } = this.canvasBounds
    this.camera = new THREE.PerspectiveCamera(fov, canvasWidth / canvasHeight, near, far)
    this.scene.add(this.camera)
  }

  setupRenderer () {
    const { canvasWidth, canvasHeight } = this.canvasBounds
    this.renderer = new THREE.WebGLRenderer(this.options.renderer)
    this.renderer.setSize(canvasWidth, canvasHeight)
    this.$el.appendChild(this.renderer.domElement)
  }

  setupGLTFLoader () {
    const { decorderPath } = this.options.dracoLoader

    this.gltfLoader = new THREE.GLTFLoader()
    this.dracoLoader = new THREE.DRACOLoader()
    this.dracoLoader.setDecoderPath(decorderPath)
    this.gltfLoader.setDRACOLoader(this.dracoLoader)
  }

  setupLights () {
    const { canvasBounds, scene } = this
    this.lights.forEach(light => {
      const instance = new light.Type(light.color)
      instance.intensity = light.intensity || 1

      if (light.position) {
        instance.position.set.apply(instance.position, light.position(canvasBounds))
      }

      light.instance = instance
      scene.add(light.instance)
    })
  }

  setupGrid () {
    const { size, divisions } = this.options.grid
    this.debuggingGeometry.grid = new THREE.GridHelper(size, divisions)
  }

  setupOrbitControls () {
    this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    this.orbitControls.enabled = false
  }

  setupDebugging () {
    this.setupDebugToggle()
    this.setupGrid()
    this.setupOrbitControls()
    this.setupDebuggingGeometry()
  }

  setupDebugToggle () {
    document.addEventListener('keyup', (evnt) => {
      if (evnt.code === 'Escape' && evnt.ctrlKey) {
        if (!this.debugging) {
          this.startDebugging()
        } else {
          this.stopDebugging()
        }

        this.debugging = !this.debugging
      }
    })
  }

  setupDebuggingGeometry () {
    const { canvasBounds } = this

    const cameraGeo = new THREE.BoxGeometry(20, 20, 40)
    const cameraMat = new THREE.MeshBasicMaterial({ color: 0xffff0 })
    const cameraMesh = new THREE.Mesh(cameraGeo, cameraMat)

    cameraMesh.position.z = this.camera.position.z
    console.log('cameraMesh.position.z', cameraMesh.position.z)

    this.debuggingGeometry.camera = cameraMesh

    this.lights.forEach(light => {
      const lightGeo = new THREE.SphereGeometry(20, 20, 20)
      const lightMat = new THREE.MeshBasicMaterial({ color: light.debugColor })
      const lightMesh = new THREE.Mesh(lightGeo, lightMat)

      if (light.position) {
        lightMesh.position.set.apply(lightMesh.position, light.position(canvasBounds))
      }

      this.debuggingGeometry.lights.push(lightMesh)
    })
  }

  startDebugging () {
    const { camera, grid, cache, lights } = this.debuggingGeometry
    const { position: cameraPosition } = this.camera
    let geometry = []

    geometry.push(camera)
    geometry.push(grid)
    geometry = geometry.concat(lights)
    geometry.forEach(object => this.scene.add(object))

    this.orbitControls.enabled = true
    cache.camera = { position: cameraPosition }
    this.orbitControls.update()
  }

  stopDebugging () {
    const { camera, grid, cache, lights } = this.debuggingGeometry
    let geometry = []

    geometry.push(camera)
    geometry.push(grid)
    geometry = geometry.concat(lights)

    geometry.forEach(geometry => this.scene.remove(geometry))

    this.orbitControls.reset()
    Object.assign(this.camera.position, cache.camera.position)
    this.camera.updateProjectionMatrix()
    this.orbitControls.update()

    this.orbitControls.enabled = false
  }

  calculateScreenDepth () {
    this.screenDepth = utils.findScreenDepth(this.camera, this.renderer)
    console.log('screenDepth', this.screenDepth)
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }

  update () {
    const { canvasDepth } = this.canvasBounds

    if (this.debugging) {
      this.updateDebugging()
    } else {
      this.camera.position.z = canvasDepth
    }

    this.models.forEach(model => model.update(this.frame))
    this.frame += 1

    this.render()
  }


  updateDebugging () {
    this.orbitControls.update()
  }

  animate () {
    this.update()
    // window.requestAnimationFrame(this.animate.bind(this))
    setTimeout(this.animate.bind(this), 4000)
  }

  add (objekt) {
    objekt.scene = this

    if (objekt.filename && !objekt.model) {
      return this.loadObjekt(objekt)
    }

    this.models.push(objekt)
    this.scene.add(objekt.model)
  }

  addModelChild (modelChild) {
    this.scene.add(modelChild)
  }

  loadObjekt (objekt) {
    this.gltfLoader.load(
      `${assetsURL}/${objekt.filename}`,
      (gltf) => objekt.onLoad(gltf),
      (xhr) => objekt.onProgress(xhr),
      (error) => objekt.onLoadError(error)
    )
  }
}
