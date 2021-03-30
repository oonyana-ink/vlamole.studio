<template>
  <section
    class="intro section"
    :style="sectionStyles"
  >
    <h1>
      Fly. Crash.<br/>
      Order new parts.<br/>
      Wait. Wait. Wait. <br/>
      Fix. <br/>
      Fly. Crash. Repeat.
    </h1>
  </section>

  <teleport to="#section-backgrounds">
    <div
      ref="background"
      class="section-background"
      style='background-color: #fff'
    />
  </teleport>
</template>

<script>
import sectionMixin from '@mixins/section'

export default {
  name: 'Intro',
  mixins: [sectionMixin],

  setup () {
    return {
      config: {}
    }
  }
}
</script>
