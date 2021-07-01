// 获取本地的token 给全局变量使用
function getToken(that) {
  wx.getStorage({
    key: 'token',
    success(res) {
      that.globalData.token = res.data.token
    },
  })
}
// 获取本地的用户信息
function getUser(that) {
  wx.getStorage({
    key: 'user',
    success(res) {
      that.globalData.user = res.data
    },
  })
}
module.exports = {
  getToken,
  getUser
}