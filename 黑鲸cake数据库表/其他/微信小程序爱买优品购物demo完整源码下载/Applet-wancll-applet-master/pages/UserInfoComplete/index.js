const APP = getApp();
Page({
  data: {
    condition: false,
    name:'',
    email:'',
    qq:'',
    wechat:'',
    // 三级联动
    province: {},
    city: {},
    county: {},
    showAddress: '请选择地址',
  },
  onLoad: function (options) {
    APP.ajax({
      url: APP.api.user,
      success: res => {
        let showAddress;
        if (res.data.province && res.data.city && res.data.area) {
          if (res.data.province.name == res.data.city.name) {
            showAddress = res.data.province.name;
          }else{
            showAddress = `${res.data.province} ${res.data.city} ${res.data.area}`
          }
        } else {
          showAddress = '请选择地址'
        }
        this.setData({
          name: res.data.nick_name,
          email: res.data.email,
          qq: res.data.qq,
          wechat: res.data.wechat,
          showAddress: showAddress,
        })
      }
    })
  },
  showPicker() {
    this.setData({
      condition: true
    },()=>{
      this.pinAddress()
    });
  },
  pinAddress() {
    let showAddress;
    if (this.data.province.name == this.data.city.name) {
      showAddress = this.data.province.name;
    } else {
      showAddress = `${this.data.province.name} ${this.data.city.name} ${this.data.county.name}`
    }
    this.setData({
      showAddress: showAddress
    })
  },
  // 默认地址选择
  getCitys(e) {
    this.setData({
      province: e.detail.province,
      city: e.detail.city,
      county: e.detail.county
    }, () => {
      if (this.data.condition) {
        this.pinAddress()
      }
    })
  },
  enterName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  enterQQ(e) {
    this.setData({
      qq: e.detail.value
    })
  },
  enterWechat(e) {
    this.setData({
      wechat: e.detail.value
    })
  },
  enterEmail(e) {
    this.setData({
      email: e.detail.value
    })
  },
  send(){
    if (!this.data.name) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return;
    }
    if (!this.data.qq) {
      wx.showToast({
        title: '请输入qq号',
        icon: 'none'
      })
      return;
    }
    if (!this.data.wechat) {
      wx.showToast({
        title: '请输入微信号',
        icon: 'none'
      })
      return;
    }
    if (!this.data.email) {
      wx.showToast({
        title: '请输入邮箱',
        icon: 'none'
      })
      return;
    }
    APP.ajax({
      url: APP.api.userSettingUpdate,
      data:{
        qq: this.data.qq,
        wechat: this.data.wechat,
        email: this.data.email,
        province_code: this.data.province.code,
        city_code: this.data.city.code,
        area_code: this.data.county.code,
        nick_name: this.data.name,
      },
      success:res=>{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },800)
      }
    })
  }
})