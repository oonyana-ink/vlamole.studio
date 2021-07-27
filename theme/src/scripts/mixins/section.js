import config from "@/config";
export default {
  data () {
    return {
      isMounted: false
    }
  },

  computed: {
    assetsURL() {
      return config.assetsURL;
    },

    isIntersecting () {
      return this.isMounted && this.$refs.section.isIntersecting
    }
  },

  mounted () {
    this.isMounted = true
  }
}
