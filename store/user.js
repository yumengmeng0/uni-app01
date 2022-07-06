export default {
  // 开启命名空间
  namespaced: true,
  // state数据
  state: () => ({
    // 收货地址
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    token: uni.getStorageSync('token') || '',
    // 用户的信息对象
    userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
    // 重定向的对象
    redirectInfo: null
  }),
  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      this.commit('m_user/saveAddressToStorage')
    },
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
      this.commit('m_user/saveUserInfoToStorage')
    },
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
    },
    updateToken(state, token) {
      state.token = token
      this.commit('m_user/saveTokenToStorage')
    },
    saveTokenToStorage(state) {
      uni.setStorageSync('token', JSON.stringify(state.token))
    },
    updateRedirectInfo(state, info) {
      this.redirectInfo = info
      console.log('info')
      console.log(info)
      this.commit('m_user/saveRedirectInfoToStorage')
    },
    saveRedirectInfoToStorage(state) {
      uni.setStorageSync('redirectInfo', JSON.stringify(state.redirectInfo))
      console.log(state.redirectInfo)
    }
  },
  // 数据包装器
  getters: {
    addstr(state) {
      if (!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.detailInfo + state.address.postalCode
    }
  },

}
