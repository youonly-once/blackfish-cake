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
    score: 0,
    commentTexts: ''
  },
  onLoad: function (options) {
    // 获取本地存储的订单列表
    APP.utils.getOrderById(options.orderId, (res) => {
      let goodsList = res.order_goods_info
      this.setData({
        orderId: options.orderId,
      }, () => {
        let goodsInfo = APP.utils.getGoodsById(goodsList, options.goodsId)
        this.setData({
          goodsInfo: goodsInfo
        })
      })
    })
  },
  // 添加图片
  addImage() {
    let paths = this.data.tempFilePaths;
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        let path = res.tempFilePaths
        path.forEach((item, index) => {
          if (paths.length < 4) {
            paths.push(item)
          }
        })
        this.setData({
          tempFilePaths: paths
        }, () => {
          console.log(this.data.tempFilePaths)
        })
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
    this.setData({
      tempFilePaths: arr
    }, () => {
      console.log(this.data.tempFilePaths)
    })
  },
  // 输入绑定
  textareaInput(e) {
    this.setData({
      commentTexts: e.detail.value
    })
  },
  // 点星星
  canesll() {
    this.setData({
      score: 0
    })
  },
  star(e) {
    let n = APP.utils.getDataSet(e, 'n');
    console.log(n)
    this.setData({
      score: n
    })
  },
  // 发送评价
  send() {
    if (!this.data.commentTexts) {
      wx.showToast({
        title: '输入评价内容',
        icon: 'none',
      })
      return
    }
    if (!this.data.score) {
      wx.showToast({
        title: '评个分吧！',
        icon: 'none',
      })
      return
    }
    if(this.data.tempFilePaths.length){
      let i = 0;
      let imgs = [];
      wx.showLoading({
        title: '图片上传中',
      })
      this.uploadDIY(i, imgs);
    }else{
      this.uploadData([])
    }
    
  },
  // 上传数据
  uploadData(imgs) {
    APP.ajax({
      url: APP.api.orderComments,
      data: {
        content: this.data.commentTexts,
        goods_id: this.data.goodsInfo.goods_id,
        imgs: imgs,
        order_id: this.data.goodsInfo.order_id,
        score: this.data.score,
        status: 1
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
              wx.navigateTo({
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

  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})