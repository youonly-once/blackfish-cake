const routes = require('../../router/index.js');
Component({
  options: {
    addGlobalClass: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 匹配列表
    itemIndex: String,
    itemStyle: Object,
    params: Object
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 跳转到搜索页面
     */
    onTargetSearch(e) {
      routes.navigateTo('search')
    }
  }
})