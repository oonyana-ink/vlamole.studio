import { interpolate } from 'd3-interpolate'

const INTERPOLATABLES = {
  appearance: {
    default: 'shaded'
  },
  float: {
    default: 1
  },
  explodedView: {
    default: 0
  }
}

export default {
  namespaced: true,
  state: () => ({
    updated: Date.now(),
    appearance: 'shaded',
    appearanceInterpolation: {
      ratio: 1
    },
    rotation: ['0deg', '0deg', '0deg'],
    position: [0, 0, 0],
    size: [1],
    float: 1,
    floatInterpolation: {
      from: 1,
      to: 1,
      ratio: 1,
      value: 1
    },
    explodedView: 0,
    explodedViewInterpolation: {
      from: 0,
      to: 0,
      ratio: 0,
      value: 0
    }
  }),
  getters: {},
  mutations: {
    apply (state, newState) {
      for (const key in newState) {
        state[key] = newState[key]
      }
      state.updated = Date.now()
    },

    interpolate (state, { incomingState, outgoingState, easedRatio }) {
      const interpolatedState = {}
      const vectors = ['position', 'rotation']
      let keysToInterpolate = []
      let fromConfig = {}
      let toConfig = {}

      vectors.forEach(key => {
        fromConfig[key] = outgoingState[key]
        toConfig[key] = incomingState[key]
        if (fromConfig[key] && toConfig[key]) {
          keysToInterpolate.push(key)
        }
      })

      keysToInterpolate.forEach(key => {
        state[key] = interpolate(fromConfig[key], toConfig[key])(easedRatio)
      })

      Object.entries(INTERPOLATABLES).forEach(([key, conf]) => {
        const interpolation = {
          from: outgoingState[key] !== undefined ? outgoingState[key] : conf.default,
          to: incomingState[key] !== undefined ? incomingState[key] : conf.default
        }

        if (interpolation.from !== interpolation.to) {
          interpolation.ratio = easedRatio
          interpolation.value = interpolate(interpolation.from, interpolation.to)(easedRatio)

          if (easedRatio > 0.95) {
            state[key] = interpolation.to
          }

          Object.assign(interpolatedState, {
            [`${key}Interpolation`]: interpolation
          })
        }
      });

      this.commit('drone/apply', interpolatedState)
    }
  },
  actions: {}
}
