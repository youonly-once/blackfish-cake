const APP = getApp();
import {
  headers,
  imageHost
} from '../../api/config.js';
Page({
  data: {
    orderId: 0,
    goodsInfo: {},
    tempFilePaths: [],
    refoundTexts: ''
  },
  onLoad(options) {
    // 获取本地存储的订单列表
    APP.utils.getOrderById(options.orderId, (res) => {
      let goodsList = res.order_goods_info
      this.setData({
        orderId: options.orderId,
      }, () => {
        let goodsInfo = APP.utils.getGoodsById(goodsList, options.goodsId)
        this.setData({ goodsInfo: goodsInfo })
      })
    })

  },
  // 输入绑定
  textareaInput(e) {
    this.setData({
      refoundTexts: e.detail.value
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
    let id = APP.utils.getDataSet(e, 'id')
    let that = this
    wx.previewImage({
      current: that.data.tempFilePaths[id],
      urls: that.data.tempFilePaths,
    })
  },
  // 删除预览图片
  deleltImage(e) {
    let id = APP.utils.getDataSet(e, 'id')
    let arr = this.data.tempFilePaths
    arr.splice(id, 1);
    this.setData({ tempFilePaths: arr })
  },
  // 退款 
  send() {
    let that = this;
    if (!that.data.refoundTexts) {
      wx.showToast({
        title: '输入退款原因',
        icon: 'none',
      })
      return
    }
    // 添加了图片的时候
    if(that.data.tempFilePaths.length){
      let i = 0;
      let imgs = [];
      wx.showLoading({
        title: '图片上传中',
      })
      this.uploadDIY(i, imgs);
    }else{
      this.uploadData([]);
    }
  },
  // 上传数据
  uploadData(imgs) {
    APP.ajax({
      url: APP.api.orderRefound,
      data: {
        order_id: Number(this.data.orderId),
        order_goods_id: this.data.goodsInfo.id,
        imgs: imgs,
        return_reason: this.data.refoundTexts,
        return_type: 1
      },
      success: res => {
        if(this.data.tempFilePaths.length){
          wx.hideLoading();
        }
        wx.showToast({
          title: res.msg,
          icon: 'none',
          success: () => {
            let params = APP.utils.paramsJoin({
              target: wx.getStorageSync('thisOrderList')
            })
            setTimeout(() => {
              wx.redirectTo({
                url: `/pages/UserOrderList/index?${params}`,
              })
            }, 1000)
          }
        })
      }
    })
  },
  // 上传图片
  uploadDIY(i, imgs) {
    wx.uploadFile({
      url: APP.api.uploadFile,
      filePath: this.data.tempFilePaths[i],
      header: {
        'auth': headers.auth,
        'client-type': headers.clientType,
        'token': wx.getStorageSync('token').token,
      },
      formData: {
        save_path: 'public/upload/applet/'
      },
      name: 'file',
      success: res => {
        imgs.push(imageHost.appletUploadImages + JSON.parse(res.data).data.file_name)
        if (i == this.data.tempFilePaths.length - 1) {
          this.uploadData(imgs)
        } else {
          i++;
          // console.log(imgs)
          this.uploadDIY(i, imgs);
          // console.log('上传第',i,'个')
        }
      },
      fail: e => {
        console.log(e)
      }
    });
  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  onShareAppMessage() {

  }
})