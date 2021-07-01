const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    tabList: [{
      id: 0,
      title: '所有订单'
    }, {
      id: 1,
      title: '待付款'
    }, {
      id: 2,
      title: '已付款'
    }, {
      id: 3,
      title: '已完成'
    }],
    tabSelectedId: 0,
    orderList:[],
    // 分页功能
    FPage: {
      pageNum: 1,
      hasData: true,
      noContent: false,
      noContentImg: APP.imgs.noContentImg
    }
  },
  onLoad (options) {
    Paging.init({
      type:1,
      that:this,
      url:'drpOrderList',
      pushData:'orderList',
      getStr:'orders',
      getFunc: this.getOrderData
    })
    this.getOrderData(this.data.tabSelectedId)
  },
  getOrderData(status) {
    let data = status != 0 ? { order_status: status } : {}
    Paging.getPagesData({postData: data})
  },
  // 点击切换顶部的标签
  tabchange(e) {
    Paging.tabChange()
  },
  // 下拉刷新
  onPullDownRefresh () {
    Paging.refresh()
  },
  onReachBottom: function () {
    this.getOrderData(this.data.tabSelectedId)
  }

})