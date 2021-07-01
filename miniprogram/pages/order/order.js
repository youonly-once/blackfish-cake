//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    first:true,
  
  },

  onLoad: function (options) {
    //初始打开哪个tap
    if (options.orderstatus != null && options.orderstatus!=undefined && options.orderstatus != "undefined"){
      this.setData({ 
        currentTap: options.orderstatus
      })
    }
    this.selectComponent("#order-list").refresh(this.data.currentTap)
    console.log("currentTap:", this.data.currentTap)
    
    //this.getOrderList()
  },
  onShow(){
    //非第一次 显示时
    if(!this.data.first){
      //暂时不刷新//this.selectComponent("#order-list").refresh()
    }
  },
  onReady(){
    this.setData({
      first:false
    })
  },
  //用户下拉
  onPullDownRefresh: function () {
    this.selectComponent("#order-list").refresh()
   // wx.stopPullDownRefresh();
  },
  //用户上拉
  onReachBottom:function(){
    this.selectComponent("#order-list").getOrderList(true)
  },
  loadingSuccess:function(){
    console.log("组件加载数据库完成")
    wx.stopPullDownRefresh()
    //防止重复点击tab
    this.setData({
      switchTab:false
    })
  },
  
  onHide(){
   
  },
  onUnload(){

  },
  
  //切换页面
  order_status:function(e){
    if(this.data.switchTab){//防止重复点击
      return
    }
    this.setData({
      currentTap: e.currentTarget.dataset.current,
      switchTab:true
    })
    this.selectComponent("#order-list").refresh(e.currentTarget.dataset.current)
    
  },
 
})
