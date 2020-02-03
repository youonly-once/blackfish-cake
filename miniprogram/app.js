const config = require('./config')
const httpUtil = require("./utils/http.js");
const cart = require('./utils/cart.js')
global.isDemo = true
App({
  //小程序运行
  onLaunch(opts) {
    console.log('App Launch', opts)
    //初始化云函数
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: config.envId,
        traceUser: true,
      })
    }
    cart.setCartNun()
  },
  onShow(opts) {
    console.log('App Show', opts)
  },
  onHide() {
    console.log('App Hide')
  },
  /**
  * 刷新纪录新增购物车的状态
  */
  flushCartStatus: function () {
    this.globalData.flushCart = this.globalData.flushCart == true ? false : true;
    
  },
  flushCartNum:function(){
    this.globalData.flushCartNum = this.globalData.flushCartNum == true ? false : true;
  },
 
  globalData: {
    hasLogin: false,
    openid: null,
    
    userInfo: null,
    apiUrl: null,
    needToReloadShareActivity: false,
    flushCart: false,
    flushCartNum:false
  },
  // lazy loading openid
  getUserOpenId(callback) {
    const self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success(data) {
          wx.request({
            url: config.openIdUrl,
            data: {
              code: data.code
            },
            success(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'wxContext',
      data: {}
    }).then(res => {
      this.globalData.openid = res.result.openid
      return res.result.openid
    })
  }
})
