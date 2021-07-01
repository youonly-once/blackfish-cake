const APP = getApp();
Page({
  data: {
    condition: false,
    isEdit: false,
    id: 0,
    enterName: '',
    enterMobile: '',
    enterTextarea: '',
    enterDefault: 1,
    // 三级联动
    province: {},
    city: {},
    county: {},
    showAddress: '请选择地址',
    loading: false,
  },

  onLoad(options) {

    // 编辑模式 先获取地址
    if (options.id) {
      wx.setNavigationBarTitle({
        title: '编辑地址',
      })
      APP.ajax({
        url: APP.api.addressRead,
        data: {
          id: options.id
        },
        success: res => {
          let data = res.data;
          this.setData({
            isEdit: true,
            id: data.id,
            enterName: data.consignee_name,
            enterMobile: data.mobile,
            enterTextarea: data.address,
            enterDefault: data.is_default,
            province: {
              name: data.province,
              code: data.province_code
            },
            city: {
              name: data.city,
              code: data.city_code
            },
            county: {
              name: data.area,
              code: data.area_code
            }
          }, () => {
            this.pinAddress()
          })
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '新增地址',
      })
    }
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
  showPicker() {
    this.setData({
      condition: true
    },()=>{
      this.pinAddress()
    });
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
  // 默认值是否选择
  radioChange(e) {
    this.setData({
      enterDefault: e.detail.value
    })
  },
  enterName(e) {
    this.setData({
      enterName: e.detail.value
    })
  },
  enterMobile(e) {
    this.setData({
      enterMobile: e.detail.value
    })
  },
  enterTextarea(e) {
    this.setData({
      enterTextarea: e.detail.value
    })
  },
  // 新增
  send() {
    if (!this.data.enterName) {
      wx.showToast({
        title: '请输入收货人名字',
        icon: 'none'
      })
      return;
    }
    if (!this.data.enterMobile) {
      wx.showToast({
        title: '请输入收货人联系电话',
        icon: 'none'
      })
      return;
    }
    if (!APP.validator.mobile(this.data.enterMobile)) {
      wx.showToast({
        title: '手机格式不正确',
        icon: 'none'
      })
      return;
    }
    if (!this.data.enterTextarea) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return;
    }
    let api = '';
    if (!this.data.isEdit) {
      api = APP.api.addressSave
    } else {
      api = APP.api.addressUpdate
    }
    this.setData({
      loading: true
    })
    APP.ajax({
      url: api,
      data: {
        id: this.data.id,
        address: this.data.enterTextarea,
        area_code: this.data.county.code,
        city_code: this.data.city.code,
        consignee_name: this.data.enterName,
        is_default: this.data.enterDefault,
        mobile: this.data.enterMobile,
        province_code: this.data.province.code,
      },
      success: res => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    })
  }
})