const APP = getApp();
export function getUserData(that) {
  APP.ajax({
    url: APP.api.userCount,
    success(res) {
      that.setData({ count: res.data })
    }
  })
  APP.ajax({
    url: APP.api.userAsset,
    success(res) {
      that.setData({ asset: res.data })
    }
  })
  APP.ajax({
    url: APP.api.user,
    success(res) {
      res.data.avatar = res.data.avatar ? res.data.avatar : APP.imgs.avatar
      that.setData({
        user: res.data
      });
      wx.setStorage({
        key: 'user',
        data: res.data,
      })
    }
  })
  APP.ajax({
    url: APP.api.userInfo,
    success(res) {
      that.setData({
        is_open_bonus: res.data.is_open_bonus,
        is_open_drp : res.data.is_open_drp,
      });
    }
  })
}
// 查询实名认证状态
export function queryAuthStatus(that) {
  APP.ajax({
    url: APP.api.queryAuthStatus,
    success(res) {
      let status = res.data.status;
      if (status == 0) {
        wx.navigateTo({
          url: `/pages/UserIdSubmit/index?status=${status}`,
        })
      } else if (status == 2) {
        wx.showToast({
          title: '您的信息未通过审核,请重新提交',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/UserIdSubmit/index?status=${status}&id=${res.data.id}`,
          })
        }, 1000)
      } else if (status == 1 || status == 3) {
        wx.navigateTo({
          url: '/pages/UserIdInfo/index',
        })
      }
    }
  })
}