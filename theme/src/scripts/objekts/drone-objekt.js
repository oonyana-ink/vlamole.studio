import THREE from '@vendor/three.import'

import Objekt from './objekt'
import PropObjekt from './prop-objekt'

export default class DroneObjekt extends Objekt {
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

  constructor () {
    super()
    this.droneObject = true
  }

  get model () {

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
    console.log('>>>', childObjekt)
    this.childObjekts.push(childObjekt)
  }

  generateEdgeGeometry (child) {
    const edges = new THREE.EdgesGeometry(child.geometry, 70)
    const lineMaterial = /propeller/i.test(child.name)
      ? new THREE.LineDashedMaterial({
        transparent: true,
        dashSize: 3,
        gapSize: 2,
        color: 0xffffff,
        opacity: 0.6
      })
      : new THREE.LineBasicMaterial({
        linewidth: 1.25,
        color: 0xffffff
      })
    const edgeLines = new THREE.LineSegments(edges, lineMaterial)
    edgeLines.computeLineDistances()
    edgeLines.position.set(child.position.x, child.position.y, child.position.z)
    edgeLines.rotation.set(child.rotation.x, child.rotation.y, child.rotation.z)
    // this.model.add(edgeLines)
    // child.material.visible = false
  }

  update (frame) {
    // const sinePeriod = Math.PI * 2 / 500
    // const sineOffset = 8 * Math.sin(frame * sinePeriod) + 10
    // const sineRotationZ = 0.0005 * Math.sin(frame * sinePeriod * 1.5)

    // super.update()

    // this.positionYAxis(sineOffset)
    // this.rotateZAxis(sineRotationZ)
  }
}
