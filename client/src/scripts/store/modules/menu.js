export default {
  namespaced: true,
  state: () => ({
    open: false
  }),
  getters: {},
  mutations: {
    open (state) {
      state.open = true
    },

    close (state) {
      state.open = false
    },

    toggle (state) {
      state.open = !state.open
    }
  }
}
