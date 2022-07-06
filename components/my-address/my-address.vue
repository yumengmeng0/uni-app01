<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btn-choose-address" @click="chooseAddress">请选择收货地址+</button>
    </view>

    <!-- 收货信息的盒子 -->
    <view class="addres-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：{{address.userName}} </view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：{{address.telNumber}}</view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">
          收货地址：
        </view>
        <view class="row2-right">
          {{addstr}}
        </view>
      </view>
    </view>

    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import {
    mapSate,
    mapMutations,
    mapGetters
  } from 'vuex'

  export default {
    name: "my-address",
    data() {
      return {
        address: {}
      };
    },
    computed: {
      ...mapGetters('m_user', ['addstr'])
      // ...mapSate('m_user', ['address']),
      // addstr() {
      //   if (!this.address.provinceName) return ''
      //   return this.address.provinceName + this.address.cityName + this.address.detailInfo + this.address.postalCode
      // }
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress']),
      async chooseAddress() {
        // 成功传给第二个参数，失败，把错误传给第二个参数
        const [err, succ] = await uni.chooseAddress().catch(err => err)
        console.log('succ')
        console.log(succ.errMsg)
        console.log(this.addstr)
        if (err === null && succ.errMsg === 'chooseAddress:ok') {
          this.address = succ
          this.updateAddress(succ)
        }

        // console.log(err)

        if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg ===
            'chooseAddress:fail authorize no response')) {
          this.reAuth() // 向用户重新发起授权申请
        }

      },
      async reAuth() {
        const [err2, confirmResult] = await uni.showModal({
          content: '检测到您没有打开地址授权，是否去设置打开？',
          confirmText: '确认',
          cancelText: '取消'
        })

        if (err) return

        console.log(confirmResult)

        if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权！')
        if (confirmResult.confirm) return uni.openSetting({
          success: (settingResult) => {
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权')
          }
        })

      }
    }
  }
</script>

<style lang="scss">
  .address-border {
    display: block;
    width: 100%;
    height: 5px;
  }

  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn-choose-address {}

  }

  .addres-info-box {
    font-size: 12px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;

    .row1 {
      display: flex;
      justify-content: space-between;

      .row1-left {
        .username {}
      }

      .row1-right {
        display: flex;
        justify-content: space-between;

        .phone {}
      }
    }

    .row2 {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      margin-top: 10px;

      .row2-left {
        // 文本不换行
        white-space: nowrap;
      }

      .row2-right {}
    }
  }
</style>
