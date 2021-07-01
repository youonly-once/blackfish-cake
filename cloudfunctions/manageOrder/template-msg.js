const cloud = require('wx-server-sdk')
const appid = 'wx515561ada65f1c58'
const program_appid = 'wx82f1142443293aae'
const secret = '59652b163668f4fa2e9404a664d9f465'
const myOpenid = 'oDyLk5FI5tBIvFz0sflkBwnRSa8o'
const bossOpenid = 'oDyLk5G6G6PT5NdI34NNtVZ_b_rs'
const ORDER_CREATE = -1 //待创建 购物车
const ORDER_CANCEL = 0 //已取消，或无订单
const ORDER_SAVE = 1 //订单已保存 未付款
const ORDER_PAY = 2 //已付款
const ORDER_SEND = 3 //已送货 或者是已自提
const ORDER_RECEIVE = 4 //已签收 待评价
const ORDER_Finish = 5 //已完成 
const ORDER_REFUND = 6 //退款中
const ORDER_REFUNDCONFIRM = 7 //确认退款
const ORDER_REFUNDSUCCESS = 8 //退款成功
function sendTempMsg(orderdata,  type) {
  orderdata.then(res => {
    console.log(res)
    let data = res.list[0]
    console.log(data)
    //发送给用户
    let id = data._openid
    let _path = 'pages/Order/OrderDetail/OrderDetail?orderid=' + data._id
    sendTempType(data, id, _path, type)

    //发送给管理员
    _path = 'pages/OrderManager/OrderDetailManager/OrderDetailManager?orderid=' + data._id
    // if (user_openid != bossOpenid) {
    id = bossOpenid
      sendTempType(data, id, _path, type)
    //}
    //if (user_openid != myOpenid) {
    id = myOpenid
    sendTempType(data, id, _path, type)
    // }

  })

}

function sendTempType(data, openid, _path, type) {
  if (type == ORDER_PAY) {
    sendPaySuccess(data, openid, _path)
  } else if (type == ORDER_SEND) {
    sendSendSuccess(data, openid, _path)
  } else if (type == ORDER_REFUND) {
    refund(data, openid, _path)
  } else if (type == ORDER_REFUNDCONFIRM) {
    refundConfirm(data, openid, _path)
  }
}

//付款成功模板消息
function sendPaySuccess(data, openid, _path) {
  let sendData = {}
  sendData.openid = openid
  sendData.path = _path
  sendData.first = '下单成功！'
  sendData.keyword1 = '黑鲸Cake'
  sendData.keyword2 = data.payDate,
    sendData.keyword3 = data.out_trade_no,
    sendData.keyword4 = '已付款',
    sendData.keyword5 = '¥' + ((data.payPrice / 100).toFixed(2)),
    sendData.remark = '我们将尽快安排送货！',
    sendData.templateId = 'CUe7bolnt5vS9YwSwqkJcTsuhJxnmDo0cRo7OASN5Vw'
  send(sendData)
}
//发货成功消息
function sendSendSuccess(data, openid, _path) {
  addr = data.addrObject[0]
  let sendData = {}
  sendData.openid = openid
  sendData.path = _path
  sendData.first = '您订购的蛋糕在配送中。'
  sendData.keyword1 = '已支付' + ((data.payPrice / 100).toFixed(2)) + '元(共' + ((data.allGoodPrice + data.delivPrice).toFixed(2))+'元)'
  sendData.keyword2 = data.goods[0].cakeName + '...'
  sendData.keyword3 = addr.name,
  sendData.keyword4 = addr.addressName,
  sendData.keyword5 = data.currDeliverDate,
  sendData.remark = '配送员姓名:' + data.delivPerName +
    '\n配送员电话:' + data.delivPerPhone
  if (data.delivPerRemark.trim() != '') {
    sendData.remark = sendData.remark+'\n留言：' + data.delivPerRemark
  }
  sendData.templateId = 'AkQTNpWMICUcPU3-ULZoxOZk8nxaAzPDeHq_ptNE4DU'
  send(sendData)

}
//退款申请
function refund(data, openid, _path) {
  let sendData = {}
  _path = 'pages/OrderRefund/RefundDetail/RefundDetail?orderid=' + data._id
  sendData.openid = openid
  sendData.path = _path
  sendData.first = '提交退款申请'
  sendData.keyword1 = data.out_trade_no
  sendData.keyword2 = data.out_trade_no
  sendData.keyword3 = parseInt(data.refundData.refundPrice).toFixed(2)+'元'
  sendData.keyword4 = '微信支付',
  sendData.keyword5 = (data.payPrice/100).toFixed(2)+'元',
  sendData.remark = '已通知商家审核'
  sendData.templateId = 'xvIL6mU7-MPQIBVauVyQtNnAb3Wg8pjRv9CDb-QBAk0'
  send(sendData)
} 
//退款确认
function refundConfirm(data, openid, _path) {
  let sendData = {}
  _path = 'pages/OrderRefund/RefundDetail/RefundDetail?orderid=' + data._id
  sendData.openid = openid
  sendData.path = _path
  sendData.first = '您的退款请求商家已受理'
  sendData.keyword1 = data.out_trade_no
  sendData.keyword2 = (data.refundData.refundPrice).toFixed(2) + '元'
  sendData.keyword3 = data.createDate
  sendData.keyword4 = '18223411280',
  //sendData.keyword5 = (data.payPrice / 100).toFixed(2) + '元',
    sendData.remark = '预计1~5个工作日内退回支付账户'
  sendData.templateId = '1x_GhOvYjaPd-yf6zt44PKbe1QfPus7o2D-0ss1uOVI'
  send(sendData)
}

function send(sendData) {
  try {
    const result = cloud.openapi.uniformMessage.send({
      touser: sendData.openid,
      mpTemplateMsg: {
        appid: appid,
        url: 'http://weixin.qq.com',
        miniprogram: {
          appid: program_appid,
          pagepath: sendData.path //
        },
        data: {
          first: { //标题
            value: sendData.first,
            color: '#173177'
          },
          keyword1: { //总价及支付状态
            value: sendData.keyword1,
            color: '#173177'
          },
          keyword2: { //商品名
            value: sendData.keyword2,
            color: '#173177'
          },
          keyword3: { //收货人信息
            value: sendData.keyword3,
            color: '#173177'
          },
          keyword4: { //配送地址
            value: sendData.keyword4,
            color: '#173177'
          },
          keyword5: { //配送时间
            value: sendData.keyword5,
            color: '#173177'
          },
          remark: { //备注
            value: sendData.remark,
            color: '#173177'
          }
        },
        templateId: sendData.templateId
      }
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err

  }
}
module.exports = {
  sendTempMsg: sendTempMsg
}