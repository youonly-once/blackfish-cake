
var app = getApp()
Page({
  data: {
    hide:'',
    servicetc:'none',
    // 吐司文本和显示控制
    toastText:'',
    showtoast:'none',
    // 输入的号码
    payPrice:'9.9',
    region:['江西省','南昌市','西湖区'],
    // 粉丝卡号码
    num:'',
    numF:'',
    numS:'',
    // 用户姓名
    userName:'',
    // 用户手机号
    userphone:'',
  // 用户详细地址
    moreaddr:'',
    opacity:'1'
  }, 
  // 靓号弹窗
  closetc: function () {
    this.setData({
      servicetc: 'none'
    })
  },
  // 用户自动输入卡号
  bindKeyInput: function (e) {
    console.log(typeof(e.detail.value) );
    if(e.detail.value == '11111111'){
      this.setData({
        hide:'hide',
        servicetc: 'block'
      })
    }
    var str = e.detail.value;
    var num1,num2,num3;
    num1 = str.substring(0, 4);
    num2 = str.substring(4, 8);
    if (str.length > 8){
      str = str.substring(0, 8);
    }
    this.setData({
      num: str,
      numF:num1,
      numS:num2,
    })
  },
  // 卡号显示卡号
showNum:function(e){
  var numBer = Math.random();
  numBer = numBer * 0.9 + 0.1;
  numBer = Math.round(numBer * 1e8);
  var str = numBer.toString();
  var num1, num2, num3;
  num1 = str.substring(0, 4);
  num2 = str.substring(4, 8);
  this.setData({
      num: str,
      numF: num1,
      numS: num2
    })
},
  // 获取用户的姓名
  inputname: function(e){
    var username = e.detail.value
    this.setData({
      userName:username
    })
    console.log(e.detail.value);
  },
  // 获取用户的手机号
  inputphone:function(e){
    var userphone = e.detail.value;
    this.setData({
      userphone: userphone
    })
    console.log(e.detail.value);
  },
  // 选择所在地区的提示切换
  bindChange: function (e) {
    console.log(e.detail.value)
    var addr = e.detail.value;
    this.setData({
      areatip: 'none',
      region: addr
    })
  },
  // 获取用户的详细地址
  bindTextAreaBlur:function(e){
    var moreAddr = e.detail.value;
    this.setData({
      moreaddr:moreAddr
    })
    console.log(moreAddr);
  },
  // 支付功能需要用到
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //登陆获取code
    wx.login({
      success: function (res) {
        console.log(res.code)
        //获取openid
        that.getOpenId(res.code)
      }
    });
  },
  getOpenId: function (code) {
    var that = this;
    wx.request({
      // url: 'https://api.weixin.qq.com/sns/jscode2session?appid=‘+<code></code>appid+’&secret=‘+secret+’&grant_type=authorization_code&js_code=' + loginCode.code,
      url: 'https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3',
      data: {},
      method: 'GET',
      success: function (res) {
        that.generateOrder(res.data.openid)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  // 表单提交
  formSubmit: function (e) {
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var flag = reg.test(this.data.userphone); 
    // 用户卡号的输入
    if (this.data.num.length < 1) {
      this.setData({
        toastText: '请输入您的卡号',
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
    // 用户卡号的有效输入判断
    if (this.data.num.length > 1 && this.data.num.length <8) {
      this.setData({
        toastText: '请您输入八位有效卡号',
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
    // 靓号判断
    if (this.data.num == '11111111') {
      this.setData({
        servicetc: 'block'
      })
      return false;
    }
    // 用户姓名的输入
    if (this.data.userName.length < 1) {
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
    // 用户正确手机号码的判断
    if(!flag){
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
    // 用户手机号码的输入判断
    if (this.data.userphone.length < 1) {
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
    // 详细地址的输入判断
    if (this.data.moreaddr.length < 1) {
      this.setData({
        toastText: '请输入您的详细地址',
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
    
    // 转入支付成功页面，需要的是URL
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