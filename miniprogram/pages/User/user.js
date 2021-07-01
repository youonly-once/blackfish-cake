
const app = getApp()


Page({
  data: {
    showCustomSheet:false//客服界面显示
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
      url:'/pages/UserInfor/UserInfor'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/UserCoupon/UserCoupon'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/UserAddress/UserAddress'
    })
  },
  order:function(e){
    let orderstatus = e.currentTarget.dataset.orderstatus
    wx.navigateTo({
      url: '/pages/Order/Order?orderstatus=' + orderstatus
    })
  },
  orderManager: function (e) {
    
    wx.navigateTo({
      url: '/pages/OrderManager/OrderManager?orderstatus=0' 
    })
  },
 shopping:function(){
     wx.redirectTo({
      url:'/pages/Shopping/Shopping'
    })
  },
  sort:function(){
     wx.redirectTo({
      url:'/pages/Sort/Sort'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/Index/Index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/User/User'
    })
  },
  bindCustom: function () {
    this.setData({
      showCustomSheet:true
    })
  },

  bindAbout: function () {
    wx.navigateTo({
      url: '/pages/About/About'
    })
  }
})
