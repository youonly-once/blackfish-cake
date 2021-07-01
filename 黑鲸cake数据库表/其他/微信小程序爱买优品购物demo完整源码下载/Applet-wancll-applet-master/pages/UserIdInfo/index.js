const APP = getApp();
Page({
  data: {
    id: '',
    status: '',
    name: '',
    idcard: '',
    idcardFront: '',
    idcardBack: '',
    statusName: {
      1: '审核中',
      2: '审核未通过',
      3: '审核已通过'
    }
  },
  onLoad(options) {

  },
  onShow() {
    this.getAuthInfo();
  },
  getAuthInfo() {
    let that = this;
    APP.ajax({
      url: APP.api.queryAuthStatus,
      success(res) {
        that.setData({
          id: res.data.id,
          status: res.data.status,
          name: res.data.name,
          idcard: res.data.id_card,
          idcardFront: res.data.id_card_front_img,
          idcardBack: res.data.id_card_back_img
        })
      }
    })
  },
  submit() {
    wx.navigateTo({
      url: `/pages/UserIdSubmit/index?status=${this.data.status}&id=${this.data.id}`,
    })
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.getAuthInfo();
  },
  onShareAppMessage() {
  }
})