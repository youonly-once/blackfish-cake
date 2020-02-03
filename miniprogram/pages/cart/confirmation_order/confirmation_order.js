const date = require("../../../utils/date.js")
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
    storeLatitude : 29.492788228,
    storeLongitude : 106.470879739,
    isShow:false,//数据是否正常，能否付款 暂未用
    goods:[],//商品数组
    allGoodPrice:0,//,所有商品总价 不包括折扣配送
    discount: 0,//优惠
    delivPrice: 0,//配送费
    delivMethod:'同城配送',
    isDeliver: 1,//1,2默认为商家配送
    defAddrObject:{},
    orderChoose: false,//判断是否为选择地址界面返回，刷新地址
    isHaveAddr:false,//false 表示没有地址
    orderStatusStr:'提交订单',
    orderStatus: ORDER_CREATE,
    orderId:null,//保存订单提交成功 数据库表的ID
    deliverStartDate: '2018-01-01',//默认起始时间  
    deliverEndDate: '2018-01-24',//默认结束时间  
   // deliverStartTime: '08:00',//默认起始时间  
    //deliverEndTime: '23:59',//默认结束时间  
    timeArray: ['08：00 ~ 09：00', '09：00 ~ 10：00', '10：00 ~ 11：00', '12：00 ~ 13：00', '13：00 ~ 14：00', '14：00 ~ 15：00', '15：00 ~ 16：00', '16：00 ~ 17：00', '17：00 ~ 18：00', '18：00 ~ 19：00', '19：00 ~ 20：00', '20：00 ~ 21：00', '21：00 ~ 22:00'],
    currDeliverDate:'选择配送或自提日期',
    currDeliverTime:'选择配送或自提时间',
   /* years:['2019','2018'],
    months: ['1', '2'],
    minutes: ['1', '59'],
    days: ['29', '30'],
    hours: ['8', '9'],*/
    remark:'',

  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    if(!this.getGoods()){
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
  
  onReady: function () {
    //console.log("onReady", "onReady")
    // Do something when page ready.
  },
  /**
 * 生命周期函数--监听页面显示
 * 跳转到选择地址界面后，返回来判断 刷新地址
 */
  onShow: function () {
    if (this.data.orderChoose) {
      wx.showLoading({
        title: '',
      })
      this.getDefaultAddr()//重新获取地址
    }

 
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh:function(){
    this. getRealLocation()
    this.getDefaultAddr()

  },
  /**
   * 切换配送方式
   */
  swithDeliver:function(e){
    var isDeliver = e.currentTarget.dataset.id
    //isDeliver=(isDeliver==1?isDeliver=2:isDeliver)
    this.setData({
      isDeliver: isDeliver
    })
    if (isDeliver==2){
      this.getRealLocation()
      this.setData({
        delivPrice: 0,
        delivMethod: "用户自提、免运费"

      })
    } if (isDeliver == 1){
      this.getDelivPrice()
      this.setData({
        delivPrice: 0,
        delivMethod: '同城配送'
      })
    }
    
  },
  chooseMapAddress: function () {
    var that = this
    wx.openLocation({
      name:"黑鲸烘培工作室",
      address:"重庆市大渡口区双园路1号附35号",
      latitude:that.data.storeLatitude,
      longitude:that.data.storeLongitude,
      success(res) {
        console.log(res)

      },
      fail(res) {//打开地理位置授权}
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
  getRealLocation: function(){
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        let distance=that.getDistance(res.latitude, res.longitude, that.data.storeLatitude, that.data.storeLongitude)
        let distanceStr=""
        if(distance!=null && distance!=undefined){
          distanceStr ="\n距您" + distance+"km"
        }
        that.setData({
          markers: [{
            id: 1,
            latitude: that.data.storeLatitude,
            longitude: that.data.storeLongitude,
            iconPath: '/images/head.jpg',
            width: '20px',
            height: '20px',
            //alpha: 0.3,
            /*callout: {
              content: "黑鲸烘培工作室",
              bgColor: "#fff",
              padding: "5px",
             borderRadius: "20px",
              fontSize:'24rpx', 
             borderWidth: "1px",
              borderColor: "#fff",
              display: "ALWAYS"
            },*/ label: {
              content: "黑鲸烘培工作室" + distanceStr,
              bgColor: "#fff",
              padding: "5px",
              borderRadius: "20px",
              fontSize: '24rpx',
              borderWidth: "1px",
              borderColor: "#fff",
              //display: "ALWAYS",
              color:"gray",
              //anchorX:-30,
              //anchorY:-50,
            }
          }]
        });
      },
      fail(res){
        console.log(res)
      }
    })
  },
  getDefaultAddr:function(){
    var that = this;
    wx.cloud.callFunction({
      name: 'manageAddr',
      data: {
        command: 'getDefault'
      },
      success(res) {
        console.log("获取地址列表成功", res.result.data)
        var def = res.result.data[0];
        if (def == null || def == undefined || Object.keys(def).length<=0){
          that.setData({
            isHaveAddr: false,//没有地址
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
      },
      fail(res) {
        console.log("获取地址列表失败", res)
      },
      complete(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh()
        
      }
    })
  },
  /**
   * 计算配送费
   */
  getDelivPrice:function(){
    //3km 20元 超出3元/KM

    //距离 km
    var distance = this.getDistance(this.data.storeLatitude, this.data.storeLongitude
      , this.data.defAddrObject.latitude, this.data.defAddrObject.longitude)
    var delivPrice=0
    if (distance<=3){
      delivPrice=20;
    }else{
      delivPrice = 20 + (distance-3)*3
    }
    this.setData({
      delivPrice: parseInt(delivPrice),

    })
 
  },
  /**
   * 计算地图上二点距离
   * 单位KM
   */
  getDistance: function (lat1, lng1, lat2, lng2) {
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
    distance = Math.round(distance/1000)
    return distance 
  },
  //订单详情页传递的信息
  getGoods: function () {
    let goods = wx.getStorageSync('goods');
    console.log("goods", goods);
    //删除缓存的商品信息
    try {
      wx.removeStorageSync('goods')
    } catch (e) {
      // Do something when catch error
    }
    if (goods == null || goods == undefined || goods.length<=0) {
      wx.showToast({
        title: '获取商品错误',
        icon: 'none'
      })
      return false;
    }
    this.setData({ 
      goods: goods,
    isShow:true
    
     })
    this.calculateAllGoodPrice()
    //获取默认地址
    return true;
  },
  //计算所有商品总价
  calculateAllGoodPrice:function(){
    let allGoodPrice=0;
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
  chooseAddr:function(){
    this.setData({
      orderChoose:true
    })
    //orderChoose", true表明由订单详情页调用，选择完成后返回
    wx.navigateTo({
      url: '../../manageAddress/manageAddress?orderChoose=true',
    })
  },
  chooseCoupon:function(){
    wx.navigateTo({
      url: '../../discount/discount',
    })
  },
  deliverDateChange: function (e) {
    this.setData({
      currDeliverDate: e.detail.value
    })
  },
  deliverTimeChange: function (e) {
      this.setData({
        currDeliverTime:this.data.timeArray[e.detail.value]
      })
  },
  //买家留言
  remarkInput:function(e){
    this.setData({
      remark:e.detail.value
    })
  },
  getPerson: function (e) {
    this.setData({
      getPerson: e.detail.value
    })
  },
  getPersonPhone: function (e) {
    this.setData({
      getPersonPhone: e.detail.value
    })
  },
  checkOrderStatus:function(){
    
    switch (this.data.orderStatus){
      case ORDER_CREATE://订单已经前端创建 
        this.confirmOrder()//提交订单
        break
      case  ORDER_SAVE://订单已经保存数据库 则发起付款
        this.confirmPay()
        break
      case ORDER_PAY://订单已经支付
        this.updaePayOK()//更新订单状态
        break
      case ORDER_RECEIVE://订单已经签收

        break
      default:
        this.order
    }
  },
  /**
   * 提交订单
   */
  confirmOrder: function(){

    /**
     * 提交的数据格式
     * {
     *  orderID:。。。
     *  remark:...
     * goods:[{good},{good}]
     * }
     */

    let that = this;
    let  out_trade_no=that.getRandomCode() //生成商户订单号
    
    let orderInfors={
      getPerson: that.data.getPerson,
      getPersonPhone: that.data.getPersonPhone,
      "delivPrice": parseInt(that.data.delivPrice),//配送费
      "discount": parseInt(that.data.discount),//优惠
      "allGoodPrice": that.data.allGoodPrice,//所有商品价格
      "payPrice": 1,//that.data.allGoodPrice+that.data.delivPrice-that.data.discount  //单位分 付款金额
      "remark": that.data.remark,
      "delivMethod": "同城配送",
      "currDeliverDate": that.data.currDeliverDate + '  ' + that.data.currDeliverTime,
      "addrId": that.data.defAddrObject._id,//地址
      deliverWay: parseInt(that.data.isDeliver),
      "out_trade_no": out_trade_no,
      "body": '测试',//付款内容
      "attach": 'attach',
      "spbill_create_ip": '127.0.0.1',
    }
    
    //检查数据
    if (!that.checkSubmitData(orderInfors)) {
      return
    }
    for (let i = 0, length = that.data.goods.length; i < length; i++) {
      //检查数据
      if (!that.checkSubmitData(that.data.goods[i])) {
        return
      }
    }
    orderInfors.goods = that.data.goods;
    console.log("orderInfors", orderInfors)
    wx.showLoading({
      title: '提交中',
    })
    wx.cloud.callFunction({
      name: "manageOrder",
          data: {
            command:"add",
            orderData: orderInfors
      },
      success(res) {
        that.setData({
          orderStatusStr:'去支付',
          orderStatus:ORDER_SAVE,
          orderId:res.result._id
        })
        wx.hideLoading()
        console.log("云函数manageOrder ADD提交成功：", res.result)
        //调用支付
        that.confirmPay()//数据库的ID
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '订单提交失败',
          icon: 'none',
        })
        console.log("云函数manageOrder ADD提交失败：", res)
      }, complete: () => {
       
      }
    })
  },
  /**
   * 检查数据是否正常
   */
  checkSubmitData: function (submitdata){

    console.log(submitdata)
    for (var o in submitdata) {
  
      let temp=submitdata[o]
      //判断null 和undefined 以及长度
      if (temp == null || temp == undefined || temp == "null" || temp == "undefined" || temp == "NaN" || temp.length == 0 ){
        if (o == "candleDesc" || o == "remark" || o == "blessing") {//非必填
          continue
        }
        //配送方式 则不校验提货人信息
        if ((o == "getPerson" || o == "getPersonPhone") && submitdata.deliverWay == 1){
          continue
        }
        wx.showToast({
          title: '请填写配送或自提信息',
          icon: 'none'
        })
        console.log(o, temp + "==" + typeof (temp));
        
        return false
      }
      //数字必须大于0 配送费和折扣可为0  //口味价格可能为0
      if (!isNaN(temp) && temp <= 0 && o != "discount" && o != "delivPrice" && o != "stylePrice" && o != "status"){
        wx.showToast({
          title: '价格有误',
          icon: 'none'
        })
        console.log('付款金额错误', o+'='+temp);
        return false
      }

      //自提 校验
      if (o == "getPersonPhone" && submitdata.deliverWay == 2 && temp.length!=11){
        wx.showToast({
          title: '请输入正确手机号',
          icon: 'none'
        })
        return false
      }
     /* if (o == "currDeliverDate" && (temp <= date.getDateStr(date.getNowTime(), 31))){
        wx.showToast({
          title: '只能提前30天预定',
          icon: 'none'
        })
        return false
      }*/
      
    }  
    if (!date.isDateTime(this.data.currDeliverDate /*+ ' ' + this.data.currDeliverTime*/) || this.data.currDeliverTime =="选择配送或自提时间")      {
      wx.showToast({
        title: '请选择配送或自提日期',
        icon: 'none'
      })
      return false
    }
    return true
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
        if(res.result==null){
          wx.showToast({
            title: '支付失败',
            icon: 'none',
          })
        }else{
          that.pay(res.result)
        }
        
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '付款失败',
          icon: 'none',
         
        })
        console.log("云函数payment提交失败：", res)
      },complete: () => {
        
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
        that.setData({
          orderStatusStr: '支付成功',
          orderStatus: ORDER_PAY
        })
        wx.hideLoading()
        wx.showToast({
          title: '付款成功',
          icon: 'success',
          duration: 2000
        })
        console.log("支付成功：", res)
        //巧妙利用小程序支付成功后的回调，再次调用云函数，通知其支付成功，以便进行订单状态变更
        that.updaePayOK()
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
  updaePayOK: function (){
    let that = this;
    if (that.data.orderId == null || that.data.orderId == undefined) {
      wx.showToast({
        title: '付款失败',
        icon: 'none'
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
        orderStatus:ORDER_PAY
      },
      success(res) {
        /**
         * 整个订单 支付 更新状态成功
         */
        console.log("更新订单状态成功",res)
        
        //关闭当前页面 跳转到订单详情页
        wx.redirectTo({
          url: '../../order/order_detail/order_detail?orderid=' + that.data.orderId
        })
        //跳转订单详情
      },
      fail(res) {
        console.log("更新订单状态失败", res)
        that.setData({
          orderStatusStr: '更新订单状态',//用户点击按钮时就 重新更新
          
        })
      },
      complete(res) {
        wx.hideLoading()
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
  generateCode:function () {
    let that=this
    let promise = new Promise(function (resolve, reject) {
      let code = that.getRandomCode();
      that.queryCode(code).then(res => {
        if (res[0]) {
          //  需要结束
          console.log("最终商户订单号",code)
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
getRandomCode :function () {
    let code = "";
    const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'/*, 'a', 'b', 'c', 'd', 'e',
      'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
      'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'*/];

    for (let i = 0; i < 8; i++) {
      let id = Math.round(Math.random() * 9);
      code += array[id];
    }
    return Date.parse(new Date()).toString()+ code;
  },

/**
 * 从云数据库中查询code
 */
 queryCode:function (code) {
    let promise = new Promise(function (resolve, reject) {
      //  result[0] 代表是否需要结束，true：需要结束，false：不需要结束
      var result = [false, ""];

      wx.cloud.callFunction({
        name: "manageOrder",
        data: {
          command:"checkOut_trade_noRepeat",
          out_trade_no: code
        },
        success: res => {
          console.log("商户订单号重复校验结果",res)
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
  }
})