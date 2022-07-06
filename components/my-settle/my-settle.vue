<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio">
      <radio value="" color="#c00000" :checked="isFullCheck" @click="changAllGoodsState" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}0</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算（{{checkedCount}}）</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    name: "my-settle",
    data() {
      return {
        seconds: 3,
        timer: null
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapState('m_user', ['token']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_cart', ['cart']),
      isFullCheck() {
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changAllGoodsState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 结算
      settlement() {
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
        console.log(this.token)
        if (!this.addstr) return uni.$showMsg('请选择收获地址')
        // 倒计时导航跳转
        if (!this.token) return this.delayNavigate()
        this.payOrder()
      },
      // 展示倒计时的提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + '秒后自动跳转到登录页',
          mask: true, // 防止展示消息时，用户的点击穿透
          duration: 1500
        })
      },
      // 延时导航到my页面
      delayNavigate() {
        this.seconds = 3

        this.showTips(this.seconds)
        this.timer = setInterval(() => {

          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                console.log('success')
                this.updateRedirectInfo({
                  openType: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
            return
          }

          this.seconds--
          this.showTips(this.seconds)
        }, 1000)
      },
      async payOrder() {

        // 1.创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // order_price: this.checkedGoodsAmount,
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_number,
            gooods_price: x.goods_price
          }))
        }
        // 1.2 组织发起请求创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)

        // console.log(res) // "无效token"
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败')

        // 1.3 得到服务器响应的 订单编号
        const orderNumber = res.message.order_number
        // console.log(orderNumber)

        // 2. 订单预支付
        // 2.1 预支付订单生成失败
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', orderNumber)
        // 2.2 得到订单支付相关的必要参数
        if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.payInfo
        console.log(payInfo)

        // 3. 发起微信支付
        // 3.1 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 未完成支付
        if (err) return uni.$showMsg('订单未支付！')

        //  3.3 完成支付，进一步查询支付结果
        const {
          data: res3
        } = await uni.$http.post('/api/public/v1/my/orders/checkOrder', {
          order_number: orderNumber
        })

        // 3.4 检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')

        // 3.5 订单支付完成
        uni.showToast({
          title: '支付完成',
          icon: 'success'
        })
      }
    }

  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #c00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #c00000;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }

  }
</style>
