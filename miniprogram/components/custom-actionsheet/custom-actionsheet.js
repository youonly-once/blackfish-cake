// components/custom-actionsheet/custom-actionsheet.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actionShow:{
      type:Boolean,
      value:false
    },
    sendMessagePath:{
      type: String,
      value: ''
    },
    sendMessageTitle: {
      type: String,
      value: ''
    },
    showMessageCard:{
      type: Boolean,
      value: false
    }
    
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
    call_custom: function (e) {
      wx.makePhoneCall({
        phoneNumber: app.globalData.customPhone //仅为示例，并非真实的电话号码
      })
    },
  }
})
