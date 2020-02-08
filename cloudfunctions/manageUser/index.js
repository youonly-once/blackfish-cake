// 云函数入口文件
const cloud = require('wx-server-sdk')
const manager ='oDyLk5FI5tBIvFz0sflkBwnRSa8o'
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (wxContext.OPENID==manager){
    return {
      isAdmin:true
    }
  }
  return {
    isAdmin: false
  }
  /*
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }*/
}