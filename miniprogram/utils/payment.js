/** 
   * 获取付款所需参数
   * */
function confirmPay(callback) {
  wx.showLoading({
    mask: true,
    title: '支付中',
  })
  wx.cloud.callFunction({
    name: "payment",
    data: {
      command: "pay", //付款
      orderId: callback.id
    },
    success(res) {
      
      console.log("云函数payment提交成功：", res)
      let data = res.result
      if (data == null || data.msg_code == null || data.msg_code == 'FAIL') {
        wx.hideLoading()
        wx.showToast({
          title: '支付失败：' + data.msg,
          icon: 'none',
        })
        callback.fail(res)
      } else {
         pay(res.result, callback)
        //改变销量数据
       
      }

    },
    fail(res) {
      wx.hideLoading()
      wx.showToast({
        title: '付款失败',
        icon: 'none',
      })
      callback.fail(res)
      console.log("云函数payment提交失败：", res)
    },
    complete: () => {

    }
  })
}
/**
 * 发起付款
 */

function pay(payData, callback) {
  wx.requestPayment({ //已经得到了5个参数
    timeStamp: payData.timeStamp_,
    nonceStr: payData.random,
    package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
    signType: payData._signType,
    paySign: payData.paySign_, //签名

    success(res) {
      wx.hideLoading()
      wx.showToast({
        title: '付款成功',
        icon: 'success',
      })
      console.log("支付成功：", res)
      //巧妙利用小程序支付成功后的回调，再次调用云函数，通知其支付成功，以便进行订单状态变更
      updaePayOK(callback)
      

    },
    fail(res) {
      wx.hideLoading()
      wx.showToast({
        title: '付款失败',
        icon: 'none',
      })
      callback.fail(res)
      console.log("支付失败：", res)
    },
    complete(res) {
      console.log("支付完成：", res)
    }
  })
}
function updaePayOK(callback) {
  wx.showLoading({
    mask: true,
    title: '更新订单状态',
  })
  wx.cloud.callFunction({
    name: "manageOrder",
    data: {
      command: "updateStatus",
      "_id": callback.id,
      orderStatus: 2
    },
    success(res) {
      /**
       * 整个订单 支付 更新状态成功
       */
      console.log("更新订单状态成功", res)
      callback.success(res)
      //跳转订单详情
    },
    fail(res) {
      console.log("更新订单状态失败", res)
      callback.updatePayOKFail(res)
    },
    complete(res) {
      wx.hideLoading()
    }
  })
}

module.exports = {
  confirmPay
}