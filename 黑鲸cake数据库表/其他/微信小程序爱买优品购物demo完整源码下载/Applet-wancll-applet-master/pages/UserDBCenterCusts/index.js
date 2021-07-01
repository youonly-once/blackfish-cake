const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    user: {},
    // 分页数据
    custsUser: [],
    // 分页功能
    FPage: {
      pageNum: 1,
      hasData: true,
      noContent: false,
      noContentImg: APP.imgs.noContentImg
    }
  },
  // 初始化
  onLoad: function (options) {
    this.setData({
      user: wx.getStorageSync('user')
    })
    Paging.init({
      type:2,
      that:this,
      url:'bonusChildUser',
      pushData:'custsUser',
      getFunc: this.getOrderData
    })
    this.getOrderData()
  },
  // 获取分页数据
  getOrderData() {
    Paging.getPagesData()
  },
  // 下拉刷新
  onPullDownRefresh() {
    Paging.refresh()
  },
  // 上拉加载
  onReachBottom() {
    this.getOrderData()
  }
})