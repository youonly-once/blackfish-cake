
const app = getApp();



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
        console.log('Cart.js 购物车:',res)
        if(res.result==null){
          return
        }
        let carts=res.result.data
        let num=0;
        for(var i=0;i<carts.length;i++){
          num=num+carts[i].buyCount
        }
        if(num<=0){
          wx.removeTabBarBadge({
            index: 1,
          })
          return
        }
       // console.log(num)
        wx.setTabBarBadge({
          index: 1,
          text: num+''
        })
      }
    })

}



module.exports = { setCartNun}
