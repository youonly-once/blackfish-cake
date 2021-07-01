
/**
 * 获取用户IP地址
 */
function getClientIp(that) {
  var _this = this;
  // 获取IP地址
  wx.request({
    url: 'https://tianqiapi.com/ip/',
    data: {
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res); 
      try{
        that.setData({ ip: res.data.ip });
      }catch(e){
        that.setData({ ip: '127.0.0.1' });
        console.error(e)
      }
      
    }
  });
}
module.exports = {
  getClientIp
}