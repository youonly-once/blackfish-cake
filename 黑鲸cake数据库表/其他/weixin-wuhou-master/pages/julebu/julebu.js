var app = getApp()
Page({
  data:{
    // 消息滚动
    imgUrls: [
      { 
        pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        text:'蔡海燕卡通粉丝卡'
      },
      {
        pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        text: '涂红卡通粉丝卡'
      },
      {
        pic: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        text: '贻鹏卡通粉丝卡'
      },
      {
        pic: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
        text: '利华卡通粉丝卡'
      } 
    ],
    imgUrlsS: [
      {
        pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        text: 'fcawerfgewrb'
      },
      {
        pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        text: 'fcawefrv'
      },
      {
        pic: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        text: 'fawefcawe'
      },
      {
        pic: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
        text: 'dawefsrfeav'
      }
    ],
    imgUrlsT: [
      {
        pic: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        text: 'jiujiu卡通粉丝卡'
      },
      {
        pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        text: 'kani卡通粉丝卡'
      },
      {
        pic: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        text: 'babi卡通粉丝卡'
      },
      {
        pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        text: 'papi通粉丝卡'
      }
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 1000,
    duration: 1000,
    // 用户信息
    userInfo: {},
    // 控制更多标签
    tagBottom:'none',
    // 粉丝卡号
    fnum:'123',
    snum:'456',
    tnum:'78',
    daynumber:'5',
    activitynum:'20',
    fansnum:'190907',
    // 滚动
    scrollTop: 0,
    tags:[
      '影响家否和我就或服务或服务IE借哦if借我 if借哦我微积分欧锦外婆', '一周CP', '洪城吃货', '火锅王子', '影响家', '一周CP', '洪城吃货', '火锅王子', '影响家', '一周CP', '洪城吃货'],
    fansgroup:[
      {
        name:'吃货群',
        text:'粉丝俱乐部度hi啊ujidjalijwelj 降低加我我破的恐怕就地QJPOPOWI的键盘强迫胃口',
        pic:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=829671749,3584368330&fm=11&gp=0.jpg'
      },
      {
        name: '花痴群',
        text: '粉丝俱乐部度hi啊ujidjalijwelj 降低加我我破的恐怕就地QJPOPOWI的键盘强迫胃口',
        pic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=829671749,3584368330&fm=11&gp=0.jpg'
      }
    ]
  },
  onLoad: function () {
    console.log('onLoad')
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
  Tomenu: function () {
    wx.navigateTo({
      url: '../menuList/menuList'
    })
  },
  Tofreedom: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  Totag: function (e) {
    console.log('标签')
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '18252093635',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  showService: function () {
    this.setData({
      close: 'block'
    })
  },
  closeService: function () {
    this.setData({
      close: 'none'
    })
  },
  moreTag: function () {
    this.setData({
      tagBottom: 'block'
    })
  },
  closeTag: function () {
    this.setData({
      tagBottom: 'none'
    })
  },
  buyFansCard: function () {
    wx: wx.navigateTo({
      url: '../buynow/buynow',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
  
})