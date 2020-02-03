// 云函数入口文件
const cloud = require('wx-server-sdk')
const md5 = require('md5-node');
const random = require("random.js") //生成随机数
const requestData = require("requestData.js")
const request = require("request")
const xmlreader = require("xmlreader")
const chinaTime = require('china-time');
const md51 = require('MD5.js');
cloud.init({
  env: "bookcake-ne49u",
  traceUser: true,
})

const appid = 'wx82f1142443293aae' //小程序appid
const mch_id = '1574775751' //商户号
const notify_url = 'http://www.weixin.qq.com/wxpay/pay.php' //随便写一个，云函数无法实现返回结果，但有巧妙的方法实现同样功能
const trade_type = 'JSAPI' //小程序的trade_type为JSAPI。
const key = 'HUY87T65Gj0iU09G7TFtre45FHJbhGFT' //就是微信支付账户里面设置的API密钥

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
      let dataBody = requestData(
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

    case "refund": //退款功能
      /*console.log("refund, event, wxContext.OPENID", event, wxContext.OPENID);
      return await api.refund({
        // transaction_id, out_trade_no 二选一
        // transaction_id: '微信的订单号',
        out_trade_no: event.out_trade_no,    //商户订单号
        out_refund_no: event.out_trade_no + 're',  //商户退款订单号，要求商户内唯一
        payPrice: event.payPrice,  //原单订单金额(单位是分)
        refund_fee: event.refund_fee,
        refund_desc: event.refund_desc
      })*/
      // 相关默认值:
      // op_user_id - 默认为商户号(此字段在小程序支付文档中出现)
      // notify_url - 默认为初始化时传入的refund_url, 无此参数则使用商户后台配置的退款通知地址
      break
  }
}
function getOut_trade_no(openid,orderId){
  //console.log("2", 2)
  return cloud.database().collection('order').where({
    _openid: openid,//用户ID
    _id:orderId
  }).get({})
}