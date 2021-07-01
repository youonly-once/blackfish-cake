const APP = getApp();
Page({
  data: {
    walletInfo: {}
  },
  onLoad(options) {
    this.getAssetData();
  },
  getAssetData(){
    let that = this;
    APP.ajax({
      url: APP.api.myWallet,
      success(res) {
        wx.stopPullDownRefresh();
        that.setData({
          walletInfo: res.data
        })
      },
      fail(err) {
        wx.stopPullDownRefresh();
      }
    })
  },
  onPullDownRefresh() {
    this.getAssetData();
  },
  onReachBottom() {

  },
  onShareAppMessage() {

  }
})