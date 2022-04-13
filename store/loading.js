export const state = () => ({ 
  isLoading: false
})

export const mutations = { 
  START_LOADING(state) {
    state.isLoading = true
  },
  STOP_LOADING(state) {
    state.isLoading = false
  }
}

export const getters = {
  isLoading: (state) => state.isLoading
}
