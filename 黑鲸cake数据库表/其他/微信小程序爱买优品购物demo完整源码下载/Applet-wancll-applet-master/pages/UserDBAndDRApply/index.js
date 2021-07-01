const APP = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    condition: false,
    name: '',
    email: '',
    qq: '',
    wechat: '',
    // 三级联动
    province: {},
    city: {},
    county: {},
    showAddress: '请选择地址',
    isNeedCompleteUserInfo: true,
  },

  onLoad: function (options) {
    this.setData({
      type: options.type
    },()=>{
      this.init()
    })
  },
  init() {
    // 查询是否需要完善个人信息
    let url;
    if (this.data.type == 'distribution') {
      url = APP.api.userDrp;
      wx.setNavigationBarTitle({
        title: '成为分销商申请',
      })
    } else if (this.data.type == 'bonus') {
      url = APP.api.userBonus;
      wx.setNavigationBarTitle({
        title: '成为分红商申请',
      })
    }
    APP.ajax({
      url: url,
      success: res => {
        this.setData({
          isNeedCompleteUserInfo: res.data.is_need_complete_user_info
        }, () => {
          if (this.data.isNeedCompleteUserInfo) {
            APP.ajax({
              url: APP.api.user,
              success: res => {
                let showAddress;
                if (res.data.province && res.data.city && res.data.area) {
                  showAddress = `${res.data.province} ${res.data.city} ${res.data.area}`
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
          }
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
    if (this.data.province.name == this.data.city.name){
      showAddress = this.data.province.name;
    }else{
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
    },()=>{
      if (this.data.condition){
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
  send() {
    if (this.data.isNeedCompleteUserInfo) {
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
        data: {
          qq: this.data.qq,
          wechat: this.data.wechat,
          email: this.data.email,
          province_code: this.data.province.code,
          city_code: this.data.city.code,
          area_code: this.data.county.code,
          nick_name: this.data.name,
        },
        success: res => {
          this.applyFor()
        }
      })
    } else {
      this.applyFor()
    }
  },
  applyFor() {
    let url
    if (this.data.type == 'distribution') {
      url = APP.api.getDrpApply;
    } else if (this.data.type == 'bonus') {
      url = APP.api.getBonusApply;
    }
    APP.ajax({
      url: url,
      success: res => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 800);
      }
    })
  }

})