//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    currentTap:0,//当前页面
    orderList:[],
  
  },

  onLoad: function (options) {
    console.log("options",options)
    console.log("options.orderstatus", options.orderstatus)
    if (options.orderstatus != null && options.orderstatus!=undefined && options.orderstatus != "undefined"){
      this.setData({ 
        currentTap: options.orderstatus
      })
    }

    this.getOrderList()
  },
  //用户下拉
  onPullDownRefresh: function () {
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  //用户上拉
  onReachBottom:function(){
    
  },
  getOrderList: function (){
    let that=this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'manageOrder',
      data:{
        command:'get',
        _orderStatus: that.data.currentTap
      },
      success(res){
        
        that.setData({
          orderList: res.result.data,
      
        })
        console.log("订单列表", that.data.orderList)
        
      },
      fail(res){
        console.log("获取订单列表失败", res)
      },
      complete(res){
        wx.hideLoading()
      }
    })
  },
  //取消订单，更新订单状态
  isCancelOrder:function(e){
    let that=this
    wx.showModal({
      title: '提示',
      content: '订单还未付款，确定取消吗',
      cancelText:  '取消订单',
      confirmColor:'#FF0000',
      confirmText: '再考虑下',
      success(res){
        if (res.cancel) {
          that.cancelOrder(e.currentTarget.dataset.id)
        }
       
      },
      fail(res){
        
      },
      complete(res){

      }
    })
  },
  cancelOrder:function(_id){
    let that=this
      wx.showLoading({
        title: '取消中',
      })
      wx.cloud.callFunction({
        name: "manageOrder",
        data: {
          command: "updateStatus",
          "_id": _id,
          orderStatus:0//0表设取消
        },
        success(res) {
          console.log("更新订单状态成功", res)
          wx.showToast({
            title: '已取消',
          })
          //重新加载列表
          that.getOrderList();
        },
        fail(res) {
          console.log("更新订单状态失败", res)
          wx.showToast({
            title: '取消失败',
            icon:'none'
          })
        },
        complete(res) {
          wx.hideLoading()
        }
    })
  },
  //切换页面
  order_status:function(e){
    var current = e.currentTarget.dataset.current
    this.setData({
      currentTap:current
    })
    this.getOrderList()
  },
  /**
   * 订单详情页
   */
  gotoOrderDetail:function(e){
    wx.navigateTo({
      url: '/pages/order/order_detail/order_detail?orderid=' + e.currentTarget.dataset.id
    })
  }
})
