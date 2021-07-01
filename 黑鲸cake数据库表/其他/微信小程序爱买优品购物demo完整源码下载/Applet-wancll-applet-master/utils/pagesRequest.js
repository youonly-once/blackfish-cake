const APP = getApp();

// 获取的分页数据
function getPagesData(options) {
  let that = options.that;
  let url = options.url;
  let type = options.type || 1;
  let postData = options.postData || {}
  let getStr = options.getStr || ''
  let pushData = options.pushData || ''

  // 数据请求完了
  if (!that.data.FPage.hasData) {
    return;
  }
  APP.ajax({
    url: APP.api[url],
    data: postData,
    header: {
      'page-limit': 10,
      'page-num': that.data.FPage.pageNum,
    },
    success: (res) => {
      wx.stopPullDownRefresh();
      if (type == 1) {
        // 子参数中取到
        setdata1(res, getStr, that, pushData)
      } else if (type == 2) {
        // 直接data中取到
        setdata2(res, that, pushData)
      }
    }
  })
}

// 子参数中取到
function setdata1(res, getStr, that, pushData) {
  if (res.data[getStr].length) {
    that.setData({
      [pushData]: that.data[pushData].concat(res.data[getStr]),
      ['FPage.pageNum']: ++(that.data.FPage.pageNum),
      ['FPage.noContent']: false,
    })
  } else {
    // 如果是第一页就没有数据
    if (that.data.FPage.pageNum == 1) {
      that.setData({
        ['FPage.noContent']: true,
        ['FPage.hasData']: false
      })
    } else {
      that.setData({
        ['FPage.hasData']: false
      })
    }
  }
}

// 直接data中取到
function setdata2(res, that, pushData) {
  if (res.data.length) {
    that.setData({
      [pushData]: that.data[pushData].concat(res.data),
      ['FPage.pageNum']: ++(that.data.FPage.pageNum),
      ['FPage.noContent']: false,
    })
  } else {
    // 如果是第一页就位空
    if (that.data.FPage.pageNum == 1) {
      that.setData({
        ['FPage.noContent']: true,
        ['FPage.hasData']: false
      })
    } else {
      that.setData({
        ['FPage.hasData']: false
      })
    }
  }
}

// 下拉刷新 -----------------------------------
function pullRefresh(options) {
  let that = options.that;
  let pushData = options.pushData || ''
  let fn = options.fn
  that.setData({
    ['FPage.pageNum']: 1,
    ['FPage.hasData']: true,
    [pushData]: []
  }, () => {
    fn()
  })
}

// 点击tab菜单切换数据 数据 tabSelectedId 必须固定 ------------------
function tabChange(options) {
  let that = options.that;
  let pushData = options.pushData || ''
  let fn = options.fn
  let id = that.selectComponent("#tab").data.selectedId
  // 禁止重复点击
  if (id == that.data.tabSelectedId) {
    return;
  }
  that.setData({
    tabSelectedId: id,
    [pushData]: [],
    ['FPage.hasData']: true,
    ['FPage.pageNum']: 1,
  }, () => {
    fn(id);
  })
}

module.exports = {
  getPagesData,
  pullRefresh,
  tabChange,
}