
var app = getApp()
Page({
  data: {
    likenum:'341',
    showshop:'none',
    closeshop:'block',
    signup:'block',
    paynow:'none',
    servicetc:'none',
    Notfans:'block',
    att:'selected',
    act:'',
    shop:'',
    use:'',
    attentiontop:0,
    activitytop:0,
    shoptop:0,
    usetop:0,
    select:'selected',
    topMenu:'none',
    scrollTop: 0,
    saleBg:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/saleBg.png',
    nowPrice:'3.00',
    oldPrice:'5.00',
    fansPrice:'2.00',
    saleNumber:'1758',
    pic:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1708393226,3469769460&fm=200&gp=0.jpg',
    Title:'火狐之猎---驾驶雪上摩托，穿上雪谢在芬兰追猎北极光',
    activityLogo:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/activityLogo.png',
    attentionLogo:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/attentionLogo.png',
    attentionText:'注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注注意安全注意安全注意安全注意安全注意安全注意安全注意安全注',
    Picture:'http://www.lemontreevip.com/upload/201603/201603181458295704.jpg',
    IntroduceText:'牛肉是中国人的第二大肉类食品，仅次于猪肉，牛肉蛋白质含量高，而脂肪含量低，所以味道鲜美，受人喜爱，享有“肉中骄子”的美称。牛肉属高蛋白、低脂肪，富含多种氨基酸和矿物质元素，具有消化吸收率高等特点。西方发达国家牛肉的销售已成为肉食消费的主体.',
    shopLogo:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/shopLogo.png',
    useLogo:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/useLogo.png',
    useText:'使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使使用流程使用流程使用流程使用流程使用流程使用流程使用流程使用流程使',
    shopTimePic:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/shopTimePic.png',
    shopTeleponePic:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/shopTeleponePic.png',
    shopAddressPic:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/shopAddressPic.png',
    shops:[{
      title:"成龙电影院",
      openTime:'8.00',
      endTime:'20.00',
      shopTelepone:'0191-88112345',
      shopAddress:'江西省南昌市新建县范家新村 '
    }
    ],
    freedompic:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/freedom.png',
    customerSpic:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/customerS.png',
    menupic:'http://wuhouhd.oss-cn-shanghai.aliyuncs.com/wxfans/images/menu.png',
    kindState:'立即购买',
    stayNumber:'5555'
  },
// 滑动后获取滑动距离，并且从localstorage中获取各个列表距离顶部的距离，进行判断顶部菜单的的显示问题
  scroll: function (e, res) {
    let that = this;
    wx.getStorage({
      key: 'attention',
      success: function (res) {
        that.setData({
          attentiontop: res.data
        })
      }
    });
    wx.getStorage({
      key: 'shop',
      success: function (res) {
        that.setData({
          shoptop: res.data
        })
      }
    });
    wx.getStorage({
      key: 'activity',
      success: function (res) {
        that.setData({
          activitytop: res.data
        })
      }
    });
    wx.getStorage({
      key: 'use',
      success: function (res) {
        that.setData({
          usetop: res.data
        })
      }
    });
    if (e.detail.scrollTop > 150) {
      that.setData({
        topMenu: 'block'
      });
    } else {
      that.setData({
        topMenu: 'none'
      });
    }
    if (e.detail.scrollTop >150 && e.detail.scrollTop < that.data.shoptop){
      that.setData({
        att: 'selected',
        act: '',
        shop: '',
        use: '',
      })
    }
    if (e.detail.scrollTop > that.data.shoptop-50 && e.detail.scrollTop < that.data.activitytop) {
      that.setData({
        shop: 'selected',
        att: '',
        act: '',
        use: '',
      })
    }
    if (e.detail.scrollTop > that.data.activitytop-50 && e.detail.scrollTop < that.data.usetop) {
      that.setData({
        act: 'selected',
        att: '',
        shop: '',
        use: '',
      })
    }
    if (e.detail.scrollTop > that.data.usetop-50) {
      that.setData({
        use: 'selected',
        att: '',
        act: '',
        shop: '',
      })
    }
  },
  // 获取注意事项，商家，活动详情，使用等距离顶部的距离并将其存入localStorage当中
  onLoad: function () {
    var that = this;
    var t = that.data.likenum
    // that.setData({
    //   likenum:t++
    // })
    wx.getStorage({
      key: 'classes',
      success: function (res) {
        if(res.data == '活动'){
          that.setData({
            signup:'block',
            paynow:'none'
          })         
        }
        if(res.data == '商品'){
          that.setData({
            signup:'none',
            paynow:'block'
          })
        }
        console.log(res.data)
      }
    });
    console.log(this.data.att)
    wx.createSelectorQuery().select('#attention').boundingClientRect(function (rect) {
      wx.setStorage({
        key: "attention",
        data: rect.top
      })
    }).exec()
    wx.createSelectorQuery().select('#activity').boundingClientRect(function (rect) {
      wx.setStorage({
        key: "activity",
        data: rect.top
      })
    }).exec()
    wx.createSelectorQuery().select('#shop').boundingClientRect(function (rect) {
      wx.setStorage({
        key: "shop",
        data: rect.top
      })
    }).exec()
    wx.createSelectorQuery().select('#use').boundingClientRect(function (rect) {
      wx.setStorage({
        key: "use",
        data: rect.top
      })
    }).exec()
    var nowshop = [];
    if(this.data.shops.length>2){
      nowshop.push(this.data.shops[0])
      nowshop.push(this.data.shops[1])
      console.log(nowshop)
      this.setData({
        shops: nowshop,
        showshop: 'block',
        closeshop: 'none'
      })
    }else{
      this.setData({
        showshop: 'none',
        closeshop: 'none'
      })
    }
  },
  Tomenu: function () {
    wx.redirectTo ({
      url: '../menuList/menuList'
    })
  },
  Tofreedom:function(){
    wx.redirectTo({
      url: '../index/index'
    })
  },
  ToSingup: function () {
    var that = this;
    wx:wx.getStorage({
      key: 'classes',
      success: function(res) {
        if(res.data == '活动'){
          wx.navigateTo({
            url: '../signup/signup'
          })
        }
        if(res.data == '商品'){
          wx.navigateTo({
            url: '../SubmitOrder/SubmitOrder'
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    console.log('duawhuiqji')
   
  },
  ToPaynow:function(){
    wx.navigateTo({
      url: '../SubmitOrder/SubmitOrder'
    })
  },
  nameInput: function(e){
    console.log('e.detail.value')
  },
  Toattention:function(){
    this.setData({
      list:'attention',
      att:'selected',
      act:'',
      shop:'',
      use:''
    })
  },
  Toshop: function () {
    this.setData({
      list: 'shop',
      shop: 'selected',
      att: '',
      act: '',
      use: ''
    })
    console.log('注意事项' + this.data.att)
    console.log('商家信息' + this.data.shop)
  },
  Toactivity:function(){
    this.setData({
      list:'activity',
      act: 'selected',
      att: '',
      shop: '',
      use: ''
    })
    console.log('活动详情'+this.data.act)
    console.log('fhwhoi')
  },
  Touse: function () {
    this.setData({
      list:'use',
      use: 'selected',
      att: '',
      act: '',
      shop: '',
    })
    console.log('注意事项' + this.data.use)
  },
  // 开通粉丝卡
  openCard:function(){
    wx.navigateTo({
      url: '../buynow/buynow',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  // 商家导航需要获取每个商家的经纬度
  goShop: function (e) {
    wx.openLocation({
      latitude: 23.362490,
      longitude: 116.715790,
      scale: 18,
      name: '华乾大厦',
      address: '金平区长平路93号'
    })
  }, 

  // 每个商家的电话号码,获取后台数据
  calling: function (e) {
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
  // 客服电话
serviceTc:function(){
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
  // 关闭购买粉丝卡的提示弹框
  closetc:function(){
    this.setData({
      servicetc:'none'
    })
  },


// 更多商家的按钮,点击获取更多的商家
  moreShop:function(){
    var sp = this.data.shops;
    console.log(sp)
    this.setData({
      shops: [{
        openTime: '8.00',
        endTime: '20.00',
        shopTelepone: '0191-88112345',
        shopAddress: '江西省南昌市东湖区江西省南昌市东湖区江西省南昌市东湖区江西省南昌市东湖区江西省南昌市东湖区江西省南昌市东湖区江西省南昌市东湖区江西省南昌市东湖区江西省南昌市东湖区江西省南昌市东湖区'
      },
      {
        openTime: '8.00',
        endTime: '20.00',
        shopTelepone: '0191-88112345',
        shopAddress: '江西省南昌市东湖区'
      },
      {
        openTime: '8.00',
        endTime: '20.00',
        shopTelepone: '0191-88112345',
        shopAddress: '江西省南昌市东湖区'
      },
      {
        openTime: '8.00',
        endTime: '20.00',
        shopTelepone: '0191-88112345',
        shopAddress: '江西省南昌市东湖区'
      },
      {
        openTime: '8.00',
        endTime: '20.00',
        shopTelepone: '0191-88112345',
        shopAddress: '江西省南昌市东湖区'
      },
      {
        openTime: '8.00',
        endTime: '20.00',
        shopTelepone: '0191-88112345',
        shopAddress: '江西省南昌市东湖区'
      },
      {
        openTime: '8.00',
        endTime: '20.00',
        shopTelepone: '0191-88112345',
        shopAddress: '江西省南昌市东湖区'
      }
      ],
      showshop: 'none',
      closeshop: 'close'
    })
  },
  // 点击收起更多商家
  closeShops: function(){
    var nowshop = [];
    nowshop.push(this.data.shops[0])
    nowshop.push(this.data.shops[1])
    console.log(nowshop)
    this.setData({
      shops:nowshop,
      showshop:'block',
      closeshop:'none'
    })
  }
  
})
