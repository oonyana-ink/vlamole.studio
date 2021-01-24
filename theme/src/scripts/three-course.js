const { requestAnimationFrame, innerWidth, innerHeight, THREE } = window
const { stylesheet } = window.theme
const stylesheetParts = stylesheet.split('/')
stylesheetParts.pop()
const assetsURL = stylesheetParts.join('/')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

camera.position.z = 195
renderer.setSize(innerWidth, innerHeight)
document.getElementById('shopify-section-drone').appendChild(renderer.domElement)

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

const loader = new THREE.GLTFLoader()
const dracoLoader = new THREE.DRACOLoader()
let modelScene
const props = {
  cw: [],
  ccw: [],
  loaded: false,
  setup (prop) {
    prop.material.color.setHex(0x6242ff)
    prop.material.emissive.setHex(0xbb00ff)
    prop.material.emissiveIntensity = 0
    prop.material.opacity = 0.65
    prop.material.transparent = true
    this.add(prop, 1, 1, 1)
    this.add(prop, 2, -1, 1, true)
    this.add(prop, 3, 1, -1, true)
    this.add(prop, 4, -1, -1, true)
  },
  add (prop, number, x, z, clone = false) {
    if (clone) {
      prop = prop.clone()
      modelScene.add(prop)
    }
    if (/[1|4]/.test(number)) {
      prop.rotation.set(THREE.Math.degToRad(180), 0, 0)
      props.cw.push(prop)
    }
    if (/[2|3]/.test(number)) {
      props.ccw.push(prop)
    }
    prop.position.set(32 * x, -9, 32 * z)
  }
}
dracoLoader.setDecoderPath(assetsURL + '/')
loader.setDRACOLoader(dracoLoader)
loader.load(`${assetsURL}/bateleur.v0.2.6.glb?cbust=${Date.now()}`, function (gltf) {
  modelScene = gltf.scene
  modelScene.rotation.set(THREE.Math.degToRad(40), THREE.Math.degToRad(-225), 0)
  modelScene.position.set(75, 15, 0)
  modelScene.children.forEach(child => {
    child.material.dithering = true
    console.log(child)

    if (/^Propguards/.test(child.name)) {
      child.material.color.setHex(0x86CFE2)
      child.material.emissive.setHex(0x86CFE2)
      child.material.emissiveIntensity = 0.1
    }

    if (/^Propeller/.test(child.name)) {
      props.setup(child)
    }
  })
  props.loaded = true
  scene.add(gltf.scene)
}, function (xhr) {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded')
}, function (error) {
  console.log('error', error)
})


const addSpotlight = function (x, y, z, intensity) {
  const spotLight = new THREE.PointLight(0xffffff)
  spotLight.intensity = intensity
  spotLight.position.set(x, y, z)
  scene.add(spotLight)
}

addSpotlight(100, 200, 150, 0.75)
// addSpotlight(-400, -100, -100, 0.3)
addSpotlight(0, -200, 200, 0.4)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.25)
scene.add(ambientLight)
// addSpotlight(30, 0, 10, 1.5)
// addSpotlight(0, 0, -10, 1.5)
// addSpotlight(10, 25, 10, 1.1)
// addSpotlight(0, 10, -15, 0.75)
// addSpotlight(5, -10, 10, 0.75)
// addSpotlight(-5, -3, 0, 0.35)

let counter = 0
const increase = Math.PI * 2 / 300

const animate = function () {
  const propSpeed = 0.05
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // if (modelScene) {
  //     const { x, y, z } = modelScene.rotation
  //     modelScene.rotation.set(0, y + 0.01, z + 0.005)
  // }
  if (modelScene) {
    const sineOffset = Math.sin(counter * 0.5) * 0.75
    const sineRotationZ = Math.sin(counter * 0.4) * 0.02
    const sineRotationX = Math.sin(counter * 0.6) * 0.03
    const sineRotationY = 0 //Math.sin(counter * 0.2) * 0.07
    modelScene.position.set(modelScene.position.x, sineOffset + 15, modelScene.position.z)
    modelScene.rotation.set(sineRotationX + THREE.Math.degToRad(40), sineRotationY + THREE.Math.degToRad(-225), sineRotationZ)
    counter += increase
  }
  props.cw.forEach(prop => prop.rotation.set(prop.rotation.x, prop.rotation.y + propSpeed, prop.rotation.z))
  props.ccw.forEach(prop => prop.rotation.set(prop.rotation.x, prop.rotation.y - propSpeed, prop.rotation.z))
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()
