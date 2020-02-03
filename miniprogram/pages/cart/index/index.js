const http = require("./../../../utils/http.js");
const cart = require("./../../../utils/cart.js");
const util = require("./../../../utils/util.js");
const app = getApp()

Page({
  data: {
    carts:[],
    selectAll:true,
    amount:0,
    isShow:false
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })

    this.getCarts();
    app.flushCartStatus();
  },
  onPullDownRefresh:function(){
    this.getCarts();
  },
  onShow:function(){
    if (app.globalData.flushCart==true){
      cart.setCartBadge();
      this.getCarts();
      app.flushCartStatus();
    }
  },

  /**
   * 获取购物车商品
   */
  getCarts:function(){
    let that = this
  
    wx.cloud.callFunction({
      name: 'manageOrder',
      data: {
        command: 'get',
        _orderStatus: 0
      },
      success(res) {
        console.log("orderInfor", res);
        that.setData({
          carts: res.result.data,
          isShow:true
        })
       // that.setOrderStatus()
        //获取收获地址
       // that.getOrderAddr()
      },
      fail(res) {
        console.log("加载失败", res)
      },
      complete(res) {
          wx.hideLoading()
          wx.stopPullDownRefresh()
      }
    })
  },

  /**
   * 勾选商品
   */
  selectGoods:function(e){
    let cartId    = e.currentTarget.dataset.id;
    let carts     = this.data.carts;
    let selectAll = true;
    let cartData = carts.map(item=>{
      if (cartId == item.sku_id){
        if (item.select == true) {
          item.select = false;
        }else{
          item.select = true;
        }
      }
      return item;
    });

    this.setData({ carts: cartData});
    this.flushAmount();
  },

  /**
   * 将商品移出购物车
   */
  removeCart(e){
    let skuId = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确认将该商品移出购物车?',
      success: res => {
        if (res.confirm) {
          cart.deleteUserSku(skuId,true,res=>{
            let resData = res.data;
            if (resData.code == 0) {
              cart.setCartBadge();
              let carts = this.data.carts;
              carts = carts.filter(item => {
                if (item.sku_id != skuId) {
                  return item;
                }
              })
              this.setData({ carts: carts })
              this.flushAmount();
            }
          });
        }
      }
    })
  },

  /**
   * 查看商品详情
   */
  openDetail:function(e){
    let id = e.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/category/goods_detail/goods_detail?id=' + id
    })
  },

  /**
   * 去支付结算
   */
  toPay:function(){
    let sku = [];
    this.data.carts.map(item => {
      if (item.select == true) {
        sku.push(item);
      }
    });

    if (sku.length <= 0) {
      wx.showToast({
        title: '请选择需要支付的商品',
        icon: 'none'
      })
      return false;
    }

    wx.removeStorageSync('order_skus')
    wx.setStorageSync('order_skus', JSON.stringify(sku))

    wx.navigateTo({
      url: '/pages/cart/confirmation_order/confirmation_order'
    })
  },

  /**
   * 更新购买数量
   */
  updatePurchase: function (e) {
    let type        = e.currentTarget.dataset.type;
    let skuId = e.currentTarget.dataset.sku_id;
    let purchaseNum = 0;
    let limitNum    = 0;

    this.data.carts.map(item=>{
      if(item.sku_id == skuId){
        purchaseNum = item.purchase_num;
        limitNum = item.sku.goods.limit_purchase_num
      }
      return item;
    });

    if (type == 0) {
      if (purchaseNum <= 1) {
        return false;
      }
      purchaseNum --;
      this.reduceCart(skuId);
    } else {
      if (limitNum > 0 && purchaseNum >= limitNum) {
        wx.showToast({
          title:'限购数量：'+limitNum,
          icon:"none"
        })
        return false;
      }
      purchaseNum ++;
      this.submitCartNum(skuId,1);
    }

    let carts = this.data.carts.map(item => {
      if (item.sku_id == skuId) {
        item.purchase_num = purchaseNum;
      }
      return item;
    });

    this.setData({carts:carts});
  },

  submitCartNum:function(skuId,purchaseNum){
    cart.submitCart(skuId,purchaseNum,false, res => {
      app.flushCartStatus();
      this.flushAmount();
    })
  },

  /**
   * 计算合计金额
   */
  flushAmount:function(){
    let amount = 0;
    let carts = this.data.carts;
    carts.map(item => {
      if (item.select == true) {
        amount += parseFloat(item.sku.price * item.purchase_num);
      }
    })

    this.setData({ amount: util.floar(amount) })
  },

  /**
   * 购物车数量减一
   */
  reduceCart:function(skuId){
    http.put(`/cart/${skuId}/reduce`, {}, res => {
      let resData = res.data;
      if(resData.code == 0){
        this.flushAmount();
      }else{
        wx.showToast({
          title: resData.message,
          icon:'none'
        })
      }
    });
  }
})