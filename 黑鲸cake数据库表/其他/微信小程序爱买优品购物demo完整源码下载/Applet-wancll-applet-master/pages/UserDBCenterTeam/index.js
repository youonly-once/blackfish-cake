const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    teamUsers:[],
    user:{},
    // 分页功能
    FPage: {
      pageNum: 1,
      hasData: true,
      noContent: false,
      noContentImg: APP.imgs.noContentImg
    }
  },
  onLoad(options) {
    this.setData({
      user:wx.getStorageSync('user')
    })
    Paging.init({
      type: 1,
      that: this,
      url: 'bonusTeamUser',
      pushData: 'teamUsers',
      getStr: 'team_users',
      getFunc: this.getOrderData
    })
    this.getOrderData()
  },
  getOrderData() {
    Paging.getPagesData()
  },
  onPullDownRefresh() {
    Paging.refresh()
  },
  onReachBottom() {
    this.getOrderData()
  }
})