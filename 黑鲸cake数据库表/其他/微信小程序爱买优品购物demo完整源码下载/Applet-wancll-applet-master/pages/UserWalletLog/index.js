const APP = getApp();
Page({
  data: {
    logs: [],
    pageNum: 1,
    pageLimit: 10,
    loading: true,
  },
  onLoad(options) {
    this.getData()
  },
  getData() {
    let that = this
    let pageNum = this.data.pageNum;
    let logs = this.data.logs
    APP.ajax({
      url: APP.api.myWalletLog,
      header: {
        'page-limit': that.data.pageLimit,
        'page-num': pageNum,
      },
      success(res) {
        wx.stopPullDownRefresh();
        that.setData({
          loading: false
        })
        if (res.data.length) {
          that.setData({
            logs: logs.concat(res.data),
            pageNum: ++pageNum
          })
        }
      },
      fail(err){
        wx.stopPullDownRefresh();
      }
    })
  },
  onPullDownRefresh() {
    this.setData({
      logs: [],
      pageNum: 1
    });
    this.getData();
  },

  onReachBottom() {
    this.getData()
  },
  onShareAppMessage() {

  }
})