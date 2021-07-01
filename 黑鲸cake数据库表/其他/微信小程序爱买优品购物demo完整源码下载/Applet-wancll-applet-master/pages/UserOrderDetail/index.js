const APP = getApp();
const STAUTS = ['', '等待付款', '等待发货', '已发货', '交易完成']
Page({
  data: {
    statusName: '',
    orderData: {},
    orderGoods: [],
    id: '',
    statusFontClass: {
      1: 'icon-daifukuan',
      2: 'icon-daifahuo',
      3: 'icon-yifahuo',
      4: 'icon-iconwxz'
    }
  },
  onLoad(options) {
    this.setData({
      id: options.id
    });
    this.getData();
  },
  getData() {
    let that = this;
    APP.ajax({
      url: APP.api.orderDetail,
      data: { id: this.data.id },
      success: res => {
        that.setData({
          statusName: STAUTS[res.data.status],
          orderData: res.data,
          orderGoods: res.data.order_goods_info,
        })
      }
    })
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.getData();
  }
})