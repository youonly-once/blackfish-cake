Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timevalue: {
      type: Array,
      value: "标题"
    },
    years: {
      type: Array,
      value: "年"
    },
    months: {
      type: Array,
      value: "月"
    },
    days: {
      type: Array,
      value: "日"
    },
    hours: {
      type: Array,
      value: "小时"
    },
    minutes: {
      type: Array,
      value: "分钟"
    }
  },
  /* 组件的初始数据*/
  data: {
  },
  /** 组件的方法列表 **/
  methods: {
    //取消
    canslebtn() {
      this.triggerEvent("canslebtn");
    },
    //确认
    closebtn() {
      this.triggerEvent("closebtn");
    },
    // 调用父组件  事件
    fnbindChange(e) {
      this.triggerEvent("bindChangeEvent", e.detail);
    }
  }
})
