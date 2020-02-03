// 云函数入口文件
const cloud = require('wx-server-sdk')
const chinaTime = require('china-time');
const databaseName = 'order_carts'

cloud.init()
const db = cloud.database()
const _ = db.command
const ORDER_CREATE = -1 //待创建 购物车
const ORDER_CANCEL = 0 //已取消，或无订单
const ORDER_SAVE = 1 //订单已保存 未付款
const ORDER_PAY = 2 //已付款
const ORDER_SEND = 3 //已送货
const ORDER_RECEIVE = 4 //已签收 待评价
const ORDER_Finish = 5 //已完成 待评价
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //console.log(chinaTime('YYYY-MM-DD HH:mm:ss')); // 2018-02-07 13:08:17
  //console.log('XXX', templateOpera.sendTempMsg())
  //console.log("XXX", templateMsg.sendPaySuccess(getSingleOrder('d68532785e3053b00711be267df56ea0', wxContext.OPENID), 'oDyLk5FI5tBIvFz0sflkBwnRSa8o'))
  //return
  switch (event.command) {
    //新增订单
    case 'add':
      return await addOrder(event.orderData, wxContext.OPENID)
      break;
    case 'get':
      return await getCart(event._ids, wxContext.OPENID)
      break;
    case 'getNum':
      return await getNum(wxContext.OPENID)
      break;
    case 'updateCount':
      return await updateCount(event._data,event._id,wxContext.OPENID)
      break
    case 'del':
      return await delCart(event._ids, wxContext.OPENID)
      break; 
  }

}
/**
 * 获取订单列表
 * 订单状态
 * 用户openid
 */
function getCart(ids,openid) {
  if (ids.length<=0){
    return db.collection(databaseName).where({
      _openid: openid, //用户ID
    }).get({})
  }else{
    return db.collection(databaseName).where({
      _openid: openid, //用户ID
      _id: _.in(ids)
    }).get({})
  }

  
}
function getNum(openid){
  return db.collection(databaseName).field({
    buyCount: true, //用户ID
  }).get({})
}
/**
 * 获取 单个订单详情
 * 订单id
 * 用户openid
 */
function getSingleOrder(id, openid) {

  return db.collection(databaseName).where({
    _openid: openid, //用户ID
    _id: id
  }).get()

}
/**
 * 删除购物车商品
 * 订单id
 * 用户openid
 */
function delCart(ids, openid) {
  console.error(ids)
  try {
    return db.collection(databaseName).where({
      _openid: openid, //用户ID
      _id: _.in(ids)
    }).remove()
  } catch (e) {
    console.error(e)
  }
}

function addOrder(_orderData, openid) {

  let date = chinaTime('YYYY-MM-DD HH:mm:ss');
  _orderData.createDate = date
  _orderData.updateDate = date

  _orderData._openid = openid
  _orderData.status = ORDER_CREATE
  return db.collection(databaseName).add({
    data: _orderData,
  })
}
function updateCount(_data, id,openid) {
  try {
    _data.updateDate = chinaTime('YYYY-MM-DD HH:mm:ss');
    return db.collection(databaseName).where({
      _openid: openid, //用户ID
      _id: id,
    }).update({ //update内部要加data
      data: _data
    })
  } catch (e) {
    console.error(e + "==id:" + id)
  }
}

