import '../styles/index.scss'
// import './three-course.js'
import './grid-overlay.js'

// import Animation from './animation.js'
import Scene from './classes/scene'
import Drone from './classes/drone-objekt'
// import Drone from './drone.js'

// const animation = Animation()
// const scene = Scene({ animation })
// const drone = Drone({ scene, animation })

// scene.init()
// drone.init()
// animation.start()

const scene = new Scene({ $el: document.getElementById('shopify-section-drone') })
const drone = new Drone()

scene.add(drone)
console.log(scene)
