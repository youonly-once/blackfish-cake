//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  tapCurrent:0,
  name:'',
  phone:'',
  province:'重庆市',
  city:'重庆市',
  area:'大渡口区',
  street:'',
  detailAddr:'',
  defaultAddr:false,
  region:['重庆市', '重庆市', '大渡口区'],
   chooseAddress:'去选择地址',
    latitude:null,//经度纬度
    longitude:null,
    isOpenLocation:false,
  },
  
  onLoad: function () {
   
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/userInfo/userInfo'
    })
  },

   bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  discount:function(e){
    var current=e.currentTarget.dataset.current;
    this.setData({
      tapCurrent:current
    })
  },
  bindDateChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
//输入姓名
  nameInput:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  //输入电话
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //详细地址
  detailAddrInput: function (e) {
    this.setData({
      chooseMapAddress: e.detail.value,
      street: e.detail.value
    })
  },
  //默认地址
  switchDefaultChange: function (e) {
    this.setData({
      defaultAddr: e.detail.value
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
        that.setData({
          chooseMapAddress:res.address,
          longitude:res.longitude,
          latitude: res.latitude,
          addressName: res.name
        })
      },
      fail(res) {//打开地理位置授权}
        console.log(res)
        //不是用户取消，则提示用户打开地理位置授权
        if (res.errMsg = !"chooseLocation:fail cancel"){
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
    var subData = {
     // "userAddr": 
        "sex": "男",
        "_default": this.data.defaultAddr,
       // "addr": {
          //"city": this.data.city,
          //"area": this.data.area,
          //"street": this.data.detailAddr,
         // "detail": this.data.detailAddr,
          //"province": this.data.province
        //},
        "address":this.data.chooseMapAddress,
        "name": this.data.name,
        addressName: this.data.addressName,
        "phone": this.data.phone,
      "latitude": this.data.latitude,
      "longitude": this.data.longitude,
      }
    if (!this.checkInput(subData)){
      console.log(subData)
      return;
    }
    wx.showLoading({
      title: '保存中',
    })
    console.log("添加地址数据", subData)
      wx.cloud.callFunction({
        name:'manageAddr',
        data:{
          command:'add',
          addrData:subData
        },
        success(res){
         // if ( wx.getStorageSync("manageAddr"))
          wx.navigateBack({
            delta: 1
          })//返回地址管理界面
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
    for (var o in submitdata) {
      if (  o == '_default'){
        continue
      }
      if (submitdata[o] == null || submitdata[o] == undefined || submitdata[o].length == 0 || submitdata[o] == '' ) {
        wx.showToast({
          title: '请填写地址信息',
          icon: 'none'
        })
        console.log(o, submitdata[o]);
        console.log('==', typeof (submitdata[o]));
        return false
      }
      //数字必须大于0 配送费和折扣可为0  //口味价格可能为0
      if (!isNaN(submitdata[o]) && submitdata[o]<=0  ) {
        wx.showToast({
          title: '请选择您的地址',
          icon: 'none'
        })
        console.log(o, submitdata[o]);
        console.log('==', typeof (submitdata[o]));
        return false
      }
      if (o == "phone" && submitdata[o].length!=11){
        wx.showToast({
          title: '手机号不正确',
          icon: 'none'
        })
        return false
      }
    }
  return true;
  },
})
