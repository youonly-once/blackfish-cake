const APP = getApp();
import { getKeywords, deleteKeywords } from './data.js';
Page({
  data: {
    keywords: '',
    userKeywordsList: [],
    hotKeywordsList: [],
  },
  onLoad(options) {
    getKeywords(this);
  },
  // 搜索输入框监听
  keywordsInput(e) {
    this.setData({
      keywords: e.detail.value
    })
  },
  // 搜索商品
  search(e) {
    if (e.currentTarget.dataset.keywords) {
      wx.navigateTo({
        url: `/pages/ComGoodsList/index?value=${e.currentTarget.dataset.keywords}&type=keyword`,
      })
    }
  },
  // 删除搜索词
  deleteKeywords(e) {
    deleteKeywords(this)
  },
  onPullDownRefresh() {
    getKeywords(this);
  },
  onShareAppMessage() {

  }
})