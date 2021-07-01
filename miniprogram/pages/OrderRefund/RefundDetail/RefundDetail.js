const app = getApp()
Page({
  data:{
    noContent:false,
    showContent:false
  },

  onLoad: function (options) {
    this.setData({
      isAdmin: app.globalData.isAdmin,
    })
    if(options.orderid==null){
      let orderInfors = wx.getStorageSync("orderInfors")
      if(orderInfors==''){
        console.log("null")
        this.setData({
          noContent:true
        })
      }else{
        this.setData({
          orderInfors: orderInfors,
          orderId: orderInfors._id,
          showContent:true
        })
        wx.removeStorageSync("orderInfors")
      }     
    }else{
      this.setData({
        orderId: options.orderid
      })
      wx.showLoading({
        title: '',
      })
      this.getorderInfors();
    }
    

 
    /*

    wx.showLoading({
      title: '加载中',
    })
    this.getorderInfors();*/
  },
  onReady: function () {
  
  },
  onPullDownRefresh(){
    
    this.getorderInfors()
  },
  // 图片预览
  previewImage(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    let refundImg = that.data.orderInfors.refundData.refundImg;
    wx.previewImage({
      current: refundImg[id],
      urls: refundImg,
    })
  },
  
  isRefundOrder: function (e) {
    let that = this
      wx.showModal({
        title: '提示',
        content: '请仔细确认退款金额，一旦发起退款将不能撤销',
        cancelText: '确认退款',
        confirmColor: '#FF0000',
        confirmText: '再考虑下',
        success(res) {
          if (res.cancel) {
            that.submitRefund()
          }
        }
      })
  },
  /**
   * 商家确认退款 更新订单信息
   * 生成顶大号
   */
  
  submitRefund(){
    let that = this
    if (!that.data.isAdmin) {
      wx.showToast({
        title: '非法访问',
        icon: 'none'
      })
      return
    }
    let id = that.data.orderInfors._id
    wx.showLoading({
      title: '退款中',
    })
    wx.cloud.callFunction({
      name: 'payment',
      data: {
        command: 'refundConfirm',
        _id: id,
      },
      success(res) {
        console.log("退款详情：", res);
        if (res.result != null && res.result.data != null && res.result.data.length > 0 && res.result.code == 'SUCCESS') {
          that.setData({
            orderInfors: res.result.data[0],
            noContent: false,
            showContent: true
          })
          that.selectComponent("#refund-status").queryRefund1()
        } else if (res.result.msg != null) {
          wx.showToast({
            title: res.result.msg,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: "退款失败，请稍后再试",
          })
        }
       
      },
      fail(res) {
        console.log("退款失败", res)
        wx.showToast({
          title: '退款失败，请稍后再试',
          icon: 'none'
        })
      },
      complete(res) {
       
        wx.hideLoading()
      }

    })
  },
  //订单详情页传递的信息
  getorderInfors: function () {
    let that = this
    wx.cloud.callFunction({
      name: 'manageOrder',
      data: {
        command: 'getSingle',
        _id: that.data.orderId,
      },
      success(res) {
        console.log("订单详情", res)
        if (res.result != null && res.result.data != null && res.result.data.length > 0) {
          that.setData({
            orderInfors: res.result.data[0],
            noContent: false,
            showContent: true
          })
          that.selectComponent("#refund-status").queryRefund1()

        } else {
          that.setData({
            noContent: true,
            showContent: false
          })
        }
      },
      fail(res) {
        that.setData({
          noContent: true,
          showContent: false
        })

      },
      complete(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        
      }
    })
  },
})