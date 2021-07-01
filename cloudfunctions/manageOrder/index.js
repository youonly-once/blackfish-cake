// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const _ = cloud.database().command
const orderDateBase = cloud.database().collection('order')

const chinaTime = require('china-time');
const templateMsg = require('template-msg')
const generateOrderno = require('generate-orderno')
const manager = 'oDyLk5FI5tBIvFz0sflkBwnRSa8o'
const manager1 = 'oDyLk5G6G6PT5NdI34NNtVZ_b_rs'


const ORDER_CREATE = -1 //待创建 购物车
const ORDER_CANCEL = 0 //已取消，或无订单
const ORDER_SAVE = 1 //订单已保存 未付款
const ORDER_PAY = 2 //已付款
const ORDER_SEND = 3 //已送货 或者是已自提
const ORDER_RECEIVE = 4 //已签收 待评价
const ORDER_Finish = 5 //已完成 
const ORDER_REFUND = 6 //退款中
const ORDER_REFUNDCONFIRM = 7 //确认退款
const ORDER_REFUNDSUCCESS =8 //退款成功
const orderListField = {
  _id: true,
  createDate: true,
  goods: true,
  allGoodPrice: true,
  discount: true,
  status: true,
  deliverWay:true,
  delivPrice:true,
  payPrice:true,
  discount:true
}
const orderListNum=5
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  //console.log(chinaTime('YYYY-MM-DD HH:mm:ss')); // 2018-02-07 13:08:17
  //console.log('XXX', templateOpera.sendTempMsg())
  //console.log("XXX", templateMsg.sendPaySuccess(getSingleOrder('d68532785e3053b00711be267df56ea0', wxContext.OPENID), 'oDyLk5FI5tBIvFz0sflkBwnRSa8o'))
  console.log(event)
  //return
  switch (event.command) {
    
    //新增订单
    case 'add':
      let out_trade_no = await generateOrderno.generateOrderNo(8)
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
    case 'getSingleAndAddr':
      return await getSingleAndAddr(event._id, wxContext.OPENID)
      break;
    case 'getSingleAndAddrManager':
      return await getSingleAndAddrManager(event._id, wxContext.OPENID)
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
      return await updateStatus(event._id, orderStatus, wxContext.OPENID)
      break;

    case 'refund':
      let out_refund_no = await generateOrderno.generateRefundNo(16)
      return await refund(event._id, wxContext.OPENID, event.refundData, out_refund_no)
      break;

    case 'refundConfirmSuccess':
      //微信退款接口调用成功，更新订单状态
      //payMent调用
      return await refundConfirmSuccess(event._id, event.useropenid)

      break;
    case 'refundSuccess':
      return await refundSuccess(event.out_refund_no, event.refundSuccessDate)
      break;
    case 'confirmReceive':
      return await updateStatus(event._id, ORDER_RECEIVE,wxContext.OPENID)
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
 
  _orderStatus = _orderStatus * 1 //转为数字
  if (_orderStatus == 0) { //所有订单
      return orderDateBase.where({
        _openid: openid, //用户ID
      })
      .field(orderListField)
      .orderBy('createDate', 'desc')
      .skip(orderListNum * pageNum) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(orderListNum) // 限制返回数量为 10 条
      .get({}) 
  } else {
      return orderDateBase.where({
        _openid: openid, //用户ID
        status: _orderStatus
      })
      .field(orderListField)
      .orderBy('createDate', 'desc')
       .skip(orderListNum * pageNum) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(orderListNum) // 限制返回数量为 10 条
      .get({})
  }
}/**
 * 获取订单列表
 * 订单状态
 * 用户openid
 * 页码
 */
function getOrder_Manager(_orderStatus, openid, pageNum) {
  if (manager != openid && manager1 != openid) {
    return
  }

  _orderStatus = _orderStatus * 1 //转为数字
  if (_orderStatus == 0) { //所有订单
      //管理员则返回所有用户订单
    return orderDateBase
    .field(orderListField)
    .orderBy('createDate', 'desc')
      .skip(orderListNum * pageNum) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(orderListNum) // 限制返回数量为 10 条
    .get({})
  } else {
      //管理员则返回所有用户类型订单
      return orderDateBase.where({
        status: _orderStatus
      })
      .field(orderListField)
      .orderBy('createDate', 'desc')
        .skip(orderListNum * pageNum) // 跳过结果集中的前 10 条，从第 11 条开始返回
        .limit(orderListNum) // 限制返回数量为 10 条
      .get({})
  }
}
/**
 * 获取 单个订单详情
 * 订单id
 * 用户openid
 */
function getSingleOrder(id, openid) {
  
  if (manager == openid || manager1 == openid ) {
      return orderDateBase.where({
        _id: id
      }).get()
  }else{
    return orderDateBase.where({
      _openid: openid, //用户ID
      _id: id
    }).get()
  }
}
/**
 * 联表查询返回地址信息
 */
function getSingleAndAddr(id, openid) {
  if (manager == openid || manager1 == openid ) {
    return orderDateBase.aggregate()
      .match({
        _id: id
      })
      .lookup({//同时查询地址
        from: 'userAddre',
        localField: 'addrId',
        foreignField: '_id',
        as: 'addrObject',
      })
      .end()
  } else {
    return orderDateBase.aggregate()
      .match({
        _openid: openid, //用户ID
        _id: id
      })
      .lookup({//同时查询地址
        from: 'userAddre',
        localField: 'addrId',
        foreignField: '_id',
        as: 'addrObject',
      })
      .end()
  }
}
  /**
   * 获取 单个订单详情
   * 订单id
   * 用户openid
   */
  function getSingleOrder_Manager(id, openid) {
    if (manager != openid && manager1 != openid ) {
      return
    }
    return orderDateBase.where({
        _id: id
      }).get()

}
/**
 * 联表查询返回地址信息
 */
function getSingleAndAddrManager(id, openid) {
  if (manager != openid && manager1 != openid) {
    return
  }
  return orderDateBase.where({
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
/**管理员操作
 * 发货
 * 订单id
 * 管理员openid
 * 订单用户openid
 * 配送员数据
 * 订单状态
 */
function sendSubmit(id,openid,useropenid,data,status){
  if (openid != manager && manager1 != openid){
    console.log("非法访问")
    return "非法访问"
  }
  return new Promise((reslove, reject) => {
        if (status == ORDER_PAY){//发货时间以第一次更新为准
          data.sendDate = chinaTime('YYYY-MM-DD HH:mm:ss')
        }
        data.status = ORDER_SEND
        orderDateBase.where({
                _id: id,
                _openid: useropenid
              }).update({
                  data: data,
              }).then((res=>{
                //提交成功 推送发货消息
                if (status == ORDER_PAY){
                  if (res.stats.updated == 1)
                  templateMsg.sendTempMsg(getSingleAndAddr(id, useropenid), ORDER_SEND)
                }else{
                  templateMsg.sendTempMsg(getSingleAndAddr(id, useropenid), ORDER_SEND)
                }
                console.log("sendSubmit:",res)
                reslove({
                  updated:res.stats.updated
                })
              }))
  })
} 
/**
 * 更新订单状态
 */
function updateStatus(id, orderStatus, openid) {
    orderStatus = orderStatus * 1 //转为数字
    let _data = {}
    let date = chinaTime('YYYY-MM-DD HH:mm:ss');
    let beforeStatus=100
    _data.updateDate = date
    _data.status = orderStatus
    //增加付款时间 
    if (orderStatus == ORDER_PAY) {
      _data.payDate = date
      beforeStatus =ORDER_SAVE//付款之前必须
    }
    //增加收获时间
    else if (orderStatus == ORDER_RECEIVE) {
      _data.receiveDate = date
      beforeStatus = ORDER_SEND//发货之前必须付款
    }
    //增加评价时间
    else if (orderStatus == ORDER_Finish) {
      _data.finishDate = date
      beforeStatus = ORDER_RECEIVE//发货之前必须付款
    }
    //取消订单
    else if (orderStatus == ORDER_CANCEL) {
      beforeStatus = ORDER_SAVE//已保存的订单
    }
    return new Promise((reslove)=>{
      orderDateBase.where({
        _openid: openid, //用户ID
        _id: id,
        status: beforeStatus,
      }).update({ //update内部要加data
        data: _data
      }).then((res=>{
        //发送模板消息通知
        if(res.stats.updated==1){
          templateMsg.sendTempMsg(getSingleAndAddr(id, openid), orderStatus)
        }
        reslove({
          updated: res.stats.updated
        })
        })
      )
    })

}


/*function queryOut_trade_no(_out_trade_no, openid) {
  return orderDateBase.where({
    _openid: openid, //用户ID
    out_trade_no: _out_trade_no

  }).get({})
}
*/
//####################   退款  ##########################################
//####################   退款  ##########################################
//####################   退款  ##########################################
function refund(id, openid, refundData, out_refund_no){
  return new Promise((reslove,reject)=>{
      refundData.refundCreateDate = chinaTime('YYYY-MM-DD HH:mm:ss');
      orderDateBase.where({
          _id: id,
          _openid: openid,
          status: _.gte(ORDER_PAY).and(_.lte(ORDER_Finish))//退款前提是 已支付-已评价范围均可
        })
        .update({
            data: {
              status: ORDER_REFUND,
              refundData: refundData,
              out_refund_no: out_refund_no
            }
        }).then((res=>{//更新成功
          if(res.stats.updated==1){
            templateMsg.sendTempMsg(getSingleAndAddr(id, openid), ORDER_REFUND)
          }
          getSingleOrder(id,openid).then(res=>{
            reslove(res)
          })

        }))
  })
}

/**
 * 
 * 商家确认退款
 * 成功调用了微信支付退款接口
 * payment调用
 */
function refundConfirmSuccess(id,useropenid) {
  console.log('refundConfirmSuccess-order id:',id)
      let refundConfirmDate = chinaTime('YYYY-MM-DD HH:mm:ss');
      return new Promise((reslove)=>{
        templateMsg.sendTempMsg(getSingleAndAddr(id, useropenid), ORDER_REFUNDCONFIRM)
        orderDateBase.where({
          _id: id,
          status: ORDER_REFUND, 
          refundData: cloud.database().command.exists(true)
        })
        .update({
            data: {
              status: ORDER_REFUNDCONFIRM,
              refundData: {
                refundConfirmDate: refundConfirmDate
              },
            }
          }).then((res)=>{
            getSingleOrder(id,useropenid).then((res)=>{
              reslove(res)
            })
          })
      })
}
/**
 * 调用微信支付
 * 通过调用接口查询微信支付状态
 * 退款成功 
 */
function refundSuccess(out_refund_no, refundSuccessDate) {
  try {
    return orderDateBase.where({
      out_refund_no: out_refund_no,
      status: ORDER_REFUNDCONFIRM
    })
      .update({
        data: {
          status: ORDER_REFUNDSUCCESS,
          refundData: {
            refundSuccessDate: refundSuccessDate
          },
        }
      })

  } catch (e) {
    console.error(e)
  }
}
