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

      if (childWireframe.material) {
        childWireframe.material.transparent = true
        childWireframe.material.opacity = 0
        childWireframe.material.color.set(0xffffff)
      }

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
    const { floatInterpolation } = this.state
    const { wireframe } = this.appearances

    const offsetMultiplier = wireframe.inScene ? 5 : 10
    const periodDivisor = 600
    const sinePeriod = Math.PI * 2 / periodDivisor
    const sineOffset = (offsetMultiplier * Math.sin(frame * sinePeriod) + 10) * floatInterpolation.value
    const sineRotationZ = (wireframe.inScene ? 0.05 : 0.02) * Math.sin(frame * sinePeriod * 1.3) * floatInterpolation.value
    const sineRotationX = (wireframe.inScene ? 0.05 : 0.01) * Math.sin(frame * sinePeriod * 1.5) * floatInterpolation.value

    this.transformTarget = 'object3D'
    this.position = { y: sineOffset }
    this.rotation = { z: sineRotationZ, x: sineRotationX }

    if (this.appearances.wireframe.inScene) {
      this.wireframe.position.copy(this.transformTarget.position)
      this.wireframe.rotation.copy(this.transformTarget.rotation)
    }
    this.transformTarget = 'default'
  }

  explodedViewInterpolator ({ from = 0, to = 0, value, ratio }) {
    const { scalar } = this.scene
    if (to === from) { return }

    const relatedRatio = to > from ? ratio : 1 - ratio
    this.explodedViewSpinRatio = relatedRatio

    this.children.forEach(child => {
      child._initialPosition = child._initialPosition || child.position.clone()
      const { yRatio } = child.meta.explodedView
      const positionOffset = (((value * window.innerHeight * 0.2) / scalar) * yRatio);
      const yPosition = child._initialPosition.y + positionOffset
      child.position = {
        y: yPosition
      }
    })
  }

  spinExplodedView () {
    if (this.explodedViewSpinRatio > 0.98) {
      const { rotation } = this.state
      this.store.commit('drone/apply', {
        rotation: [
          parseFloat(rotation[0]) + (0.15 * this.explodedViewSpinRatio) + 'deg' ,
          parseFloat(rotation[1]) + (0.25 * this.explodedViewSpinRatio) + 'deg',
          rotation[2]
          // parseFloat(rotation[2]) + (0.25 * this.explodedViewSpinRatio) + 'deg'
        ]
      })
    }
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
      if (child.type === 'Group') {
        this.fadeChildren(child, appearanceKey)
        return
      }

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
    this.spinExplodedView(frame)
  }

  updateFromStore () {
    const {
      appearanceInterpolation,
      explodedViewInterpolation
    } = this.state
    super.updateFromStore()
    this.appearanceInterpolator(appearanceInterpolation)
    this.explodedViewInterpolator(explodedViewInterpolation)
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
      },
      explodedView: {
        yRatio: -0.33
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
      },
      explodedView: {
        yRatio: 0
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
      },
      explodedView: {
        yRatio: -0.6
      }
    },
    PropguardTop: {
      clone: [
        {
          group: 'top',
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
          },
          explodedView: {
            yRatio: 0.66
          }
        },
        {
          group: 'top',
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
          },
          explodedView: {
            yRatio: 0.66
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
          },
          explodedView: {
            yRatio: -1
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
          },
          explodedView: {
            yRatio: -1
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
      },
      explodedView: {
        yRatio: 1
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
          },
          explodedView: {
            yRatio: -0.33
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
          },
          explodedView: {
            yRatio: -0.33
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
      rotation: ['110deg', 0, 0],
      explodedView: {
        yRatio: -0.33
      }
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
          },
          explodedView: {
            yRatio: -0.05
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
          },
          explodedView: {
            yRatio: -0.05
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
          },
          explodedView: {
            yRatio: -0.05
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
          },
          explodedView: {
            yRatio: -0.05
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
          },
          explodedView: {
            yRatio: -0.33
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
          },
          explodedView: {
            yRatio: -0.33
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
      },
      explodedView: {
        yRatio: 0.33
      }
    }
  }
}
