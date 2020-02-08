const cloud = require('wx-server-sdk')
const appid = 'wx515561ada65f1c58'
const program_appid = 'wx82f1142443293aae'
const secret = '59652b163668f4fa2e9404a664d9f465'
const myOpenid = 'oDyLk5FI5tBIvFz0sflkBwnRSa8o'
const bossOpenid = 'oDyLk5G6G6PT5NdI34NNtVZ_b_rs'
//付款成功模板消息
function sendPaySuccess(orderdata, user_openid) {
  orderdata.then(res => {
    let data = res.data[0]
    console.log(data)
    let id = 0
    let _path = 'pages/order_manager/order_detail_manager/order_detail_manager?orderid=' + data._id
    for (let i = 0; i < 3; i++) {
      switch (i) {
        case 0:
          id = user_openid
          _path = 'pages/order/order_detail/order_detail?orderid=' + data._id
          break;
        case 1:
          if (user_openid == bossOpenid) {
            continue
          }
          id = bossOpenid
          break;
        case 2:
          if (user_openid == myOpenid) {
            continue
          }
          id = myOpenid
          break;
      }
      try {
        const result = cloud.openapi.uniformMessage.send({
          touser: id,
          mpTemplateMsg: {
            appid: appid,
            url: 'http://weixin.qq.com',
            miniprogram: {
              appid: program_appid,
              path: _path //
            },
            data: {
              first: { //标题
                value: '下单成功！',
                color: '#173177'
              },
              keyword1: { //订单号
                value: '黑鲸Cake',
                color: '#173177'
              },
              keyword2: { //下单时间
                value: data.payDate,
                color: '#173177'
              },
              keyword3: { //订单编号
                value: data.out_trade_no,
                color: '#173177'
              },
              keyword4: { //订单状态
                value: '已付款',
                color: '#173177'
              },
              keyword5: { //付款金额
                value: '¥' + data.allGoodPrice,
                color: '#173177'
              },
              remark: { //备注
                value: '我们将尽快安排送货！',
                color: '#173177'
              }
            },
            templateId: 'CUe7bolnt5vS9YwSwqkJcTsuhJxnmDo0cRo7OASN5Vw'
          }
        })
        console.log(result)
        //return result
      } catch (err) {
        console.log(err)
        //return err
        continue
      }
    }
  })
}
//发货成功消息
async function sendSendSuccess(orderdata, user_openid) {
  console.log('userid', user_openid)
  orderdata.then(res => {
    let data = res.data[0]
    console.log(data)
    //获取配送地址信息
    let addr
    cloud.database().collection('userAddre').where({
      _id: data.addrId
    }).get({}).then(res => {
      addr = res.data[0]
      console.log(addr)
      let id = 0
      let _path = 'pages/order_manager/order_detail_manager/order_detail_manager?orderid='+data._id
      for (let i=0;i < 3;i++) {
        switch (i) {
          case 0:
            id = user_openid
            _path = 'pages/order/order_detail/order_detail?orderid=' + data._id
            break;
          case 1:
            if (user_openid == bossOpenid) {
              continue
            }
            id = bossOpenid
            break;
          case 2:
            if (user_openid == myOpenid) {
              continue
            }
            id = myOpenid
            break; 
        }
        console.log('id', id)
        try {
          const result = cloud.openapi.uniformMessage.send({
            touser: id,
            mpTemplateMsg: {
              appid: appid,
              url: 'http://weixin.qq.com',
              miniprogram: {
                appid: program_appid,
                path: _path //
              },
              data: {
                first: { //标题
                  value: '您订购的蛋糕在配送中。',
                  color: '#173177'
                },
                keyword1: { //总价及支付状态
                  value: '共'+data.payPrice + '元 已支付',
                  color: '#173177'
                },
                keyword2: { //商品名
                  value: data.goods[0].cakeName + '...',
                  color: '#173177'
                },
                keyword3: { //收货人信息
                  value: addr.name,
                  color: '#173177'
                },
                keyword4: { //配送地址
                  value: addr.addressName,
                  color: '#173177'
                },
                keyword5: { //配送时间
                  value: data.currDeliverDate,
                  color: '#173177'
                },
                remark: { //备注
                  value: '配送员姓名:' + data.delivPerName +
                    '\n配送员电话:' + data.delivPerPhone
                    + '\n' + data.delivPerRemark,
                  color: '#173177'
                }
              },
              templateId: 'AkQTNpWMICUcPU3-ULZoxOZk8nxaAzPDeHq_ptNE4DU'
            }
          })
          console.log(result)
          //return result
        } catch (err) {
          console.log(err)
          //return err
          continue
        }
      }
    })
  })
}
module.exports = {
  sendPaySuccess: sendPaySuccess,
  sendSendSuccess: sendSendSuccess,
}