import { assetsURL } from './config.js'

function Scene(opts) {
  const { innerWidth, innerHeight, THREE } = window
  const { animation } = opts

  const elementID = 'shopify-section-drone'
  const rootEl = document.getElementById(elementID)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 10000)
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  const gltfLoader = new THREE.GLTFLoader()
  const dracoLoader = new THREE.DRACOLoader()
  const orbitControls = new THREE.OrbitControls(camera, rootEl)
  orbitControls.saveState()

  document.addEventListener('keydown', function(evnt) {
    console.log(orbitControls)
    if (evnt.code === 'Escape') {
      orbitControls.reset()
      camera.position.x = 0
      camera.position.y = 0
      camera.position.z = state.screenDepth
      camera.updateProjectMatrix()
      orbitControls.update()
    }
  })

  const lights = [
    {
      type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.7,
      position: () => [innerWidth * 0.5, innerHeight * 0, state.screenDepth], //[100, 200, 150]
      sphereColor: 0xff0000 // Red
    },
    {
      type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.5,
      position: () => [0, -innerHeight, -state.screenDepth * 0.5],
      sphereColor: 0x00ff00 // Green
    },
    {
      type: THREE.PointLight,
      color: 0xffffff,
      intensity: 0.5,
      position: () => [-innerWidth * 0.5, -innerHeight * 0, state.screenDepth],
      sphereColor: 0x0000ff // Blue
    },
    {
      type: THREE.AmbientLight,
      color: 0xffffff,
      intensity: 0.2,
      sphereColor: 0xff00ff // Magenta
    }
  ]

  const state = {
    screenDepth: 0
  }

  const methods = {
    init () {
      methods.setupLoaders()
      methods.setupRenderer()
      methods.setupCamera()
      methods.setupGrid()
      methods.setupLights()
      animation.onFrame(methods.animate)
    },

    setupLoaders () {
      dracoLoader.setDecoderPath(assetsURL + '/')
      gltfLoader.setDRACOLoader(dracoLoader)
    },

    setupRenderer () {
      renderer.setSize(innerWidth, innerHeight)
      console.log(renderer)
      document.getElementById(elementID).appendChild(renderer.domElement)
    },

    setupCamera () {
      camera.position.z = 0
      state.screenDepth = methods.findScreenDepth(camera, renderer)
      camera.position.z = state.screenDepth

      const geometry = new THREE.BoxGeometry(20, 20, 40)
      const material = new THREE.MeshBasicMaterial({ color: 0xffff0 })
      const cameraBox = new THREE.Mesh(geometry, material)
      scene.add(cameraBox)
      cameraBox.position.z = camera.position.z
    },

    setupLights () {
      lights.forEach(light => {
        const instance = new light.type(light.color)
        const geometry = new THREE.SphereGeometry(20, 20, 20)
        const material = new THREE.MeshBasicMaterial({ color: light.sphereColor })
        const lightSphere = new THREE.Mesh(geometry, material)

        instance.intensity = light.intensity || 1
        if (light.position) {
          const lightPosition = light.position()
          instance.position.set.apply(instance.position, lightPosition)
          lightSphere.position.set.apply(lightSphere.position, lightPosition)
        }
        light.instance = instance

        scene.add(light.instance)
        scene.add(lightSphere)
      })
    },

    setupGrid () {
      const grid = new THREE.GridHelper(2000, 10)
      scene.add(grid)
    },

    loadModel (model) {
      console.log('>>', model)
      const loadPromise = new Promise((resolve, reject) => {
        gltfLoader.load(`${assetsURL}/${model.filename}`,
          (gltf) => resolve(gltf),
          methods.loadModelProgress,
          (error) => reject(methods.loadModelError(error))
        )
      })
      return loadPromise
    },

    loadModelProgress (xhr) {
      console.log('Scene:loadModelProgress', (xhr.loaded / xhr.total * 100) + '%')
    },

    loadModelError (error) {
      console.log('Scene:loadModelError', error)
      return error
    },

    animate () {
      orbitControls.update()
      renderer.render(scene, camera)
    },

    add (obj) {
      scene.add(obj)
    },

    getCameraPosition () {
      return camera.position
    },

    visibleHeightAtZDepth (depth, camera) {
      // vertical fov in radians
      const vFOV = camera.fov * Math.PI / 180;

      // Math.abs to ensure the result is always positive
      return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
    },

    findScreenDepth (camera, renderer) {
      const { near, far } = camera
      const { height: physicalViewHeight } = renderer.getDrawingBufferSize()

      // RESOLUTION, divide by the pixel ratio so that we find the plane where
      // one unit spans one CSSpixel, which actually spans (CSSpixel * pixelRatio)
      // physical pixels. Basically, if pixel ratio is 2, then one CSS pixel
      // spans 2 physical pixels.
      const cssViewHeight = physicalViewHeight / renderer.getPixelRatio()

      // they should match if canvas is full widht/height of the window.
      console.log(window.innerWidth, window.innerHeight, cssViewHeight)


      const threshold = 0.0001

      return _findScreenDepth(near, far)

      function _findScreenDepth (near, far) {
        const midpoint = (far - near) / 2 + near
        const midpointHeight = methods.visibleHeightAtZDepth(-midpoint, camera)
        const heightDiff = Math.abs((cssViewHeight / midpointHeight) - 1)
        console.log(heightDiff, threshold, '|', cssViewHeight, midpointHeight)
        if (heightDiff <= threshold) {
          return midpoint
        }

        if (cssViewHeight < midpointHeight) {
          return _findScreenDepth(near, midpoint)
        } else if (cssViewHeight > midpointHeight) {
          return _findScreenDepth(midpoint, far)
        } else if (midpointHeight === cssViewHeight) { // almost never happens
          return midpoint
        }
      }
    }
  }

  return {
    init: methods.init,
    loadModel: methods.loadModel,
    add: methods.add,
    getCameraPosition: methods.getCameraPosition
  }
}

export default Scene
