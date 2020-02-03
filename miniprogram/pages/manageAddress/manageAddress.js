//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tapCurrent:0,
    addrArray:[],
    orderChoose:false,
    isShow:false,
  
  },
  
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getAddrList();
    this.setData({
      orderChoose: options.orderChoose
    })
   
  },
  onReady:function(){
    
    console.log("Ready", "Ready")
  },
  onPullDownRefresh: function () {
    this.getAddrList();
  },
  getAddrList:function(){

    var that=this;
    wx.cloud.callFunction({
      name:'manageAddr',
      data:{
        command:'get'
      },
      success(res){
        console.log("获取地址列表成功",res.result.data)
        that.setData({
          addrArray: res.result.data,
          isShow:true
        })
      },
      fail(res){
        console.log("获取地址列表失败", res)
      },
      complete(res){
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
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
  setDefaultAddr:function(data){
    //已经是默认地址
    if (data.currentTarget.dataset.def){
      return
    }
    wx.showLoading({
      title: '设置中',
    })
    var that=this
    var id = data.currentTarget.dataset.id
    console.log("id",id)
    wx.cloud.callFunction({
      name:'manageAddr',
      data:{
        command:'setDefault',
        _id: id
      },
      success:function(res){
        wx.hideLoading()
        console.log("setDefaultAddr", res)
        //订单页选择地址 返回订单页
        if (that.data.orderChoose){
          wx.navigateBack({
            delta:1//回退1栈
          })
        }else{//否则刷新列表
          that.getAddrList();
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '设置失败',
          icon:'none'
        })
        wx.hideLoading()
      },
      commplete: function (res) {

      },
    })
  },
  delConfirm:function(data){
    var that=this
    var id = data.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '确定删除该地址吗',
      confirmText:'删除',
      confirmColor:'#FF0000',
      success(res) {
        if (res.confirm) {
          that.delAddr(id)
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  delAddr:function(id){
    wx.showLoading({
      title: '删除中',
    })
    var that = this
    
    wx.cloud.callFunction({
      name: 'manageAddr',
      data: {
        command: 'delAddr',
        _id: id
      },
      success: function (res) {
        wx.hideLoading()
        that.getAddrList();//刷新
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
        console.log("delAddr fail"+res)
      },
      commplete: function (res) {

      },
    })
  },
  onShow:function(){
    if (wx.getStorageSync("manageAddr")){
      this.getAddrList();
      wx.setStorageSync("manageAddr", false)
    }
   
  },
  newAddress:function(){
    //表示从管理地址页面跳转，返回时判断刷新
    wx.setStorageSync("manageAddr", true)
    wx.navigateTo({
      url:'/pages/newAddress/newAddress'
    })
  }
})
