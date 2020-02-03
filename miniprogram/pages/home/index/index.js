const http = require("./../../../utils/http.js");
const cart = require("./../../../utils/cart.js");
const app = getApp();

const images = [
  "http://article.qiuhuiyi.cn/hui_yi_15532398760009200",
  "http://article.qiuhuiyi.cn/hui_yi_15532398790002956"
]

Page({

  data: {
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    filter:'',
    showAuth: false,
    showGeMoreLoadin:false,
    notDataTips:false,
    attachments: images,
    goodsList: []
  },

  onLoad: function (options) {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            showAuth: true
          });
        } else {
          //已授权
          //获取商品列表
          that.getGoods();
        }
      }
    })
  },

  onReady(){
    cart.setCartBadge();
  },

  /**
   * 获取商品列表
   */
  getGoods:function(){
    http.get(`/goods?page_size=${this.data.pageSize}&page_number=${this.data.pageNumber}&filter=${this.data.filter}`, {}, res => {
      this.setData({ showGeMoreLoadin:false});
      let resData = res.data;
      if(resData.code == 0){
        let goods = resData.data.page_data;
        if (goods){
          let goodsList = this.data.goodsList;
          goods.map(item => {
            goodsList.push(item);
          })
          this.setData({
            goodsList: goodsList,
            pageNumber: this.data.pageNumber + 1,
            notDataTips:goods.length>=0?true:false
          })
        }
      }
    });
  },

  /**
   * 查看商品详情
   */
  openGoodsDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/category/goods_detail/goods_detail?id=' + id
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    this.setData({
      showGeMoreLoadin: true
    });
    this.getGoods();
  },

  /**
   * 搜索商品
   */
  search:function(){

  },

  /**
 * 检测用户授权
 */
  checkoutAuth: function () {
    let theUrl = '/pages/home/coupon_detail/coupon_detail?id=' + this.data.detailId + '&user_id=' +            this.data.userId;
    let that   = this;
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          console.log("弹出授权弹窗")
          this.setData({
            showAuth: true
          });
        } else {
          
        }
      }
    })
  },


  /**
 * 监听用户点击授权按钮
 */
  getAuthUserInfo: function (data) {
    this.setData({ showAuth: false });
    http.login(null, null, null, res => {
      //获取商品列表
      this.getGoods();
    });
  },
})