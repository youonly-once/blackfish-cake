//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    currentTap:0,//当前页面
    orderList:[],
    currentPage: 0,
    noMore: false,
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
    this.setData({
      currentPage: 0,
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
    if (!reach){
      wx.showLoading({
        mask: true,
        title: '加载中',
      })
    }

    wx.cloud.callFunction({
      name:'manageOrder',
      data:{
        command:'get',
        pageNum: that.data.currentPage,
        _orderStatus: that.data.currentTap
      },
      success(res){
        //一页显示5条
        if (res.result.data.length < 5) {
          that.setData({
            noMore: true
          })
        }
        if (res.result.data.length > 0) {
          if (that.data.currentPage == 0) {
            that.setData({
              orderList: res.result.data,
              currentPage: that.data.currentPage + 1
            })
          } else {
            that.setData({
              orderList: that.data.orderList.concat(res.result.data),
              currentPage: that.data.currentPage + 1
            })
          }
        }else{
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
    let status=e.currentTarget.dataset.status
    if (status==1){//未付款取消订单
      wx.showModal({
        title: '提示',
        content: '订单还未付款，确定取消吗',
        cancelText: '取消订单',
        confirmColor: '#FF0000',
        confirmText: '再考虑下',
        success(res) {
          if (res.cancel) {
            that.cancelOrder(e.currentTarget.dataset.id)
          }

        },
        fail(res) {

        },
        complete(res) {

        }
      })
    } /*else if (status >=2 && status<6) {//已付款，申请退款
        wx.navigateTo({
          url: '/pages/order_refund/order_refund?orderid=' + e.currentTarget.dataset.id,
        })
    } else if (status==6){//查看退款详情
      
    }
     */
  },
  cancelOrder:function(_id){
    let that=this
    wx.showLoading({
      mask: true,
        mask:true,
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
            mask: true,
            title: '已取消',
          })
          //重新加载列表
          that.getOrderList();
        },
        fail(res) {
          console.log("更新订单状态失败", res)
          wx.showToast({
            mask: true,
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
