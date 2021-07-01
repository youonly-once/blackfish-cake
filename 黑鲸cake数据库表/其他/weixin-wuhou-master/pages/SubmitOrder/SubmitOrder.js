var app = getApp()
Page({
  data: {
    // 吐司文本和显示控制
    toastText: '',
    showtoast: 'none',
    // 商品数量控制
    click:'',
    clickId:0,
    goodspic: 'http://only5201314.com/uploads/2017/04/181412206332.jpg',
    goodsTitle: '火狐之猎---驾驶雪上摩托，穿上雪谢在芬兰追猎北极光',
    nowPrice: '20.00',
    goodsNumber: '1',
    fansdiscount:'10',
    region: ['江西省','南昌市','西湖区'],
    moreaddr:'',
    areatip:'block',
    cardStateTip:'(未购买)',
    nocardkind:'购买',
    cardState:'block',
    goodskinds: [
      {
        name:'漂亮宝贝',
        kindnumber:'10'
      }, 
      {
        name: '美丽宝贝',
        kindnumber: '9'
      }, 
      {
        name: '奇葩宝贝',
        kindnumber: '8'
      }, 
      {
        name: '大喜宝贝',
        kindnumber: '7'
      }, 
      {
        name: '天天宝贝',
        kindnumber: '6'
      }, 
      {
        name: '优惠宝贝',
        kindnumber: '5'
      }, 
    ],
    restnumber:''
  },
  onLoad:function(){
    this.setData({
      restnumber:this.data.goodskinds[0].kindnumber,
    })
  },
  // 表单验证
  formSubmit:function (e) {
    console.log(typeof(e.detail.value.phonenumber))
    var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (e.detail.value.name.length <= 0){
      this.setData({
        toastText: '请输入您的姓名',
        showtoast: 'block'
      })
      var that = this;
      setTimeout(function hide() {
        that.setData({
          showtoast: 'none'
        })
      }, 2000)
      return false;
    }
    if (e.detail.value.phonenumber.length <= 0){
      this.setData({
        toastText: '请输入您的手机号',
        showtoast: 'block'
      })
      var that = this;
      setTimeout(function hide() {
        that.setData({
          showtoast: 'none'
        })
      }, 2000)
      return false;
    }
    if(reg.test(e.detail.value.phonenumber)==false){
        this.setData({
          toastText: '请您输入正确的手机号',
          showtoast: 'block'
        })
        var that = this;
        setTimeout(function hide() {
          that.setData({
            showtoast: 'none'
          })
        }, 2000)
        return false;
    }
    if(e.detail.value.addressmore.length <=0){
      this.setData({
        toastText: '请填写您的详细地址',
        showtoast: 'block'
      })
      var that = this;
      setTimeout(function hide() {
        that.setData({
          showtoast: 'none'
        })
      }, 2000)
      return false;
    }
     console.log('djiwoajoid')
    console.log(e.detail.value.name.length)
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    wx.redirectTo({
      url: '../paysuccess/paysuccess',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 选择类型
  clickkind:function(e){
    var that = this;
    that.setData({
      clickId: e.currentTarget.id,
      restnumber: that.data.goodskinds[e.currentTarget.id].kindnumber
    })
   console.log(that.data.goodsNumber)
   var kindnumbers = that.data.goodskinds[e.currentTarget.id].kindnumber 
   console.log(kindnumbers)
   if(that.data.goodsNumber > kindnumbers){
     that.setData({
       goodsNumber:kindnumbers
     })
   }
    console.log(e.currentTarget)
  },
  bindRegionChange: function (e) {
    console.log(e.detail.value)
    var addr = e.detail.value;
    this.setData({
      areatip:'none',
      region: addr
    })
  },
  // 数量增加
  addNumber:function(){
    var num = this.data.goodsNumber;
    if(num<this.data.restnumber){
      num++;
      this.setData({
        goodsNumber: num
      })
    }else{
      console.log('您的购买数量已达到上限')
    }
  },
  // 数量减少
  reduceNumber:function(){
    var num = this.data.goodsNumber;
    if(num>1){
      num--;
      this.setData({
        goodsNumber:num
      })
    }
  },
//  获取地址
  getaddr:function(){
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var addr = [];
        addr.push(res.provinceName)
        addr.push(res.cityName)
        addr.push(res.countyName)
        that.setData({
          areatip:'none',
          region:addr,
          moreaddr: res.detailInfo
        })
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
    // wx.getLocation({
    //   type: 'wgs84', //返回可以用于wx.openLocation的经纬度
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     console.log(latitude, longitude)
    //     wx.openLocation({
    //       latitude: latitude,
    //       longitude: longitude,
    //       scale: 28
    //     })
    //   }
    // })  
  }
})