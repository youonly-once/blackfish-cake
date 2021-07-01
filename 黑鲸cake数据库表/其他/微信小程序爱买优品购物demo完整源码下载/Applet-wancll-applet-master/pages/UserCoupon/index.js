const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    tabList: [{
      id: 1,
      title: '未使用'
    }, {
      id: 2,
      title: '已使用'
    }, {
      id: 3,
      title: '已过期'
    }],
    tabSelectedId: 1,
    discountList: [],
    enterConvert: '',
    // 分页功能
    FPage: {
      pageNum: 1,
      hasData: true,
      noContent: false,
      noContentImg: APP.imgs.noContentImg
    }
  },
  onLoad(options) {
    Paging.init({
      type: 2,
      that: this,
      url: 'myDiscount',
      pushData: 'discountList',
      getFunc: this.getList
    })
    this.getList(this.data.tabSelectedId);
  },
  getList(status) {
    let data = {}
    if (status == 3) {
      data = { expiry_time: "" }
    } else {
      data = { status: status }
    }
    Paging.getPagesData({
      postData: data,
      handler: (data) => {
        data.forEach(item => {
          if (!item.is_expiry && item.status != 2) {
            item.bg_img = APP.imgs.coupon
          } else {
            item.bg_img = APP.imgs.couponPass
          }
          item.change_value = parseFloat(item.change_value)
        });
        return data;
      }
    })
  },
  tabchange() {
    Paging.tabChange()
  },
  // 显示刷新
  onShow() {
    Paging.refresh()
  },
  // 下拉刷新
  onPullDownRefresh() {
    Paging.refresh()
  },
  // 上拉加载
  onReachBottom() {
    this.getList(this.data.tabSelectedId);
  },
  enterConvert(e) {
    this.setData({
      enterConvert: e.detail.value
    })
  },
  goCenter() {
    wx.navigateTo({ url: `/pages/UserCouponCenter/index` })
  },
  convert() {
    if (!this.data.enterConvert) {
      wx.showToast({
        title: '输入兑换码',
        icon: 'none',
      })
      return
    }
    APP.ajax({
      url: APP.api.myDiscountReceive,
      data: {
        coupon_no: this.data.enterConvert
      },
      success:(res)=> {
        wx.showToast({
          title: res.msg,
          icon: 'none',
        })
        setTimeout(() => {
          this.getList(this.data.tabSelectedId)
        }, 1000)
      }
    })
  },
  goBuy() {
    wx.switchTab({ url: `/pages/BarCategory/index` })
  },

  
})