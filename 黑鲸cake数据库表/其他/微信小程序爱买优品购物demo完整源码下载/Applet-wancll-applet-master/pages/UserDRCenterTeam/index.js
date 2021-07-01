const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    tabList: [{
      id: 1,
      title: '一级'
    }, {
      id: 2,
      title: '二级'
    }, {
      id: 3,
      title: '三级'
    }],
    tabSelectedId: 1,
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
  onLoad (options) {
    this.setData({
      user:wx.getStorageSync('user')
    })
    Paging.init({
      type:1,
      that:this,
      url:'drpTeamUser',
      pushData:'teamUsers',
      getStr:'team_users',
      getFunc: this.getOrderData
    })
    this.getOrderData(this.data.tabSelectedId)
  },
  getOrderData(id) {
    Paging.getPagesData({postData: {team_type:id}})
  },
  // 点击切换顶部的标签
  tabchange() {
    Paging.tabChange()
  },
  onPullDownRefresh () {
    Paging.refresh()
  },
  onReachBottom () {
    this.getOrderData(this.data.tabSelectedId)
  }
})