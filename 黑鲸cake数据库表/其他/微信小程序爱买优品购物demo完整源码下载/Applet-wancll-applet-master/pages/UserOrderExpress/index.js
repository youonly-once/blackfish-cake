const APP = getApp();
Page({
  data: {
    logisticsMap: {
      huitongkuaidi: '百世汇通',
      ems: 'EMS',
      shentong: '申通快递',
      shunfeng: '顺丰快递',
      tiantian: '天天快递',
      yuantong: '圆通快递',
      yunda: '韵达快运',
      zhongtong: '中通速递',
      zhaijisong:'宅急送',
      youzhengguonei:'邮政快递'
    },
    logisticsStatus: [
      '运输中',
      '揽件中',
      '疑难(货物寄送过程出了问题)',
      '已签收',
      '退签中',
      '派件中',
      '退回中',
    ],
    orderInfo: {},
    expressInfo:{}, // 物流信息
    footData:[],  // 快件足迹
  },
  onLoad(options) {
    // 获取本地存储的订单列表
    APP.utils.getOrderById(options.id, (res) => {
      // console.log(res)
      this.setData({
        orderInfo: res
      }, () => {
        APP.ajax({
          url: APP.api.orderExpress100,
          data: {
            express_type: this.data.orderInfo.express_type,
            express_no: this.data.orderInfo.express_no
          },
          success:(res)=>{
            this.setData({
              expressInfo:res.data
            })
          }
        })
      })
    })
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})