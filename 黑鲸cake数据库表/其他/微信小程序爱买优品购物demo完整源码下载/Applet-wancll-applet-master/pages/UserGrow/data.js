const APP = getApp();
export function getUserAsset(that) {
  APP.ajax({
    url: APP.api.userAsset,
    success(res) {
      that.setData({
        asset: res.data,
      })
    }
  })
}
export function getList(that) {
  let pageNum = that.data.pageNum;
  let lists = that.data.lists
  APP.ajax({
    url: APP.api.userGrowLogs,
    header: {
      'page-limit': that.data.pageLimit,
      'page-num': pageNum,
    },
    success(res) {
      if (res.data.length) {
        that.setData({
          lists: lists.concat(res.data),
          pageNum: ++pageNum,
          noContent: false,
        })
      } else if (that.data.pageNum == 1) {
        that.setData({
          noContent: true
        })
      }
    }
  })
}