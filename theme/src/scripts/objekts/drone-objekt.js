import THREE from '@vendor/three.import'

import Objekt from './objekt'
import PropObjekt from './prop-objekt'
import utils from '@utils'

export default class DroneObjekt extends Objekt {
  ready = false
  filename = 'bateleur.v0.2.12.squashed.glb'

  components = {
    Antennamount: {
      merge: true,
      position: [0, -0.25, -57],
      color: 0xbbbbbb
    },
    Coretop: {
      merge: true,
      position: [0, 10.5, 0],
      color: 0xbbbbbb
    },
    Corebottom: {
      merge: true,
      position: [0, -10.5, 0],
      color: 0xbbbbbb
    },
    PropguardsTop: {
      clone: true,
      merge: true,
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
      merge: true,
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
      merge: true,
      position: [0, 15, 0],
      color: 0xbbbbbb
    },
    CameraBracket: {
      merge: true,
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
      objekt: {
        Klass: PropObjekt,
        opts: {
          direction: 'cw'
        }
      }
    }
  }

  mergables = []

  edgeLineModels = []

  constructor () {
    super()
    this.droneObject = true
  }

  get model () {

  }

  loaded () {
    this.processModel()
    this.setupModel()

    this.ready = true
  }

  processModel () {
    this.model.children.forEach(child => {
      this.processChild(child)
    })
  }

  setupModel () {
    const { canvasWidth } = this.scene.canvasBounds
    this.setPosition(canvasWidth * 0.2, 0, 0)
    this.setScalePx(canvasWidth * 0.35, { saveAsOffset: true })
    this.setRotation(0, 0, 0)
    // this.model.lookAt(this.scene.camera.position)
    this.rotateXAxis(40, 'deg')
    this.rotateYAxis(-40, 'deg')
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
    // child.material.dithering = true
    // child.material.castShadow = true
    // child.material.receiveShadow = true
    // child.material.depthWrite = true
    // child.material.depthTest = true

    if (childMeta.color) {
      child.material.color.setHex(childMeta.color)
    }


    if (childMeta.objekt) {
      this.setupChildObjekt(child, childMeta)
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

  setupChildObjekt (child, childMeta) {
    const { objekt } = childMeta
    const childObjekt = new objekt.Klass(child, Object.assign({ parent: this, meta: childMeta }, objekt.opts))
    this.childObjekts.push(childObjekt)
  }

  update (frame) {
    super.update()
    this.animation && this[`${this.animation}Animation`](frame)
  }

  set (opts) {
    Object.entries(opts).forEach(([optKey, optValue]) => {
      console.log('set drone', optKey, optValue)
      this[`set${utils.capitalize(optKey)}`](optValue)
    })
  }

  setAnimation (animation) {
    this.animation = animation
  }

  setMaterial (material) {
    if (!this.model) { return }
    console.log(this.model)
    if (material === 'edgeLines') {
      this.model.children.forEach(child => {
        if (/^Propeller/.test(child.name) || child.type === 'LineSegments') { return }
        if (/Bottom/.test(child.name)) {
          child.material.visible = false
          return
        }
        const edgeLineModel = this.generateEdgeGeometry(child)
        this.edgeLineModels.push(edgeLineModel)
        this.model.add(edgeLineModel)
      })
    } else {
      this.edgeLineModels.forEach(edgeLineModel => this.model.remove(edgeLineModel))
      this.edgeLineModels = []
      this.model.children.forEach(child => {
        if (/^Propeller/.test(child.name) || child.type === 'LineSegments') { return }
        child.material.visible = true
      })
    }
  }

  floatAnimation (frame) {
    const offsetMultiplier = 4
    const periodDivisor = 1000
    const sinePeriod = Math.PI * 2 / periodDivisor
    const sineOffset = offsetMultiplier * Math.sin(frame * sinePeriod) + 10
    const sineRotationZ = 0.0003 * Math.sin(frame * sinePeriod * 1.3)

    this.positionYAxis(sineOffset)
    this.rotateZAxis(sineRotationZ)
  }
}
