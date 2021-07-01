//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    // 区别是抢购还是直播
    bono:'red',
    bonopic:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/redkind.png',
    // 区分是否结束还是售罄
    salekindpic:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/saleOver.png',
    // 区分是否是有结束和售罄的状态
    salekinds:'block',
    fans:'block',
    notfans:'none',
    fansHappyPrice:'9.9',
    userInfo: {},
    fansDay: '20',
    cardnumber:'95950910',
    cardFirst:'',
    cardSecond:'',
    topics:[],
    preferenceList: [{
      classes:'活动',
      pic: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505734147908&di=fa6ed7c057d39e93445508a27507672e&imgtype=0&src=http%3A%2F%2Fimg.taopic.com%2Fuploads%2Fallimg%2F120410%2F2302-12041020395698.jpg',
      kind: '优选',
      title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      fansPrice: '￥55.00',
      price: '￥60.00',
      saleNumber: '46',

    },
    {
      classes: '商品',
      pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2197619314,2568662790&fm=200&gp=0.jpg',
      kind: '优选',
      title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
      fansPrice: '￥55.00',
      price: '￥60.00',
      saleNumber: '46',
      kindcontent:[],
    }],
    exclusiveList:[
      {
        classes: '活动',
        pic: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2458963133,1590811449&fm=27&gp=0.jpg',
        kind: '专属',
        title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
        fansPrice: '￥55.00',
        price: '￥60.00',
        saleNumber: '46',

      },
      {
       classes: '商品',        
       pic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1696024169,3802137831&fm=27&gp=0.jpg',
        kind: '专属',
        title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
        fansPrice: '￥55.00',
        price: '￥60.00',
        saleNumber: '46',
      },
      {
        classes: '商品',
        pic: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505734147908&di=fa6ed7c057d39e93445508a27507672e&imgtype=0&src=http%3A%2F%2Fimg.taopic.com%2Fuploads%2Fallimg%2F120410%2F2302-12041020395698.jpg',
        kind: '专属',
        title: '零基础和孩子一起画油画，这个暑假要和别人家的孩子不一样！',
        fansPrice: '￥55.00',
        price: '￥60.00',
        saleNumber: '46',
      }
    ],
    all:'block',
    exclusive:'none',
    preference:'none'
  },
 // 事件处理函数
  goods: function(e) {
    wx.setStorage({
      key: "classes",
      data: e.currentTarget.dataset.classes
    });
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../goods/goods'
    })
  },
  exclusive: function () {
    this.setData({
      kindcontent: this.data.exclusiveList
    })
  },
  preference:function(){
   this.setData({
     kindcontent: this.data.preferenceList
   })
  },
  TofansHappy: function() {
    wx.redirectTo ({
      url: '../fansHappy/fansHappy'
    })
  },
  picTofansHappy:function(){
    wx.redirectTo ({
      url: '../fansHappy/fansHappy'
    })
  },
  Tomenu:function(){
    wx.redirectTo ({
      url: '../menuList/menuList'
    })
  },
  onLoad: function () {
    var f = this.data.cardnumber.substring(0, 4);
    var s = this.data.cardnumber.substring(4, 8);
    console.log(s);
    this.setData({
      cardFirst: f,
      cardSecond: s
    })
    this.setData({
      kindcontent: this.data.preferenceList
    })
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})
