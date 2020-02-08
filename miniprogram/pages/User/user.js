//logs.js
const util = require('../../utils/util.js')
const app = getApp()


Page({
  data: {
    
  },
  onLoad: function () {
    app.getIsAdmin(function(res){
      console.log(res)
      wx.stopPullDownRefresh()
    })
    this.setData({
      isAdmin: app.globalData.isAdmin
    })
  },
  onPullDownRefresh:function(){
    this.onLoad()
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/userInfo/userInfo'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/discount/discount'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/manageAddress/manageAddress'
    })
  },
  order:function(e){
    let orderstatus = e.currentTarget.dataset.orderstatus
    wx.navigateTo({
      url: '/pages/order/order?orderstatus=' + orderstatus
    })
  },
  orderManager: function (e) {
    
    wx.navigateTo({
      url: '/pages/order_manager/order_manager?orderstatus=0' 
    })
  },
 shopping:function(){
     wx.redirectTo({
      url:'/pages/Shopping/shopping'
    })
  },
  sort:function(){
     wx.redirectTo({
      url:'/pages/Sort/sort'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/Index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/User/user'
    })
  }
})
