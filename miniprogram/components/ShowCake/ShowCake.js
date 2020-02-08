// components/ShowCake/ShowCake.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cakes: {
      type: Array,
      value: []
    },
 
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //跳转到商品详情页
    gotoCakeDetail: function (data) {
      let id = data.currentTarget.dataset.id
      wx.showLoading({
        mask: true,
        title: '',
      })
      wx.navigateTo({
        url: '../../cake_detail/cake_detail?cakeid=' + id,
        complete(res) {
          wx.hideLoading()
        }
      })
    },
  },

})
