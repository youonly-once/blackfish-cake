var app = getApp()
Page({
  data: {
    end:'none',
    start:'block',
    openpic:'block',
    change:0,
    startTime:'2017-09-09',
    endTime:'2017-10-10',
    goodsidentifier:'346294170849208502',
    pic:'https://img6.bdstatic.com/img/image/public/sunlinanian.png',
    goodstitle:'零基础和孩子一起画油画，这个暑假要和别人家的孩子一样！',
    goodsnum:'1',
    goodskind:'油画',
    goodsnumber:'1',
    goodsprice:'10.00',
    fansprice: '20.00',
    primecost:'10.00',
    discountprice:'5.00',
    realtotal:'10.00',
    username:'蔡海燕',
    userphone:'13767441759',
    kefuphone:'13767551678',
    sendstate:'已发货',
    sendcompany:'顺丰',
    sendnumber:'677890486367489',
    hxnumber:'2328473328059802850',
    hxexplain:'消费时,向工作人员出示下方二维码,工作人员通过微信扫一扫二维码完成核销',
    hxer:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3402467289,678111516&fm=27&gp=0.jpg',
    clickId:0,
    hxexplain:'消费时,向工作人员出示下方二维码,工作人员通过微信扫一扫二维码完成核销',
    hxer:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3402467289,678111516&fm=27&gp=0.jpg',
    clickId:0,
    openmark:'block',
    clickId:0,
    openmark:'block',
    closemark:'none',
    hxoneshop:[
      {
        hxtime:'2017-09-08',
        hxusenum:'1'
      },
      {
        hxtime: '2017-10-07',
        hxusenum: '3'
      }
    ],
    hxshops:[
      {
        shopname:'万达乐园',
         hxnum:'1',
         hxtotal: [
           {
             hxday: '2017-09-10',
             usenum: '2'
           },
           {
             hxday: '2017-08-09',
             usenum: '3'
           }
         ]
         
      },
      {
        shopname:'东华乐园',
        hxnum:'2',
        hxtotal: [
          {
            hxday: '2017-10-11',
            usenum: '1'
          },
          {
            hxday: '2017-12-19',
            usenum: '4'
          }
        ]
      }
    ],
    hxdaynum:[]
  }, 
  pay: function () {
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
  },
  clickopen:function(e){
    console.log('fiuwoied');
    var index = e.currentTarget.id;
    var single = this.data.hxshops[index].hxtotal;
    this.setData({
        hxdaynum:single,
        clickId:e.currentTarget.id,
        change:1,
        openmark:'none',
        closemark:'block',
        openpic:'none'
    })
  },
  clickclose:function(){
    this.setData({
      clickId:'-1',
      openpic:'block'
    })
  },
  TofansHappy: function () {
    wx.redirectTo({
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