<template>
  <div
    class="product-selector"
    :class="stateClasses"
  >
    <div class="product-selector__box free">
      <div class="illustration">
        <img :src="`${assetsURL}/drone-transparent-bg.png`" />
      </div>
      <div class="copy">
        <div class="price">
          <h4 class="category-label">Free</h4>
          <h1>$0</h1>
        </div>
        <ul>
          <li>{{ freeVariant.id }}</li>
          <li>Category Feature</li>
          <li>Category Feature</li>
          <li>Category Feature</li>
          <li>Category Feature</li>
        </ul>
      </div>
      <div class="cta">
        <button @click="addToCartAndCheckout(freeVariant)">Add to cart</button>
      </div>
    </div>
    <div class="product-selector__box premium">
      <div class="illustration">
        <img :src="`${assetsURL}/drone-transparent-bg.png`" />
      </div>
      <div class="copy">
        <div class="price">
          <h4 class="category-label">Better than free</h4>
          <h1>$10</h1>
        </div>
        <ul>
          <li>{{ premiumVariant.id }}</li>
          <li>Category Feature</li>
          <li>Category Feature</li>
          <li>Category Feature</li>
          <li>Category Feature</li>
        </ul>
      </div>
      <div class="cta">
        <button @click="addToCartAndCheckout(premiumVariant)">Add to cart</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import config from '@/config'

export default {
  name: 'ProductSelector',

  computed: {
    ...mapGetters({
      freeVariant: 'product/freeVariant',
      premiumVariant: 'product/premiumVariant',
      showSelector: 'product/showSelector'
    }),

    stateClasses () {
      return {
        show: this.showSelector
      }
    },

    assetsURL () {
      return config.assetsURL
    }
  },

  methods: {
    ...mapActions({
      addToCartAndCheckout: 'cart/addAndCheckout'
    })
  }
}
</script>
