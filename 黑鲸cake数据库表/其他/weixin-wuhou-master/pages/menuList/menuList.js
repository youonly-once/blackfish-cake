var app = getApp()
Page({
  data: {
    userInfo:{},
    cardendtime:'2017-01-1',
    firstnumber:'',
    secondnumber:'',
    // thirdnumber:'',
    cardnumber:'95950910',
    first:'select',
    second:'',
    third:'',
    fourth:'',
    // 所有订单的数据
    allcontent:[{
      kindcolor:'noUse',
      identifier:'1234567890090898',
      time:'2017-02-01',
      pic:'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
      title:'零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      menuNumber:'1',
      allPrice:'100',
      kind:'待使用'
    },
      {
        kindcolor: '',
        identifier: '11111111111111',
        time: '2017-02-01',
        pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
        title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
        menuNumber: '1',
        allPrice: '10.00',
        kind: '待付款'
      },
      {
        kindcolor: '',
        identifier: '12767328432642',
        time: '2017-02-01',
        pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
        title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
        menuNumber: '1',
        allPrice: '10.00',
        kind: '已使用'
      },
      {
        identifier: '12767328432642',
        time: '2017-02-01',
        pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
        title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
        menuNumber: '1',
        allPrice: '10.00',
        kind: '已取消'
      }],
      // 未使用订单的数据
    noUseContent: [{
      identifier: '111111111',
      time: '2017-02-01',
      pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
      title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      menuNumber: '1',
      allPrice: '100',
      kind: '待使用'
    },
    {
      identifier: '12767328432642',
      time: '2017-02-01',
      pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
      title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      menuNumber: '1',
      allPrice: '10.00',
      kind: '待使用'
    },
    {
      identifier: '12767328432642',
      time: '2017-02-01',
      pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
      title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      menuNumber: '1',
      allPrice: '10.00',
      kind: '待使用'
    },
    {
      identifier: '12767328432642',
      time: '2017-02-01',
      pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
      title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      menuNumber: '1',
      allPrice: '10.00',
      kind: '待使用'
    }],
    // 未付款的订单数据
    noPayContent: [{
      identifier: '12767328432642',
      time: '2017-02-01',
      pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
      title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      menuNumber: '1',
      allPrice: '100',
      kind: '待付款'
    },
    {
      identifier: '12767328432642',
      time: '2017-02-01',
      pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
      title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      menuNumber: '1',
      allPrice: '10.00',
      kind: '待付款'
    },
    {
      identifier: '12767328432642',
      time: '2017-02-01',
      pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
      title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      menuNumber: '1',
      allPrice: '10.00',
      kind: '待付款'
    },
    {
      identifier: '12767328432642',
      time: '2017-02-01',
      pic: 'http://img5.imgtn.bdimg.com/it/u=1830118142,562049001&fm=27&gp=0.jpg',
      title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      menuNumber: '1',
      allPrice: '10.00',
      kind: '待付款'
    }],
  },
  // 页面形成时获取用户的头像和用户名,以及获取卡号，对卡号进行分段处理
  onLoad:function(){
    console.log('onLoad')
    var f = this.data.cardnumber.substring(0,4);
    var s = this.data.cardnumber.substring(4, 8);
    console.log(s);
    this.setData({
      firstnumber:f,
      secondnumber:s
    })
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      console.log(userInfo);
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  // 跳转粉丝俱乐部页面
  TofansHappy: function () {
    wx.redirectTo ({
      url: '../fansHappy/fansHappy'
    })
  },
  // 跳转特权页面
  Tofreedom: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  toseemenu:function(){
    wx.redirectTo({
      url: '../paysuccess/paysuccess',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 所有订单的控制
  all:function(){
    this.setData({
      all: 'block',
      noPay: 'none',
      noUse: 'none',
      payback: 'none',
      first:'select',
      second:'',
      third:'',
      fourth:''
    })
  },
  // 未付款的订单显示控制
  noPay:function(){
    this.setData({
      allcontent: this.data.noPayContent,
      first: '',
      second: 'select',
      third: '',
      fourth: ''
    })
  },
  // 未使用的订单显示控制
  noUse:function(){
    this.setData({
      allcontent: this.data.noUseContent,
      first: '',
      second: '',
      third: 'select',
      fourth: ''
    })
  },
  // 退款订单的显示控制
  // payOff: function () {
  //   this.setData({
  //     all: 'none',
  //     noPay: 'none',
  //     noUse: 'none',
  //     payback: 'block',
  //     first: '',
  //     second: '',
  //     third: '',
  //     fourth:'select'
  //   })
  // },
  // 续费页面的跳转
  renew:function(){

  }
})