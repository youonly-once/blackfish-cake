const http = require("./http.js");
const app = getApp();

/**
 * 设置购物车图标数量
 */
const setCartBadge = function (timestamp) {
  getCartNun(res=>{
    let resData = res.data;
    if (resData.code == 0) {
      let num = resData.data;
      if (num > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: num
        })
      } else {
        wx.removeTabBarBadge({ index: 2 })
      }
    }
  })
}

/**
 * 获取购物车商品数量
 */
const getCartNun = function(call){
  http.get(`/cart/num`, {}, res => {
    call(res);
  });
}

/**
 * 加入购物车
 */
const submitCart = function (skuId, num, shopTip=true,call){
  http.post(`/cart`, {
    sku_id: skuId,
    purchase_num: num
  }, res => {
    let resData = res.data;
    if (resData.code == 0) {
      call(resData)
    }
    if (resData.data){
      if (shopTip) {
        wx.showToast({
          title: resData.data.message,
          icon: 'none'
        })
      }
    }

  })
}

/**
 * 删除用户购物车中的商品
 */
const deleteUserSku = function (skuId,showTip,call){
  http.del(`/cart/${skuId}/delete`, {}, res => {
    let resData = res.data;
    let amount = 0;
    if (resData.code == 0) {
      call(res)
    }
  });
}

module.exports = { setCartBadge, getCartNun, submitCart, deleteUserSku}
