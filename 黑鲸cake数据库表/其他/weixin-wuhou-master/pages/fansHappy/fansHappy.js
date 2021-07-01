var app = getApp()
Page({
  data: {
    guntime:'19',
    // 消息滚动
    imgUrls: [
      {
        pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1056229810,2834906715&fm=27&gp=0.jpg',
        text: '蔡海燕卡通粉丝卡'
      },
      {
        pic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2808716253,3345449868&fm=27&gp=0.jpg',
        text: '涂红卡通粉丝卡'
      },
      {
        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1576055076,1637155764&fm=27&gp=0.jpg',
        text: '贻鹏卡通粉丝卡'
      },
      {
        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2482873032,1831161292&fm=27&gp=0.jpg',
        text: '利华卡通粉丝卡'
      },{
        pic:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2052120700,1975514698&fm=27&gp=0.jpg',
        text:'何斌开通粉丝卡'
      },
      {
        pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1056229810,2834906715&fm=27&gp=0.jpg',
        text: '蔡海燕卡通粉丝卡'
      },
      {
        pic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2808716253,3345449868&fm=27&gp=0.jpg',
        text: '涂红卡通粉丝卡'
      },
      {
        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1576055076,1637155764&fm=27&gp=0.jpg',
        text: '贻鹏卡通粉丝卡'
      },
      {
        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2482873032,1831161292&fm=27&gp=0.jpg',
        text: '利华卡通粉丝卡'
      }, {
        pic: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2052120700,1975514698&fm=27&gp=0.jpg',
        text: '何斌开通粉丝卡'
      },
      {
        pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1056229810,2834906715&fm=27&gp=0.jpg',
        text: '蔡海燕卡通粉丝卡'
      },
      {
        pic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2808716253,3345449868&fm=27&gp=0.jpg',
        text: '涂红卡通粉丝卡'
      },
      {
        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1576055076,1637155764&fm=27&gp=0.jpg',
        text: '贻鹏卡通粉丝卡'
      },
      {
        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2482873032,1831161292&fm=27&gp=0.jpg',
        text: '利华卡通粉丝卡'
      }, {
        pic: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2052120700,1975514698&fm=27&gp=0.jpg',
        text: '何斌开通粉丝卡'
      }
    ],
    fansgroups: [
      {
        name:'吃喝群',
        pic: 'http://img2.imgtn.bdimg.com/it/u=1438701306,2901861000&fm=27&gp=0.jpg',
        text: '粉丝俱乐部是午逅为粉丝匠心打造的VIP会员俱乐部，为午逅粉丝提供更多的品质活动加入粉丝俱乐部后，用户可享有粉丝权益。'
      },
      {
        name:'玩乐群',
        pic: 'http://img2.imgtn.bdimg.com/it/u=1438701306,2901861000&fm=27&gp=0.jpg',
        text: '粉丝俱乐部是午逅为粉丝匠心打造的VIP会员俱乐部，为午逅粉丝提供更多的品质活动加入粉丝俱乐部后，用户可享有粉丝权益。'
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
    // 控制消息滚动
    mheight:600,
    mtop:0,
    i:0,
    smshow:'none',
    // 显示回到顶部
    showtop:'none',
    indicatorDots: false,
    autoplay: true,
    interval: 1000,
    duration: 1000,
    // 用户信息
    userInfo: {},
    // 控制更多标签
    tagBottom: 'none',
    // 粉丝卡号
    fnum: '123',
    snum: '456',
    tnum: '78',
    daynumber: '5',
    activitynum: '20',
    fansnum: '145981',
    allnumber:[],
    // 滚动
    scrollTop: 0,
    tags: [
      '影响家', '一周CP', '洪城吃货', '火锅王子', '影响家', '一周CP', '洪城吃货', '火锅王子', '影响家', '一周CP', '洪城吃货', '一周CP', '洪城吃货', '火锅王子', '影响家', '一周CP', '洪城吃货', '火锅王子', '影响家', '一周CP', '洪城吃货'],
    tag:[],
    moreshow:'none',
    fansgroup: [
      {
        name: '吃货群',
        text: '粉丝俱乐部度hi啊ujidjalijwelj 降低加我我破的恐怕就地QJPOPOWI的键盘强迫胃口',
        pic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=829671749,3584368330&fm=11&gp=0.jpg'
      },
      {
        name: '花痴群',
        text: '粉丝俱乐部度hi啊ujidjalijwelj 降低加我我破的恐怕就地QJPOPOWI的键盘强迫胃口',
        pic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=829671749,3584368330&fm=11&gp=0.jpg'
      }
    ]
  },
  onLoad: function () {
    var t = this.data.tags.slice(0,10);
    console.log(t)
    if(this.data.tags.length>8){
      this.setData({
        tag:t,
        moreshow:'inline-block'
      })
    }else{
      this.setData({
        tag:this.data.tags,
        moreshow:'none'
      })
    }
    // 获取消息条数并处理
    console.log(this.data.imgUrls.length)
    var mnum = this.data.imgUrls.length * 110;
    this.setData({
      mheight:mnum
    })
    console.log(this.data.mheight)
    // 获取卡号并处理
    console.log(this.data.fansnum);
    var allnum = this.data.fansnum.split("");
    console.log(allnum);
    this.setData({
      allnumber:allnum
    })
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
  // t:function(){
  //   var i  = this.data.mtop - 1
  //   this.setData({
  //     mtop: i
  //   })
  //   if (this.data.mtop > -(this.data.mheight - 264)){
  //     console.log(this.data.mtop)
  //     var t = setTimeout(this.t,5)
  //   }else{
  //     this.setData({
  //       mtop:0
  //     })
  //     var t = setTimeout(this.t, 5)
  //   }
  // },
 
  // 滚动距离
  scroll: function (e, res) {
    console.log(e.detail.scrollTop)
    if (e.detail.scrollTop > 200){
      this.setData({
        showtop:'block'
      })
    }else{
      this.setData({
        showtop: 'none'
      })
    }
  },
  buycard:function(e){
    wx.redirectTo({
      url: '../buynow/buynow'
    })

  },
  Tomenu: function () {
    wx.redirectTo ({
      url: '../menuList/menuList'
    })
  },
  Tofreedom: function () {
    wx.redirectTo ({
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
      phoneNumber: '13970046644',
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
  }

})