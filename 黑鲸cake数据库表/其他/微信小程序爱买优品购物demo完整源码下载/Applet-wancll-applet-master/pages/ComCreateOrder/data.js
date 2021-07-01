const APP = getApp();
// 获取默认地址
export function getDefaultAddress(that) {
  APP.ajax({
    url: APP.api.orderAffimAddress,
    success: res => {
      // 没有获取到地址的时候
      if (!res.data.id) {
        wx.navigateTo({
          url: '/pages/UserAddressEidt/index',
        });
      } else {
        that.setData({
          selectedAddress: res.data,
        }, () => {
          orderView(that);
        })
      }
    }
  })
}
// 订单预览
export function orderView(that) {
  APP.ajax({
    url: APP.api.orderAffimView,
    data: {
      address_id: that.data.selectedAddress.id,
      goods_info: packageOrderGoodsInfo(that.data.goodsList),
    },
    success(res) {
      that.setData({
        view: res.data,
        selectedActivity: {},
        selectedActivityText: '',
        selectedActivityType: '',
      }, () => {
        getMarketInfo(that);
      })
    }
  })
}
// 查询可参与的优惠活动
export function getMarketInfo(that) {
  APP.ajax({
    url: APP.api.orderAffimUser,
    data: {
      goods_ids: packageOrderGoodsIds(that.data.goodsList),
      money: that.data.view.total_money
    },
    success(res) {
      that.setData({
        activities: res.data
      }, () => {
        if (that.data.isDiscountGoods && !res.data.discount) {
          wx.showModal({
            title: '提示',
            content: '您不能享受该折扣商品',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        } else {
          that.computeTotalPrice();
        }
      })
    }
  })
}
// 提交订单
export function submit(that) {
  // 组装数据
  APP.ajax({
    url: APP.api.orderSaveAll,
    data: {
      address_id: that.data.selectedAddress.id,
      goods_info: packageOrderGoodsInfo(that.data.goodsList),
      market_activity_id: that.data.selectedActivity.id || 0,
      market_activity_type: that.data.selectedActivityType || 0,
      memo: that.data.memo
    },
    success(res) {
      wx.setStorageSync('buyOrder', res.data)
      wx.showToast({
        title: res.msg,
        icon: 'none',
      })
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/ComPay/index?orderNo=${res.data.order_no}&orderMoney=${res.data.total_money}`
        })
      }, 1000)
    }
  })
}
// 组装订单商品信息
function packageOrderGoodsInfo(goodsList) {
  let orderGoodsData = goodsList.map(item => {
    let data = {
      goods_id: item.goodsInfo.id,
      num: item.num,
      spec_group_id: 0,
    }
    if (item.specGroupInfo.id) {
      data.spec_group_id = item.specGroupInfo.id;
    }
    return data;
  });
  return JSON.stringify(orderGoodsData);
}
// 组装订单ids
function packageOrderGoodsIds(goodsList) {
  return goodsList.map(item => {
    return item.goodsInfo.id;
  })
}