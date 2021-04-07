import Model from './model'
import { Propeller } from './propeller'

const DRONE_DIMENSIONS = {
  widthXAxis: 69,
  widthZAxis: 69,
  heightCoreInner: 18,
  thicknessPropguard: 2,
  thicknessCore: 3
}

const COLORS = {
  core: 0x989898,
  aux: 0x6CD0E0,
  wireframe: 0xFB5902
}

export class Drone extends Model {
  name = 'Drone'

  appearance = 'shaded'
  appearanceRatio = 1
  appearances = {
    shaded: {
      visible: true,
      ratio: 1,
      inScene: true
    },
    wireframe: {
      visible: false,
      ratio: 0,
      inScene: false
    }
  }

  meta = {
    // rotation: ['40deg', '140deg', 0],
    // position: () => [grid.columnsWidth(3), 0, 0],
    // size: () => [grid.columnsWidth(6)],
    useContainer: true
  }

  constructor () {
    super(undefined, {
      filename: 'bateleur.v0.3.1.6.squashed.glb'
    })

    this.setState({
      float: true
    })
  }

  loaded () {
    this.createWireframe()
  }

  createWireframe () {
    this.wireframe = new THREE.Group()
    this.wireframe.copy(this.object3D, false)
    this.object3D.children.forEach(child => {
      if ([
        // 'AntennaMount',
        'CoreBottom',
        // 'PropguardBottom',
        // 'BatteryPlate',
        // 'CameraBracket',
        // 'RXBracket',
        'Standoff',
        'PropellerCW',
        'PropellerCCW',
        'Camera'
      ].includes(child.name) || child.type === 'LineSegments') { return }
      const childWireframe = this.generateWireframe(child)

      childWireframe.rotation.set(child.rotation.x, child.rotation.y, child.rotation.z)
      childWireframe.position.set(child.position.x, child.position.y, child.position.z)
      childWireframe.material.transparent = true
      childWireframe.material.opacity = 0
      childWireframe.material.color.set(0xffffff)

      this.wireframe.add(childWireframe)
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
    if (!this.state.float) { return this.resetAnimation() }
    const { wireframe } = this.appearances

    const offsetMultiplier = wireframe.inScene ? 5 : 10
    const periodDivisor = 600
    const sinePeriod = Math.PI * 2 / periodDivisor
    const sineOffset = offsetMultiplier * Math.sin(frame * sinePeriod) + 10
    const sineRotationZ = (wireframe.inScene ? 0.05 : 0.02) * Math.sin(frame * sinePeriod * 1.3)
    const sineRotationX = (wireframe.inScene ? 0.05 : 0.01) * Math.sin(frame * sinePeriod * 1.5)

    this.transformTarget = 'object3D'
    this.position = { y: sineOffset }
    this.rotation = { z: sineRotationZ, x: sineRotationX }

    if (this.appearances.wireframe.inScene) {
      this.wireframe.position.copy(this.transformTarget.position)
      this.wireframe.rotation.copy(this.transformTarget.rotation)
    }
    this.transformTarget = 'default'
  }

  resetAnimation () {
    this.transformTarget = 'object3D'
    this.position.y = 0
    this.rotation = { z: 0, x: 0 }
    this.transformTarget = 'default'
  }

  appearanceInterpolator ({ from, to, ratio }) {
    if (from === to) { return }
    const ratioMax = 0.8
    const ratioMin = 0.2
    ratio = Math.min(ratioMax, Math.max(ratioMin, ratio))
    this.appearances[from].ratio = 1 - ratio
    this.appearances[to].ratio = ratio

    Object.entries(this.appearances).forEach(([appearanceKey, appearanceState]) => {
      appearanceState.visible = appearanceState.ratio > ratioMin
      if (!appearanceState.visible) {
        this.removeAppearance(appearanceKey)
      } else {
        this.addAppearance(appearanceKey)
      }
    })
    if (this.appearances.wireframe.ratio >= ratioMax) {
      this.scene.fog(true)
    } else if (this.appearances.wireframe.ratio < ratioMax) {
      this.scene.fog(false)
    }

    this.fadeChildren(this.wireframe, 'wireframe')
    this.fadeChildren(this.object3D, 'shaded')
  }

  fadeChildren (parent, appearanceKey) {
    let opacity = this.appearances[appearanceKey].ratio
    opacity = THREE.MathUtils.mapLinear(opacity, 0.25, 0.75, 0, 1)
    parent.children.forEach(child => {
      if (appearanceKey === 'shaded' && child.type === 'LineSegments') { return }
      child.material.transparent = true
      child.material.opacity = opacity
    })
  }

  removeAppearance (appearanceKey) {
    if (!this.appearances[appearanceKey].inScene || appearanceKey === 'shaded') { return }
    const appearanceObject = appearanceKey === 'wireframe' ? this.wireframe : this.object3D
    this.appearances[appearanceKey].inScene = false
    this.container.remove(appearanceObject)
  }

  addAppearance (appearanceKey) {
    if (this.appearances[appearanceKey].inScene) { return }
    const appearanceObject = appearanceKey === 'wireframe' ? this.wireframe : this.object3D
    this.appearances[appearanceKey].inScene = true
    this.container.add(appearanceObject)
  }

  sizeInterpolator (size) {

  }

  update (frame) {
    this.floatAnimation(frame)
  }

  updateFromStore () {
    const {
      appearanceTransition
    } = this.state.store
    super.updateFromStore()
    this.appearanceInterpolator(appearanceTransition)
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
        color: COLORS.aux,
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
        color: COLORS.core,
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
        color: COLORS.core,
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
            color: COLORS.aux,
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
            color: COLORS.aux,
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
            color: COLORS.aux,
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
            color: COLORS.aux,
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
        color: COLORS.core,
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
            color: COLORS.aux,
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
            color: COLORS.aux,
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
      material: {
        color: COLORS.wireframe
      },
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
            color: COLORS.wireframe
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
            color: COLORS.wireframe
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
            color: COLORS.wireframe
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
            color: COLORS.wireframe
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
            color: COLORS.core,
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
            color: COLORS.core,
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
        color: COLORS.aux,
        flatShading: true
      }
    }
  }
}
