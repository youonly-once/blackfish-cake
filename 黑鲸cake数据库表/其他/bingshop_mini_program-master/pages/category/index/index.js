const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    categories: [],
    goods: [],
    toView:"v1",
    toGoodsView:"v1",
    selectCategory:'',
    scrollWithAnimation:true
  },

  onLoad: function (e) {
    wx.showLoading({
      title: '加载中'
    })

    this.getCategories();

  },

  selectCategory:function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      toView: 'v'+id,
      selectCategory:id,
      toGoodsView:'v1'
    })

    //获取分类商品
    http.get(`/category/${id}/goods`, {}, res => {
      let resData = res.data;
      this.setData({
        goods: resData.data
      })
    });
  },

  /**
   * 获取商品类目
   */
  getCategories:function(){
    http.get(`/categories`,{},res => {
      wx.hideLoading();
      this.setData({
        showGeMoreLoadin: false
      })
      let resData      = res.data;
      let categoryList = this.data.categories;
      resData.data.categories.map((item,index)=>{
        if(index == 0){
          //勾选tab
          this.setData({selectCategory:item.id})
        }
        categoryList.push(item);
      })

      this.setData({
        categories:categoryList,
        goods: resData.data.goods
      })
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "优卡",
      path: '/pages/index/index',
      imageUrl: '',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  /**
   * 查看商品详情
   */
  openGoodsDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/category/goods_detail/goods_detail?id='+id
    })
  }

})