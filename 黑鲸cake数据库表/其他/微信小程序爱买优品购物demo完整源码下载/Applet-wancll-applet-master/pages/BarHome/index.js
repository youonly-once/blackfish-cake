const APP = getApp();
import { getOtherData } from './data.js';
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    // 轮播参数
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,

    // 数据参数
    imgUrls: [],  // 轮播图片
    notice: {},   // 首页公告
    goods: [],    // 商品列表
    sellList: [], // 促销列表广告(5个圆形图片)
    discount: [], // 限时折扣活动列表
    full: [],     // 减免活动列表
    wapIndex: [], // 广告轮播产品
    timeDown: '0天 00 : 00 : 00', // 倒计时

    // 控制参数
    ready: false,  // 数据是否请求成功？

    // 分页功能
    FPage: {
      pageNum: 1,
      hasData: true,
      noContent: false,
      noContentImg: APP.imgs.noContentImg
    },
    // 售罄
    noStockImage: APP.imgs.noStock,
  },
  onLoad() {
    Paging.init({
      type:2,
      that:this,
      url:'goods',
      pushData:'goods',
      getFunc: this.getGoodsData
    })
    // 获取所有数据
    wx.showLoading({
      title: '加载中...',
    })
    let timer = setTimeout(() => {
      getOtherData(this);
      this.getGoodsData();
      clearTimeout(timer)
    }, 500)
  },
  // 获取商品数据
  getGoodsData(){
    let data = {goods_cate_id: ''}
    Paging.getPagesData({postData: data })
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    getOtherData(this);
    Paging.refresh()
  },
  // 上拉加载事件
  onReachBottom() {
    this.getGoodsData();
  },
  // 跳转到商品的详情页面 仅存在于商品列表模块
  goDetail(e) {
    let id = APP.utils.getDataSet(e, 'id');
    let param = APP.utils.paramsJoin({
      id: id
    })
    wx.navigateTo({
      url: `/pages/ComDetail/index?${param}`,
    })
  },
  // 跳转到商品的详情页面 仅存在于线上折扣
  goDetailDiscount(e) {
    let id = APP.utils.getDataSet(e, 'id');
    let discountid = APP.utils.getDataSet(e, 'discountid');
    let param = APP.utils.paramsJoin({
      id: id,
      discountid: discountid
    })
    wx.navigateTo({
      url: `/pages/ComDetail/index?${param}`,
    })
  },
  // 跳转到文章详情页面
  goArticle(e){
    let id = APP.utils.getDataSet(e, 'id');
    let type = APP.utils.getDataSet(e, 'type');    
    let param = APP.utils.paramsJoin({
      id: id,
      type: type
    })
    wx.navigateTo({
      url: `/pages/ComArticle/index?${param}`,
    })
  },
  // 去领券中心
  goDiscountCenter() {
    wx.navigateTo({
      url: `/pages/UserCouponCenter/index`,
    })
  },
  // 减满促销
  goCategory() {
    wx.switchTab({
      url: `/pages/BarCategory/index`,
    })
  },
  // 去搜索页面
  goSearchPage() {
    wx.navigateTo({
      url: '/pages/ComSearch/index',
    })
  },
  // 标签商品页
  goTagGoods(e) {
    let tag = APP.utils.getDataSet(e, 'tag');
    let param = APP.utils.paramsJoin({
      value: tag,
      type: 'tag'
    })
    wx.navigateTo({
      url: `/pages/ComGoodsList/index?${param}`,
    })
  },
  
  // 分享
  onShareAppMessage: function () {
    return {
      path: '/pages/BarHome/index'
    }
  }
})