function requestData(
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
) {
  let data = "<xml>"
  data += "<appid>" + appid + "</appid>"
  data +=  "<attach>" + attach + "</attach>"
  data += "<body>" + body + "</body>"
  data += "<mch_id>" + mch_id + "</mch_id>"
  data += "<nonce_str>" + random + "</nonce_str>"
  data += "<notify_url>" + notify_url + "</notify_url>"
  data += "<openid>" + openid + "</openid>"
  data += "<out_trade_no>" + out_trade_no + "</out_trade_no>"
  data += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
  data += "<total_fee>" + payPrice + "</total_fee>"
  data += "<trade_type>" + trade_type + "</trade_type>"
  data += "<sign>" + sign + "</sign>"
  data += "</xml>"
  return data
}

module.exports = requestData