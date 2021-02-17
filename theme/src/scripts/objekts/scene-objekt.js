/* global requestAnimationFrame */

import THREE from '@vendor/three.import'
import utils from '../utils'

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
  assetsURL = null
  debugging = false
  screenDepth = null
  screenDepthScalar = 0.25
  ready = false

  options = {
    renderer: {
      alpha: true,
      // logarithmicDepthBuffer: true,
      antialias: true
    },
    camera: {
      fov: 40,
      near: 1,
      far: 2000
    },
    dracoLoader: {
      decorderPath: ''
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

  canvasDimensions = {
    height: 0,
    width: 0
  }

  postprocessing = {}
  outlineTargets = []

  models = []
  frame = 0

  constructor (opts = {}) {
    const {
      $el,
      canvas,
      assetsURL,
      width,
      height
    } = opts

    this.$el = $el
    this.canvas = canvas
    this.assetsURL = assetsURL
    this.canvasDimensions = { width, height }

    this.setupScene()
    this.setupPerspectiveCamera()
    this.setupRenderer()
    // this.setupPostProcessing()

    this.calculateScreenDepth()

    this.setupGLTFLoader()
    this.setupLights()

    this.update()
    this.animate()

    this.setupDebugging()

    this.ready = true
  }

  get canvasBounds () {
    return {
      canvasWidth: this.canvasDimensions.width,
      canvasHeight: this.canvasDimensions.height,
      canvasDepth: this.screenDepth && this.screenDepth * this.screenDepthScalar,
      canvasScalar: this.screenDepthScalar
    }
  }

  setupScene () {
    this.scene = new THREE.Scene()
  }

  setupPerspectiveCamera () {
    const { fov, near, far } = this.options.camera
    const { canvasWidth, canvasHeight } = this.canvasBounds
    this.camera = new THREE.PerspectiveCamera(fov, canvasWidth / canvasHeight, near, far)
  }

  setupOrthographicCamera () {
    const { canvasWidth, canvasHeight } = this.canvasBounds

    this.camera = new THREE.OrthographicCamera(canvasWidth / -2, canvasWidth / 2, canvasHeight / 2, canvasHeight / -2, 0, 3000)
    this.camera.zoom = 4.2
    this.scene.add(this.camera)
  }

  setupRenderer () {
    const { canvas } = this
    const { canvasWidth, canvasHeight } = this.canvasBounds
    const rendererOptions = Object.assign({ canvas }, this.options.renderer)
    this.renderer = new THREE.WebGLRenderer(rendererOptions)
    // this.renderer.shadowMap.enabled = true
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(canvasWidth, canvasHeight, false)
  }

  setupPostProcessing () {
    const {
      EffectComposer,
      RenderPass,
      ShaderPass,
      OutlinePass,
      FXAAShader,
      Vector2,
      Color
    } = THREE

    const {
      scene,
      camera,
      canvasBounds,
      renderer
    } = this

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const outlinePass = new OutlinePass(new Vector2(canvasBounds.canvasWidth, canvasBounds.canvasHeight), scene, camera)
    outlinePass.hiddenEdgeColor = new Color(0, 0, 0)
    outlinePass.edgeStrength = 10.0
    composer.addPass(outlinePass)

    const effectFXAA = new ShaderPass(FXAAShader)
    effectFXAA.uniforms.resolution.value.set(1 / canvasBounds.canvasWidth, 1 / canvasBounds.canvasHeight)

    // composer.addPass(effectFXAA)

    this.postprocessing = {
      composer,
      renderPass,
      outlinePass,
      effectFXAA
    }
  }

  setupGLTFLoader () {
    this.gltfLoader = new THREE.GLTFLoader()
    this.dracoLoader = new THREE.DRACOLoader()
    this.dracoLoader.setDecoderPath(`${this.assetsURL}/`)
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

      // if (instance.shadow) {
      //   instance.castShadow = true
      //   instance.shadow.camera.near = this.camera.near
      //   instance.shadow.camera.far = this.camera.far

      // }


      light.instance = instance
      scene.add(light.instance)
    })
  }

  setupGrid () {
    const { size, divisions } = this.options.grid
    this.debuggingGeometry.grid = new THREE.GridHelper(size, divisions)
  }

  setupOrbitControls () {
    // this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    // this.orbitControls.enabled = false
  }

  setupDebugging () {
    this.setupDebugToggle()
    this.setupGrid()
    this.setupOrbitControls()
    this.setupDebuggingGeometry()
  }

  setupDebugToggle () {
  //   document.addEventListener('keyup', (evnt) => {
  //     if (evnt.code === 'Escape' && evnt.ctrlKey) {
  //       if (!this.debugging) {
  //         this.startDebugging()
  //       } else {
  //         this.stopDebugging()
  //       }

  //       this.debugging = !this.debugging
  //     }
  //   })
  }

  setupDebuggingGeometry () {
    const { canvasBounds } = this

    const cameraGeo = new THREE.BoxGeometry(20, 20, 40)
    const cameraMat = new THREE.MeshBasicMaterial({ color: 0xffff0 })
    const cameraMesh = new THREE.Mesh(cameraGeo, cameraMat)

    cameraMesh.position.z = this.camera.position.z

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
    // if (this.cameraType === 'ortho') {
    //   return this.screenDepth = 300
    // }
    this.screenDepth = utils.findScreenDepth(this.camera, this.renderer)
  }

  render () {
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
    // this.postprocessing.composer.render()
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
    requestAnimationFrame(this.animate.bind(this))
    this.update()
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

  addToOutlinePass (modelChild) {
    this.outlineTargets.push(modelChild)
    this.postprocessing.outlinePass.selectedObjects = this.outlineTargets
  }

  loadObjekt (objekt) {
    this.gltfLoader.load(
      `${this.assetsURL}/${objekt.filename}`,
      (gltf) => objekt.onLoad(gltf),
      (xhr) => objekt.onProgress(xhr),
      (error) => objekt.onLoadError(error)
    )
  }

  set (opts) {
    console.log('set scene', opts)
    Object.entries(opts).forEach(([optKey, optValue]) => {
      optKey = utils.capitalize(optKey)
      this[`set${optKey}`](optValue)
    })
  }

  setCamera (type) {
    this.scene.remove(this.camera)
    this[`setup${utils.capitalize(type)}Camera`]()
  }
}
