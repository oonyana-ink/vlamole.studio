import THREE from '@vendor/three.import'

import Objekt from './objekt'
import PropObjekt from './prop-objekt'

export default class DroneObjekt extends Objekt {
  filename = 'bateleur.v0.2.12.squashed.glb'

  components = {
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
        [-28.75, 12.55, 0.05],
        [28.75, 12.55, 0.05]
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
        [-23.9, -11.6, 0.15],
        [23.9, -11.6, 0.15]
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
    PropellerCCW: {
      clone: true,
      position: [
        [-32, 0, 32],
        // [32, 0, 32],
        // [-32, 0, -32],
        [32, 0, -32]
      ],
      color: 0xbb00bb,
      // opacity: 0.5,
      objekt: {
        Klass: PropObjekt,
        opts: {
          direction: 'ccw'
        }
      }
    },
    PropellerCW: {
      clone: true,
      position: [
        // [-32, 0, 32],
        [32, 0, 32],
        [-32, 0, -32]
        // [32, 0, -32]
      ],
      color: 0xbb00bb,
      outline: true,
      opacity: 0,
      objekt: {
        Klass: PropObjekt,
        opts: {
          direction: 'cw'
        }
      }
    }
  }

  constructor () {
    super()
    this.droneObject = true
  }

  loaded () {
    this.processModel()
    this.setupModel()
  }

  processModel () {
    this.model.children.forEach(child => {
      console.log(child)
      this.processChild(child)
    })
    console.log('drone model', this.model)
  }

  setupModel () {
    const { canvasWidth } = this.scene.canvasBounds
    this.setPosition(canvasWidth * 0.2, 0, 0)
    this.setScalePx(canvasWidth * 0.35, { saveAsOffset: true })
    this.setRotation(0, 0, 0)
    this.model.lookAt(this.scene.camera.position)
    this.rotateXAxis(90, 'deg')
    // this.rotateYAxis(-40, 'deg')
  }

  processChild (child, cloneIndex = -1) {
    const childMeta = this.components[child.name]
    if (childMeta.clone && cloneIndex < 0) {
      this.cloneChild(child, childMeta)
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
    child.material.castShadow = true
    child.material.receiveShadow = true
    child.material.depthWrite = true
    child.material.depthTest = true

    if (childMeta.color) {
      child.material.color.setHex(childMeta.color)
    }

    if (childMeta.opacity !== undefined) {
      child.material.transparent = true
      child.material.opacity = childMeta.opacity
    }

    if (true || childMeta.outline) {
      // child.material = new THREE.Material()
      // child.visible = false
      child.material.transparent = true
      child.material.color.setHex(0xffffff)
      child.material.wireframe = true
      child.material.opacity = 0.5
      child.material.side = THREE.FrontSide

      if (/Bottom/i.test(child.name)) {
        child.visible = false
        // child.material.visible = false
      }
      // this.scene.addToOutlinePass(child)
      // child.material.visible = false
    }

    if (childMeta.objekt) {
      this.setupChildObjekt(child, childMeta.objekt)
    }
  }

  cloneChild (child, childMeta) {
    childMeta.position.forEach((position, cloneIndex) => {
      if (cloneIndex > 0) {
        child = child.clone()
        this.model.add(child)
      }
      this.processChild(child, cloneIndex)
    })
  }

  setupChildObjekt (child, objekt) {
    const childObjekt = new objekt.Klass(child, objekt.opts)
    this.childObjekts.push(childObjekt)
  }

  update (frame) {
    const sinePeriod = Math.PI * 2 / 500
    const sineOffset = 8 * Math.sin(frame * sinePeriod) + 10
    const sineRotationZ = 0.0005 * Math.sin(frame * sinePeriod * 1.5)

    super.update()

    // this.positionYAxis(sineOffset)
    // this.rotateZAxis(sineRotationZ)
  }
}
