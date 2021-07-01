//app.js
App({
  onLaunch: function() {    
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },  
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
      console.log(this.globalData.userInfo,1)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
          console.log(that.globalData.userInfo, 1)
        }
      })
    }
  },
  onLoad: function() {
    
  },
  globalData: {
    userInfo: null,
    location: "",
    city: '',
    address: '',
    buycar_num: 0,
    totalMoney: 0,
    totalSecond: 899
  }
})
