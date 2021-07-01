const APP = getApp();
export function updateUserInfo(that, data) {
  APP.ajax({
    url: APP.api.userSettingUpdate,
    data: data,
    success(res) {
      that.setData({
        user: res.data
      })
      wx.setStorage({
        key: 'user',
        data: res.data,
      })
    }
  })
}

export function getUserData(that){
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
}

export function queryWechatBindStatus(that) {
  APP.ajax({
    url: APP.api.queryWechatBindStatus,
    success(res) {
      if (res.data.wechat_openid) {
        that.setData({
          hasBindWechat: true,
        })
      }
    }
  })
}

export function unbind(that) {
  APP.ajax({
    url: APP.api.unbind,
    data: {
      openid_type: 'wechat'
    },
    success(res) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      that.setData({
        hasBindWechat: false,
      })
    }
  })
}

export function bindWechatInLogin(that, openid) {
  APP.ajax({
    url: APP.api.bindWechatInLogin,
    data: {
      openid_type: 'wechat',
      openid: openid
    },
    success(res) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  })
}