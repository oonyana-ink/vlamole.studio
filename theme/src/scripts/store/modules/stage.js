import { interpolate } from 'd3-interpolate'

const INTERPOLATABLES = ['position']
export default {
  namespaced: true,
  state: () => ({
    updated: Date.now(),
    position: [0, 0, 0]
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
      let keysToInterpolate = []
      let fromConfig = {}
      let toConfig = {}

      INTERPOLATABLES.forEach(key => {
        fromConfig[key] = outgoingState[key]
        toConfig[key] = incomingState[key]
        if (fromConfig[key] && toConfig[key]) {
          keysToInterpolate.push(key)
        }
      })

      keysToInterpolate.forEach(key => {
        state[key] = interpolate(fromConfig[key], toConfig[key])(easedRatio)
        // console.log(key, state[key], easedRatio)
      })
    }
  }
}