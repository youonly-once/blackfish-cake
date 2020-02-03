const cloud = require('wx-server-sdk')
const request = require("request")
const appid = 'wx515561ada65f1c58'
const program_appid = 'wx82f1142443293aae'
const secret = '59652b163668f4fa2e9404a664d9f465'
const myOpenid ='oDyLk5FI5tBIvFz0sflkBwnRSa8o'
const bossOpenid ='oDyLk5G6G6PT5NdI34NNtVZ_b_rs'
//付款成功模板消息
function sendPaySuccess(orderdata,user_openid) {  
  orderdata.then(res => {
    let data = res.data[0]
    console.log(data)
  for(var i=0,id;i<3;i++){
    if(i==0)id=user_openid

    if (i == 1 ){
      if (user_openid==bossOpenid){
        continue
      }
      id = bossOpenid
    } 
    if (i == 2) {
      if (user_openid == myOpenid) {
        break
      }
      id = myOpenid
    }
      
  try {
    const result = cloud.openapi.uniformMessage.send({
      touser: id,
      mpTemplateMsg: {
        appid: appid,
        url: 'http://weixin.qq.com',
        miniprogram: {
          appid: program_appid,
          path: 'pages/order/order'//
        },
        data: {
          first: {//标题
            value: '下单成功！',
            color: '#173177'
          },
          keyword1: {//订单号
            value: '黑鲸Cake',
            color: '#173177'
          },
          keyword2: {//下单时间
            value: data.payDate,
            color: '#173177'
          },
          keyword3: {//订单编号
            value: data.out_trade_no,
            color: '#173177'
          },
          keyword4: {//订单状态
            value: '已付款',
            color: '#173177'
          },
          keyword5: {//付款金额
            value: '¥' + data.allGoodPrice,
            color: '#173177'
          },
          remark: {//备注
            value: '我们将尽快安排送货！',
            color: '#173177'
          }
        },
        templateId: 'CUe7bolnt5vS9YwSwqkJcTsuhJxnmDo0cRo7OASN5Vw'
      }
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
      }
    }
  })
}

module.exports = {
  
  sendPaySuccess: sendPaySuccess
}  