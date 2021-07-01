//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  
  },
  
  onLoad: function () {
   
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/UserInfo/UserInfo'
    })
  },
   bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  user:function(){
     wx.switchTab({
      url:'/pages/User/User'
    })
  }
  
})
