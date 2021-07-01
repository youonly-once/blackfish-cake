const APP = getApp();
Page({
  data: {
    content: '',
    title: '功能异常'
  },
  onLoad(options) {

  },
  inputChange(e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit() {
    if (!this.data.content) {
      wx.showToast({
        title: '请填写反馈意见',
        icon: 'none'
      })
      return;
    }
    let userId = wx.getStorageSync('user').id;
    APP.ajax({
      url: APP.api.submitHelpAndOption,
      data: {
        user_id: userId,
        title: this.data.title,
        content: this.data.content
      },
      success(res) {
        wx.showToast({
          title: res.msg,
          icon: 'non'
        })
        setTimeout(() => {
          wx.navigateBack();
        }, 800)
      }
    })
  },
  radioChange(e) {
    this.setData({
      title: e.detail.value
    })
  },
  onShareAppMessage() {

  }
})