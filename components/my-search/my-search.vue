<template>
  <view class="my-search-container" :style="{'background-color' : bgcolor}" @click="searchBoxHanlder">
    <!-- 使用view组件模拟input输入框的样式 -->
    <view class="my-search-box">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      // 圆角尺寸
      radius: {
        type: Number,
        default: 18 // px
      },
      // 背景颜色
      bgcolor: {
        type: String,
        default: '#c00000'
      }

    },
    name: "my-search",
    data() {
      return {

      };
    },
    methods: {
      searchBoxHanlder() {
        console.log("searchBoxHanlder")
        // 为自定义组件绑定事件
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 50px;
    // background-color: #c00000;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .my-search-box {
      height: 36px;
      background-color: #fff;
      // !小程序端不能动态修改border-radius
      border-radius: 18px;
      width: 100%;
      display: flex;
      // 在弹性盒对象的 <div> 元素中的各项周围留有空白：
      justify-content: center;
      // 居中对齐弹性盒的各项 <div> 元素：
      align-items: center;

      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>
