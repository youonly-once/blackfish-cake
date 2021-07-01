const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    collectionList: [],
    // 分页功能
    FPage: {
      pageNum: 1,
      hasData: true,
      noContent: false,
      noContentImg: APP.imgs.noContentImg
    }
  },
  onLoad() {
    Paging.init({
      type: 2,
      that: this,
      url: 'collections',
      pushData: 'collectionList',
      getFunc: this.getList
    })
    this.getList();
  },
  getList(){
    Paging.getPagesData();
  },
  onPullDownRefresh() {
    Paging.refresh()
  },
  onReachBottom() {
    this.getList();
  },
  deleteItem(e) {
    let id = APP.utils.getDataSet(e, 'id');
    this.deleteCollection(id)
  },
  goDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/ComDetail/index?id=${id}`,
    })
  },
  
  deleteCollection(id) {
    wx.showModal({
      title: '提示',
      content: '确定要从收藏中移除商品吗？',
      success:(res) =>{
        if (res.confirm) {
          APP.ajax({
            url: APP.api.collectionsDelete,
            data: { id: id },
            success:(res)=> {
              wx.showToast({
                title: res.msg,
                icon: 'none',
              });
              let newCollectionList = this.data.collectionList.filter(i => i.id != id);
              this.setData({
                collectionList: newCollectionList,
                noContent: newCollectionList.length ? false : true
              })
            }
          })
        }
      }
    })
  }
})