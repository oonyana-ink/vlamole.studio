<template>
  <div
    ref="trigger"
    class="scroll-trigger"
  />
</template>

<script>
const OBSERVERS = {}
const PROCESS_TRIGGERS = (intersectionEntries, observer) => {
  intersectionEntries.forEach(entry => {
    const crossedThresholds = observer.thresholds.filter(threshold => entry.intersectionRatio > threshold)
    if (crossedThresholds.length > 0) {
      entry.target.trigger.$emit('trigger', entry.target.trigger)
    }
  })
}
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    isActive: Boolean,
    threshold: {
      type: String,
      default: 0.5
    }
  },

  watch: {
    isActive () {
      this.toggleObservation()
    }
  },

  created () {
    this.setupObserver()
  },

  mounted () {
    this.$el.trigger = this
    this.toggleObservation()
  },

  methods: {
    setupObserver () {
      const { threshold } = this
      if (!OBSERVERS[threshold]) {
        OBSERVERS[threshold] = new IntersectionObserver(PROCESS_TRIGGERS, {
          threshold: parseFloat(threshold)
        })
      }
    },

    toggleObservation () {
      const { isActive, threshold, $el } = this
      const observerMethod = isActive ? 'observe' : 'unobserve'
      OBSERVERS[threshold][observerMethod]($el)
    }
  }
}
</script>
