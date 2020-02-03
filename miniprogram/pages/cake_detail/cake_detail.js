
const app = getApp()
Page({
  data: {
    //商品信息，假装请求到的信息
    cakeId:'',
    sizePrice: 0,
    stylePrice: 0,
    candle: '', //备注蜡烛说明
    blessing: '', //字牌祝福语
    buyCount: 1, //选择的购买数量 默认1
    styleImgSelect: '', //选中的口味图片 
    styleNameSelect: '', //选择的口味 主页面显示
    sizeNameSelect: '', //选择的尺寸 主页面显示
    styleIdSelect: '0', // 选中的口味ID 判断是否选中口味 选择框变色
    cakeSizeSelect: '0', //判断是否选中尺寸 选择框变色
    isHidden: 1, //是否隐藏选择框
    animationData: {}, //弹框动画
    popOpacityAnimation: {}, //遮罩层颜色动画
    showModalStatus: false, //显示遮罩
    select: 0,   //商品详情、参数切换
    swiperImgHei: '',//swiper的高度
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cakeId: options.cakeid,
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getCakeDetail(this.data.cakeId)
    this.setData({
      "isIphoneX": this.isIphoneX()
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onReady: function () {
   
    // Do something when page ready.
  },
  //重载 用户下拉 刷新
  onPullDownRefresh:function(){
    this.getCakeDetail(this.data.cakeId)
  },
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px";
    //等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    //swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      swiperImgHei: swiperH　　　　　　　　//设置高度
    })
  },
  /**
   * 分享按钮
   */
  shareActionSheet:function(){
    wx.showActionSheet({
      itemList: ['分享朋友圈', '发送给朋友', '生成海报'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  getCakeDetail:function(cakeId){

    var that = this;
    //上页面传过来的参数 cakeId参数
    var cakedata = {};
    wx.cloud.callFunction({
      data: {
        "cakeid": cakeId
      },
      name: 'getCakeDetail',
      success: res => {
        console.log('callFunction getCakeDetail: ', res.result.data);
        cakedata = res.result.data;

        var cakeStyles = cakedata.style; //商品花色信息 
        //循环获取口味的图片 给swiper使用
        var imgStyleArray = [];
        for (var i = 0; i < cakeStyles.length; i++) {
          /*var jo = {
            style_image: cakeStyles[i].styleimgpath,
            style_id: cakeStyles[i].styleid,
          }*/
          imgStyleArray.push(cakeStyles[i].styleimgpath);
        };
        that.setData({ //商品
          styleImgSelect: cakedata.mainPic[0],//默认显示的口味图片 主图1
          imgStyleArray: imgStyleArray, //蛋糕口味图片数组，用于点击预览
          imgMainArray: cakedata.mainPic, //蛋糕主图图片，用于顶部滑动显示
          cakedata: cakedata,
          popOpacity: 0.0,
        
        });
        wx.hideLoading();
      },
      fail(res){
        wx.hideLoading();
        wx.showToast({
          title: '加载失败',
          icon:'none'
        })
      },
      complete(res){
        wx.stopPullDownRefresh()
      }
      

    });
  },
  /**选择口味 */
  chooseStyle: function(data) {
    var that = this;
    var style_id = data.currentTarget.dataset.select;
    var style_name = data.currentTarget.dataset.styleName;
    var style_price = data.currentTarget.dataset.stylePrice;
    //把选中值，放入判断值中
    that.setData({
      styleNameSelect: style_name, //选中的口味名称
      styleIdSelect: style_id, //选中的口味ID
      styleImgSelect: data.currentTarget.dataset.img,
      stylePrice: style_price
    })
  },
  /**选择尺寸 */
  chooseCakeSize: function(data) {
    var that = this;
    var size_id = data.currentTarget.dataset.select;
    var size_name = data.currentTarget.dataset.sizeName; //注意wxml为data-size-name
    //把选中值，放入判断值中
    that.setData({
      sizeNameSelect: size_name,
      cakeSizeSelect: size_id,
      sizePrice: data.currentTarget.dataset.sizePrice
    })


  },

  /**点击选择口味 尺寸按钮、显示弹出页面 */
  viewStyleArea: function(data) {
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
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        popOpacityAnimation: animationOpacity.export(),
        animationData: animation.export(),
      })
    }, 100)

  },
  /**隐藏选择口味弹框 */
  hideModal: function(data) {

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
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        showModalStatus: false,
        isHidden: 1,//隐藏
      })
    }, 500)


  },
  //注意：上面的550是你弹框的高度rpx，上面的catchtouchmove是弹框显示的时候防止地图的遮罩层滚动
  toCatch: function() {
    return false;
  },
  //增加购买数量
  buyCountAdd: function(data) {

    var that = this;
    var buyCount = that.data.buyCount + 1;
    that.setData({ //商品数量+1
      buyCount: buyCount
    })

  },
  buyCountReduce: function(data) {

    var that = this;
    var buyCount = that.data.buyCount - 1;
    that.setData({ //商品数量+1
      buyCount: buyCount
    })

  },
  /**商品详情、参数切换 */
  changeArea: function(data) {
    var that = this;
    var area = data.currentTarget.dataset.area;
    that.setData({
      "select": area
    });

  },
  //获取用户输入的祝福语 字牌
  blessingInput: function(e) {
    this.setData({
      blessing: e.detail.value
    })
  },
  //获取用户输入的备注
  candleInput: function(e) {
    this.setData({
      candle: e.detail.value
    })
  },
  /**
   * 加入购物车
   */
  addCart: function() {
    var that = this;
    var orderdata = that.getSubmitData()
    if (orderdata == null) {
      return;
    }
 
    wx.showToast({
      title: '',
    })
    console.log("orderInfor", orderdata)

    wx.cloud.callFunction({
      name: "manageCart",
      data: {
        command: "add",
        orderData: orderdata
      },
      success(res) {
        app.flushCartNum()
        app.flushCartStatus();
        console.log("云函数manageCart ADD提交成功：", res.result)
      },
      fail(res) {
       /* wx.showToast({
          title: '加入失败',
          icon: 'none',
        })*/
        console.log("云函数manageCart ADD提交失败：", res)
      }, complete: () => {
         wx.hideLoading()
      }
    })



  },
  /**
   * 生成订单 点击立即购买
   */
  saveOrder: function(data) {
    wx.showLoading({
      title: '',
    })
    var goodData = this.getSubmitData()
    if (goodData ==null){
      wx.hideLoading()
      return;
    }
    let goods=[]
    goods.push(goodData)
    wx.setStorageSync('goods', goods);
    wx.navigateTo({
      url: '../cart/confirmation_order/confirmation_order',
      // 提交订单
      complete(res) {
        wx.hideLoading()
      }
    })

  },
  getSubmitData:function(){
    var that = this;
    var thatData = that.data;
    var orderdata = {
      "cakeId": thatData.cakeId,
      "cakeName": thatData.cakedata.cakename,
      "cakeImage": thatData.cakedata.mainPic[0],

      "cakeSize": thatData.sizeNameSelect,
      "cakeSizeId": thatData.cakeSizeSelect,


      "style": thatData.styleNameSelect,
      "styleId": thatData.styleIdSelect,

      "stylePrice": thatData.stylePrice.toFixed(2),
      "sizePrice": thatData.sizePrice.toFixed(2),
      "singlePrice": (thatData.stylePrice + thatData.sizePrice).toFixed(2),
      "buyCount": thatData.buyCount,
      "totalPrice": ((thatData.stylePrice + thatData.sizePrice) * thatData.buyCount).toFixed(2),

      "candleDesc": thatData.candle,
      "blessing": thatData.blessing,
      
      
    }
    if (that.checkSubmitData(orderdata) == false) {
      that.viewStyleArea();
      return null
    }else{
      return orderdata
    }


  },
  /**
 * 检查数据是否正常
 */
  checkSubmitData: function (submitdata) {
    /*  var exp = undefined;
      if (exp == undefined) {
        console.log("undefined");
      }
      exp=null
      if (exp == null) {
        console.log("null");
      }
      exp=''
      if (exp =='') {
        console.log("空1");
      }
      exp = ""
      if (exp == '') {
        console.log("空2");
      }
      exp = ""
      if (exp.length ==0 ) {
        console.log("空3");
      }
       return*/

    for (var o in submitdata) {
      if (submitdata[o] == null || submitdata[o] == undefined || submitdata[o].length == 0) {
        if (o == "candleDesc" || o == "blessing") {//非必填
          continue
        }
        //未显示 选择框则不显示提示信息
        if (this.data.isHidden==0){
            wx.showToast({
              title: '还没有选择口味',
              icon: 'none'
            })
        }
        console.log(o, submitdata[o]);
        console.log('==', typeof (submitdata[o]));
        return false
      }
      //数字必须大于0 配送费和折扣可为0
      if (!isNaN(submitdata[o]) && submitdata[o] <= 0 && o!="stylePrice") {
        console.log('付款金额错误', o + '=' + submitdata[o]);
        return false
      }

    }
  },

  /**
   * 查看轮播图片
   */
  seeSwiperAll: function(e) {
    //console.log("SSS", e.currentTarget.dataset.img);
    this.seePreviewImg(0, e.currentTarget.dataset.img)
  },
  /**
   * 查看花色图片 
   * */
  seeStylesAll: function(e) {
    this.seePreviewImg(1, e.currentTarget.dataset.img);

  },
  /**
   * 预览图片
   * 
   * 无法显示本地图片！！！！！！！
   * 无法显示本地图片！！！！！！！
   * 无法显示本地图片！！！！！！！
   * 
   * @pd 0表示轮播图 、 1表示花色
   */
  seePreviewImg: function(pd, showImg) {
    var that = this;
    var imgArray=[]
    if (pd == 0) {
      imgArray = that.data.imgMainArray;//保存的主图
    } else if (pd == 1) {//imgStyleArray 保存的口味图片
      imgArray = that.data.imgStyleArray;
    }

    wx.previewImage({
      current: showImg, // 当前显示图片的http链接
      urls: imgArray // 需要预览的图片http链接列表
    })
  },
  /**
   * IPHONE X系列底部会被遮挡
   * IPHONE 11系列也会
   */
  isIphoneX() {
    let info = wx.getSystemInfoSync();
    let infoX = info.model.substring(0, 8)
    let info11 = info.model.substring(0, 9)
   // console.log('info.model', infoX)
   // console.log('info.model', info11)
    if (/iPhone X/i.test(infoX) || /iPhone 11/i.test(info11)) {
      return true;
    } else {
      return false;
    }
  }
})