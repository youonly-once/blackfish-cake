//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: null,
    baseUrl:"https://wx.yogalt.com/",
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    list:[],
    page:1,
  },
  onPullDownRefresh(){
    this.getCakeList()
  },
  getCakeList: function () {
    let that=this
    wx.cloud.callFunction({
      name: 'manageCake',
      data:({
        command:'getIndexList',
      }),

      success(res){
        console.log("index list:",res)
        let result = res.result
        if (result == null || result.data == 0 || result.swiperImg.length==0){
          that.setData({
            noContent: true,
            isShow: false,
          })
        }else{
          that.setData({
            cakeList: result.data,
            swiperImg: result.swiperImg,
            noContent: false,
          })
        }
        wx.hideLoading()
      },
      fail(res){
        console.log("index list:", res)
        that.setData({
          noContent: true,
          isShow:false
        })
        wx.hideLoading()
      
      },
      complete(res){
        wx.stopPullDownRefresh()
      }
    })
  },

  lower:function(e){
    console.log("XXX",e)
   // this.getCakeList()
  },
  onLoad: function () {
    wx.showLoading({
      title: '',
    })
    this.getCakeList()
    /*
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }*/
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
 * 查看轮播图片
 */
  seeSwiperAll: function (e) {
    //console.log("SSS", e.currentTarget.dataset.img);
    if (this.data.swiperImg.length <= 0) {
      return
    }
    this.seePreviewImg(e.currentTarget.dataset.img)
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
  seePreviewImg: function (showImg) {

    var that = this;
    wx.previewImage({
      current: showImg, // 当前显示图片的http链接
      urls: that.data.swiperImg // 需要预览的图片http链接列表
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
      isShow: true　//绘制完成后再显示　　　
    })
    wx.hideLoading()
  },
})
