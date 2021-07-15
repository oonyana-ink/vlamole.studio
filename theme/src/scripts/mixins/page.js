import { mapMutations } from 'vuex'

export default {
  mounted () {
    this.setPageLoaded(true)
  },

  methods: {
    ...mapMutations({
      setPageLoaded: 'page/setLoaded'
    })
  }
}
