var app = getApp()
Page({
  data: {
    realpay:'15',
    goodsidentifier:'76782535251321719823',
    pic:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2928687581,1323635621&fm=11&gp=0.jpg',
    goodstitle:'零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样',
    primecost:'20.00',
    fansprice:'10.00',
    goodskind:'油画',
    goodsnumber:'2',
    goodsprice:'10.00',
    discountprice:'5.00',
    realtotal:'5.00',
    username:'蔡海燕',
    userphone:'13764417692'
  },
  toPaysuccess:function(){
    wx:wx.navigateTo({
      url: '../paysuccess/paysuccess',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})