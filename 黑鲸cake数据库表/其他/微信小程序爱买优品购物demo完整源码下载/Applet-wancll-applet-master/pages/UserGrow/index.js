const APP = getApp();
import { getUserAsset, getList } from './data.js';
Page({
  data: {
    asset: {},
    user: {},
    lists: [],
    pageNum: 1,
    pageLimit: 10,
    noContent: false,
    noContentImg: APP.imgs.noContentImg
  },
  onLoad: function (options) {
    this.setData({
      user: wx.getStorageSync('user')
    })
    getUserAsset(this);
    getList(this);
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.setData({
      lists: [],
      pageNum: 1
    })
    getList(this);
    getUserAsset(this);
  },
  onReachBottom: function () {
    getList(this);
  },
  onShareAppMessage: function () {

  }
})