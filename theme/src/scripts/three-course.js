const { requestAnimationFrame, innerWidth, innerHeight, THREE } = window
const { stylesheet } = window.theme
const stylesheetParts = stylesheet.split('/')
stylesheetParts.pop()
const assetsURL = stylesheetParts.join('/')
console.log(assetsURL)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

camera.position.z = 15
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

const loader = new THREE.GLTFLoader()
const dracoLoader = new THREE.DRACOLoader()
let modelScene
dracoLoader.setDecoderPath(assetsURL + '/')
loader.setDRACOLoader(dracoLoader)
loader.load(`${assetsURL}/bateleur.v0.2.blue.gltf?cbust=${Date.now()}`, function (gltf) {
    console.log(gltf)
    modelScene = gltf.scene
    gltf.scene.scale.set(0.1, 0.1, 0.1)
    scene.add(gltf.scene)
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded')
}, function (error) {
    console.log('error', error)
})


const addSpotlight = function (x, y, z) {
    const spotLight = new THREE.SpotLight({ color: 0xffffff, intensity: 1.2 })
    spotLight.position.set(x, y, z)
    scene.add(spotLight)
}

addSpotlight(10, 10, 15)
addSpotlight(0, 15, -5)
addSpotlight(-15, -10, 5)


const animate = function () {
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    if (modelScene) {
        const { x, y, z } = modelScene.rotation
        modelScene.rotation.set(0 , y + 0.01, z + 0.005)
    }
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()
