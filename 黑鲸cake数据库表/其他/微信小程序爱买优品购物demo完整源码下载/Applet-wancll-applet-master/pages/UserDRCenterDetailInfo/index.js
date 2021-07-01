const APP = getApp();
Page({
  data: {
    info:{}
  },
  onLoad: function (options) {
    APP.ajax({
      url: APP.api.drpApplysRead,
      data: {id:options.id},
      success: (res) => {
        this.setData({
          info: res.data,
        })
      }
    })
  }
})