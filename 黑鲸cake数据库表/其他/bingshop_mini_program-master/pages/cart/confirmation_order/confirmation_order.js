const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    sku:[]
  },
  onLoad: function (options) {
    this.getSku();
    console.log(this.data.sku)
  },

  getSku:function(){
    let sku = wx.getStorageSync('order_skus');
    if (sku == '') {
      wx.showToast({
        title: '获取商品错误',
        icon: 'none'
      })
      return false;
    }
    this.setData({ sku: JSON.parse(sku) })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 提交订单
   */
  submitOrder: function () {
    let addressId = 1;
    let skuData = [];

    this.data.sku.map(item => {
      skuData.push({ sku_id: item.sku_id, purchase_num: item.purchase_num })
    })

    if (skuData.length <= 0) {
      wx.showToast({
        title: '商品数据错误',
        icon: 'none'
      })
      return false;
    }

    http.post(`/order`, {
      address_id:addressId,
      sku:skuData
    }, res => {
      wx.hideLoading();
      let resData = res.data;
      if (resData.code == 0) {
        this.payment(resData.data)
      }

    })
  },
  payment:function(data){
    wx.requestPayment(
      {
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        'success': function (res) {
          console.log("s");
          console.log(res);
        },
        'fail': function (res) {
          console.log("f");
          console.log(res);
        },
        'complete': function (res) {
          console.log("c");
          console.log(res);
        }
      })
  }
})