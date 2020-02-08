// 云函数入口文件
const cloud = require('wx-server-sdk')
const chinaTime = require('china-time');
const templateMsg = require('template-msg')
const generateOrderno = require('generate-orderno')
const databaseName = 'order'
const manager = 'oDyLk5FI5tBIvFz0sflkBwnRSa8o'
cloud.init()

const ORDER_CREATE = -1 //待创建 购物车
const ORDER_CANCEL = 0 //已取消，或无订单
const ORDER_SAVE = 1 //订单已保存 未付款
const ORDER_PAY = 2 //已付款
const ORDER_SEND = 3 //已送货 或者是已自提
const ORDER_RECEIVE = 4 //已签收 待评价
const ORDER_Finish = 5 //已完成 
const ORDER_REFUND = 6 //退款中
const ORDER_REFUNDCONFIRM = 7 //确认退款
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
      let out_trade_no = await generateOrderno.generateOrderNo(8)
      console.log('out_trade_no', out_trade_no)
      let orderData=event.orderData
      orderData.out_trade_no = out_trade_no
      return await addOrder(orderData, wxContext.OPENID)
      break;
    case 'get':
      return await getOrder(event._orderStatus, wxContext.OPENID, event.pageNum)
      break;
    case 'getSingle':
      return await getSingleOrder(event._id, wxContext.OPENID)
      break;
    case 'get_Manager':
      return await getOrder_Manager(event._orderStatus, wxContext.OPENID, event.pageNum)
      break;
    case 'getSingle_Manager':
      return await getSingleOrder_Manager(event._id, wxContext.OPENID)
      break;
     //提交发货信息
    case 'sendSubmit':
      return await sendSubmit(event._id, wxContext.OPENID, event.useropenid, event.data, event.status)
      break
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
    case 'refund':
      return await refund(event._id, wxContext.OPENID, event.refundData)
      break;
    case 'refundConfirm'://
      //退款订单号
      let out_refund_no = await generateOrderno.generateRefundNo(16)
      return await refundConfirm(event._id, wxContext.OPENID, out_refund_no)
      break;
    case 'refundConfirmSuccess':
      //微信退款接口调用成功，更新订单状态
      return await refundConfirmSuccess(event._id, wxContext.OPENID)
      break;
    default:
      return

  }

}

/**
 * 获取订单列表
 * 订单状态
 * 用户openid
 */
function getOrder(_orderStatus, openid,pageNum) {
  console.log(_orderStatus)
  _orderStatus = _orderStatus * 1 //转为数字
  if (_orderStatus == 0) { //所有订单
      return cloud.database().collection(databaseName).where({
        _openid: openid, //用户ID
      }).orderBy('createDate', 'desc')
        .skip(5 * pageNum) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(5) // 限制返回数量为 10 条
      .get({}) 
  } else {
      return cloud.database().collection(databaseName).where({
        _openid: openid, //用户ID
        status: _orderStatus
      }).orderBy('createDate', 'desc')
      .skip(5 * pageNum) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(5) // 限制返回数量为 10 条
      .get({})
  }
}/**
 * 获取订单列表
 * 订单状态
 * 用户openid
 * 页码
 */
function getOrder_Manager(_orderStatus, openid, pageNum) {
  if (manager != openid) {
    return
  }
  console.log(_orderStatus)
  _orderStatus = _orderStatus * 1 //转为数字
  if (_orderStatus == 0) { //所有订单
      //管理员则返回所有用户订单
    return cloud.database().collection(databaseName)
    .orderBy('createDate', 'desc')
     .skip(5 * pageNum) // 跳过结果集中的前 10 条，从第 11 条开始返回
     .limit(5) // 限制返回数量为 10 条
    .get({})
  } else {
      //管理员则返回所有用户类型订单
      return cloud.database().collection(databaseName).where({
        status: _orderStatus
      })
      .skip(10 * pageNum) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(10) // 限制返回数量为 10 条
      .get({})
  }
}
/**
 * 获取 单个订单详情
 * 订单id
 * 用户openid
 */
function getSingleOrder(id, openid) {
  if (manager == openid) {
    return cloud.database().collection(databaseName).where({
      _id: id
    }).get()
  }else{
    return cloud.database().collection(databaseName).where({
      _openid: openid, //用户ID
      _id: id
    }).get()
  }
}
  /**
   * 获取 单个订单详情
   * 订单id
   * 用户openid
   */
  function getSingleOrder_Manager(id, openid) {
    if (manager != openid) {
      return
    }
    return cloud.database().collection(databaseName).where({
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
/**
 * 发货
 * 订单id
 * 管理员openid
 * 订单用户openid
 * 配送员数据
 * 订单状态
 */
function sendSubmit(id,openid,useropenid,data,status){
  if(openid!=manager){
    return
  }
  try {
    data.status = ORDER_SEND
    if (status == ORDER_PAY){//发货时间以第一次更新为准
      data.sendDate = chinaTime('YYYY-MM-DD HH:mm:ss')
    }
    
    let res=cloud.database().collection(databaseName).where({
      _id: id
    })
      .update({
        data: data,
      })
    sendTempMsg(id, useropenid, ORDER_SEND)
    return res
  } catch (e) {
    console.error(e)
  }
} cloud.database().command
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
    case ORDER_SEND:
      templateMsg.sendSendSuccess(getSingleOrder(id, openid), openid)
      break
  }

 
}

function queryOut_trade_no(_out_trade_no, openid) {
  return cloud.database().collection(databaseName).where({
    _openid: openid, //用户ID
    out_trade_no: _out_trade_no

  }).get({})
}

function refund(id, openid, refundData){
  
  try{
    refundData.refundCreateDate = chinaTime('YYYY-MM-DD HH:mm:ss');
       cloud.database().collection(databaseName).where({
        _id: id,
        _openid: openid,
      })
        .update({
          data: {
            status: ORDER_REFUND,
            refundData: refundData,
          }
        })

  } catch (e) {
    console.error(e)
  }
}
/**
 * 商家确认退款 更新订单信息
 */
function refundConfirm(id, openid, _out_refund_no){
  try {
    if (manager != openid) {
      return
    }
    return cloud.database().collection(databaseName).where({
      _id: id,
      status:6,
      refundData: cloud.database().command.exists(true)
    })
    .update({
        data: {
          out_refund_no: _out_refund_no,
        }
      })

  } catch (e) {
    console.error(e)
  }
}

function refundConfirmSuccess(id, openid) {
  try {
    if (manager != openid) {
      return
    }
    let refundConfirmDate = chinaTime('YYYY-MM-DD HH:mm:ss');
    return cloud.database().collection(databaseName).where({
      _id: id,
      status: 6,
      refundData: cloud.database().command.exists(true)
    })
    .update({
        data: {
          status: ORDER_REFUNDCONFIRM,
          refundData: {
            refundConfirmDate: refundConfirmDate
          },
        }
      })

  } catch (e) {
    console.error(e)
  }
}

