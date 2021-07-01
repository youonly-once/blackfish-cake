// components/order-list-item/order-list-item.js
const date = require('../../utils/date.js')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      currentTap:{
        type:Number,
        value:0,
       /* observer: function (newVal, oldVal) {//数组变化时回调该函数
          if (!this.data.first){
            this.refresh()
          }
        }*/
      },
      isAdmin:{
        type:Boolean,
        value:false
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    orderList: [],
    currentPage: 0,
    isNoContent: false,
    paymentCountdown: [],//付款倒计时,
    intervalArray: [],//倒计时定时器
    noMore:false,
    first:true,
    loadMoreShow:false,
  },
  lifetimes: {
    // 组件的生命周期函数，用于声明组件的生命周期
    attached() {
      //console.log(1)
      //this.getOrderList()
    },
    ready() {
      //console.log(2)
    },
    moved(){
      //console.log(3)
    },
    detached() {
    
      this.clearTimer()
    },

  },
  /**
   * 对<2.2.3版本兼容
   */
  detached() {
   
    this.clearTimer()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refresh(currentTap){
      //切换tap 
      if (currentTap != null && currentTap != undefined) {
        this.setData({
          currentTap: currentTap,//
          orderList: []//清空数据
        })
      }
      this.setData({
          currentPage: 0,
      })
      
      
      this.getOrderList()
    },
    getOrderList: function (reach) {
      
      let that = this
      if (!reach) {
        wx.showLoading({
          title: '加载中',
        })
        //没有更多了，或者第一次也没有
      } else if (this.data.noMore || (that.data.currentPage == 0 && that.data.isNoContent)) {
        that.triggerEvent('loadingSuccess')
        return;
      }
      if (that.data.currentPage != 0){
        that.setData({
          loadMoreShow: true
        })
      }

      this.clearTimer()
      this.setData({
        isNoContent: false,
        noMore: false
      })
      let command="get"
      if(this.data.isAdmin){
        command='get_Manager'
      }
      wx.cloud.callFunction({
        name: 'manageOrder',
        data: {
          command: command,
          pageNum: that.data.currentPage,
          _orderStatus: that.data.currentTap
        },
        success(res) {
          if (res.result.data.length > 0) {
            //第一次加载有数据 直接赋值
            if (that.data.currentPage == 0) {
              that.setData({
                orderList: res.result.data,
                currentPage: that.data.currentPage + 1
              })
              //累加
            } else {
              that.setData({
                orderList: that.data.orderList.concat(res.result.data),
                currentPage: that.data.currentPage + 1
              })
            }
            that.createCountdown()
            //第一次加载没有数据
          } else if (that.data.currentPage == 0) {
            that.setData({
              orderList: [],
              isNoContent: true,
            })
          }
          //一页显示5条
          if (res.result.data.length < 5 && that.data.orderList.length > 0) {
            that.setData({
              noMore: true,
            })
          }
          console.log("订单列表 order-list.js", that.data.orderList)

        },
        fail(res) {
          console.log("获取订单列表失败 order-list.js", res)
          that.setData({
            isNoContent: true
          })
        },
        complete(res) {
          that.triggerEvent('loadingSuccess')
          that.setData({
            loadMoreShow: false,
          })
          wx.hideLoading()
        }
      })
    },
    /**
     * 创建倒计时
     */
    createCountdown() {

      for (let i = 0; i < this.data.orderList.length; i++) {
        if (this.data.orderList[i].status == 1) {
          
          let endTime = date.getDateAddMinStr(this.data.orderList[i].createDate, 30);
          this.startCountdown(new Date(), date.createDate(endTime), i)
        }
      }
    },
    /**
     * 付款倒计时
     */
    startCountdown: function (beginTime, endTime, i) {
      var millisecond = endTime.getTime() - beginTime.getTime();
      var that = this;
      if (millisecond <= 0) {
        /*if (that.data.orderList[i].status == 1) {
          console.log('循环中内:', that.data.orderList[i]._id);
          that.cancelOrder(that.data.orderList[i]._id)
        }*/
        return
      }
      
      var intervalArray = that.data.intervalArray
      let interval = setInterval(function () {
        var paymentCountdown = that.data.paymentCountdown
        console.log('循环中:', millisecond);
        millisecond -= 1000;
        if (millisecond <= 0) {
          //console.log('循环中内:', millisecond);
          var intervalArray = that.data.intervalArray
          clearInterval(interval)//删除定时器
          paymentCountdown[i] = ''
          intervalArray.splice(i, 1)//删除数组
          that.setData({
            paymentCountdown: paymentCountdown,
            intervalArray: intervalArray
          });
          

          /*
          //超时取消有BUG
          if (that.data.orderList[i].status==1){
            console.log('循环中内:', that.data.orderList[i]._id);
            that.cancelOrder(that.data.orderList[i]._id)
          }*/
          return;
        }

        let obj = date.transformRemainTime(millisecond);
        paymentCountdown[i] = '付款倒计时：' + obj.hour + '小时' + obj.minute + '分' + obj.second + '秒'
        that.setData({
          paymentCountdown: paymentCountdown,
        });
      }, 1000);
      intervalArray[i] = interval
      that.setData({
        intervalArray: intervalArray
      });

    },
    /**
   * 清空定时器
   */
    clearTimer: function() {
      for (let i = 0; i < this.data.intervalArray.length; i++) {
        clearInterval(this.data.intervalArray[i])

      }
      this.data.intervalArray.splice(0, this.data.intervalArray.length)
      this.data.paymentCountdown.splice(0, this.data.paymentCountdown.length)
    },
    //取消订单，更新订单状态
    isCancelOrder: function (e) {
      let that = this
      let status = e.currentTarget.dataset.status
      if (status == 1) {//未付款取消订单
        wx.showModal({
          title: '提示',
          content: '订单还未付款，确定取消吗',
          cancelText: '取消订单',
          confirmColor: '#FF0000',
          confirmText: '再考虑下',
          success(res) {
            if (res.cancel) {
              wx.showLoading({
                title: '取消中',
              })
              that.cancelOrder(e.currentTarget.dataset.id)
            }

          }
        })
      } /*else if (status >=2 && status<6) {//已付款，申请退款
        wx.navigateTo({
          url: '/pages/order_refund/order_refund?orderid=' + e.currentTarget.dataset.id,
        })
    } else if (status==6){//查看退款详情
      
    }
     */
    },
    cancelOrder: function (_id) {
      let that = this
      wx.cloud.callFunction({
        name: "manageOrder",
        data: {
          command: "updateStatus",
          "_id": _id,
          orderStatus: 0//0表设取消
        },
        success(res) {
          console.log("取消订单成功 order-list.js", res)
          //重新加载列表
          that.setData({
            currentPage: 0,
          })
          that.getOrderList();
        },
        fail(res) {
          console.log("更新订单状态失败 order-list.js", res)
          wx.showToast({
            title: '取消失败',
            icon: 'none'
          })
        },
        complete(res) {
          wx.hideLoading()
        }
      })
    },
    /**
  * 订单详情页
  */
    gotoOrderDetail: function (e) {
      if (this.data.isAdmin){
        wx.navigateTo({
          url: '/pages/OrderManager/OrderDetailManager/OrderDetailManager?orderid=' + e.currentTarget.dataset.id
        })
      }else{
        wx.navigateTo({
          url: '/pages/Order/OrderDetail/OrderDetail?orderid=' + e.currentTarget.dataset.id
        })
      }

    },
    
  }
})
