const APP = getApp();

Page({
  data: {
    bgImg: APP.imgs.DRcenter,
    user: {},
    drpData: {},
  },
  
  goSubPage(e) {
    let target = APP.utils.getDataSet(e, 'target');
    wx.navigateTo({
      url: `/pages/UserDRCenter${target}/index`,
    })
  },

  onShow: function () {
    let user = wx.getStorageSync('user');
    APP.ajax({
      url: APP.api.drpCenter,
      success: res => {
        res.data.can_drawcash_money = Number(res.data.can_drawcash_money).toFixed(2)
        this.setData({
          drpData: res.data,
          user: user
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})