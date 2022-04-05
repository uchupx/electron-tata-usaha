// import shop from "@/api/shop";
import fs from 'fs'

export default {
  namespaced: true,

  state: {
    // {id, quantity}
    configPath: '',
    userDataPath: '',
    logo: '',
    schoolName: '',
    hostBackup: '',
    autoBackup: false,
    backupEvery: 'transaction',
    items: [],
    isModalOpen: false,
    modalComponent: null,
    modalPayload: {} as any,
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
    },
    setModalPayload(state: any, payload: any) {
      state.modalPayload = payload
    },

    setPath(state: any, path: string) {
      state.configPath = path
    },
    setUserDataPath(state: any, path: string) {
      state.userDataPath = path
    },
    setLogo(state: any, value: string) {
      state.logo = value
    },
    setSchoolName(state: any, value: string) {
      state.schoolName = value
    },
    setAutoBackup(state: any, value: boolean) {
      state.autoBackup = value
    },
    setBackupEvery(state: any, value: string) {
      state.backupEvery = value
    },
    setHost(state: any, value: string) {
      state.hostBackup = value
    },
    
    initializeState(state: any, payload: any) {
      state.logo = payload.logo
      state.schoolName = payload.schoolName
      state.autoBackup = payload.autoBackup
      state.backupEvery = payload.backupEvery
      state.hostBackup = payload.hostBackup
    }
  },

  actions: {
    openModal({ commit }: { commit: Function }, component: any) {
      commit('openModal', component)
    },
    closeModal({ commit }: { commit: Function }) {
      commit('closeModal')
    },
    initialize({ commit }: { commit: Function }, path: string) {
      const data = fs.readFileSync(`${path}/config.json`, { encoding: 'utf8', flag: 'r' })
      commit('initializeState', JSON.parse(data))
      commit('setPath', `${path}/config.json`)
      commit('setUserDataPath', `${path}`)
    },
    updateSchoolName({ commit }: { commit: Function }, payload: any) {
      const rawData = fs.readFileSync(payload.path, {encoding:'utf8', flag:'r'})
      const data = JSON.parse(rawData)
      
      data.schoolName = payload.name

      fs.writeFileSync(payload.path, JSON.stringify(data))

      commit('setSchoolName', payload.name)
    },
    updateAutoBackup({ commit }: { commit: Function }, payload: any) {
      const rawData = fs.readFileSync(payload.path, {encoding:'utf8', flag:'r'})
      const data = JSON.parse(rawData)
      
      data.autoBackup = payload.value

      fs.writeFileSync(payload.path, JSON.stringify(data))

      commit('setAutoBackup', payload.value)
    },
    updateLogo({ commit }: { commit: Function }, payload: any) {
      const rawData = fs.readFileSync(payload.path, {encoding:'utf8', flag:'r'})
      const data = JSON.parse(rawData)
      
      data.logo = payload.value

      fs.writeFileSync(payload.path, JSON.stringify(data))

      commit('setLogo', payload.value)
    },
    updateHost({ commit }: { commit: Function }, payload: any) {
      const rawData = fs.readFileSync(payload.path, {encoding:'utf8', flag:'r'})
      const data = JSON.parse(rawData)
      
      data.hostBackup = payload.value

      fs.writeFileSync(payload.path, JSON.stringify(data))

      commit('setHost', payload.value)
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