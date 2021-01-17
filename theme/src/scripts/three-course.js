const { requestAnimationFrame, innerWidth, innerHeight, THREE } = window
const { stylesheet } = window.theme
const stylesheetParts = stylesheet.split('/')
stylesheetParts.pop()
const assetsURL = stylesheetParts.join('/')
console.log(assetsURL)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

camera.position.z = 18
renderer.setSize(innerWidth, innerHeight)
document.getElementById('shopify-section-drone').appendChild(renderer.domElement)

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

const loader = new THREE.GLTFLoader()
const dracoLoader = new THREE.DRACOLoader()
let modelScene
dracoLoader.setDecoderPath(assetsURL + '/')
loader.setDRACOLoader(dracoLoader)
loader.load(`${assetsURL}/bateleur.v0.2.2.glb?cbust=${Date.now()}`, function (gltf) {
  console.log(gltf)
  modelScene = gltf.scene
  modelScene.scale.set(0.1, 0.1, 0.1)
  modelScene.rotation.set(THREE.Math.degToRad(40), THREE.Math.degToRad(-45), 0)
  modelScene.position.set(6.5, 1, 0)
  modelScene.children.forEach(child => {
    if (child.name === 'Propguards') {
      console.log('ping')
      child.material.color.setHex(0x86CFE2)
      console.log(child.material.color.getHex())
    }
  })
  scene.add(gltf.scene)
}, function (xhr) {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded')
}, function (error) {
  console.log('error', error)
})


const addSpotlight = function (x, y, z, intensity) {
  const spotLight = new THREE.PointLight(0xffffff)
  console.log(spotLight)
  spotLight.intensity = intensity
  spotLight.position.set(x, y, z)
  scene.add(spotLight)
}

addSpotlight(10, 25, 10, 1.1)
addSpotlight(0, 10, -15, 0.75)
addSpotlight(5, -10, 10, 0.75)
addSpotlight(-5, -3, 0, 0.35)


const animate = function () {
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // if (modelScene) {
  //     const { x, y, z } = modelScene.rotation
  //     modelScene.rotation.set(0, y + 0.01, z + 0.005)
  // }
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()
