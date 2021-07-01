const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Component({
  // 传递过来的参数
  properties: {},
  // 默认参数
  data: {
    addressList: [],
    // 分页功能
    FPage: {
      pageNum: 1,
      hasData: true,
      noContent: false,
      noContentImg: APP.imgs.noContentImg
    },
  },
  attached() {
    Paging.init({
      type: 2,
      that: this,
      url: 'addressList',
      pushData: 'addressList',
      getFunc: this.getList
    })
  },
  // 组件的方法列表 
  methods: {
    // 刷新数据
    refresh() {
      Paging.refresh()
    },
    getList(){
      Paging.getPagesData()
    },
    // 下拉加载数据
    concat() {
      this.getList();
    },
    // 将点击每个地址列表得到的值传递出去 用 getclickid 接收
    selectAddress(e) {
      let id = APP.utils.getDataSet(e, 'id');
      this.triggerEvent('getclickid', {
        id: id
      });
    },
    // 点击设置默认地址
    setDefaultAddress(e) {
      let id = APP.utils.getDataSet(e, 'id');
      this.getDefaultAddress(id);
    },
    // 判断点击的是新增还是编辑 然后跳转到编辑页面
    editAddress(e) {
      let id = APP.utils.getDataSet(e, 'id');
      let param = id == 'new' ? '' : `?id=${id}`;
      wx.navigateTo({
        url: `/pages/UserAddressEidt/index${param}`
      })
    },
    // 删除地址操作
    deleteAddress(e) {
      let id = APP.utils.getDataSet(e, 'id');
      this.deleteAdd(id);
    },
    getDefaultAddress(id) {
      APP.ajax({
        url: APP.api.addressSetDefault,
        data: {
          is_default: 1,
          id: id
        },
        success: res => {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
          this.setData({
            addressList: this.data.addressList.map(i => {
              i.is_default = i.id == id ? true : false;
              return i;
            })
          })
        }
      })
    },
    deleteAdd(id) {
      wx.showModal({
        title: '提示',
        content: '确定要删除该地址吗？',
        success: res => {
          if (res.confirm) {
            APP.ajax({
              url: APP.api.addressDelete,
              data: { id: id },
              success: res => {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                });
                let newAddressList = this.data.addressList.filter(i => i.id != id)
                this.setData({
                  addressList: newAddressList,
                  noContent: newAddressList.length > 0 ? false : true,
                })
              }
            })
          }
        }
      })
    }
  }
})