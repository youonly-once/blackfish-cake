const app = getApp()

Page({
  data:{
    
  },

  onLoad: function (options) {
    this.setData({
      isAdmin: app.globalData.isAdmin
    })
    let orderInfors = wx.getStorageSync("orderInfors")
    this.setData({
      orderInfors: orderInfors
    })
    wx.removeStorageSync("orderInfors")
    /*

    wx.showLoading({
      title: '加载中',
    })
    this.getorderInfors();*/
  },
  onReady: function () {

    console.log("Ready", "Ready")
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
  /**
   * 商家确认退款 更新订单信息
   */
  confirmRefund(){
    let that = this
    if(!that.data.isAdmin){
      wx.showToast({
        title: '非法访问',
        icon:'none'
      })
      return
    }
    let id = that.data.orderInfors._id
    if(id==null || id==undefined){
      wx.showToast({
        title: '系统错误',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '退款中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'manageOrder',
      data: {
        command: 'refundConfirm',
        _id: id ,
      },
      success(res){
        that.submitRefund(id)
        console.log(res)
      },
      fail(res){
        console.log(res)
        wx.hideLoading()
      },
      complete(res){
        
      }
      
    })
  },
  //提交付款
  submitRefund(id){
    let that=this
    wx.cloud.callFunction({
      name: 'payment',
      data: {
        command: 'refund',
        _id: id,
      },
      success(res) {
        if (res.result.code=='SUCCESS'){
          that.getorderInfors()
        } else if (res.result.code == 'FAIL') {
          wx.hideLoading()
          wx.showToast({
            title: '退款失败,'+res.result.msg,
            icon:'none'
          })
        }
        console.log(res)
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '退款失败，请稍后再试',
          icon: 'none'
        })
        console.log(res)

      },
      complete(res) {
       
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
        _id: that.data.orderInfors._id
      },
      success(res) {
        console.log("orderInfors", res);
        that.setData({
          orderInfors: res.result.data[0]
        })
      },
      fail(res) {

      },
      complete(res) {
        wx.hideLoading()
      }
    })
  },
})