const APP = getApp();
import { handleWechatPay } from '../../utils/common.js';
import { payType } from '../../api/config.js';
Page({
  data: {
    showPopup: false,
    orderNo: '',
    orderMoney: '',
    password: "",
    payType: '1'
  },
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderNo,
      orderMoney: options.orderMoney
    })
  },
  // 数据绑定
  passwordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 切换弹出层隐显
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  // 选择
  handleSelectChange(e) {
    this.setData({
      payType: e.currentTarget.dataset.paytype
    })
  },
  // 支付
  payMoney() {
    let that = this;
    if (this.data.payType == 1) {
      APP.ajax({
        url: APP.api.setPayPass,
        success(res) {
          if (res.data.is_set_pay_password == 1) {
            that.togglePopup()
          } else {
            wx.showToast({
              title: '请设置支付密码',
              icon: 'none',
            })
            setTimeout(() => {
              wx.navigateTo({
                url: `/pages/UserSettingPass/index?id=1`,
              })
            }, 500)
          }
        }
      })
    } else if (this.data.payType == 2) {
      handleWechatPay(that.data.orderNo, payType.goodsOrderPay);
    }
  },
  sendMoney() {
    if (!this.data.password) {
      wx.showToast({
        title: '请填写密码',
        icon: 'none',
      })
      return;
    }
    let that = this
    APP.ajax({
      url: APP.api.orderMoney,
      data: {
        order_no: that.data.orderNo,
        pay_password: that.data.password
      },
      success(res) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          success() {
            let params = APP.utils.paramsJoin({
              // target: wx.getStorageSync('thisOrderList')
              target: 2
            })
            setTimeout(() => {
              wx.redirectTo({
                url: `/pages/UserOrderList/index?${params}`,
              })
            }, 1000)
          }
        })
      }
    })
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})