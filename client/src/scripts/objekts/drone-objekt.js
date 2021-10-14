import THREE from '@vendor/three.import'

import Objekt from './objekt'
import PropObjekt from './prop-objekt'
import utils from '@utils'
import Drone from '../models/drone'

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
      clone: [
        {
          position: [-28.75, 12.55, 0.05],
          rotation: [0, 0, 0],
          material: {
            color: 0x6cd0e0
          }
        },
        {
          position: [28.75, 12.55, 0.05],
          rotation: [0, THREE.Math.degToRad(180), 0],
          material: {
            color: 0x6cd0e0
          }
        }
      ],
    },
    PropguardsBottom: {
      // clone: true,
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
      // clone: true,
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
      // clone: true,
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
  currentModel = null
  material = 'default'

  constructor (opts = {}) {
    const {
      wireframe = false
    } = opts

    super(opts)
    this.wireframe = wireframe
  }

  get material () {

  }

  onLoad (payload) {
    super.onLoad(payload)
    this.droneModel = new Drone(payload.scene)
    this.processModel(this.model)
    this.ready = true
    return this
  }

  processModel (model) {
    model.children.forEach(child => {
      child.parentModel = model
      this.processChild(child)
    })
    model.children.forEach(child => {
      if (child.setToRemove) { model.remove(child) }
    })
  }

  setupWireframeModel () {
    const { x, y, z } = this.models.default.position
    this.models.wireframe = new THREE.Object3D() // this.models.default.clone(true)
    this.models.wireframe.position.set(x, y, z)

    this.models.default.children.forEach(child => {
      if (!/Bottom/.test(child.name)) {
        const childClone = child.clone(true)
        childClone.name = child.name
        if (childClone.type !== 'LineSegments') {
          const edgeLineModel = this.generateEdgeGeometry(childClone)
          this.models.wireframe.add(edgeLineModel)
        } else {
          if (/^Propeller/.test(child.name)) {
            const existingChild = this.models.wireframe.children.findIndex(modelChild => modelChild.name === child.name)
            if (existingChild < 0) {
              this.models.wireframe.add(childClone)
            }
          } else {
            this.models.wireframe.add(childClone)
          }
        }
      }
    })
  }

  processChild (child, cloneIndex = -1) {
    const { parentModel } = child
    const childMeta = this.components[child.name]
    const { wireframe } = this
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

    if (wireframe) {
      parentModel.remove(child)
      child = this.generateEdgeGeometry(child)
      child.parentModel = parentModel
      parentModel.add(child)
    } else {
      child.material.roughness = 1

      if (childMeta.color) {
        child.material.color.setHex(childMeta.color)
      }
    }

    if (childMeta.objekt) {
      this.setupChildObjekt(child, childMeta)
    }
  }

  cloneChild (child, childMeta) {
    childMeta.position.forEach((position, cloneIndex) => {
      if (cloneIndex > 0) {
        const { parentModel } = child
        const childClone = child.clone()
        childClone.parentModel = parentModel
        parentModel.add(childClone)
        this.processChild(childClone, cloneIndex)
      } else {
        this.processChild(child, cloneIndex)
      }
    })
  }

  setupChildObjekt (child, childMeta) {
    const { objekt } = childMeta
    const childObjekt = new objekt.Klass(child, Object.assign({ parent: this, meta: childMeta }, objekt.opts))
    child.parentModel.add(childObjekt.model)
    this.childObjekts.push(childObjekt)
  }

  update (frame) {
    super.update()
    this.animation && this[`${this.animation}Animation`](frame)
  }

  set (opts) {
    Object.entries(opts).forEach(([optKey, optValue]) => {
      this[`set${utils.capitalize(optKey)}`](optValue)
    })
  }

  setAnimation (animation) {
    this.animation = animation
  }

  setMaterial (material) {
    if (!this.model) { return }
    if (material !== this.material) {
      this.scene.remove(this)
      this.material = material
      this.scene.add(this)
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
