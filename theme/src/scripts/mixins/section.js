import config from "@/config";
export default {
  computed: {
    assetsURL() {
      return config.assetsURL;
    },

    isIntersecting () {
      console.log(this.$refs.section && this.$refs.section.isIntersecting)
      return this.mounted && this.$refs.section.isIntersecting
    }
  }
}
