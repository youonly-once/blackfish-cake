const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    custsUser: [],
    user: {},
    // 分页功能
    FPage: {
      pageNum: 1,
      hasData: true,
      noContent: false,
      noContentImg: APP.imgs.noContentImg
    }
  },
  onLoad: function (options) {
    this.setData({
      user: wx.getStorageSync('user')
    })
    Paging.init({
      type:2,
      that:this,
      url:'drpChildUser',
      pushData:'custsUser',
      getFunc: this.getOrderData
    })
    this.getOrderData()
  },
  getOrderData() {
    Paging.getPagesData()
  },
  onPullDownRefresh () {
    Paging.refresh()
  },
  onReachBottom () {
    this.getOrderData()
  }
})