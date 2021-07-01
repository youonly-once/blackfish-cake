const APP = getApp();
Page({
  data: {
    orderList: []
  },
  onLoad(options) {
    let that = this;
    APP.ajax({
      url: APP.api.orderAll,
      data: { is_has_return_goods: 1 },
      success(res) {
        console.log(res.data)
        that.setData({ orderList: res.data })
        wx.setStorageSync('orderList', res.data)
      }
    })
  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  onShareAppMessage() {

  }
})