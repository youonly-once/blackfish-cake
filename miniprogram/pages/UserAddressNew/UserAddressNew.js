//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    addrData:{
      sex: "男",
      name: '',
      phone: '',
      address: '',//选择的地图地址
      addressName: '',//选择的地图位置名
      latitude: 0,
      longitude: 0,
      detailAddr: '',//详细地址
      _default: false,
    },
    // "addr": {
    //"city": this.data.city,
    //"area": this.data.area,
    //"street": this.data.detailAddr,
    // "detail": this.data.detailAddr,
    //"province": this.data.province
    //},
      isEdit:false,
        province:'重庆市',
        city:'重庆市',
        area:'大渡口区',
        region:['重庆市', '重庆市', '大渡口区'],
        chooseAddress:'去选择地址',
        isOpenLocation:false,

  },
  
  onLoad: function (options) {
    let addrData = wx.getStorageSync("addrData")
    if (addrData != '') {
      this.setData({
        addrData: addrData,
        isEdit:true
      })
      wx.removeStorageSync("addrData")
      wx.setNavigationBarTitle({
        title: '修改收货地址',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '新建收货地址',
      })
      
    }
  },
 
  bindDateChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
//输入姓名
  nameInput:function(e){
    let addrData = this.data.addrData
    addrData.name = e.detail.value
    this.setData({
      addrData: addrData
    })
  },
  //输入电话
  phoneInput: function (e) {
    let addrData=this.data.addrData
    addrData.phone=e.detail.value
    this.setData({
      addrData: addrData
    })
  },
  /**
   * 地区
   */
  areaAddrInput(e){
    let addrData = this.data.addrData
    addrData.address = e.detail.value
    this.setData({
      addrData: addrData
    })
  },
  //详细地址
  detailAddrInput: function (e) {
    let addrData = this.data.addrData
    addrData.detailAddr = e.detail.value
    this.setData({
      addrData: addrData
    })
  },
  //默认地址
  switchDefaultChange: function (e) {
    let addrData = this.data.addrData
    addrData._default = e.detail.value
    this.setData({
      addrData: addrData
    })
  },
  //城市选择
  bindRegionChange: function (e) {
    this.setData({
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2],
    })
  
  },

  /**
   * 通过地图选择位置
   */

  getSetting: function (e) { //获取用户的当前设置
    if (!e.detail.authSetting["scope.userLocation"]) {//如果打开了地理位置，就会为true
      //未授权
      wx.showModal({
        title: '请求授权当前位置',
        content: '需要您手动授权地理位置，用于配送蛋糕及计算配送距离。',
      })
    }else{
      this.setData({
        isOpenLocation: false
      })
      this.chooseMapAddress()
    }
  },
  chooseMapAddress:function(){
    var that=this
    wx.chooseLocation({
      success(res) {
        console.log(res)
        let addrData=that.data.addrData
        addrData.address = res.address
        addrData.longitude = res.longitude
        addrData.latitude = res.latitude
        addrData.addressName = res.name
        that.setData({
          addrData: addrData
        })
      },
      fail(res) {//打开地理位置授权}
        console.log(res)
        //不是用户取消，则提示用户打开地理位置授权
        if (res.errMsg !="chooseLocation:fail cancel"){
          that.setData({
            isOpenLocation: true
          })
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要您手动授权地理位置，用于配送蛋糕及计算配送距离。',
          })
        }
      }
    })
  },
  saveAddress:function(){
    var subData = this.data.addrData
    if (!this.checkInput(subData)){
      console.log(subData)
      return;
    }

    wx.showLoading({
      title: '保存中',
    })
    let command='add'
    let id=''
    if (this.data.isEdit){//修改地址
      command='edit'
      id=subData._id
      console.log(id)
      delete subData['_id']
      console.log(id)
    }
    console.log("添加地址数据", subData)
      wx.cloud.callFunction({
        name:'manageAddr',
        data:{
          _id: id,
          command: command,
          addrData:subData
        },
        success(res){
          wx.navigateBack({//返回地址管理界面
            delta: 1
          })
          console.log("新增地址成功", res)
        },
        fail(res){
          console.log("新增地址失败", res)
        },
        complete: () => {
          wx.hideLoading()
        }
        
      })
  },
  checkInput: function (submitdata) {
    if(submitdata.name==''){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请填写姓名',
      })
      return false
    }
    if (submitdata.phone == '' || submitdata.phone.length != 11) {
      wx.showModal({
        showCancel:false,
        title: '提示',
        content: '请填写正确的手机号',
      })
      return false
    }
    if (submitdata.addressName == '' || submitdata.latitude == 0 || submitdata.longitude== 0 ) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择地区',
      })
      return false
    }
    if (submitdata.address== '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择地区',
      })
      return false
    }
    if (submitdata.detailAddr == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请填写详细地址信息',
      })
      return false
    }
    
  return true;
  },
})
