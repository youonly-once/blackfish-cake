const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    tabList: [{
      id: 0,
      title: '全部'
    }, {
      id: 1,
      title: '待审核'
    }, {
      id: 2,
      title: '未通过审核'
    }, {
      id: 3,
      title: '已打款'
    }],
    tabSelectedId: 0,
    dbList: [],
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
    Paging.init({
      type:1,
      that:this,
      url:'bonusApplysList',
      pushData:'dbList',
      getStr:'applys',
      getFunc: this.getOrderData
    })
    this.getOrderData(this.data.tabSelectedId)
  },
  // 上拉加载
  onReachBottom() {
    this.getOrderData(this.data.tabSelectedId)
  },
  // 下拉刷新
  onPullDownRefresh() {
    Paging.refresh()
  },
  // 获取分页数据
  getOrderData(status) {
    let data = status != 0 ? { status: status } : {}
    Paging.getPagesData({postData: data})
  },
  // 点击切换顶部的标签
  tabchange() {
    Paging.tabChange()
  },
  // 进入详情
  goDetailInfo(e) {
    let id = APP.utils.getDataSet(e, 'id');
    wx.navigateTo({
      url: `/pages/UserDBCenterDetailInfo/index?id=${id}`,
    })
  }
})