// 1.导入Vue和Vuex
import Vue from 'vue'
import Vuex from 'vuex'

// 导入购物车的vuex模块
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'

// 2.将Vuex安装为Vue的插件
Vue.use(Vuex)

// 3.创建Store的实例对象
const store = new Vuex.Store({
  // 挂载store模块
  modules: {
    // 挂载购物车的vue模块，模块内成员的访问路径被调整为m_cart，例如购物车模块中cart数组的访问路径是：m_cart/cart
    m_cart: moduleCart,
    m_user: moduleUser
  }
})

// 4.向外共享store
export default store
