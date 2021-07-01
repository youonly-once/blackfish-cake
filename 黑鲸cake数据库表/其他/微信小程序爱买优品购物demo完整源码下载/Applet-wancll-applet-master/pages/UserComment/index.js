const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    goodsComments: [],
    // 分页功能
    FPage: {
      pageNum: 1,
      hasData: true,
      noContent: false,
      noContentImg: APP.imgs.noContentImg
    }
  },
  onLoad(options) {
    Paging.init({
      type: 2,
      that: this,
      url: 'itemComments',
      pushData: 'goodsComments',
      getFunc: this.getData
    })
    this.getData();
  },
  getData() {
    Paging.getPagesData()
  },
  onPullDownRefresh: function () {
    Paging.refresh()
  },
  onReachBottom: function () {
    this.getData();
  },
  previewImg(e) {
    let imgs = e.currentTarget.dataset.imgs;
    let currentImg = e.currentTarget.dataset.currentimg;
    wx.previewImage({
      urls: imgs,
      current: currentImg,
    })
  }
})