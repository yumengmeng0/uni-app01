<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧滑动区域-->
      <scroll-view scroll-y="true" :style="{height: windowHeight + 'px'}" class="left-scroll-view">
        <block v-for="(item, i) in cateList" :key="i">
          <view :class="['left-scroll-view-item', active===i?'active':'']" @click="activeChanged(i)">{{item.cat_name}}
          </view>
        </block>
      </scroll-view>

      <!-- 右侧滑动区域-->
      <scroll-view scroll-y="true" :scroll-top="scrollTop" :style="{height: windowHeight + 'px'}">
        <view class='cate-lv2' v-for="(item2, i2) in cateLevel2" :key="i2">
          <!-- 二级分类标题 -->
          <view class="cate-lv2-title">
            /{{item2.cat_name}}/
          </view>
          <!-- 三级分类列表-->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodList(item3)">
              <image :src="item3.cat_icon"></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 当前设备可用高度
        windowHeight: 0,
        cateList: [],
        active: 0,
        // 二级分类列表
        cateLevel2: [],
        cateLevel3: [],
        // 滚动条距离顶部的距离
        scrollTop: 0
      }
    },
    methods: {
      // 获取分类表数据
      async getCateList() {

        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')

        if (res.meta.status !== 200) uni.$showMessage()
        this.cateList = res.message
        this.cateLevel2 = res.message[0].children


      },
      activeChanged(i) {
        this.active = i
        // 重新为二级分类赋值
        this.cateLevel2 = this.cateList[i].children
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 跳转到商品列表页面
      gotoGoodList(item3) {
        uni.navigateTo({
          url: '/subpkg/good_list/good_list?cid=' + item3.cat_id
        })
      }
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync() // 同步获取
      // const sysInfo2 = uni.getSystemInfo() // 异步获取（返回Promise对象）
      this.windowHeight = sysInfo.windowHeight
      console.log(this.windowHeight)
      this.getCateList();
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #f7f7f7;
        line-height: 60px;
        text-align: center;
        font: 12px;

        // & 是父选择器
        &.active {
          background-color: #ffffff;
          position: relative;

          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }

    .cate-lv2-title {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 15px 0;
    }
  }

  .cate-lv3-list {
    display: flex;
    // 让弹性盒元素在必要的时候拆行：
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }

    }
  }
</style>
