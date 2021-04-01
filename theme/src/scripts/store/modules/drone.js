import { interpolate } from 'd3-interpolate'

export default {
  namespaced: true,
  state: () => ({
    updated: Date.now(),
    appearance: 'shaded',
    appearanceTransition: {
      from: 'shaded',
      to: 'shaded',
      ratio: 1
    },
    rotation: ['0deg', '0deg', '0deg'],
    position: [0, 0, 0],
    size: [1]
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
      const currentVectors = {
        rotation: state.rotation,
        position: state.position
      }
      const incomingVectors = {}
      const outgoingVectors = {}
      Object.keys(currentVectors).forEach(vectorKey => {
        incomingVectors[vectorKey] = incomingState[vectorKey] || currentVectors[vectorKey]
        outgoingVectors[vectorKey] = outgoingState[vectorKey] || currentVectors[vectorKey]
      })
      Object.assign(interpolatedState, interpolate(outgoingVectors, incomingVectors)(easedRatio))

      const appearanceTransition = {
        from: outgoingState.appearance || state.appearance,
        to: incomingState.appearance || state.appearance
      }
      if (
        appearanceTransition.from !== appearanceTransition.to
      ) {
        appearanceTransition.ratio = easedRatio
        if (easedRatio > 0.95) {
          state.appearance = appearanceTransition.to
        }
        Object.assign(interpolatedState, { appearanceTransition })
      }

      this.commit('drone/apply', interpolatedState)
    }
  },
  actions: {}
}
