// import shop from "@/api/shop";

export default {
  namespaced: true,

  state: {
    // {id, quantity}
    items: [],
    isModalOpen: false,
    modalComponent: null
  },

  getters: {
  },

  mutations: {
    openModal(state: any, component: any) {
      state.isModalOpen = true
      state.modalComponent = component
    },
    closeModal(state: any) {
      state.isModalOpen = false
      state.modalComponent = null
    }
  },

  actions: {
    openModal({ commit }: { commit: Function }, component: any) {
      commit('openModal', component)
    },
    closeModal({ commit }: { commit: Function }) {
      commit('closeModal')
    }
    // addProductToCart({state, getters, commit, rootState, rootGetters}, product) {
    //   if (rootGetters['products/productIsInStock'](product)) {
    //     const cartItem = state.items.find(item => item.id === product.id)
    //     if (!cartItem) {
    //       commit('pushProductToCart', product.id)
    //     } else {
    //       commit('incrementItemQuantity', cartItem)
    //     }
    //     commit('products/decrementProductInventory', product, {root: true})
    //   }
    // },

    // checkout({state, commit}) {
    //   shop.buyProducts(
    //     state.items,
    //     () => {
    //       commit('emptyCart')
    //       commit('setCheckoutStatus', 'success')
    //     },
    //     () => {
    //       commit('setCheckoutStatus', 'fail')
    //     }
    //   )
    // }
  }
}