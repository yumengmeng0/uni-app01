<template>
  <view class="goods-list">

    <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
      <my-goods :goods="goods"></my-goods>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
        // 节流阀，是否正在请求数据
        isLoading: false
      }
    },
    onLoad(options) {
      console.log(options)
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    onReachBottom() {

      // 判断是否有下一页数据
      console.log(this.queryObj.pagenum * this.queryObj.pagesize)
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) {
        console.log('数据加载完毕！')
        return uni.$showMsg('数据加载完毕！')
      }

      if (this.isLoading) return
      // 页码值+1
      this.queryObj.pagenum++
      this.getGoodsList()
    },
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isLoading = false
      this.goodsList = []

      // 重新发起请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    },
    methods: {
      gotoDetail(goods) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      },
      async getGoodsList(cb) {

        // console.log(this.queryObj)

        this.isLoading = true
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        this.isLoading = false

        cb && cb()

        if (res.meta.status !== 200) return uni.$showMsg

        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total

      }
    }
  }
</script>

<style lang="scss">

</style>
