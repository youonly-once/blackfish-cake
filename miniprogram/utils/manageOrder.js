

//更新订单状态
const updaeOrderStatus= function () {
  let that = this;
  if (that.data.orderId == null || that.data.orderId == undefined) {
    wx.showToast({
      title: '付款失败',
      icon: 'none'
    })
    return
  }
  wx.showLoading({
    title: '更新订单状态',
  })
  wx.cloud.callFunction({
    name: "manageOrder",
    data: {
      command: "updateStatus",
      "_id": that.data.orderId,
      
    },
    success(res) {
      /**
       * 整个订单 支付 更新状态成功
       */
      console.log("更新订单状态成功", res)

      //关闭当前页面 跳转到订单详情页
      wx.redirectTo({
        url: '../../order/order'
      })
      //跳转订单详情
    },
    fail(res) {
      console.log("更新订单状态失败", res)
      that.setData({
        orderStatusStr: '更新订单状态',//用户点击按钮时就 重新更新

      })
    },
    complete(res) {
      wx.hideLoading()
    }
  })
}