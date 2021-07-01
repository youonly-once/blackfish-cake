const app = getApp()
const payment = require("../../../utils/payment.js")
const ORDER_CREATE = -1 //待创建
const ORDER_CANCEL = 0   //已取消，或无订单
const ORDER_SAVE = 1   //订单已保存 未付款
const ORDER_PAY = 2     //已付款
const ORDER_SEND = 3//已送货
const ORDER_RECEIVE = 4//已签收 待评价
const ORDER_Finish = 5//已完成 待评价
const ORDER_REFUND = 6//已申请退款
Page({
  data: {
    orderInfors: {},//保存的订单信息
    addrObject: {},//订单关联的收获地址
    orderStatusStr: '',
    orderId: null,//订单 数据库表的ID
    first:false,


  },
  onLoad: function (options) {
    wx.showLoading({
      title: '',
    })
    console.log("options.orderid", options.orderid)
    this.setData({
      orderId:options.orderid
    })

  },
  onShow:function(){
    wx.showLoading({
      title: '',
    })
    if(this.data.refresh){
      this.order_infor.getorderInfors()
    }
  },
  onReady: function () {
    console.log("onReady", "onReady")
    // Do something when page ready.
    this.order_infor = this.selectComponent("#order_infor")
    this.setData({
      refresh: true
    })
  },
  onPullDownRefresh:function(){
    this.order_infor.getorderInfors()
  },
/**
 * 子组件回调
 */
  getOrderInfor(orderInfors){
    //console.log('orderInfors', orderInfors)
    let detail = orderInfors.detail
    if (detail.length == 0) {

    } else {
      
      this.setData({
        orderInfors: detail[0],
        addrObject: detail[0].addrObject[0],
        
      })
      this.setOrderStatus()
    }
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  /**
   * 右下角按钮文字
   */
  setOrderStatus:function(){
    let orderStatusStr=''

    switch (this.data.orderInfors.status){
      case ORDER_SAVE:
        orderStatusStr='支付'
        break;
      case ORDER_PAY:

        orderStatusStr = '提醒商家'
        break;
      case ORDER_SEND:
        orderStatusStr = '签收'
        break;
      case ORDER_RECEIVE:
        orderStatusStr = '去评价'
        break;

    }
    this.setData({
      orderStatusStr: orderStatusStr
    })
  },
  checkOrderStatus: function () {

    switch (this.data.orderInfors.status) {
      case ORDER_SAVE://订单已经保存数据库 则发起付款
        this.paySubmit()
        break
      case ORDER_PAY://订单已经支付 且为配送方式 提醒商家发货
        if (this.data.orderInfors.deliverWay==1){
            //
        }
        break
      case ORDER_SEND://订单已经发货 签收
        this.confirmReceive()
        break
      case ORDER_RECEIVE://订单已经签收 去评价

        break
      default:
        
    }
  },
  paySubmit() {
    let that = this
    payment.confirmPay({
      id: that.data.orderId,
      success(res) {
        console.log('success:' + res)
        that.order_infor.getorderInfors()
      },
      fail(res) {
        console.log('fail:' + res)
      },
      updatePayOKFail(res) {
        wx.showModal({
          title: '提示',
          content: '刷新订单出现问题，请联系客服',
        })
      }
    })
  },
  /**
   * 签收
   */
  confirmReceive: function (){
    wx.showLoading({
      title: '',
    })
    let that=this
    wx.cloud.callFunction({
      name:'manageOrder',
      data: {
        command:'confirmReceive',
        _id: that.data.orderId,
      },
      success(res){
        that.order_infor.getorderInfors()
      },
      fail(res){
        wx.hideLoading()
        wx.showToast({
          title: '签收失败,请重试',
          icon:'none',
        })
        console.log(res)
      }
    })
  }
 
})