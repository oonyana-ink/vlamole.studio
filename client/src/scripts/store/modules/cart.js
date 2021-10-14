export default {
  namespaced: true,
  state: () => ({

  }),
  getters: {},
  mutations: {},
  actions: {
    addAndCheckout (context, variant) {
      const postBody = {
        items: [
          {
            id: variant.id,
            quantity: 1
          }
        ]
      }

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
      }).then(response => {
        return response.json()
      }).then(data => {
        window.location = '/checkout'
      }).catch(error => {
        console.log('cart/add:error', error)
      })
    }
  }
}
