import Model from './model'
import { Propeller } from './propeller'
import grid from '../layout/grid'

const DRONE_DIMENSIONS = {
  widthXAxis: 69,
  widthZAxis: 69,
  heightCoreInner: 18,
  thicknessPropguard: 2,
  thicknessCore: 3
}

export class Drone extends Model {
  name = 'Drone'

  meta = {
    rotation: ['40deg', '140deg', 0],
    position: () => [grid.columnsWidth(3), 0, 0],
    size: () => [grid.columnsWidth(6)],
    useContainer: true
  }

  constructor () {
    super(undefined, {
      filename: 'bateleur.v0.3.1.6.squashed.glb'
    })
  }

  processChildren (children) {
    const processedChildren = []

    children.forEach(child => {
      const processChild = this.processChild(child)
      processedChildren.push(processChild)
    })

    super.processChildren(processedChildren)
  }

  processChild (child) {
    const modelMeta = this.components[child.name]
    child.modelMeta = modelMeta
    return child
  }

  floatAnimation (frame) {
    const offsetMultiplier = 10
    const periodDivisor = 600
    const sinePeriod = Math.PI * 2 / periodDivisor
    const sineOffset = offsetMultiplier * Math.sin(frame * sinePeriod) + 10
    const sineRotationZ = 0.02 * Math.sin(frame * sinePeriod * 1.3)
    const sineRotationX = 0.01 * Math.sin(frame * sinePeriod * 1.5)
    this.transformTarget = this.object3D

    this.position = { y: sineOffset }
    this.rotation = { z: sineRotationZ, x: sineRotationX }
    this.transformTarget = null
  }

  update (frame) {
    this.floatAnimation(frame)
  }

  components = {
    AntennaMount: {
      position: [
        0,
        DRONE_DIMENSIONS.heightCoreInner / -2,
        60.7
      ],
      material: {
        class: THREE.MeshPhongMaterial,
        color: 0xbbbbbb,
        flatShading: true
      }
    },
    CoreTop: {
      merge: true,
      position: [
        0,
        DRONE_DIMENSIONS.heightCoreInner / 2,
        0
      ],
      material: {
        class: THREE.MeshPhongMaterial,
        color: 0xbbbbbb,
        flatShading: true
      }
    },
    CoreBottom: {
      merge: true,
      position: [
        0,
        DRONE_DIMENSIONS.heightCoreInner / -2 - DRONE_DIMENSIONS.thicknessCore,
        0
      ],
      material: {
        class: THREE.MeshPhongMaterial,
        color: 0xbbbbbb,
        flatShading: true
      }
    },
    PropguardTop: {
      clone: [
        {
          position: [
            DRONE_DIMENSIONS.widthXAxis / -2,
            DRONE_DIMENSIONS.heightCoreInner / 2 + DRONE_DIMENSIONS.thicknessCore + DRONE_DIMENSIONS.thicknessPropguard,
            0
          ],
          rotation: [0, 0, 0],
          material: {
            class: THREE.MeshPhongMaterial,
            color: 0x6cd0e0,
            flatShading: true
          }
        },
        {
          position: [
            DRONE_DIMENSIONS.widthXAxis / 2,
            DRONE_DIMENSIONS.heightCoreInner / 2 + DRONE_DIMENSIONS.thicknessCore + DRONE_DIMENSIONS.thicknessPropguard,
            0
          ],
          rotation: [0, '180deg', 0],
          material: {
            class: THREE.MeshPhongMaterial,
            color: 0x6cd0e0,
            flatShading: true
          }
        }
      ]
    },
    PropguardBottom: {
      clone: [
        {
          position: [
            DRONE_DIMENSIONS.widthXAxis / -2,
            DRONE_DIMENSIONS.heightCoreInner / -2 - DRONE_DIMENSIONS.thicknessCore - DRONE_DIMENSIONS.thicknessPropguard,
            0
          ],
          rotation: [0, 0, 0],
          material: {
            class: THREE.MeshPhongMaterial,
            color: 0x6cd0e0,
            flatShading: true
          }
        },
        {
          position: [
            DRONE_DIMENSIONS.widthXAxis / 2,
            DRONE_DIMENSIONS.heightCoreInner / -2 - DRONE_DIMENSIONS.thicknessCore - DRONE_DIMENSIONS.thicknessPropguard,
            0
          ],
          rotation: [0, '180deg', 0],
          material: {
            class: THREE.MeshPhongMaterial,
            color: 0x6cd0e0,
            flatShading: true
          }
        }
      ]
    },
    BatteryPlate: {
      merge: true,
      position: [
        0,
        DRONE_DIMENSIONS.heightCoreInner / 2 + DRONE_DIMENSIONS.thicknessCore + DRONE_DIMENSIONS.thicknessPropguard,
        0
      ],
      material: {
        class: THREE.MeshPhongMaterial,
        color: 0xbbbbbb,
        flatShading: true
      }
    },
    CameraBracket: {
      clone: [
        {
          position: [
            -10.2,
            DRONE_DIMENSIONS.heightCoreInner / -2,
            -60.7
          ],
          rotation: [0, 0, 0],
          material: {
            class: THREE.MeshPhongMaterial,
            color: 0x6cd0e0,
            flatShading: true
          }
        },
        {
          position: [
            10.2,
            DRONE_DIMENSIONS.heightCoreInner / 2,
            -60.7
          ],
          rotation: [0, 0, '180deg'],
          material: {
            class: THREE.MeshPhongMaterial,
            color: 0x6cd0e0,
            flatShading: true
          }
        }
      ]
    },
    Camera: {
      wireframe: true,
      position: [
        0,
        0,
        -54
      ],
      rotation: ['110deg', 0, 0]
    },
    PropellerCCW: {
      clone: [
        {
          class: Propeller,
          direction: 'CCW',
          wireframe: true,
          position: [
            DRONE_DIMENSIONS.widthXAxis / -2,
            0,
            DRONE_DIMENSIONS.widthZAxis / 2
          ],
          material: {
            color: 0xbb00bb
          }
        },
        {
          class: Propeller,
          direction: 'CCW',
          wireframe: true,
          position: [
            DRONE_DIMENSIONS.widthXAxis / 2,
            0,
            DRONE_DIMENSIONS.widthZAxis / -2
          ],
          material: {
            color: 0xbb00bb
          }
        }
      ]
    },
    PropellerCW: {
      clone: [
        {
          class: Propeller,
          direction: 'CW',
          wireframe: true,
          position: [
            DRONE_DIMENSIONS.widthXAxis / 2,
            0,
            DRONE_DIMENSIONS.widthZAxis / 2
          ],
          material: {
            color: 0xbb00bb
          }
        },
        {
          class: Propeller,
          direction: 'CW',
          wireframe: true,
          position: [
            DRONE_DIMENSIONS.widthXAxis / -2,
            0,
            DRONE_DIMENSIONS.widthZAxis / -2
          ],
          material: {
            color: 0xbb00bb
          }
        }
      ]
    },
    Standoff: {
      clone: [
        {
          position: [
            -25,
            0,
            0
          ],
          material: {
            class: THREE.MeshPhongMaterial,
            color: 0xbbbbbb,
            flatShading: true
          }
        },
        {
          position: [
            25,
            0,
            0
          ],
          material: {
            class: THREE.MeshPhongMaterial,
            color: 0xbbbbbb,
            flatShading: true
          }
        }
      ]
    },
    RXBracket: {
      position: [
        0,
        DRONE_DIMENSIONS.heightCoreInner / 2,
        0
      ],
      material: {
        class: THREE.MeshPhongMaterial,
        color: 0xbbbbbb,
        flatShading: true
      }
    }
  }
}
