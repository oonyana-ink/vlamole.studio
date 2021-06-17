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
      console.log('toggle')
      state.open = !state.open
    }
  }
}