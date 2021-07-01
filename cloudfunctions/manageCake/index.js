// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const _ = cloud.database().command
const orderDateBase = cloud.database().collection('cake_style')
const chinaTime = require('china-time');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  switch(event.command){
    //增加销量
    case 'addSales':
      return await addSales(event.cakeId,event.addCount,wxContext.OPENID)
       break
    case 'getIndexList':
      return await getIndexList()
      break
  }
}
function addSales(id, count, openid){
   count=count*1
  let updateDate = chinaTime('YYYY-MM-DD HH:mm:ss');
  return orderDateBase.where({
     _id:id
  }).update({
    data:{
      sales: _.inc(count),
      openid:openid,
      updateDate:updateDate
    }
  })
}
function getIndexList(){
  return new Promise((reslove)=>{
    orderDateBase.get().then(res => {
      let data=res;
      cloud.database().collection('home_swiper_img').get().then(res=>{
        data.swiperImg = res.data[0].swiper_img
        reslove(data)
      })
    })
  })

}