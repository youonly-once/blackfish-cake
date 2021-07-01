// components/order-detail/order-detail.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderId:{
      type:String,
      value:null,
      observer: function (newVal, oldVal) {//数组变化时回调该函数
        //console.log(typeof (newVal))
        if (newVal != null && newVal != undefined && newVal != ''){
            this.getorderInfors()
          }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
    isNoContent:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //订单详情页传递的信息
    getorderInfors: function () {
      let that = this
      wx.cloud.callFunction({
        name: 'manageOrder',
        data: {
          command: 'getSingleAndAddr',
          _id: that.data.orderId
        },
        success(res) {
          console.log("orderInfors", res);
          let list = res.result.list
          if (list.length == 0) {
            that.setData({
              isNoContent:true,
              isShow: false
            })
          } else {
            that.setData({
              orderInfors: list[0],
              addrObject: list[0].addrObject[0],
              isShow:true
            })
            that.setStatusDate()
            that.selectComponent("#refund-status").queryRefund1()
          }
          
          that.triggerEvent('getOrderInfor', list)
          
        },
        fail(res) {
          console.log("加载失败", res)

        },
        complete(res) {
          
        }
      })
    },
    setStatusDate: function () {
      this.setData({
        payShowDate: this.data.orderInfors.payDate.toString().substr(0, 10),
        sendShowDate: this.data.orderInfors.sendDate.toString().substr(0, 10),
        receiveShowDate: this.data.orderInfors.receiveDate.toString().substr(0, 10),
      })
    }, 
    chooseMapAddress: function () {
      var that = this
      wx.openLocation({
        name: "黑鲸烘培工作室",
        address: "重庆市大渡口区双园路1号附35号",
        latitude: app.globalData.storeLatitude,
        longitude: app.globalData.storeLongitude,
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
    getRealLocation: function () {
      this.setData({
        storeLatitude: app.globalData.storeLatitude,
        storeLongitude: app.globalData.storeLongitude,
      })
      var that = this;
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          //console.log(res)
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
              }, /*label: {
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
      distance = Math.round(distance / 1000)
      return distance
    },
    //跳转到商品详情页
    gotoCakeDetail: function (data) {
      let id = data.currentTarget.dataset.id
      wx.showLoading({
        mask: true,
        title: '',
      })
      wx.navigateTo({
        url: '/pages/CakeDetail/CakeDetail?cakeid=' + id,
        complete(res) {
          wx.hideLoading()
        }
      })
    },
    //下单后不允许更改地址
    chooseAddr: function () {
      wx.showToast({
        title: '下单后不允许更改地址',
        icon: 'none'
      })
    },
     call_custom: function (e) {
      wx.makePhoneCall({
        phoneNumber: app.globalData.customPhone //仅为示例，并非真实的电话号码
      })
    },

    gotoRefund() {
     if (this.data.orderInfors.status >= 6) {//用户已提交申请 跳转详情页
       wx.setStorageSync("orderInfors", this.data.orderInfors)
        wx.navigateTo({
          url: '/pages/OrderRefund/RefundDetail/RefundDetail',
        })
     } else if (this.data.orderInfors.status >= 2 && this.data.orderInfors.status<6) {//用户已付款，
       wx.setStorageSync("orderInfors", this.data.orderInfors)
        wx.navigateTo({
          url: '/pages/OrderRefund/OrderRefund',
        })
      } 
    }
  },
  lifetimes: {
    // 组件的生命周期函数，用于声明组件的生命周期
    attached() {
      //console.log(1)
      this.getRealLocation()
      
    },
    ready: () => {
     //console.log(2)
    },
    moved: () => {
      //console.log(3)
    },
    detached: () => {
      //console.log(4)
    },

  },
    /**
   * 对<2.2.3版本兼容
   */
  attached() {
    console.log(1)
    this.getRealLocation()

  }
})
