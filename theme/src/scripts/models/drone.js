import Model from './model'
import grid from '../layout/grid'

export class Drone extends Model {
  name = 'Drone'

  meta = {
    rotation: ['40deg', '-40deg', 0],
    position: () => [grid.columnsWidth(3), 0, 0],
    size: () => [grid.columnsWidth(6)]
  }

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
          rotation: [0, '180deg', 0],
          material: {
            color: 0x6cd0e0
          }
        }
      ],
    },
    PropguardsBottom: {
      clone: [
        {
          position: [-23.9, -11.6, 0.15],
          rotation: [0, 0, 0],
          material: {
            color: 0x6cd0e0
          }
        },
        {
          position: [23.9, -11.6, 0.15],
          rotation: [0, '180deg', 0],
          material: {
            color: 0x6cd0e0
          }
        }
      ]
    },
    Batteryplate: {
      merge: true,
      position: [0, 15, 0],
      color: 0xbbbbbb
    },
    CameraBracket: {
      clone: [
        {
          position: [9.5, 0, 54.3],
          rotation: [0, '180deg', 0],
          material: {
            color: 0xbbbbbb
          }
        },
        {
          position: [-9.5, 0, 54.3],
          rotation: [0, '180deg', '180deg'],
          material: {
            color: 0xbbbbbb
          }
        }
      ]
    },
    PropellerCCW: {
      clone: [
        {
          position: [-32, 0, 32],
        material: {
            color: 0xbb00bb
          }
        },
        {
          position: [32, 0, -32],
          material: {
            color: 0xbb00bb
          }
        }
      ]
    },
    PropellerCW: {
      clone: [
        {
          position: [32, 0, 32],
          material: {
            color: 0xbb00bb
          }
        },
        {
          position: [-32, 0, -32],
          material: {
            color: 0xbb00bb
          }
        }
      ]
    }
  }

  constructor () {
    super(undefined, {
      filename: 'bateleur.v0.2.12.squashed.glb'
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
    const offsetMultiplier = 4
    const periodDivisor = 1000
    const sinePeriod = Math.PI * 2 / periodDivisor
    const sineOffset = offsetMultiplier * Math.sin(frame * sinePeriod) + 10
    const sineRotationZ = 0.0003 * Math.sin(frame * sinePeriod * 1.3)

    this.position = { y: sineOffset }
    this.rotation = { z: sineRotationZ }
  }
}
