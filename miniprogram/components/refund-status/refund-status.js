// components/refund-status/refund-status.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    out_refund_no:{
      type:String,
      value: '',
      observer: function (newVal, oldVal) {//数组变化时回调该函数
        this.queryRefund()		//这里通过this.updateRate()方法来更新数据
      }
    },
    status: {
      type: String,
      value: ''
    },
    successRefundTime:{
      type: String,
      value: '等待商家审核'
    },
    refundSatus:{
      type: String,
      value: '退款中'
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
    queryRefund: function () {
      let that = this
      console.log('out_refund_no',that.data.out_refund_no)
      console.log('status',that.data.status)
      if (that.data.status<6){
        return
      }
      wx.cloud.callFunction({
        name: "payment",
        data: {
          command: "refundQuery",
          "out_refund_no": that.data.out_refund_no,
        },
        success(res) {
          console.log("查询退款状态", res)
          if(res.result.code=='SUCCESS'){
            that.setData({
              successRefundTime: res.result.time
            })
          }
          that.setData({
            refundSatus: res.result.msg
          })
        },
        fail(res) {
          console.log("更新订单状态失败", res)

        },
        complete(res) {
          
        }
      })
    }, 
    
  }, 
  lifetimes: {
    // 组件的生命周期函数，用于声明组件的生命周期
    attached() {
      console.log(1)
     // this.queryRefund()
    },
    ready: () => {
      console.log(2)
    },
    moved: () => {
      console.log(3)
    },
    detached: () => {
      //console.log(4)
    },

  },
})
