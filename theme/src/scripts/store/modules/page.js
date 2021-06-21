export default {
  namespaced: true,
  state: () => ({
    loaded: false
  }),
  getters: {},
  mutations: {
    setLoaded (state, loadedState) {
      console.log('page:setLoaded', loadedState)
      state.loaded = loadedState
    }
  },
  actions: {}
}
