const app = getApp();
const cart=require('../../utils/cart.js')
Page({
  onShareAppMessage() {
    return {
      title: 'scroll-view',
      path: 'page/component/pages/scroll-view/scroll-view'
    }
  },
  data:{
    swiperImgHei:'',
    swiperImgArrray:'',
    isShow:false
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    
    that.setData({//商品
        cakeIds: [{
          "_id": "rshprX44SssYA1kcXa0jI5SiAO5TRIFfQh854Df5tFRj3ZOR",
          "src": "cloud://bookcake-ne49u.626f-bookcake-ne49u-1301143327/home_image/cake2.jpg",
        },{
            "_id": "rshprX44SssYA1kcXa0jI5SiAO5TRIFfQh854Df5tFRj3ZOR",
            "src": "cloud://bookcake-ne49u.626f-bookcake-ne49u-1301143327/home_image/cake1.jpg",
          },
          {
            "_id": "rshprX44SssYA1kcXa0jI5SiAO5TRIFfQh854Df5tFRj3ZOR",
            "src": "cloud://bookcake-ne49u.626f-bookcake-ne49u-1301143327/home_image/cake3.jpg",
          },
          {
            "_id": "rshprX44SssYA1kcXa0jI5SiAO5TRIFfQh854Df5tFRj3ZOR",
            "src": "cloud://bookcake-ne49u.626f-bookcake-ne49u-1301143327/home_image/cake4.jpg",
          }, {
            "_id": "rshprX44SssYA1kcXa0jI5SiAO5TRIFfQh854Df5tFRj3ZOR",
            "src": "cloud://bookcake-ne49u.626f-bookcake-ne49u-1301143327/home_image/cake5.jpg",
          },],
    });
    this.getSwiperListImg()
   
  },
  onReady: function () {
  
    //console.log("onReady", "onReady")
    // Do something when page ready.
  },
  onShow:function(){
    if (app.globalData.flushCartNum == true) {
      cart.setCartNun()
      app.flushCartNum();
    }
  },
  onPullDownRefresh:function(){
    this.getSwiperListImg()
    
  },
  getSwiperListImg: function () {
    let that = this
    wx.cloud.callFunction({
      name: 'manageHomeimg',
      data: {
      },
      success(res) {
        that.setData({
          swiperImgArrray: res.result.data[0].swiper_img,
        })
        console.log("图片列表", res)
      },
      fail(res) {
        console.log("获取图片列表失败", res)
      },
      complete(res) {
       
        wx.stopPullDownRefresh()
      }
    })
  },
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px";
    //等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    //swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      swiperImgHei: swiperH,　//设置高度
      isShow:true　//绘制完成后再显示　　　
    })
    wx.hideLoading()
  },


  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    console.log(e)
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },

  /**
   * 查看轮播图片
   */
  seeSwiperAll: function (e) {
    //console.log("SSS", e.currentTarget.dataset.img);
    this.seePreviewImg( e.currentTarget.dataset.img)
  },

  /**
   * 预览图片
   * 
   * 无法显示本地图片！！！！！！！
   * 无法显示本地图片！！！！！！！
   * 无法显示本地图片！！！！！！！
   * 
   * @pd 0表示轮播图 、 1表示花色
   */
  seePreviewImg: function ( showImg) {
    var that = this;
    wx.previewImage({
      current: showImg, // 当前显示图片的http链接
      urls: that.data.swiperImgArrray // 需要预览的图片http链接列表
    })
  },
})
