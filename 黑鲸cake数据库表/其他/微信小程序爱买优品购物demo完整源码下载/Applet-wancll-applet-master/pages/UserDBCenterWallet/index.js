const APP = getApp();

Page({
  data: {
    bgImg: APP.imgs.DRcenter,
    bonusData: {},
  },
  onLoad: function (options) {
    APP.ajax({
      url: APP.api.bonusCenter,
      success: res => {
        res.data.can_drawcash_money = Number(res.data.can_drawcash_money).toFixed(2)
        this.setData({
          bonusData: res.data,
        })
      }
    })
  }
})