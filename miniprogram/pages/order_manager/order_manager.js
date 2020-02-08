//index.js
//获取应用实例
const app = getApp()
const ORDER_CREATE = -1 //待创建 购物车
const ORDER_CANCEL = 0 //已取消，或无订单
const ORDER_SAVE = 1 //订单已保存 未付款
const ORDER_PAY = 2 //已付款
const ORDER_SEND = 3 //已送货 或者是已自提
const ORDER_RECEIVE = 4 //已签收 待评价
const ORDER_Finish = 5 //已完成 
Page({
  data: {
    currentTap:0,//当前页面
    orderList:[],
    currentPage:0,
    noMore:false,
  
  },
  onLoad: function (options) {
    this.getOrderList()
  },
  onShow:function(){
    
  },
  //用户下拉
  onPullDownRefresh: function () {
    this.setData({
      currentPage: 0,
      noMore: false,
    })
    this.getOrderList();
  wx.stopPullDownRefresh();
  },
  //用户上拉
  onReachBottom:function(){
    if (this.data.noMore) {
      return;
    }
    this.getOrderList(true)
  },
  getOrderList: function (reach){
    let that=this
    if (!reach) {
      wx.showLoading({
        mask: true,
        title: '加载中',
      })
    }
    
    wx.cloud.callFunction({
      name:'manageOrder',
      data:{
        pageNum: that.data.currentPage,
        command:'get_Manager',
        _orderStatus: that.data.currentTap
      },
      success(res){
        //一页显示5条
        if (res.result.data.length<5){
          that.setData({
            noMore:true
          })
        }
        if (res.result.data.length>0){
            if (that.data.currentPage == 0) {
              that.setData({
                orderList: res.result.data,
                currentPage: that.data.currentPage + 1
              })
            } else{that.setData({
              orderList: that.data.orderList.concat(res.result.data),
              currentPage: that.data.currentPage + 1
            })
          } 
        } else {
          that.setData({
            orderList: [],
          })
        }
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
      mask: true,
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
      currentTap:current,
      currentPage: 0,
      noMore:false,
    })
    this.getOrderList()
  },
  /**
   * 订单详情页
   */
  gotoOrderDetail:function(e){
    wx.navigateTo({
      url: '/pages/order_manager/order_detail_manager/order_detail_manager?orderid=' + e.currentTarget.dataset.id
    })
  }
})
