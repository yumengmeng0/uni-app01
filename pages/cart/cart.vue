<template>
  <view>
    <view class="cart-container" v-if="cart.length !== 0">
      <my-address></my-address>
      <!-- 商品列表标题 -->
      <view class="cart-title">
        <uni-icons type="shop" size="18"></uni-icons>
        <text class="cart-title-text">购物车</text>
      </view>

      <!-- 商品列表 -->
      <uni-swipe-action>
        <block v-for="(goods, i ) in cart" :key="i">
          <uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
            <my-goods :goods="goods" :show-radio="true" @radio-change="radioChangeHandler" :show-num="true"
              @num-change="numberChangeHandler"></my-goods>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>

      <my-settle></my-settle>
    </view>

    <!-- 空购物车 -->
    <view class="empty-cart" v-else>
      <image src="../../static/cart_empty@2x.png" class="empty-img"></image>
      <text class="tip-txt">空空如也</text>
    </view>
  </view>

</template>

<script>
  import {
    mapGetters,
    mapState,
    mapMutations
  } from 'vuex'

  // import {
  //   badgeMix
  // } from '@/mixins/tabbar-badge.js'



  export default {
    // mixins: [badgeMix],
    computed: {
      ...mapGetters('m_cart', ['total']),
      ...mapState('m_cart', ['cart'])
    },
    onShow() {
      this.setBadge()
    },

    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#c00000'
          }
        }]
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      setBadge() {
        uni.setTabBarBadge({
          index: 2,
          text: this.total + ''
        })
      },
      radioChangeHandler(e) {
        // console.log(e)
        this.updateGoodsState(e)
      },
      numberChangeHandler(e) {
        // console.log(e)
        this.updateGoodsCount(e)
      },
      swipeItemClickHandler(goods) {
        console.log(goods)
        this.removeGoodsById(goods.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }

  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      margin-left: 10px;
    }
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;

    .empty-img {
      padding-top: 150px;
      width: 100px;
      height: 100px;
    }

    .tip-txt {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
