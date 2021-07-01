
// 活动倒计时 格式 00天 00：00：00
function timeDown(that, endTime) {
  let date1 = new Date(); //开始时间  
  let date2 = endTime; //结束时间 
  let date3 = new Date(date2).getTime() - date1.getTime(); //时间差的毫秒数   
  //计算出相差天数  
  let days = Math.floor(date3 / (24 * 3600 * 1000))
  //计算出小时数  
  let leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数  
  let hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数  
  let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数  
  let minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数  
  let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数  
  let seconds = Math.round(leave3 / 1000)
  let time = ad0(days) + "天 " + ad0(hours) + " : " + ad0(minutes) + " : " + ad0(seconds)
  that.setData({
    timeDown: time
  })
  function ad0(n) {
    return n = n < 10 ? `0${n}` : n;
  }
}
// 获取点击参数
function getDataSet(e, field) {
  if (e.currentTarget.dataset[field]) {
    return e.currentTarget.dataset[field]
  } else {
    return e.target.dataset[field]
  }
}
// 组装传递的参数
function paramsJoin(paramsObj) {
  let arr = [];
  for (let name in paramsObj) {
    arr.push(`${name}=${paramsObj[name]}`);
  }
  return arr.join('&');
}
// 获取本地存储订单Id
function getOrderById(id,fn) {
  wx.getStorage({
    key: 'orderList',
    success(res) {
      let obj = res.data.filter((item) => {
        return item.id == id;
      })
      fn(obj[0])
    },
  })
}
// 获取本地存储订单Id下的某个商品
function getGoodsById(goodsArr, goodsId) {
  let obj = goodsArr.filter((item) => {
    return item.goods_id == goodsId;
  })
  return obj[0]
}

module.exports = {
  getDataSet,
  paramsJoin,
  getOrderById,
  getGoodsById,
  timeDown,  
}