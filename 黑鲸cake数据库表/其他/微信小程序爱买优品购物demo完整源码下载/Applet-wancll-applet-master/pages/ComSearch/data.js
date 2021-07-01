const APP = getApp();
export function getKeywords(that) {
  // 热搜
  APP.ajax({
    url: APP.api.goodsKeywordsList,
    success(res) {
      that.setData({
        hotKeywordsList: res.data || []
      })
    }
  });
  // 用户搜索
  if (wx.getStorageSync('token')) {
    APP.ajax({
      url: APP.api.userGoodsKeywordsRead,
      success(res) {
        that.setData({
          userKeywordsList: res.data ? res.data.keywords : []
        })
      }
    });
  }
}
// 删除关键词
export function deleteKeywords(that) {
  wx.showModal({
    title: '确认删除历史搜索?',
    success(res) {
      if (res.confirm) {
        APP.ajax({
          url: APP.api.deleteKeywords,
          success(res) {
            wx.showToast({
              title: res.msg,
              icon: 'none',
            })
            that.setData({
              userKeywordsList: []
            })
          }
        })
      }
    }
  })
}