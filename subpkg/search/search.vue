<template>
  <view class="search-box">
    <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    <!-- 搜索建议列表-->
    <view class="suggest-list" v-if="searchResults.length !== 0">
      <view class="suggest-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <!-- 搜索历史-->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag v-for="(item, i) in historys" :key="i" :text="item" @click="gotoGoodsList(item)"></uni-tag>
      </view>

    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器timer
        timer: null,
        // 搜索的关键字
        keyword: '',
        // 搜索的结果列表
        searchResults: [],
        // 搜索历史关键词
        historyList: []
      };
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('keyword') || '[]')
    },
    methods: {
      // 输入框input事件
      input(e) {
        //清除timer对应的延时器
        clearTimeout(this.timer)

        // 重启一个延时器
        this.timer = setTimeout(() => {
          this.keyword = e
          this.getSearchResults()
          this.saveSearchHistory()
        }, 500)
      },
      async getSearchResults() {
        if (this.keyword === '') {
          this.searchResults = []
          return
        }

        // 发起请求，获取搜索建议列表
        // 解构 右侧对象data属性的值赋给res
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.keyword
        })

        if (res.meta.status !== 200) return uni.$showMsg
        this.searchResults = res.message
      },
      gotoDetail(item) {
        console.log(item.goods_id)
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      saveSearchHistory() {
        // 去除重复关键词
        const set = new Set(this.historyList)
        set.delete(this.keyword)
        set.add(this.keyword)
        this.historyList = Array.from(set)

        // 对搜索历史数据进行持久化存储
        uni.setStorageSync('keyword', JSON.stringify(this.historyList))
      },
      clean() {
        this.historyList = []
        uni.setStorageSync('keyword', '[]')
      },
      gotoGoodsList(keyword) {
        uni.navigateTo({
          url: '/subpkg/good_list/good_list?query=' + keyword
        })
      }
    },

    gotoGoodsList(keyword) {
      uni.navigateTo({
        url: '/subpkg/good_list/good_list?query=' + keyword
      })
    },
    computed: {
      historys() {
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  .suggest-list {
    padding: 0 5px;

    .suggest-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: solid 1px #efefef;

      .goods-name {
        // 文字不允许换行
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 溢出文本用...代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: solid 1px #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
