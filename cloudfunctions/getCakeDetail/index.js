// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "bookcake-ne49u",
  traceUser: true,
})
// 云函数入口函数
exports.main =  async(event, context) => {
 // console.log(event.cakeid)
  var resdata=[];
 // const wxContext = cloud.getWXContext()
  return await cloud.database().collection('cake_style').doc(event.cakeid).get();
 
}