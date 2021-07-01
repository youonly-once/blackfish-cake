// components/not-content-tip/not-content-tip.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow:{
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {//数组变化时回调该函数
       // console.log(newVal,oldVal)

      }
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

  }
})
