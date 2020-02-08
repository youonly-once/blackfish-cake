const app = getApp()
const ORDER_CREATE = -1 //待创建
const ORDER_CANCEL = 0   //已取消，或无订单
const ORDER_SAVE = 1   //订单已保存 未付款
const ORDER_PAY = 2     //已付款
const ORDER_SEND = 3//已送货
const ORDER_RECEIVE = 4//已签收 待评价
const ORDER_Finish = 5//已完成 待评价
Page({
  data: {
    isHidden:1,
    showModalStatus: false, //显示遮罩

    orderInfors: {},//保存的订单信息
    addrObject: {},//订单关联的收获地址
    orderStatusStr: '',
    orderId: null,//订单 数据库表的ID
    isShow:false,//加载成功就显示
    rules: [{
      name: 'delivPerName',
      rules: [{ required: true, message: '姓名必填' }],
    },{
        name: 'delivPerPhone',
        rules: [{ required: true, message: '手机号必填' }, { mobile: true, message: '手机号格式不对' }],
    }, ],
    submitData: { 'delivPerName': '', 'delivPerPhone':'', 'delivPerRemark': ''}
  },
  onLoad: function (options) {
    wx.showLoading({
      mask: true,
      title: '',
    })
    console.log("options.orderid", options.orderid)
    this.setData({
      orderId:options.orderid
    })
    this.getorderInfors()

  },
  onShow: function () {
    let option = {}
    option.orderid = this.data.orderId
    this.onLoad(option)
  },
  onReady: function () {
    console.log("onReady", "onReady")
    // Do something when page ready.
  },
  onPullDownRefresh:function(){
    this.getorderInfors()
  },

  //订单详情页传递的信息
  getorderInfors: function () {
    let that = this
    if (that.data.orderId == null) {
      return
    }
    wx.cloud.callFunction({
      name: 'manageOrder',
      data: {
        command: 'getSingle_Manager',
        _id: that.data.orderId
      },
      success(res) {
        console.log("orderInfors", res);
        that.setData({
          orderInfors: res.result.data[0]
        })

        //获取收获地址
        that.getOrderAddr()
        if (that.data.orderInfors.deliverWay == 2) {
          that.setData({
            isShow: true

          })
        }
      },
      fail(res) {
        console.log("加载失败", res)
        that.setData({
          isShow: false
        })
       
      },
      complete(res) {
       
      }
    })
  },

  /**
   * 右下角按钮文字
   */
  setOrderStatus:function(){
    let orderStatusStr=''

    switch (this.data.orderInfors.status){
      case ORDER_SAVE:
        orderStatusStr='用户未付款'
        break;
      case ORDER_PAY:
        if (this.data.orderInfors.deliverWay==1){
          orderStatusStr = '发货'
        }else{
          orderStatusStr = '通知取货'
        }
        break;
      case ORDER_SEND:
      orderStatusStr = '更新配送信息'
        break;
      case ORDER_RECEIVE:
        //orderStatusStr = '去评价'
        break;
    }
    this.setData({
      orderStatusStr: orderStatusStr
    })
  },
  /**
   * 获取送货地址
   */
  getOrderAddr: function () {

    var that = this;
    //自提方式不需地址
    if (that.data.orderInfors.deliverWay == 2) {
      wx.hideLoading();
      return
    }
    wx.cloud.callFunction({
      name: 'manageAddr',
      data: {
        command: 'getSingle_Manager',
        _id: that.data.orderInfors.addrId
      },
      success(res) {
        console.log("获取地址列表成功", res.result.data)
        var def = res.result.data[0];
        /*   if (def==null){
             console.log("addrObject", "NULL")
           }
           if(def==undefined){
             console.log("addrObject", "undefined")
           }*/
        that.setData({
          addrObject: res.result.data[0],
          isShow:true,
        })
        wx.stopPullDownRefresh()

      },
      fail(res) {
        console.log("获取地址列表失败", res)
      },
      complete(res) {
        wx.hideLoading();
        console.log("getDefaultAddr", "getDefaultAddr")
      }
    })
  },
  
 
  checkOrderStatus: function () {

    switch (this.data.orderInfors.status) {
      case ORDER_SAVE://订单已经保存数据库 则发起付款
        //this.confirmPay()
        break
      case ORDER_PAY://订单已经支付 去发货
        //配送方式 则录入发货信息
        if (this.data.orderInfors.deliverWay==1){
          this.showSendInfor()
        }
        break
      case ORDER_SEND://订单已经发货 更新快递员信息
        //配送方式 
        if (this.data.orderInfors.deliverWay == 1) {
          this.showSendInfor()//参数1表示 则是二次更新，不要更改发货时间
          
        }
        break
      case ORDER_RECEIVE://订单已经签收 去评价

        break
      default:
        
    }
  },
  
  //退款
  refund: function () {
    let that = this;
    wx.cloud.callFunction({
      name: "payment",
      data: {
        command: "refund",
        out_trade_no: "test0005",
        body: 'a7r2相机租赁',
        total_fee: 1,
        refund_fee: 1,
        refund_desc: '押金退款'
      },
      success(res) {
        console.log("云函数payment提交成功：", res)
      },
      fail(res) {
        console.log("云函数payment提交失败：", res)
      }
    })
  },
  
 
  /**点击选择口味 尺寸按钮、显示弹出页面 */
  showSendInfor: function (data) {
    if (this.data.isHidden == 0) {//已显示
      return
    }
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是低速结束
      timingFunction: 'ease-out'
    })
    var animationOpacity = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationOpacity.opacity(0.8).step(); //修改透明度,放大  
    // 将该变量赋值给当前动画
    that.animation = animation
    that.animationOpacity = animationOpacity
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(550).step()
    // 用setData改变当前动画
    that.setData({
      isHidden: 0,//显示
      // 通过export()方法导出数据
      animationData: animation.export(),
      //popOpacityAnimation: animationOpacity.export(),//背景透明度渐变
      // 改变view里面的Wx：if
      showModalStatus: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        popOpacityAnimation: animationOpacity.export(),
        animationData: animation.export(),
      })
    }, 100)

  },
  /**隐藏选择口味弹框 */
  hideModal: function (data) {

    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationOpacity = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationOpacity.opacity(0).step(); //修改透明度
    that.animation = animation
    that.animationOpacity = animationOpacity
    animation.translateY(550).step()
    that.setData({

      animationData: animation.export(),
      popOpacityAnimation: animationOpacity.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        showModalStatus: false,
        isHidden: 1,//隐藏
      })
    }, 500)


  },
  //注意：上面的550是你弹框的高度rpx，上面的catchtouchmove是弹框显示的时候防止地图的遮罩层滚动
  toCatch: function () {
    return false;
  },
  submitCheckInfor(e) {
    let that=this;
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        console.log(firstError)
        if (firstError.length) {
          /*this.setData({
            error: errors[firstError[0]].message
          })*/
          wx.showToast({
            title: errors[firstError[0]].message,
            //icon:none
          })
        }else{
          wx.showToast({
            title: "请填写相关信息",
           // icon: none
          })
        }
      } else {
        wx.showToast({
          title: '校验通过',
          
        })
        that.submitSend()
      }
    })
  },
  submitSend(){
    wx.showLoading({
      mask: true,
      title: '',
    })
    let that=this
    wx.cloud.callFunction({
      name:'manageOrder',
      data:{
        command: 'sendSubmit',
        useropenid: that.data.orderInfors._openid,
        _id:that.data.orderId,
        data: that.data.submitData,
        status: that.data.orderInfors.status
      },
      success(res){
        let options = { orderid: that.data.orderId}
        that.onLoad(options)
        that.hideModal()
      },
      fail(res){
        wx.showToast({
          title:'提交失败',
          icon:'none'
        })
      },
      complete(res){
        wx.hideLoading()
      }
    })
  },
  formInputChange:function(e){
    let field = e.currentTarget.dataset.field

    let submitData = this.data.submitData
    switch (field){
      case 'name':
        submitData.delivPerName = e.detail.value
        break;
      case 'mobile':
        submitData.delivPerPhone = e.detail.value
        break;
      case 'remark':
        submitData.delivPerRemark= e.detail.value
        break;
    }
    
    this.setData({
      submitData: submitData 
    })
  },
})