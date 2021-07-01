const WXAPI = require('wxapi/index')


App({
  onLaunch: function () {
    const that = this
    // 用户版本更新
    if (wx.canIUse('getUpdateManager')) {
      let updateManager = wx.getUpdateManager()
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            } else {
              return false
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.showModal({
          title: '升级失败',
          content: '新版本下载失败，请检查网络！',
          showCancel: false
        })
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      });
    };
    // 初次加载判断网络情况
    wx.getNetworkType({
      success: function (res) {
        // 返回有效类型,有效值wifi/2g/3g/4g/unknown(Android下不常见网络类型)/none(无网络)
        const networkType = res.networkType
        if (networkType == 'none') {
          that.globaData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    // 监听网络状态变化
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () { }
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });
  },
  // 执行清空 返回登陆
  goLoginPage() {
    wx.removeStorageSync('token')
    setTimeout(() => {
      wx.navigateTo({
        // 回到登陆页面
      })
    })
  },
  onShow: function () {
    const _this = this
    const TOKEN = wx.getStorageSync('token')
    if (TOKEN) {
      // 验证TOKEN
      WXAPI.checkToken(TOKEN).then(res => {
        if (res.code != 0) {
          // TOKEN配置错误,返回登陆页面
          wx.removeStorageSync('token')
          _this.goLoginPage()
        } else {
          //未过期 开始执行业务逻辑
          resolve();
        }
      })
    } else {
      // 没有获取到TOKEN,返回登陆页面
      if (!TOKEN) {
        _this.goLoginPage()
        return
      }
    }
  },
  /**
  * 获取当前页面
  */
  getCurrentPageUrl() {
    var pages = getCurrentPages()                //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route                  //当前页面url
    return url
  },

  globalData: {
    // 网络连接状态
    isConnected: true,
  }
})