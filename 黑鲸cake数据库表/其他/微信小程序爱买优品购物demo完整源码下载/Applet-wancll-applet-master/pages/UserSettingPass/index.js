const APP = getApp();
const TITLE1 = ['登录密码修改', '支付密码修改'];
const TITLE2 = ['登录密码修改', '支付密码设置'];
Page({
  data: {
    type: 1,
    logo: APP.imgs.logo,
    showInfo:'',
    mobile: '',
    code: 0,
    password: '',
    rpassword: '',
    status: true, //  发送成功？
    countDown: 91,
    hasLogin: false,
  },
  onLoad: function (options) {
    // 1代表的登录密码  2代表的是支付密码
    let type = (options.id == 0) ? 1 : 2;
    APP.ajax({
      url: APP.api.setPayPass,
      success:(res) =>{
        // 登录密码
        if(type==1){
          wx.setNavigationBarTitle({
            title: TITLE2[options.id]
          })
          this.setData({ showInfo: '确认重置' })
        }else if(type==2){
          if (res.data.is_set_pay_password == 1) {
            wx.setNavigationBarTitle({
              title: TITLE1[options.id]
            })
            this.setData({ showInfo:'确认重置'})
          }else{
            wx.setNavigationBarTitle({
              title: TITLE2[options.id]
            })
            this.setData({ showInfo: '确认设置' })
          }
        }
      }
    })
    let user = wx.getStorageSync('user');
    this.setData({
      mobile: user ? user.mobile : '',
      type: type,
      hasLogin: user ? true : false
    })
  },
  // 手机号码输入
  bindMobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  // 验证码输入
  bindCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 密码输入
  bindPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 重复密码输入
  bindRPassword(e) {
    this.setData({
      rpassword: e.detail.value
    })
  },
  // 发送验证码请求
  sendCode() {
    if (!this.data.mobile) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    APP.ajax({
      url: APP.api.userSettingCode,
      data: {
        mobile: this.data.mobile,
        type: 2
      },
      success: res => {
        wx.showToast({
          title: res.msg,
          icon: 'none',
        })
        this.setData({
          status: false
        }, () => {
          this.countDown()
        })
      }
    })
  },
  // 确认
  sendData() {
    if (!this.data.mobile) {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.code) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
      return;
    }
    if (!this.data.password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    if (!APP.validator.password(this.data.password)) {
      wx.showToast({
        title: '密码限制6-20位大小写字母数字组合',
        icon: 'none'
      })
      return;
    }
    if (this.data.rpassword != this.data.password) {
      wx.showToast({
        title: '两次密码不一样',
        icon: 'none'
      })
      this.setData({
        rpassword: '',
        password: ''
      })
      return;
    }
    let url = this.data.type == 1 ? APP.api.userSettingPass : APP.api.userSettingPayPass;
    let data = {
      mobile: this.data.mobile,
      code: this.data.code
    };
    if (this.data.type == 1) {
      data.password = this.data.password;
      data.password_confirm = this.data.rpassword;
    } else {
      data.pay_password = this.data.password;
      data.pay_password_confirm = this.data.rpassword;
    }
    APP.ajax({
      url: url,
      data: data,
      success: res => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        if (this.data.type == 1) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('user');
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/BarHome/index'
            })
          }, 1000);
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        }
      }
    })
  },
  // 倒计时
  countDown() {
    let that = this
    function settime() {
      let countdown = that.data.countDown;
      if (countdown == 0) {
        that.setData({
          countDown: 91,
          status: true
        })
        return;
      } else {
        that.setData({
          countDown: --countdown
        })
      }
      setTimeout(() => {
        settime()
      }, 1000)
    }
    settime();
  }
})