import Objekt from './objekt'

class DroneObj extends SceneObject {
  filename = 'bateleur.v0.2.5.squashed.glb'
  constructor (opts = {}) {
    super()
  }
}

const drone = new DroneObj()
console.log(drone)

return
function Drone (opts = {}) {
  const { THREE, innerWidth } = window
  const { scene, animation } = opts
  const model = {
    filename: 'bateleur.v0.2.5.squashed.glb',
    gltf: null,
    scene: null,
    objects: {
      core: [],
      propGuards: [],
      props: []
    },
    offsets: {
      scale: 1,
      rotation: () => [0, 0, 0],
      position: () => [0, 0, 0]
    },
    scale: 1
  }

  const components = {
    Antennamount: {
      position: [0, -0.25, -57],
      color: 0xbbbbbb
    },
    Coretop: {
      position: [0, 10.5, 0],
      color: 0xbbbbbb
    },
    Corebottom: {
      position: [0, -10.5, 0],
      color: 0xbbbbbb
    },
    PropguardsTop: {
      clone: true,
      position: [
        [-28.94, 11.9, -0.05],
        [28.94, 11.9, -0.05]
      ],
      rotation: [
        [0, 0, 0],
        [0, THREE.Math.degToRad(180), 0]
      ],
      color: 0x6cd0e0
    },
    PropguardsBottom: {
      clone: true,
      position: [
        [-24.78, -11.4, -0.05],
        [24.75, -11.4, -0.05]
      ],
      rotation: [
        [0, 0, 0],
        [0, THREE.Math.degToRad(180), 0]
      ],
      color: 0x6cd0e0
    },
    Batteryplate: {
      position: [0, 15, 0],
      color: 0xbbbbbb
    },
    CameraBracket: {
      clone: true,
      position: [
        [9.5, 0, 54.3],
        [-9.5, 0, 54.3]
      ],
      rotation: [
        [0, THREE.Math.degToRad(180), 0],
        [0, THREE.Math.degToRad(180), THREE.Math.degToRad(180)]
      ],
      color: 0xbbbbbb
    },
    Prop: {
      clone: true,
      position: [
        [-32, 0, 32],
        [32, 0, 32],
        [-32, 0, -32],
        [32, 0, -32]
      ],
      color: 0xbb00bb
    }
  }

  const methods = {
    init () {
      scene.loadModel(model)
        .then(methods.processModel)
        .then(methods.setupModel)
        .then(methods.drawModel)
    },

    processModel (gltf) {
      model.gltf = gltf
      model.scene = gltf.scene
      model.scene.children.forEach(child => {
        methods.processChild(child)
      })
    },

    processChild (child, cloneIndex = -1) {
      const childMeta = components[child.name]
      if (childMeta.clone && cloneIndex < 0) {
        methods.cloneChild(child, childMeta)
        return
      }

      if (childMeta.position) {
        const childPosition = childMeta.clone ? childMeta.position[cloneIndex] : childMeta.position
        child.position.set.apply(child.position, childPosition)
      }

      if (childMeta.rotation) {
        const childRotation = childMeta.clone ? childMeta.rotation[cloneIndex] : childMeta.rotation
        child.rotation.set.apply(child.rotation, childRotation)
      }

      child.material.roughness = 1
      child.material.dithering = true
      child.material.color.setHex(childMeta.color)
    },

    cloneChild (child, childMeta) {
      childMeta.position.forEach((position, cloneIndex) => {
        if (cloneIndex > 0) {
          child = child.clone()
          model.scene.add(child)
        }
        methods.processChild(child, cloneIndex)
      })
    },

    setupModel () {
      methods.setPosition(innerWidth * 0.15, 0, 0)
      methods.setScalePx(window.innerWidth * 0.3, { saveAsOffset: true })
      methods.setRotation(0, 0, 0)
      methods.rotateXAxis(THREE.Math.degToRad(40))
      methods.rotateYAxis(THREE.Math.degToRad(-40))
    },

    animate () {
      // methods.rotateY(0.01)
      // methods.rotateX(0.01)
      // model.scene.rotation.set(model.scene.rotation.x + 0.01, model.scene.rotation.y, model.scene.rotation.z)
    },

    drawModel () {
      scene.add(model.scene)
      animation.onFrame(methods.animate)
      // methods.rotateX(0.01, { increment: true })
      console.log(model.scene)
      console.log('rotation', model.scene.matrix.extractRotation(model.scene.matrix))
      // setTimeout(function () {
      //   methods.setRotation(0, 0, 0)
      //   methods.setPosition(0, 0, 0)
      //   model.scene.scale.set(model.scale * 1.5, model.scale * 1.5, model.scale * 1.5)
      // }, 3000)
    },

    setRotation (x, y, z) {
      const [xOffset, yOffset, zOffset] = model.offsets.rotation()
      model.scene.rotation.set(x + xOffset, y + yOffset, z + zOffset)
    },

    setPosition (x, y, z) {
      const [xOffset, yOffset, zOffset] = model.offsets.position()
      model.scene.position.set(x + xOffset, y + yOffset, z + zOffset)
    },

    setScalePx (scalePx, { saveAsOffset = false } = {}) {
      const bbox = new THREE.Box3().setFromObject(model.scene)
      const sizeV = new THREE.Vector3()
      bbox.getSize(sizeV)
      model.scale = scalePx / sizeV.x
      if (saveAsOffset) {
        model.offsets.scale = model.scale
      }
      methods.setScale(model.scale)
    },

    setScale (scale) {
      model.scale = scale * model.offsets.scale
      model.scene.scale.set(scale, scale, scale)
    },

    rotateXAxis (radian) {
      const xAxis = new THREE.Vector3(1, 0, 0)
      model.scene.rotateOnAxis(xAxis, radian)
    },

    rotateYAxis (radian) {
      const yAxis = new THREE.Vector3(0, 1, 0)
      model.scene.rotateOnAxis(yAxis, radian)
    }
  }

  return {
    init: methods.init
  }
}

export default Drone
