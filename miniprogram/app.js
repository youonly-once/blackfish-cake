const config = require('./config')
const cart = require('./utils/cart.js')
const util = require('./utils/util.js')
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
    //this.checkLogin();
    this.getIsAdmin(function(){})
    this.getUserOpenIdViaCloud()
    cart.setCartNun()
    this.isIphoneX()
    
    
  },
  onShow(opts) {
    console.log('App Show', opts)
  },
  onHide() {
    console.log('App Hide')
  },
  checkLogin(){
    wx.getSetting({
      success: function (res) {
        console.log
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              //that.queryUsreInfo();
              //用户已经授权过
            }
          });
        }else{
          wx.redirectTo({
            url: '/pages/Login/Login'
          })
        }
      }
    })
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
    customPhone:'18223411280',
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
        console.log('管理员？',res.result)
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
      name: 'login',
      data: {}
    }).then(res => {
      console.log('用户openid:',res.result.openid)
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
