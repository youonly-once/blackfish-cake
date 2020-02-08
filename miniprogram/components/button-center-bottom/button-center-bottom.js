// components/button-center-bottom/button-center-bottom.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:"按钮"
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

  },lifetimes: {
    // 组件的生命周期函数，用于声明组件的生命周期
    attached() {
      this.setData({
        padding_bottom: app.globalData.padding_bottom
      })
    },
    ready: () => {
      // console.log(2)
    },
    moved: () => {
      //console.log(3)
    },
    detached: () => {
      //console.log(4)
    },

  },
    
})
