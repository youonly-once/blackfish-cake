// 云函数入口文件
const cloud = require('wx-server-sdk')
const chinaTime = require('china-time');
cloud.init({
  env: "bookcake-ne49u",
  traceUser: true,
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.command) {  
    case 'add':
      var _addrData = event.addrData;
      let date = chinaTime('YYYY-MM-DD HH:mm:ss')
      _addrData.createDate = date
      _addrData.updateDate = date
      _addrData._openid = wxContext.OPENID
      _addrData.isDel = false 
      //如果新增地址为默认地址，则要删除其他地址的默认值
      if (_addrData._default==true){
        console.log("XXX", _addrData._default)
        await delDefault(wxContext.OPENID)
      }
      return await cloud.database().collection("userAddre").add({
        data: _addrData,
      })
      break;
      //获取用户所有地址
    case 'get':
      return await cloud.database().collection('userAddre').where({
        _openid: wxContext.OPENID,//用户ID
        isDel: false,//未删除
      }).get({})
      break
      //获取用户默认地址
    case 'getDefault':
      return await cloud.database().collection('userAddre').where({
        _openid: wxContext.OPENID,//用户ID
        _default:true,//默认地址
        isDel: false,//未删除
      }).get({})
      break
    //设置用户默认地址
    case 'setDefault':
        try{
          var id=event._id
        //  console.log("id:" + id)
        //将其他地址删除默认
        await delDefault(wxContext.OPENID)
         //设置默认地址
        return await cloud.database().collection('userAddre').where({
          _openid: wxContext.OPENID,//用户ID
            _id:id, 
          }) .update({//update内部要加data
            data:{
              _default: true,
              updateDate:chinaTime('YYYY-MM-DD HH:mm:ss')
            }
          })
        } catch (e) {
          console.error(e+"==id:"+id)
        }
        break
      case 'delAddr':
        var id = event._id
        return delAddr(id, wxContext.OPENID)
        break
  }
}
 function delAddr(id,openid){
  //设置删除标志
  return  cloud.database().collection('userAddre').where({
    _openid: openid,//用户ID
    _id: id,
  }).update({//update内部要加data
      data: {
        isDel: true
      }
    })
}
/**
 * 删除默认地址 为重设做准备
 */
 function delDefault(openid){
   cloud.database().collection('userAddre').where({
    _openid: openid,//用户ID
    _default: true//默认地址
  }).update({//update内部要加data
    data: {
      updateDate: chinaTime('YYYY-MM-DD HH:mm:ss'),
      _default: false
    }
  })
}