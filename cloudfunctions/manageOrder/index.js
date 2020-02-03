// 云函数入口文件
const cloud = require('wx-server-sdk')
const chinaTime = require('china-time');
const templateMsg = require('template_msg')
const databaseName = 'order'
cloud.init()

const ORDER_CREATE = -1 //待创建 购物车
const ORDER_CANCEL = 0 //已取消，或无订单
const ORDER_SAVE = 1 //订单已保存 未付款
const ORDER_PAY = 2 //已付款
const ORDER_SEND = 3 //已送货
const ORDER_RECEIVE = 4 //已签收 待评价
const ORDER_Finish = 5 //已完成 待评价
// 云函数入口函数
exports.main = async(event, context) => {
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
      return await getOrder(event._orderStatus, wxContext.OPENID)
      break;

    case 'getSingle':
      return await getSingleOrder(event._id, wxContext.OPENID)
      break;

    case 'updateStatus':
      let orderStatus = event.orderStatus*1;
      let data = await updateStatus(event._id, orderStatus, wxContext.OPENID)
      //发送模板消息通知
      sendTempMsg(event._id, wxContext.OPENID, orderStatus)
      return data;
      break;

    case 'checkOut_trade_noRepeat':
      return await queryOut_trade_no(event.out_trade_no, wxContext.OPENID)
      break;

  }

}
/**
 * 获取订单列表
 * 订单状态
 * 用户openid
 */
function getOrder(_orderStatus, openid) {
  _orderStatus = _orderStatus * 1 //转为数字
  if (_orderStatus == 0) { //所有订单
    return cloud.database().collection(databaseName).where({
      _openid: openid, //用户ID
    }).get({})
  } else {

    return cloud.database().collection(databaseName).where({
      _openid: openid, //用户ID
      status: _orderStatus
    }).get({})
  }
}
/**
 * 获取 单个订单详情
 * 订单id
 * 用户openid
 */
function getSingleOrder(id, openid) {

  return cloud.database().collection(databaseName).where({
    _openid: openid, //用户ID
    _id: id
  }).get()

}

function addOrder(_orderData, openid) {

  let date = chinaTime('YYYY-MM-DD HH:mm:ss');
  _orderData.createDate = date
  _orderData.updateDate = date

  _orderData.sendDate = 0
  _orderData.receiveDate = 0
  _orderData.finishDate = 0
  _orderData.payDate = 0

  _orderData._openid = openid
  _orderData.status = ORDER_SAVE
  return cloud.database().collection("order").add({
    data: _orderData,
  })
}

function updateStatus(id, orderStatus, openid) {
  try {
    orderStatus = orderStatus * 1 //转为数字
    console.error("==id:" + id)
    console.error("==orderStatus:" + orderStatus)
    let _data = {}
    let date = chinaTime('YYYY-MM-DD HH:mm:ss');
    _data.updateDate = date
    _data.status = orderStatus
    //增加付款时间 
    if (orderStatus == ORDER_PAY) {
      _data.payDate = date
    }
    //增加送货时间
    if (orderStatus == ORDER_SEND) {
      _data.sendDate = date
    }
    //增加收获时间
    if (orderStatus == ORDER_RECEIVE) {
      _data.receiveDate = date
    }
    //增加评价时间
    if (orderStatus == ORDER_Finish) {
      _data.finishDate = date
    }
    return cloud.database().collection(databaseName).where({
      _openid: openid, //用户ID
      _id: id,
    }).update({ //update内部要加data
      data: _data
    })
  } catch (e) {
    console.error(e + "==id:" + id)
  }
}
function sendTempMsg(id, openid, orderStatus){
  //已付款 
  //发送微信公众号订购成功模板消息
  /**
   * 订单ID 及用户OPENDID
   */
  //推送下单成功消息
  switch (orderStatus){
    case ORDER_PAY: 
      templateMsg.sendPaySuccess(getSingleOrder(id, openid), openid)
      break

  }

 
}

function queryOut_trade_no(_out_trade_no, openid) {
  return cloud.database().collection(databaseName).where({
    _openid: openid, //用户ID
    out_trade_no: _out_trade_no

  }).get({})
}

