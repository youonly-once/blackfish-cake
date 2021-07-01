const APP = getApp();
import { handleWechatLogin } from '../../utils/common.js';
Page({
  data: {
    logo: APP.imgs.logo,
    mobile: '',
    password: ''
  },
  onLoad(options) {

  },
  // 手机号码监听
  bindMobileInput(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  // 密码监听
  bindPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 登陆监听
  login() {
    if (!this.data.mobile) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
      })
      return;
    }
    if (!this.data.password) {
      wx.showToast({
        title: '请填写密码',
        icon: 'none',
      })
      return;
    }
    // 登录逻辑
    APP.ajax({
      url: APP.api.userLogin,
      data: {
        mobile: this.data.mobile,
        password: this.data.password,
      },
      success(res) {
        wx.showToast({
          title: '登录成功',
          icon: 'none',
        })
        res.data.user.avatar = res.data.user.avatar ? res.data.user.avatar : APP.imgs.avatar;
        // 登录之后先全部存入本地
        wx.setStorageSync("token", res.data.token)
        wx.setStorageSync("user", res.data.user)
        // 然后再存入全局变量中
        APP.globalData.hasLogin = true
        APP.globalData.token = res.data.token.token
        APP.globalData.user = res.data.user
        // 再跳转
        wx.switchTab({
          url: '/pages/BarUser/index',
        })
      }
    });
  },
  register() {
    wx.navigateTo({
      url: '/pages/ComRegister/index',
    })
  },
  forgetPassword() {
    wx.navigateTo({
      url: `/pages/UserSettingPass/index?id=0`,
    })
  },
  // 微信登陆监听
  onGotUserInfo(res) {
    handleWechatLogin(this, res.detail)
  },

})