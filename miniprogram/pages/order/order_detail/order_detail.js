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
    //顶部显示用
    payShowDate:'',
    sendShowDate:'',
    receiveShowDate:'',

    orderInfors: {},//保存的订单信息
    addrObject: {},//订单关联的收获地址
    orderStatusStr: '',
    orderId: null,//订单 数据库表的ID
    isShow:true,//加载成功就显示
 
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    console.log("options.orderid", options.orderid)
    this.setData({
      orderId:options.orderid
    })
    this.getorderInfors()

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
        command: 'getSingle',
        _id: that.data.orderId
      },
      success(res) {
        console.log("orderInfors", res);
        that.setData({
          orderInfors: res.result.data[0]
        })
        that.setStatusDate()
        that.setOrderStatus()
        //获取收获地址
        that.getOrderAddr()
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
   * 
   */
  setStatusDate:function(){
    this.setData({
      payShowDate: this.data.orderInfors.payDate.toString().substr(0,10),
      sendShowDate: this.data.orderInfors.sendDate.toString().substr(0, 10),
      receiveShowDate: this.data.orderInfors.receiveDate.toString().substr(0, 10),
    })
  },
  /**
   * 右下角按钮文字
   */
  setOrderStatus:function(){
    let orderStatusStr=''

    switch (this.data.orderInfors.status){
      case ORDER_SAVE:
        orderStatusStr='支付'
        break;
      case ORDER_PAY:
        orderStatusStr = '提醒卖家发货'
        break;
      case ORDER_SEND:
        orderStatusStr = '去签收'
        break;
      case ORDER_RECEIVE:
        orderStatusStr = '去评价'
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
    wx.cloud.callFunction({
      name: 'manageAddr',
      data: {
        command: 'getDefault',
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
  //跳转到商品详情页
  gotoCakeDetail:function(data){
    let id=data.currentTarget.dataset.id
    wx.showLoading({
      title: '',
    })
    wx.navigateTo({
      url: '../../cake_detail/cake_detail?cakeid='+id,
      complete(res){
        wx.hideLoading()
      }
    })
  },
  //下单后不允许更改地址
  chooseAddr: function () {
    wx.showToast({
      title: '下单后不允许更改地址',
      icon:'none'
    })
  },
 
  checkOrderStatus: function () {

    switch (this.data.orderInfors.status) {
      case ORDER_SAVE://订单已经保存数据库 则发起付款
        this.confirmPay()
        break
      case ORDER_PAY://订单已经支付 去收获
        //
        break
      case ORDER_RECEIVE://订单已经签收 去评价

        break
      default:
        
    }
  },
  /**
   * 提交订单 
   *  数据库订单_id 数据库自动生成
   * out_trade_no 商户订单号 程序生成
   * */
  confirmPay: function () {
    let that = this;
    wx.showLoading({
      title: '支付中',
    })
    wx.cloud.callFunction({
      name: "payment",
      data: {
        command: "pay",//付款
        orderId: that.data.orderId
      },
      /*//云函数调试
      {
        "command": "pay",
        "out_trade_no": "1",
        "body": "测试",
        "total_fee": 1,
        "attach": "attach",
        "spbill_create_ip": "127.0.0.1"
      }
      */
      success(res) {
        wx.hideLoading()
        console.log("云函数payment提交成功：", res)
        let data = res.result
        if (data == null ||data.msg_code==null|| data.msg_code=='FAIL') {
          wx.showToast({
            title: '支付失败：' + data.msg,
            icon: 'none',
          })
        } else {
          that.pay(data)
        }

      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '支付失败',
          icon: 'none',
        })
        console.log("云函数payment提交失败：", res)
      }, complete: () => {

      }
    })
  },

  //调用小程序支付 //官方标准的支付方法
  pay(payData) {
    wx.showLoading({
      title: '支付中',
    })
    let that = this
    wx.requestPayment({ //已经得到了5个参数
      timeStamp: payData.timeStamp_,
      nonceStr: payData.random,
      package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
      signType: payData._signType,
      paySign: payData.paySign_, //签名

      success(res) {
        wx.hideLoading()
        console.log("支付成功：", res)
        //巧妙利用小程序支付成功后的回调，再次调用云函数，通知其支付成功，以便进行订单状态变更
        that.updaePayOK()
        that.getorderInfors()
      },
      fail(res) {
        
        wx.hideLoading()
        wx.showToast({
          title: '付款失败',
          icon: 'none',
        })
        console.log("支付失败：", res)
      },
      complete(res) {

        console.log("支付完成：", res)
      }
    })
  },
  updaePayOK: function () {
    let that = this;
    if (that.data.orderId == null || that.data.orderId == undefined) {
      wx.showModal({
        title: '提示',
        content: '刷新订单出现问题，请联系客服',
      })
      return
    }
    wx.showLoading({
      title: '更新订单状态',
    })
    wx.cloud.callFunction({
      name: "manageOrder",
      data: {
        command: "updateStatus",
        "_id": that.data.orderId,
        orderStatus:ORDER_PAY,
      },
      success(res) {
        /**
         * 整个订单 支付 更新状态成功
         */
        console.log("更新订单状态成功", res)
        wx.showToast({
          title: '支付成功',
          icon: 'success',
        })
       
      },
      fail(res) {
        console.log("更新订单状态失败", res)
        wx.showModal({
          title: '提示',
          content: '刷新订单出现问题，请联系客服',
        })
      },
      complete(res) {
        wx.showLoading({
          title: '加载中',
        })
        that.getorderInfors()
      }
    })
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
  /**
 * 产生一个不重复的code
 */
  generateCode: function () {
    let that = this
    let promise = new Promise(function (resolve, reject) {
      let code = that.getRandomCode();
      that.queryCode(code).then(res => {
        if (res[0]) {
          //  需要结束
          console.log("最终商户订单号", code)
          resolve(res[1]);
        } else {
          //  重复，不能结束，进行递归
          return that.generateCode();
        }
      });
    });
    return promise;
  },

  /**
   * 产生四位数字+字母随机字符
   * 生成商户订单号
   */
  getRandomCode: function () {
    let code = "";
    const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'/*, 'a', 'b', 'c', 'd', 'e',
      'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
      'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'*/];

    for (let i = 0; i < 8; i++) {
      let id = Math.round(Math.random() * 9);
      code += array[id];
    }
    return Date.parse(new Date()).toString() + code;
  },

  /**
   * 从云数据库中查询code
   */
  queryCode: function (code) {
    let promise = new Promise(function (resolve, reject) {
      //  result[0] 代表是否需要结束，true：需要结束，false：不需要结束
      var result = [false, ""];

      wx.cloud.callFunction({
        name: "manageOrder",
        data: {
          command: "checkOut_trade_noRepeat",
          out_trade_no: code
        },
        success: res => {
          console.log("商户订单号重复校验结果", res)
          let data = res.result.data;
          if (data.length === 0) {
            //  查询成功，code未重复
            console.log("商户订单号重复校验结果", "未重复")
            result = [true, code];
          } else {
            //  查询成功，code重复,则继续生成code并判断
            console.log("商户订单号重复校验结果", "重复")
            result[0] = false;
          }
        },
        fail: error => {
          //  查询失败
          result[0] = true;
          console.log("商户订单号重复校验结果", error)
        },
        complete: () => {
          resolve(result);
        }
      });
    });

    return promise;
  },
  call_custom:function(){
    wx.makePhoneCall({
      phoneNumber: '15723468981' //仅为示例，并非真实的电话号码
    })
  }

})