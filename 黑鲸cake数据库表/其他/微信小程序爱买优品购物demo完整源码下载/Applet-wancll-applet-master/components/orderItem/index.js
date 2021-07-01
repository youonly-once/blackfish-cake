const APP = getApp();
Component({
  properties: {
    data: {
      type: Object,
      description: '数据列表'
    },
    haveinfo: {
      type: Boolean,
      description: '是否显示价格栏位'
    },
    gotype:{
      type: String,
      description: '跳转的类型'
    }
  },
  data: {
    bindInput:'',
    hiddenmodalput: true,
    noContent: false,
    noContentImg: APP.imgs.noContentImg
  },
  methods: {
    // 进入订单详情
    goOrderDetail() {
      // console.log(this.data.data)
      if(this.data.gotype == 'orderdetail'){
        let id = this.data.data.id;
        wx.navigateTo({
          url: `/pages/UserOrderDetail/index?id=${id}`
        })
      }
    },
    goGoodsDetail(e){
      if(this.data.gotype == 'orderdetail'){
        this.goOrderDetail()
      }
      if(this.data.gotype == 'goodsdetail'){
        let id = APP.utils.getDataSet(e,'id')
        wx.navigateTo({
          url: `/pages/ComDetail/index?id=${id}`,
        })
      }
    },
    // 进入商品详情
    // ----------------- 待付款
    // 取消订单
    cancelOrder() {
      let id = this.data.data.id;
      let itemList = ['不想买了', '信息填写错误，重新下单', '商家缺货', '其他原因']
      wx.showActionSheet({
        itemList: itemList,
        success:(res)=>{
          if (res.tapIndex == 3) {
            this.setData({
              hiddenmodalput: !this.data.hiddenmodalput,
              bindInput:''
            })
          }else{
            this.setData({
              bindInput:itemList[res.tapIndex]
            },()=>{
              APP.ajax({
                url: APP.api.orderCancel,
                data: {
                  order_id: id,
                  cancel_reason: this.data.bindInput
                },
                success:(res2) =>{
                  wx.showToast({
                    title: res2.msg,
                    icon: 'none',
                  })
                  this.triggerEvent('refreshGet')
                }
              })
            })
          }
        }
      })
    },
    //输入绑定
    bindInput(e){
      this.setData({
        bindInput: e.detail.value
      });
    },
    //取消按钮  
    modalCancel() {
      this.setData({
        bindInput: '',
        hiddenmodalput: true,
      });
    },
    //确认  
    modalConfirm () {
      if(!this.data.bindInput){
        wx.showToast({
          title: '请输入原因',
          icon: 'none',
        })
        return
      }
      this.setData({
        hiddenmodalput: true
      },()=>{
        APP.ajax({
          url: APP.api.orderCancel,
          data: {
            order_id: this.data.data.id,
            cancel_reason: this.data.bindInput
          },
          success:(res2) =>{
            wx.showToast({
              title: res2.msg,
              icon: 'none',
            })
            this.triggerEvent('refreshGet')
          }
        })
      })
    },
    

    // 预支付
    payOrder() {
      let that = this;
      APP.ajax({
        url: APP.api.orderPrePay,
        data: {
          order_id: this.data.data.id
        },
        success(res) {
          if (res.code == 1) {
            // 前往支付页面
            wx.navigateTo({
              url: `/pages/ComPay/index?orderNo=${that.data.data.order_no}&orderMoney=${that.data.data.total_money}`,
            })
          }
        }
      })
    },
    // ----------------- 待发货
    // 提醒发货
    tipOrder() {
      let id = this.data.data.id;
      APP.ajax({
        url: APP.api.orderTip,
        data: {
          order_id: id
        },
        success(res) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
          })
        }
      })
    },
    // 进入退款
    refundOrder(e) {
      let params = APP.utils.paramsJoin({
        orderId: this.data.data.id,
        goodsId: APP.utils.getDataSet(e, 'id'),
      })
      wx.navigateTo({
        url: `/pages/UserOrderRefound/index?${params}`,
      })
    },
    // ----------------- 待收货
    // 确认收货
    userSing() {
      let id = this.data.data.id;
      let that = this;
      wx.showModal({
        title: '提示',
        content: '确定货物已经收到，再点击确定收货按钮，',
        success: function (res) {
          if (res.confirm) {
            APP.ajax({
              url: APP.api.orderUserSing,
              data: {
                order_id: id
              },
              success(res) {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                })
                that.triggerEvent('refreshGet')
              }
            })
          }
        }
      })
    },
    // 查看物流
    goExpress() {
      let id = this.data.data.id
      wx.navigateTo({
        url: `/pages/UserOrderExpress/index?id=${id}`,
      })
    },
    // 评价
    estimateGoods(e) {
      let params = APP.utils.paramsJoin({
        orderId: this.data.data.id,
        goodsId: APP.utils.getDataSet(e, 'id'),
      })
      wx.navigateTo({
        url: `/pages/UserOrderEstimate/index?${params}`,
      })
    },
  }
})