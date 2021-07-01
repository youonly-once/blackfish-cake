// 云函数入口文件
const cloud = require('wx-server-sdk')
const md5 = require('md5-node');
const random = require("random.js") //生成随机数
const requestData = require("requestData.js")
const request = require("request")
const xmlreader = require("xmlreader")
const chinaTime = require('china-time');
const md51 = require('MD5.js');
const fs = require("fs");
const manager = 'oDyLk5FI5tBIvFz0sflkBwnRSa8o'
const manager1 = 'oDyLk5G6G6PT5NdI34NNtVZ_b_rs'
cloud.init({
  env: "bookcake-ne49u",
  traceUser: true,
})

const appid = 'wx82f1142443293aae' //小程序appid
const mch_id = '1574775751' //商户号
const notify_url = 'http://www.weixin.qq.com/wxpay/pay.php' //随便写一个，云函数无法实现返回结果，但有巧妙的方法实现同样功能
const trade_type = 'JSAPI' //小程序的trade_type为JSAPI。
const key = 'HUY87T65Gj0iU09G7TFtre45FHJbhGFT' //就是微信支付账户里面设置的API密钥
const cert_file = __dirname + '/ssl/apiclient_cert.pem' // 微信支付秘钥cert文件,退款接口会用到
const key_file = __dirname + '/ssl/apiclient_key.pem' // 微信支付秘钥key文件,退款接口会用到
// 云函数入口函数
exports.main = async(event, context) => {

  /*console.log('x', md51.hexMD5('123456789').toUpperCase())
  console.log('x', md51.hexMD5w('123456789').toUpperCase())
  console.log('x', md51.b64MD5('123456789').toUpperCase())
  console.log('x', md51.b64MD5w('123456789').toUpperCase())
  console.log('x', md5('123456789').toUpperCase())
        return*/

  const wxContext = cloud.getWXContext()
  //步骤4，调用，想用一个云函数实现全部支付功能，包括支付、退款、查询等
  switch (event.command) {
    case "pay": //支付功能
      const openid = wxContext.OPENID;   //付款用户的openid，直接拿就行
      let out_trade_noData = await getOut_trade_no(openid, event.orderId)//获取订单的商户号
      //await等待执行完成
      out_trade_noData = (out_trade_noData.data)[0]
      const attach = out_trade_noData.attach
      const body = out_trade_noData.body;          //订单大致内容
      const payPrice = out_trade_noData.payPrice; //订单金额(单位是分),
      const spbill_create_ip = out_trade_noData.spbill_create_ip;//付款用户的IP地址
      const out_trade_no = out_trade_noData.out_trade_no//商户号
      
      let stringA = `appid=${appid}&attach=${attach}&body=${body}&mch_id=${mch_id}&nonce_str=${random}&notify_url=${notify_url}&openid=${openid}&out_trade_no=${out_trade_no}&spbill_create_ip=${spbill_create_ip}&total_fee=${payPrice}&trade_type=${trade_type}&key=${key}`
      var sign = md5(stringA).toUpperCase()
      let dataBody = requestData.payData(
        appid,
        attach,
        body,
        mch_id,
        random,
        notify_url,
        openid,
        out_trade_no,
        spbill_create_ip,
        payPrice,
        trade_type,
        sign,
      )
      //return stringA + '--' +dataBody
      return await new Promise((reslove,reject) => {
        request({
            url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
            method: "POST",
            body: dataBody,
          },
          function(error, response, body) {
            if (error || response.statusCode!=200){
              reslove({
                msg_code: 'FAIL',
                msg: '服务器繁忙'
              })
            }
            //if (!error && response.statusCode == 200) {
                      xmlreader.read(body, function(errors, response) {
                        if (null !== errors) {
                          reslove({
                            msg_code:'FAIL',
                            msg: errors
                          })
                        }
                        //console.log("X",body)
                        //console.log("X", response)
                        //console.log("X", response.xml.return_code.text())
                       // console.log("X", response.xml.return_msg.text())
                        if (response.xml.return_code.text()=='SUCCESS'){//返回成功
                          console.log("SUCCESS", response.xml.return_msg.text() )
                        }
                        if (response.xml.return_code.text() == 'FAIL') {
                          console.log("FAIL", response.xml.return_msg.text())
                          reslove({
                            msg_code: 'FAIL',
                            msg: response.xml.return_msg.text()
                          })
                        }
                        let prepay_id = response.xml.prepay_id.text()
                        let package = 'prepay_id=' + prepay_id
                        let _signType="MD5"//用单引号居然要出错?
                        let timeStamp_ = chinaTime().getTime()+''//必须转为字符串
                        let str = `appId=${appid}&nonceStr=${random}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${timeStamp_}&key=${key}`
                        let paySign_ = md5(str).toUpperCase()
                        reslove({
                          msg_code:'SUCCESS',
                          paySign_,
                          random,
                          timeStamp_,
                          package,
                          _signType,
                        })
                    
                      })//xmlreader

               // }//if
            },//function
          )//request
      })

      break

    case "refundConfirm": //退款功能
      if (manager != wxContext.OPENID && manager1 != wxContext.OPENID) {
        return
      }
      let order = await getOut_refund_no(event._id)//获取订单的商户号
      return await refundConfirm(order, event._id, order._openid)
      break
    case "refundQuery"://退款状态查询
      return await refundQuery(event.out_refund_no)
  }
}

/**
 * 商家退款
 */
function refundConfirm(order, orderId, openid){
 
  
      //refundConfirmSuccess(event._id)

 // let order =getOut_refund_no(orderId)//获取订单的商户号
  console.log(order)
  //await等待执行完成
  order = (order.data)[0]
  console.log(order)
  
  const out_refund_no = order.out_refund_no//商户号
  const out_trade_no = order.out_trade_no//商户号
  const total_fee = order.payPrice; //订单金额(单位是分),
  const refund_fee=order.refundData.refundPrice*100
  let stringA = `appid=${appid}&mch_id=${mch_id}&nonce_str=${random}&out_refund_no=${out_refund_no}&out_trade_no=${out_trade_no}&refund_fee=${refund_fee}&total_fee=${total_fee}&key=${key}`
  var sign = md5(stringA).toUpperCase()
  let dataBody =requestData.refundData(
    appid,
    mch_id,
    random,
    out_refund_no,
    out_trade_no,
    refund_fee,
    total_fee,
    sign
  )
  let url ='https://api.mch.weixin.qq.com/secapi/pay/refund'
  return refundSubmit(dataBody, url, orderId, openid)
  
}
function refundSubmit(dataBody, url, orderId, openid){
  let key = fs.readFileSync(key_file).toString()
  let cert = fs.readFileSync(cert_file).toString()
  return new Promise((reslove, reject) => {

    request({
      url: url,
      method: "POST",
      body: dataBody,
      key:key,
      cert:cert
    },
    function (error, response, body) {
        if (error || response.statusCode != 200) {
          console.log(error)
          reject({
            code: 'FAIL',
            msg: '服务器繁忙',
            error: error
          })
        }
      xmlreader.read(body, function (errors, response) {
        if (null !== errors) {
          reslove({
            code: 'FAIL',
            msg: 'XML读取错误'
          })
        }
        //提交错误
        if (response.xml.err_code != null && response.xml.err_code.text()) {
          reslove({
            code: response.xml.err_code.text(),
            msg: response.xml.err_code_des.text()
          })
        }
        if (response.xml.return_code.text() == 'SUCCESS') {
          console.log('SUCCESS',response)
           //new Promise((reslove, reject) =>{
          refundConfirmSuccess(orderId, openid).then((res)=>{
               reslove({
                 code: 'SUCCESS',
                 msg: response.xml.return_msg.text(),
                 data:res.result.data
               })
             })
           //})

        } else {
          reslove({
            code: 'FAIL',
            msg: response.xml.return_msg.text()
          })
        }
      })

      }
    )
  })
}

/**
 * 微信退款商家确认成功
 */
function refundConfirmSuccess(orderId, openid){
  console.log('refundConfirmSuccess-payment')
  return cloud.callFunction({
    name: 'manageOrder',
    data: {
      command: 'refundConfirmSuccess',
      _id: orderId,
      useropenid:openid
    },
  })
}
/**
 * 微信退款成功，更新订单状态
 */
function refundSuccess(out_refund_no, refundSuccessDate) {
  console.log('refundSuccess-payment')
  return cloud.callFunction({
    name: 'manageOrder',
    data: {
      command: 'refundSuccess',
      out_refund_no: out_refund_no,
      refundSuccessDate: refundSuccessDate
    }
  })
}
function refundQuery(out_refund_no){
  let stringA = `appid=${appid}&mch_id=${mch_id}&nonce_str=${random}&out_refund_no=${out_refund_no}&key=${key}`
  var sign = md5(stringA).toUpperCase()
  let dataBody = requestData.refundQuery(
    appid,
    mch_id,
    random,
    out_refund_no,
    sign
  )
  let url ='https://api.mch.weixin.qq.com/pay/refundquery'
  return new Promise((reslove, reject) => {
    request({
      url: url,
      method: "POST",
      body: dataBody,
    },
      function (error, response, body) {
        if (error || response.statusCode != 200) {
          console.log(error)
          reject({
            code: 'FAIL',
            msg: '服务器繁忙',
            error: error
          })
        }
        console.log(response)
        xmlreader.read(body, function (errors, response) {
          if (null !== errors) {
            reslove({
              code: 'FAIL',
              msg: 'XML读取错误'
            })
          }
          if (response.xml.err_code!=null && response.xml.err_code.text()){
            reslove({
              code: response.xml.err_code.text(),
              msg: response.xml.err_code_des.text()
            })
          }
          if (response.xml.return_code.text() == 'SUCCESS') {
            console.log(response)
            let str='查询失败'
            switch (response.xml.refund_status_0.text()){
              case 'SUCCESS':
                str='退款成功'
                console.log('111')
                 refundSuccess(out_refund_no, response.xml.refund_success_time_0.text()).then(res=>{
                   reslove({
                     code: response.xml.refund_status_0.text(),
                     msg: str
                   })
                 })
                break;
              case 'REFUNDCLOSE':
                str ='退款关闭'
                break;
              case 'PROCESSING':
                str = '退款处理中'
                break;
              case 'CHANGE':
                str ='退款异常，退款到银行发现用户的卡作废或者冻结了，导致原路退款银行卡失败'
                break;
            }
            if (response.xml.refund_status_0.text()=='SUCCESS'){
              reslove({
                code: response.xml.refund_status_0.text(),
                msg: str,
                time: response.xml.refund_success_time_0.text()
              })
            }
            reslove({
              code: response.xml.refund_status_0.text(),
              msg: str
            })
          } else {
            reslove({
              code: 'FAIL',
              msg: '查询失败'
            })
          }
        })

      }
    )
  })
}
function getOut_trade_no(openid,orderId){
  //console.log("2", 2)
  return cloud.database().collection('order').where({
    _openid: openid,//用户ID
    _id:orderId
  }).get({})
}
function getOut_refund_no(orderId) {
  //console.log("2", 2)
  return cloud.database().collection('order').where({
    //_openid: openid,//用户ID
    _id: orderId
  }).get({})
}