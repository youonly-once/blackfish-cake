//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //orderId:'d68532785e39e0080a5ec00436b5fca4',
    tempFilePaths: [],
    reasons:['选择原因','蛋糕损坏'],
    curReasonIndex:0,
    refundPrice:0,
    detailReason:'',
    uploadSuccessImg:[],
    detailReasonCount: 0,
    detailReasonColor: 'rgba(0,0,0,.3)',
  },

  onLoad: function (options) {
    this.setData({
      orderInfors: wx.getStorageSync("orderInfors")
    })
    wx.removeStorageSync("orderInfors")
      /*
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      orderId: options.orderid
    })
    this.getorderInfors();*/

  },
  onReady: function () {

    console.log("Ready", "Ready")
  },
  
  bindReasonChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    this.setData({
      curReasonIndex: e.detail.value
    })
  },

  bindRefundPrice: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    this.setData({
      refundPrice: parseFloat(e.detail.value)
    })
  },
  bindDetailReason: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    let len = e.detail.value.length;
    let color ='rgba(0,0,0,.3)'
    if(len>50){
      color='red'
    }else if(len>0){
      color = 'green'
    }
    this.setData({
      detailReason: e.detail.value,
      detailReasonCount: len,
      detailReasonColor: color,
    })
  },
  // 添加图片
  addImage() {
    let that = this;
    let paths = this.data.tempFilePaths;
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let path = res.tempFilePaths
        path.forEach((item, index) => {
          if (paths.length < 4) {
            paths.push(item)
          }
        })
        that.setData({ tempFilePaths: paths })
      }
    })
  },
  // 图片预览
  previewImage(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    wx.previewImage({
      current: that.data.tempFilePaths[id],
      urls: that.data.tempFilePaths,
    })
  },
  // 删除预览图片
  deleltImage(e) {
    let id = e.currentTarget.dataset.id
    let arr = this.data.tempFilePaths
    arr.splice(id, 1);
    this.setData({ tempFilePaths: arr })
  },
  submitCheckInfor(){
    let that = this
    let data = that.data;
    if (data.refundPrice<=0) {
      wx.showToast({
        title: '请输入正确的退款金额',
        icon: 'none'
      })
      return
    }
    if (data.refundPrice*100>data.orderInfors.payPrice) {
      wx.showToast({
        title: '退款金额不能大于商品金额',
        icon: 'none'
      })
      return
    }
    if (data.curReasonIndex <= 0) {
      wx.showToast({
        title: '请选择退款原因',
        icon:'none'
      })
      return
    } 
    if (data.detailReason.length<=0) {
      wx.showToast({
        title: '请输入详细原因',
        icon: 'none'
      })
      return
    }
    if (data.tempFilePaths.length <= 0) {
      wx.showToast({
        title: '请上传相关图片',
        icon: 'none'
      })
      return
    }
    that.uploadImg()


  },
  uploadImg(){
    wx.showLoading({
      title: '提交中',
      mask:true
    })
    let that=this
    let uploadSuccessImg = that.data.uploadSuccessImg
    let ext='.jpg'
    for(let i=0;i<that.data.tempFilePaths.length;i++){
      let path = that.data.tempFilePaths[i]
      ext = path.substring(path.length - 5, path.length)
      wx.cloud.uploadFile({
        cloudPath: 'refund_image/' + app.globalData.openid + '/' + that.data.orderInfors._id + ext, // 上传至云端的路径
        filePath: path, // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          console.log(res.fileID)
          uploadSuccessImg[i] = res.fileID
          that.setData({
            uploadSuccessImg: uploadSuccessImg
          })
          if (i == that.data.tempFilePaths.length-1){
            that.submitRefund() 
          }
          
        },
        fail(res) {
          console.log(res)
          wx.hideLoading()
        }
        
      })
    }
  },
 submitRefund(){
   let that=this
   if (that.data.uploadSuccessImg.length != that.data.tempFilePaths.length){
     wx.hideLoading()
     wx.showToast({
       title: '图片上传失败',
       icon: 'none'
     })
     wx.cloud.deleteFile({
       fileList: that.data.uploadSuccessImg,
       success: res => {
         // handle success
         console.log(res.fileList)
       },
       fail: console.error
     })
     return
   }
   let refundData= {
     reason: that.data.reasons[that.data.curReasonIndex],
     refundPrice: that.data.refundPrice,
     detailReason: that.data.detailReason,
     refundImg: that.data.uploadSuccessImg
   }
   wx.cloud.callFunction({
     name: 'manageOrder',
     data: {
       command: 'refund',
       _id: that.data.orderInfors._id,
       refundData: refundData
     },
     success(res) {
       console.log("orderInfors", res);
       wx.hideLoading()
       let orderInfors = that.data.orderInfors
       orderInfors.refundData=refundData
       wx.setStorageSync("orderInfors", orderInfors)
       wx.redirectTo({
         url: '/pages/order_refund/refund_detail/refund_detail',
       })
     },
     fail(res) {
       console.log("加载失败", res)
       wx.hideLoading()

     },
     complete(res) {

     }
   })

 }
})
