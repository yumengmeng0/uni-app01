<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <view class="tips-text">登录后享更多权益</view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 用户授权之后获取用户基本信息
      getUserInfo(e) {
        // 判断是否获取用户基本信息
        if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权')
        // 更新用户基本信息
        this.updateUserInfo(e.detail.userInfo)
        this.getToken(e.detail)
        // console.log(e)
      },
      // 调用登录接口，换取永久token
      async getToken(info) {
        // 获取code对应的值
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)

        // console.log(res)

        // 登录失败时err!=null, res undefined
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')

        // 准备参数
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }

        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        console.log(loginResult)
        // 获取token有问题，暂时写死
        // if (loginResult.meta.state !== 200) return uni.$showMsg('登录失败！')
        this.updateToken('token')
        uni.$showMsg('登录成功！')
        this.navigateBack()
      },
      navigateBack() {
        console.log('navigateBack')
        console.log(this.redirectInfo)
        // todo 没取到this.redirectInfo的值
        
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })

        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;

    //  CSS伪元素 ::符号是用来区分伪类和伪元素的
    &::after {
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .contact-filled {}

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
