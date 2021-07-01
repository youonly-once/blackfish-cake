const APP = getApp();
Page({
  data: {
    // 轮播参数
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    imgUrls: [], // 轮播图片
    coupon: [],
  },

  onLoad(options) {
    this.getBanners();
    this.getCoupons()
  },

  getBanners() {
    APP.ajax({
      url: APP.api.indexBanners,
      data: { type: "wap领券中心轮播" },
      success: (res) => {
        this.setData({ imgUrls: res.data })
      }
    })
  },
  getCoupons() {
    APP.ajax({
      url: APP.api.myDiscountCoupon,
      data: {},
      success: res => {
        res.data.forEach(item => {
          item.bg_img = APP.imgs.couponGet;
          item.change_value = parseFloat(item.change_value)
        });
        // console.log(res.data)
        this.setData({ coupon: res.data })
      }
    })
  },
  draw(e) {
    let id = APP.utils.getDataSet(e, 'id');
    APP.ajax({
      url: APP.api.myDiscountCouponSave,
      data: { activity_coupon_id: id },
      success(res) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.setData({
      imgUrls: [], 
      coupon: [],
    },()=>{
      this.getBanners()
      this.getCoupons()
    })
  }
})