<template>
  <component :is='svgComponent' />
</template>

<script>
import Cart from '@svgs/cart.svg'
import FilamentSpindle from '@svgs/filament-spindle.svg'
import Instagram from '@svgs/instagram.svg'
import Logo from '@svgs/logo.svg'
import MarlinBed from '@svgs/marlin-bed.svg'
import MarlinFan from '@svgs/marlin-fan.svg'
import MarlinNozzle from '@svgs/marlin-nozzle.svg'
import Screw from '@svgs/screw.svg'
import Twitter from '@svgs/twitter.svg'

const components = {
  'cart': Cart,
  'filament-spindle': FilamentSpindle,
  'instagram': Instagram,
  'logo': Logo,
  'marlin-bed': MarlinBed,
  'marlin-fan': MarlinFan,
  'marlin-nozzle': MarlinNozzle,
  'screw': Screw,
  'twitter': Twitter
}

export default {
  props: {
    svg: {
      type: String,
      default: ''
    }
  },

  computed: {
    svgComponent () {
      return components[this.svg]
    }
  }
}
</script>