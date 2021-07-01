const date = require("../../utils/date.js")
const payment=require("../../utils/payment.js")
const http=require("../../utils/http.js")
const util = require('../../utils/util.js')
const app = getApp()
const ORDER_CREATE = -1 //待创建
const ORDER_CANCEL = 0 //已取消，或无订单
const ORDER_SAVE = 1 //订单已保存 未付款
const ORDER_PAY = 2 //已付款
const ORDER_SEND = 3 //已送货
const ORDER_RECEIVE = 4 //已签收 待评价
const ORDER_Finish = 5 //已完成 待评价


Page({
  data: {
    isShow: false, //数据是否正常，能否付款 暂未用
    goods: [], //商品数组
    allGoodPrice: 0, //,所有商品总价 不包括折扣配送
    discount: 0, //优惠
    delivPrice: 0, //配送费
    delivMethod: '同城配送',
    isDeliver: 1, //1,2默认为商家配送
    defAddrObject: {},
    orderChoose: false, //判断是否为选择地址界面返回，刷新地址
    isHaveAddr: false, //false 表示没有地址
    orderStatusStr: '提交订单',
    orderStatus: ORDER_CREATE,
    orderId: null, //保存订单提交成功 数据库表的ID
    deliverStartDate: '2018-01-01', //默认起始时间  
    deliverEndDate: '2018-01-24', //默认结束时间  
    // deliverStartTime: '08:00',//默认起始时间  
    //deliverEndTime: '23:59',//默认结束时间  
    timeArray: ['08:00~09:00', '09:00~10:00', '10:00~11:00', '12:00~13:00', '13:00~14:00', '14:00~15:00', '15:00~16:00', '16:00~17:00', '17:00~18:00', '18:00~19:00', '19:00~20:00', '20:00~21:00', '21:00~22:00'],
    currDeliverDate: '选择配送或自提日期',
    currDeliverTime: '选择配送或自提时间',
    /* years:['2019','2018'],
     months: ['1', '2'],
     minutes: ['1', '59'],
     days: ['29', '30'],
     hours: ['8', '9'],*/
    remark: '',

  },
  onLoad: function(options) {
    wx.showLoading({
      title: '',
    })
    if (!this.getGoods()) {
      wx.hideLoading()
      return
    }
    this.getDefaultAddr()
    console.log("getInfo", this.data.goods)

    let currDate = date.getNowTime();
    let currTime = date.writeCurrentDate();
    this.setData({
      deliverStartDate: date.getDateStr(currDate, 1),
      deliverEndDate: date.getDateStr(currDate, 31),
      //deliverStartTime: currTime
    })
  },

  onReady: function() {
    //console.log("onReady", "onReady")
    // Do something when page ready.
  },
  /**
   * 生命周期函数--监听页面显示
   * 跳转到选择地址界面后，返回来判断 刷新地址
   */
  onShow: function() {
    //配送界面才需要刷新默认地址
    if (this.data.orderChoose) {
      wx.showLoading({
        title: '',
      })
      this.getDefaultAddr() //重新获取地址
      this.getRealLocation()
      this.setData({
        orderChoose: false
      })
    }


  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    this.getRealLocation()
    this.getDefaultAddr()
  },
  /**
   * 切换配送方式
   */
  switchDeliver: function(e) {
    var isDeliver = e.currentTarget.dataset.id
    //isDeliver=(isDeliver==1?isDeliver=2:isDeliver)
    this.setData({
      isDeliver: isDeliver
    })
    if (isDeliver == 2) {
      this.getRealLocation() //获取实时位置显示在地图上
      this.setData({
        delivPrice: 0,
        delivMethod: "用户自提、免运费"

      })
    }
    if (isDeliver == 1) {
      this.getDelivPrice() //获取配送价格
      this.setData({
        delivMethod: '同城配送'
      })
    }

  },
  chooseMapAddress: function() {
    var that = this
    wx.openLocation({
      name: "黑鲸烘培工作室",
      address: "重庆市大渡口区双园路1号附35号",
      latitude: app.globalData.storeLatitude,
      longitude: app.globalData.storeLongitude,
      success(res) {
        console.log(res)

      },
      fail(res) { //打开地理位置授权}
        console.log(res)
        //if (res.errMsg == "chooseLocation:fail auth deny") {
        that.setData({
          isOpenLocation: true
        })
        wx.showModal({
          title: '请求授权当前位置',
          content: '需要您手动授权地理位置，用于配送蛋糕及计算配送距离。',
        })
        // }
      }
    })
  },
  getRealLocation: function() {
    this.setData({
      storeLatitude: app.globalData.storeLatitude,
      storeLongitude: app.globalData.storeLongitude,
    })
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        let distance = that.getDistance(res.latitude, res.longitude, app.globalData.storeLatitude, app.globalData.storeLongitude)
        let distanceStr = ""
        if (distance != null && distance != undefined) {
          distanceStr = "\n距您" + distance + "km"
        }
        that.setData({
          markers: [{
            id: 1,
            latitude: app.globalData.storeLatitude,
            longitude: app.globalData.storeLongitude,
            iconPath: '/images/head.jpg',
            width: '20px',
            height: '20px',
            //alpha: 0.3,
            callout: {
              content: "黑鲸烘培" + distanceStr,
              bgColor: "#fff",
              padding: "5px",
              borderRadius: "20px",
              fontSize: '24rpx',
              borderWidth: "1px",
              borderColor: "#fff",
              display: "ALWAYS"
            },
            /*label: {
                         content: "黑鲸烘培" + distanceStr,
                         bgColor: "#FFFFFF",
                         padding: "5px",
                         borderRadius: "20px",
                         fontSize: '16rpx',
                         borderWidth: "1px",
                         borderColor: "#FF6347",
                         //display: "ALWAYS",
                         color:"#FF6347",//不能用字母颜色代码，显示不出来
                         anchorX:20,
                         anchorY:-20,
                       }*/
          }]
        });
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  getDefaultAddr: function() {
    var that = this;
    wx.cloud.callFunction({
      name: 'manageAddr',
      data: {
        command: 'getDefault'
      },
      success(res) {
        console.log("获取地址列表成功", res)
        if (util.isEmpty(res.result) || util.isEmpty(res.result.data)) {
          let defAddrObject = that.data.defAddrObject
          defAddrObject._id = ''
          that.setData({
            isHaveAddr: false, //没有地址
            defAddrObject: defAddrObject ,
            delivPrice: 0
          })
          return
        }
        that.setData({
          defAddrObject: res.result.data[0],
          isHaveAddr: true,
          getPerson: res.result.data[0].name,
          getPersonPhone: res.result.data[0].phone,
        })
        that.getDelivPrice()
        wx.hideLoading();
        wx.stopPullDownRefresh()
      },
      fail(res) {
        console.log("获取地址列表失败", res)
        wx.hideLoading();
        wx.stopPullDownRefresh()
      },
      complete(res) {

      }
    })
  },
  /**
   * 计算配送费
   */
  getDelivPrice: function() {

    //3km 20元 超出3元/KM
    if (this.data.isDeliver == 2) { //自提方式，直接为0
      this.setData({
        delivPrice: 0,
      })
      return
    }
    if (this.data.defAddrObject == null) {
      return
    }
    //距离 km
    var distance = this.getDistance(app.globalData.storeLatitude, app.globalData.storeLongitude, this.data.defAddrObject.latitude, this.data.defAddrObject.longitude)
    var delivPrice = 0
    if (distance <= 3) {
      delivPrice = 20;
    } else {
      delivPrice = 20 + (distance - 3) * 3
    }
    this.setData({
      delivPrice: parseInt(delivPrice),

    })

  },
  /**
   * 计算地图上二点距离
   * 单位KM
   */
  getDistance: function(lat1, lng1, lat2, lng2) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));
    distance = Math.round(distance / 1000)
    return distance
  },
  //订单详情页传递的信息
  getGoods: function() {
    let goods = wx.getStorageSync('goods');
    console.log("goods", goods);
    //删除缓存的商品信息
    try {
      wx.removeStorageSync('goods')
    } catch (e) {
      // Do something when catch error
    }
    if (goods == null || goods == undefined || goods.length <= 0) {
      wx.showToast({
        title: '获取商品错误',
        icon: 'none'
      })
      return false;
    }
    this.setData({
      goods: goods,
      isShow: true
    })
    this.calculateAllGoodPrice()
    //获取默认地址
    return true;
  },
  //计算所有商品总价
  calculateAllGoodPrice: function() {
    let allGoodPrice = 0;
    let goods = this.data.goods;
    for (let i = 0, length = goods.length; i < length; i++) {
      allGoodPrice = allGoodPrice + parseInt(goods[i].totalPrice)

    }
    allGoodPrice = allGoodPrice.toFixed(2)
    this.setData({
      allGoodPrice: parseInt(allGoodPrice)
    })

  },

  //选择配送地址、跳转地址页面
  chooseAddr: function() {
    this.setData({
      orderChoose: true
    })
    //orderChoose", true表明由订单详情页调用，选择完成后返回
    wx.navigateTo({
      url: '/pages/UserAddress/UserAddress?orderChoose=true',
    })
  },
  chooseCoupon: function() {
    wx.navigateTo({
      url: '/pages/UserCoupon/UserCoupon',
    })
  },
  deliverDateChange: function(e) {
    this.setData({
      currDeliverDate: e.detail.value
    })
  },
  deliverTimeChange: function(e) {
    this.setData({
      currDeliverTime: this.data.timeArray[e.detail.value]
    })
  },
  //买家留言
  remarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  getPerson: function(e) {
    this.setData({
      getPerson: e.detail.value
    })
  },
  getPersonPhone: function(e) {
    this.setData({
      getPersonPhone: e.detail.value
    })
  },
  checkOrderStatus: function() {

    switch (this.data.orderStatus) {
      case ORDER_CREATE: //订单已经前端创建 
        this.confirmOrder() //提交订单
        break
      case ORDER_SAVE: //订单已经保存数据库 则发起付款
        this.confirmPay()
        break
      case ORDER_PAY: //订单已经支付
        this.updaePayOK() //更新订单状态
        break
      case ORDER_RECEIVE: //订单已经签收

        break
      default:
        this.order
    }
  },
  /**
   * 提交订单
   */
  confirmOrder: function() {

    /**
     * 提交的数据格式
     * {
     *  orderID:。。。
     *  remark:...
     * goods:[{good},{good}]
     * }
     */
    let that = this;
    if (that.data.defAddrObject == null && that.data.deliverWay == 1) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: "请选择配送地址",
      })
      return
    }

    //let  out_trade_no=that.getRandomCode() //生成商户订单号
    //获取IP
    //http.getClientIp(that)
    let orderInfors = {
      getPerson: that.data.getPerson,
      getPersonPhone: that.data.getPersonPhone,
      "delivPrice": parseInt(that.data.delivPrice), //配送费
      "discount": parseInt(that.data.discount), //优惠
      "allGoodPrice": parseInt(that.data.allGoodPrice), //所有商品价格
      "payPrice": (that.data.allGoodPrice+that.data.delivPrice-that.data.discount)*100,  //单位分 付款金额
      "remark": that.data.remark,
      "delivMethod": that.data.delivMethod,
      "currDeliverDate": that.data.currDeliverDate + '  ' + that.data.currDeliverTime,
      "addrId": that.data.defAddrObject._id, //地址
      deliverWay: parseInt(that.data.isDeliver),
      "attach": 'attach',
      "spbill_create_ip": '127.0.0.1',//that.data.ip,
    }

    //检查数据
    if (!that.checkSubmitData(orderInfors)) {
      return
    }
    let body=''
    for (let i = 0, length = that.data.goods.length; i < length; i++) {
      //检查数据
      
      body = body+that.data.goods[i].cakeName+' '
      if (!that.checkSubmitData(that.data.goods[i])) {
        return
      }
    }
    body=body+'-黑鲸cake'
    orderInfors.body = body
    orderInfors.goods = that.data.goods;
    console.log("orderInfors", orderInfors)
    wx.showLoading({
      mask: true,
      title: '提交中',
    })
    wx.cloud.callFunction({
      name: "manageOrder",
      data: {
        command: "add",
        orderData: orderInfors
      },
      success(res) {
        that.setData({
          orderStatusStr: '去支付',
          orderStatus: ORDER_SAVE,
          orderId: res.result._id
        })
        wx.hideLoading()
        console.log("云函数manageOrder ADD提交成功：", res.result)
        //调用支付
        that.paySubmit()
        //增加销量
        that.updateSales()
        
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '订单提交失败',
          icon: 'none',
        })
        console.log("云函数manageOrder ADD提交失败：", res)
      },
      complete: () => {

      }
    })
  },
  updateSales(){
    let goods = this.data.goods
    for (let i = 0; i < goods.length;i++)
    {
      let cakeId = goods[i].cakeId
      let addCount=goods[i].buyCount
      wx.cloud.callFunction({
        name: 'manageCake',
        data: ({
          cakeId: cakeId,
          command: 'addSales',
          addCount: addCount
        }),
        success(res) {
          console.log("增加销量成功", res)
        },
        fail(res) {
          console.log("增加销量失败", res)
        },
      })
    }
  },
  paySubmit(){
    let that=this
    payment.confirmPay({
        id: that.data.orderId,
        success(res) {
          console.log('success:' + res)
          that.setData({
            orderStatusStr: '支付成功',
            orderStatus: ORDER_PAY
          })
          wx.redirectTo({
            url: '/pages/Order/OrderDetail/OrderDetail?orderid=' + that.data.orderId
          })
        },
        fail(res) {
          console.log('fail:' + res)
          wx.redirectTo({
            url: '/pages/Order/OrderDetail/OrderDetail?orderid=' + that.data.orderId
          })
        },
        updatePayOKFail(res){
          that.setData({
            orderStatusStr: '更新订单状态', //用户点击按钮时就 重新更新

          })
          wx.redirectTo({
            url: '/pages/Order/OrderDetail/OrderDetail?orderid=' + that.data.orderId
          })
        }
      }) 
  },
  /**
   * 检查数据是否正常
   */
  checkSubmitData: function(submitdata) {
    console.log("订单提交数据：", submitdata)
    //收获地址
    if (submitdata.deliverWay == 1 && util.isEmpty(submitdata.addrId)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择收货地址',
      })
      return false
    }
    //自提 校验提货人姓名
    if (submitdata.deliverWay == 2 && util.isEmpty(submitdata.getPerson)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入提货人姓名'
      })
      return false
    }
    //自提 校验提货人手机号
    if (submitdata.deliverWay == 2 && (util.isEmpty(submitdata.getPersonPhone) || submitdata.getPersonPhone.length != 11)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入正确手机号'
      })
      return false
    }

    //配送日期
    if (!date.isDateTime(this.data.currDeliverDate /*+ ' ' + this.data.currDeliverTime*/) || this.data.currDeliverTime == "选择配送或自提时间") {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择配送或自提日期',
      })
      return false
    }
   
    for (var o in submitdata) {
      let temp = submitdata[o]

      //非必填
      if (o == "candleDesc" || o == "remark" || o == "blessing") { 
        continue
      }
      //自提方式 无需发货地址 //自提方式无配送费
      if ((o == "addrId" || o == "delivPrice") && submitdata.deliverWay == 2) {
        continue
      }
      //配送方式 则不校验提货人信息
      if ((o == "getPerson" || o == "getPersonPhone") && submitdata.deliverWay == 1) {
        continue
      }
      //可以为0
      if (o == "discount" || o == "stylePrice" || o == "status"){
        continue
      }
      
      console.log(o)
      if (util.isEmpty(temp)){
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '请填写配送或自提信息',
        })
        return false
      }
      //数字小于0 价格相关
      if (Object.prototype.toString.call(temp) == '[object Number]' && temp <= 0 ) {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '系统错误'
        })
        console.log('付款金额错误', o + '=' + temp);
        return false
      }



    }

    return true
  },
  
  call_custom: function(e) {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone //仅为示例，并非真实的电话号码
    })
  },
})