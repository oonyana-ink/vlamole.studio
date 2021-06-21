const productJSONTag = document.getElementById('product-json')
const productJSON = productJSONTag
  ? JSON.parse(productJSONTag.innerHTML)
  : {
    product: {
      variants: []
    }
  }

export default {
  namespaced: true,
  state: () => ({
    product: productJSON.product,
    showSelector: false
  }),
  getters: {
    freeVariant (state) {
      return state.product.variants.find(variant => /free/i.test(variant.option1)) || {}
    },

    premiumVariant (state) {
      return state.product.variants.find(variant => /premium/i.test(variant.option1)) || {}
    },

    showSelector (state) {
      return state.showSelector
    },

    productImages (state) {
      return state.product.images
    }
  },
  mutations: {
    showSelector (state, showSelector) {
      state.showSelector = showSelector
    },

    toggleSelector (state) {
      state.showSelector = !state.showSelector
    }
  },
  actions: {}
}
