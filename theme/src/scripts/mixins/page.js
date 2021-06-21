import { mapMutations } from 'vuex'

export default {
  mounted () {
    console.log('PAGE HAS BEEN LOADED!')
    this.setPageLoaded(true);
  },

  methods: {
    ...mapMutations({
      setPageLoaded: 'page/setLoaded'
    })
  }
}
