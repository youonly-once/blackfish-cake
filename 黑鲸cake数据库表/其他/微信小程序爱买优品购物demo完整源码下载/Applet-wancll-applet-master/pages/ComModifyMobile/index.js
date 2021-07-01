const APP = getApp();
Page({
  data: {
    logo: APP.imgs.logo,
    mobile: '',
    code: 0,
    status: true, //  发送成功？
    countDown: 91
  },
  onLoad: function (options) {
    
  },
  bindMobile(e){
    this.setData({
      mobile: e.detail.value
    })
  },
  bindCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
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
  sendData() {
    if (!this.data.mobile) {
      wx.showToast({
        title: '手机号不能为空',
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
    let url = APP.api.userSettingMobile;
    let data = {
      old_mobile: wx.getStorageSync('user').mobile,
      new_mobile: this.data.mobile,
      new_code: this.data.code
    };
    APP.ajax({
      url: url,
      data: data,
      success: res => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        wx.removeStorageSync('token');
        wx.removeStorageSync('user');
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/BarHome/index'
          })
        }, 1000);
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