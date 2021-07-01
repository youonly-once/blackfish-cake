// components/refund-status/refund-status.js
const date=require('../../utils/date.js')
let interval=0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    out_refund_no:{
      type:String,
      value: '',
      observer: function (newVal, oldVal) {//数组变化时回调该函数
        this.checkStatus()		//这里通过this.updateRate()方法来更新数据
      }
    },
    status: {
      type: Number,
      value: 0
    },
    refundData:{
      type:Object,
      value:{}
    },
    successRefundTime:{
      type: String,
      value: 'loading'
    },
    refundSatus:{
      type: String,
      value: '订单状态'
    },
    orderCreateDate: {
      type: String,
      value: ''
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
    queryRefund1(){
      this.checkStatus()
    },
    checkStatus: function () {
      let that = this
      let refundSatus=''
      let successRefundTime=''
 
      if (that.data.status == 0) {
        refundSatus = '订单已取消'
        successRefundTime = ''
      }else if (that.data.status==1){
        let endTime = date.getDateAddMinStr(that.data.orderCreateDate, 30);
        that.startCountdown(new Date(), date.createDate(endTime))
        refundSatus='待用户付款，超时自动取消'
      } else if (that.data.status == 2 ) {
        refundSatus = '待商家发货/用户自提'
        successRefundTime = ''
      } else if (that.data.status == 3) {
        refundSatus = '待用户签收'
        successRefundTime = ''
      } else if (that.data.status == 4) {
        refundSatus = '待评价'
        successRefundTime = ''
      } else if (that.data.status == 5) {
        refundSatus = '订单已完成'
        successRefundTime = ''
      } else if (that.data.status == 6) {
        refundSatus = '退款中'
        successRefundTime = '等待商家审核'
      }else if(that.data.status==8){
          successRefundTime= that.data.refundData.refundSuccessDate,
          refundSatus='退款成功'
      } else if (that.data.status == 7) {
        if (that.data.out_refund_no == '') {
          that.setData({
            successRefundTime: '加载中',
            refundSatus:'订单状态'
          })
          return
        }
        that.queryRefund()

      }

          that.setData({
            successRefundTime: successRefundTime,
            refundSatus: refundSatus
          })
    }, 
    startCountdown: function (beginTime, endTime) {
      var that = this;
      var millisecond = endTime.getTime() - beginTime.getTime();
      interval = setInterval(function () {
        console.log('循环中');
        millisecond -= 1000;
        if (that.data.status != 1){
          clearInterval(interval);
          return
        }
        if (millisecond <= 0  ) {
          clearInterval(interval);
          that.setData({
            successRefundTime:'付款倒计时：00小时00分00秒'
          });
          return;
        }
        let obj=date.transformRemainTime(millisecond);
        that.setData({
          successRefundTime:'付款倒计时：' + obj.hour + '小时' + obj.minute + '分' + obj.second + '秒'
        });
      }, 1000);
    },
    queryRefund(){
      let that=this;
      wx.cloud.callFunction({
        name: "payment",
        data: {
          command: "refundQuery",
          "out_refund_no": that.data.out_refund_no,
        },
        success(res) {
          console.log("查询退款状态", res)
          if (res.result.code == 'SUCCESS') {
            that.setData({
              successRefundTime: res.result.time,
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
    }
    
  }, 
  lifetimes: {
    // 组件的生命周期函数，用于声明组件的生命周期
    attached() {
      //console.log(1)
     // this.queryRefund()
    },
    ready: () => {
      //console.log(2)
    },
    moved: () => {
      //console.log(3)
    },
    detached: () => {
      //console.log(4)
      clearInterval(interval);
    },

  },
  /**
* 对<2.2.3版本兼容
*/
  detached: () => {
    //console.log(4)
    clearInterval(interval);
  },
})
