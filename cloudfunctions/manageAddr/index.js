// 云函数入口文件
const cloud = require('wx-server-sdk')
const chinaTime = require('china-time');
const manager = 'oDyLk5FI5tBIvFz0sflkBwnRSa8o'
cloud.init({
  env: "bookcake-ne49u",
  traceUser: true,
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.command) {  
    case 'add':
      return await addAddr(event.addrData, wxContext.OPENID)
      break;
    case 'edit':
    console.log(event)
      return editAddr(event._id,wxContext.OPENID,event.addrData)
      break
    case 'getSingle':
      return getSingle(event._id, wxContext.OPENID)
      break
    case 'getSingle_Manager':
      return getSingle_Manager(event._id, wxContext.OPENID)
      break
      //获取用户所有地址
    case 'get':
      return await getAddr(wxContext.OPENID)
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
      return await setDefault(event._id, wxContext.OPENID)
        break
    case 'delAddr':
      return delAddr(event._id, wxContext.OPENID, event._default)
        break
  }
}
function getAddr(openid){
  return  cloud.database().collection('userAddre').where({
    _openid: openid,//用户ID
    isDel: false,//未删除
  }).orderBy('createDate', 'desc').get({})
}
function addAddr(_addrData,openid){
  let date = chinaTime('YYYY-MM-DD HH:mm:ss')
  _addrData.createDate = date
  _addrData.updateDate = date
  _addrData._openid = openid
  _addrData.isDel = false
  //如果新增地址为默认地址，则要删除其他地址的默认值
  if (_addrData._default == true) {
    return new Promise((reslove, reject) => {
        console.log("XXX", _addrData._default)
        delDefault(openid).then((res)=>{
          cloud.database().collection("userAddre").add({
            data: _addrData,
          }).then((res) => {
            reslove({
              msg:'SUCCESS',
              code:'SUCCESS'
            })
          })
        })
      })
  }
  else {
    return cloud.database().collection("userAddre").add({
      data: _addrData,
    })
  }
}

function setDefault(id,openid){
  try {
    return new Promise((reslove, reject) => {
      delDefault(openid).then((res) => {
          //设置默认地址
        cloud.database().collection('userAddre').where({
          _openid: openid,//用户ID
          _id: id,
        }).update({//update内部要加data
          data: {
            _default: true,
            updateDate: chinaTime('YYYY-MM-DD HH:mm:ss')
          }
        }).then((res) => {
          getAddr(openid).then((res)=>{
            reslove(res)
          })
        })
      })
    })
  } catch (e) {
    console.error(e + "==id:" + id)
  }
}
function editAddr(id,openid,addrData){
  if(id==''){
    return
  }
  return cloud.database().collection('userAddre').where({
    _openid: openid,//用户ID
    _id: id
  }).update({
    data:addrData
  })
}
function getSingle(id, openid){
  return  cloud.database().collection('userAddre').where({
    _openid: openid,//用户ID
    _id: id
  }).get({})
}
function getSingle_Manager(id,openid) {
  if (manager != openid) {
    return
  }
  return cloud.database().collection('userAddre').where({
    _id: id
  }).get({})
}
 function delAddr(id,openid,def){
  //设置删除标志
  return new Promise((reslove,reject)=>{
      //删除地址
      cloud.database().collection('userAddre').where({
        _openid: openid,//用户ID
        _id: id,
      }).update({//update内部要加data
        data: {
          isDel: true
        }
      }).then((res) => {
        console.log(res);
        //成功删除默认地址 选取一条最新1地址设为默认 
        if (def && res.stats.updated==1 ) {
          //时间排序查询记录
          getAddr(openid).then((res) => {
            let resloveRes=res
            //最新地址的id
            if (res.data.length > 0) {
              let id = res.data[0]._id;
              //设置默认
              setDefault(id, openid).then((res)=>{
                reslove(res)
              })
            }
          })
        }

      })
  })
}
/**
 * 删除默认地址 为重设做准备
 */
 function delDefault(openid){
   return cloud.database().collection('userAddre').where({
    _openid: openid,//用户ID
    _default: true//默认地址
  }).update({//update内部要加data
    data: {
      updateDate: chinaTime('YYYY-MM-DD HH:mm:ss'),
      _default: false
    }
  })
}