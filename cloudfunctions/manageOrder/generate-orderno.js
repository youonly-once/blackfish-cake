const cloud = require('wx-server-sdk')
const databaseName = 'order'

/**
 * 产生四位数字+字母随机字符
 * 生成商户订单号
 * len 随机长度
 */
 function getRandomCode(len) {
  let code = "";
  const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'/*, 'a', 'b', 'c', 'd', 'e',
      'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
      'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'*/];

   for (let i = 0; i < len; i++) {
    let id = Math.round(Math.random() * 9);
    code += array[id];
  }
  return Date.parse(new Date()).toString() + code;
}

/**
 * 从云数据库中查询code是否重复
 */
function generateOrderNo (len) {
  let _out_trade_no = getRandomCode(len);
  return new Promise((resolve, reject) => {
    queryOrderNo(_out_trade_no).then(res => {
     // console.log(res)
     // console.log(_out_trade_no)

      if (res.data.length == 0) {
        //console.log('return')
        resolve(_out_trade_no)//resolve 就是执行完再返回，否则return会先返回
      } else {
        return generateOrderNo()
      }
    })
  })

 
}
/**
 * 检查商户号重复 全局唯一
 */
function queryOrderNo(_out_trade_no) {
  return  cloud.database().collection(databaseName).where({
    out_trade_no: _out_trade_no
  }).field({_id:true})
  .get()
}


//###################退款###############################3

/**
 * 从云数据库中查询code是否重复
 */
function generateRefundNo(len) {
  let _out_refund_no = getRandomCode(len);
  return new Promise((resolve, reject) => {
    queryRefundNo(_out_refund_no).then(res => {
      // console.log(res)
      // console.log(_out_trade_no)

      if (res.data.length == 0) {
        //console.log('return')
        resolve(_out_refund_no)//resolve 就是执行完再返回，否则return会先返回
      } else {
        return generateRefundNo()
      }
    })
  })


}


/**
 * 检查退款订单号重复 全局唯一
 */
function queryRefundNo(_out_refund_no) {
  return cloud.database().collection(databaseName).where({
    out_refund_no: _out_refund_no
  }).field({ _id: true })
  .get()
}
module.exports={
  generateOrderNo: generateOrderNo,
  generateRefundNo: generateRefundNo
}