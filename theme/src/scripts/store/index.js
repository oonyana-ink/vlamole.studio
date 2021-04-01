import { createStore } from 'vuex'
import { drone, scene } from './modules'

export default createStore({
  modules: {
    drone,
    scene
  },

  state () {
    return {

    }
  }
})
