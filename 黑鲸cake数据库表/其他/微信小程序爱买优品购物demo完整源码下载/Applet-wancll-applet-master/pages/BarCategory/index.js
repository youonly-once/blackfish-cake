const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    // tab组件参数
    tabList: [],
    tabSelectedId: 0,
    tabScroll: true,
    tabHeight: 45,
    // 数据参数
    goods: [],
    childNav: [],
    // 控制参数
    popupNav: false,
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
  onLoad(options) {
    Paging.init({
      type: 2,
      that: this,
      url: 'goods',
      pushData: 'goods',
      getFunc: this.getGoodsData
    })
    this.getGoodsTree()
    this.getGoodsData()
  },
  // 获取分页数据
  getGoodsData(id = '') {
    let data = { goods_cate_id: id }
    Paging.getPagesData({ postData: data })
  },
  // 获取树结构
  getGoodsTree() {
    APP.ajax({
      url: APP.api.goodsTree,
      success: (res) => {
        let list = [];
        res.data.forEach((item, index) => {
          item.title = item.name;
          item._child && (item._child = item._child.map(i => {
            i.thum = i.thum ? i.thum : APP.imgs.avatar;
            return i;
          }))
          list.push(item);
        })
        list.unshift({
          id: '',
          title: '全部'
        })
        this.setData({
          tabList: list,
        })
      }
    })
  },
  // 小分类的点击
  changeSubNav(e) {
    let id = e.currentTarget.dataset.id;
    // 相同点击 禁止
    if (this.data.id == id) {
      return;
    }
    // 更新数据
    this.setData({
      tabSelectedId: id,
    }, () => {
      Paging.refresh(id)
    })
  },
  // 大分类的点击
  tabChange() {
    // 传递一个处理方法进去
    Paging.tabChange({
      handler: (id) => {
        this.data.tabList.forEach((i) => {
          if (i.id == id) {
            if (i._child) {
              this.setData({
                childNav: i._child,
                popupNav: true,
              })
            } else {
              this.setData({
                childNav: [],
                popupNav: false,
              })
            }
          }
        })
      }
    })
  },

  // 跳转到商品详情页
  goDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/ComDetail/index?id=${id}`,
    })
  },

  onPullDownRefresh() {
    Paging.refresh()
    this.getGoodsTree();
  },
  onReachBottom() {
    this.getGoodsData(this.data.id)
  }
})