var app = getApp()
Page({
  data: {
    end:'none',
    start:'block',
    pics: ['https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=745308862,2551735871&fm=11&gp=0.jpg', 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3054236391,2196049918&fm=11&gp=0.jpg','https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1751458222,4195202&fm=11&gp=0.jpg'],
    identifier:'1342646278737934',
    goodsTitle:'火狐之猎---驾驶雪上摩托，穿上雪谢在芬兰追猎北极光',
    goodsNumber:'1',
    goodsPrice:'10',
    discountPrice:'10.00',
    username:'西瓜君',
    sex:'女',
    birthday:'1995-09-13',
    address:'江西省南昌市西湖区',
    hobby:['游泳','睡觉','看电影'],
    hobby:['游泳','睡觉','看电影'],
    introduce:'我就是南昌的无法获得空间物理继承父类接地网节气我就是南昌的无法获得空间物理继承父类接地网节气我就是南昌的无法获得空间物理继承父类接地网节气我就是南昌的无法获得空间物理继承父类接地网节气我就是南昌的无法获得空间物理继承父类接地网节气',
    pic:'http://only5201314.com/uploads/2017/04/181412206332.jpg'
  },
  onLoad:function(){
    this.setData({
      start:'block'
    })
  },
  pay: function(){
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
      },
      'fail': function (res) {
        
      }
    })
    this.setData({
      start: 'none',
      end: 'block'
    })
    // wx.navigateBack({
    //   delta: 2,
    // })
    // wx: wx.redirectTo ({
    //   url: '../dingdan/dingdan',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  // pay: function () {
  //   wx.navigateTo({
  //     url: '../dingdan/dingdan',
  //     success: function (res) { },
  //     fail: function (res) { },
  //     complete: function (res) { },
  //   })
  // },
  TofansHappy: function () {
    wx.redirectTo ({
      url: '../fansHappy/fansHappy'
    })
  },
  picTofansHappy: function () {
    wx.redirectTo({
      url: '../fansHappy/fansHappy'
    })
  },
  Tomenu: function () {
    wx.redirectTo({
      url: '../menuList/menuList'
    })
  },
  Tofreedom: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  }
})