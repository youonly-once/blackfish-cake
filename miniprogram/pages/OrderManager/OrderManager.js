//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    /*currentTap:0,//当前页面
    orderList:[],
    currentPage:0,//当前第几页
    noMore:false,
    isNoContent:false,
    paymentCountdown: [],//付款倒计时,
    intervalArray: [],*///倒计时定时器
    currentTap: 0,
    first: true,
  
  },
  onLoad: function (options) {
    /*this.getOrderList()*/
    this.selectComponent("#order-list").refresh(this.data.currentTap)
  },
  onShow() {
    /*
    this.setData({
      currentPage: 0
    })
    if (!this.data.first) {
      this.getOrderList()
    }*/
    if (!this.data.first) {
      //暂时不刷新//this.selectComponent("#order-list").refresh()
    }
  },
  onReady() {
    this.setData({
      first: false
    })
  },
  //用户下拉
  onPullDownRefresh: function () {
    /*this.setData({
      currentPage: 0,
    })
    this.getOrderList();*/

    this.selectComponent("#order-list").refresh()
    //wx.stopPullDownRefresh();
  },
  //用户上拉
  onReachBottom:function(){
    /*if (this.data.noMore) {
      return;
    }
    this.getOrderList(true)*/
    this.selectComponent("#order-list").getOrderList(true)
  },

  //切换页面
  order_status:function(e){
    /*this.setData({
      currentTap: e.currentTarget.dataset.current,
      currentPage: 0,
    })
    this.getOrderList()*/
    if (this.data.switchTab) {//防止重复点击
      return
    }
    this.setData({
      currentTap: e.currentTarget.dataset.current,
      switchTab:true
    })
    this.selectComponent("#order-list").refresh(e.currentTarget.dataset.current)
  },
  loadingSuccess: function () {
    console.log("组件加载数据库完成")
    wx.stopPullDownRefresh()
    //防止重复点击tab
    this.setData({
      switchTab: false
    })
  },
  
})
