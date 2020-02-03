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
 * 设置购物车图标数量
 */
const setCartNun = function(){
    wx.cloud.callFunction({
      name: 'manageCart',
      data: {
        command: 'getNum',
      },
      success(res) {
        
        let carts=res.result.data
        console.log(carts)
        let num=0;
        for(var i=0;i<carts.length;i++){
          num=num+carts[i].buyCount
        }
        console.log(num)
        wx.setTabBarBadge({
          index: 1,
          text: num+''
        })
      }
    })

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

module.exports = { setCartBadge, setCartNun, submitCart, deleteUserSku}
