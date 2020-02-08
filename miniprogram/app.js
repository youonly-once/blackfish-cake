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
    this.getIsAdmin(function(){})
    this.getUserOpenIdViaCloud()
    this.isIphoneX()
  },
  onShow(opts) {
    console.log('App Show', opts)
  },
  onHide() {
    console.log('App Hide')
  },

  globalData: {
    hasLogin: false,
    openid: null,
    //顶部显示用
    storeLatitude: 29.492788228,
    storeLongitude: 106.470879739,
    userInfo: null,
    apiUrl: null,
    needToReloadShareActivity: false,

    flushCart: false,//刷新购物车列表
    flushCartNum: false,//刷新购物车数量
    isAdmin: false,//是否为管理员
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
  getIsAdmin(callback){
    let that=this
    wx.cloud.callFunction({
      name:'manageUser',
      success(res){
        console.log(res.result)
        that.globalData.isAdmin = res.result.isAdmin
      },
      complete(res){
        callback(res)
      }
    })
  },

  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'wxContext',
      data: {}
    }).then(res => {
      console.log(res.result.openid)
      this.globalData.openid = res.result.openid
      return res.result.openid
    })
  },
  /**
  * IPHONE X系列底部会被遮挡
  * IPHONE 11系列也会
  */
  isIphoneX() {
    let info = wx.getSystemInfoSync();
    console.log('info.model', info)
    let infoX = info.model.substring(0, 8)
    let info11 = info.model.substring(0, 9)
    // console.log('info.model', infoX)
    // console.log('info.model', info11)
    if (/iPhone X/i.test(infoX) || /iPhone 11/i.test(info11)) {
      this.globalData.padding_bottom=45
    } else {
      this.globalData.padding_bottom = 0
    }
  }
})
