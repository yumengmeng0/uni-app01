<template>
  <view>
    <!-- 搜索组件-->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>

    <!-- 轮播图    -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 分类导航区域 -->
    <view class="nav-list">
      <!-- 楼层标题-->
      <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>



    <view class="floor-list">
      <!--每个楼层数据-->
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层标题图片-->
        <image :src="item.floor_title.image_src" class="floor-title"></image>

        <!-- 楼层图片-->
        <view class="floor-img-box">

          <!-- 楼层左侧1个大图片-->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width : item.product_list[0].image_width+'rpx'}"
              mode="widthFix"></image>
          </navigator>

          <!-- 楼层右侧4个大图片-->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 != 0"
              :url="item2.url">
              <image :src="item2.image_src" :style="{width : item2.image_width + 'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>
        </view>

      </view>

    </view>

  </view>

</template>

<script>
  // import {
  //   badgeMix
  // } from '@/mixins/tabbar-badge.js'

  export default {
    // mixins: [badgeMix],
    data() {
      return {
        // 轮播图数据节点
        swiperList: [],
        // 分类导航的数据列表
        navList: [],
        // 楼层数据
        floorList: []
      };
    },
    onLoad() {
      // 获取轮播图数据
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      gotoSearch() {
        // console.log('gotoSearch')
        uni.navigateTo({
          url: '../../subpkg/search/search'
        })
      },
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')

        // console.log(res)

        // 请求失败
        if (res.meta.status !== 200) {
          return uni.$showMsg
        }

        this.swiperList = res.message
      },
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')

        // 请求失败
        if (res.meta.status !== 200) {
          return uni.$showMsg
        }
        this.navList = res.message
      },
      navClickHandler(item) {
        console.log(item)
        if (item.name == '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取首页楼层数据
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')

        if (res.meta.status !== 200) return uni.$showMsg()

        // 对数据进行处理
        res.message.forEach(floor => {
          floor.product_list.forEach(product => {
            // 自定义属性url，用于页面跳转（因为good_list在分包中）
            product.url = '/subpkg/good_list/good_list?' + product.navigator_url.split('?')[1]
          })
        })

        this.floorList = res.message

      }

    }
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    width: 100%;
    height: 60rpx;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .right-img-item {
    display: flex;
    flex-wrap: wrap;

  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }


  .search-box {
    // 设置定位效果为吸顶（固定）
    position: sticky;
    // 位置
    top: 0;
    // 提高层级防止被轮播图覆盖
    z-index: 999;
  }
</style>
