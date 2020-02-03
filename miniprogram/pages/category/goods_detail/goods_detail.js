const http = require("./../../../utils/http.js");
const cart = require("./../../../utils/cart.js");
const app = getApp()

Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    showSku:false,
    showSkuContainer:false,
    interval: 5000,
    duration: 1000,
    goodsId:'',
    goods:'',
    standards:'',
    animationData: {},
    selecedtSku:'',
    skuNames:[],
    standardValueIds:[],
    purchaseNum:1,
    cartNum:0
  },

  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      goodsId:options.id
    })
    this.goodsDetail();
  },

  onReady:function(){
    this.flushCartNum();
  },

  /**
   * 更新购物车数量
   */
  flushCartNum:function(){
    cart.getCartNun(res => {
      let resData = res.data;
      if (resData.code == 0) {
        let num = resData.data;
        this.setData({ cartNum: num })
      }
    });
  },

  /**
   * 获取商品详情
   */
  goodsDetail:function(){
    http.get(`/goods/${this.data.goodsId}`, {}, res => {
      let resData          = res.data;
      let goods            = resData.data.goods;
      let standards        = resData.data.standards;
      let firstSku         = goods.sku[0];
      let skuNames         = this.data.skuNames;
      let standardValueIds = this.data.standardValueIds;
      firstSku.sku_standard_map.map(item=>{
        standards.map(standard=>{
          standard.standard_values.map(valueItem=>{
            if (item.standard_value_id == valueItem.id){
              valueItem.select = true;
              skuNames.push(valueItem.value);
              standardValueIds.push({ standard_id: standard.id, standard_value_id: valueItem.id});
            }
            return valueItem;
          })
          return standard;
        })
        return item;
      })     
      
      this.setData({
        goods: goods,
        standards: standards,
        selecedtSku:firstSku,
        skuNames: skuNames,
        standardValueIds: standardValueIds
      })
    });
  },

  /**
   * 切换sku
   */
  switchSku:function(e){
    let standardId       = e.currentTarget.dataset.standard_id;
    let valueId          = e.currentTarget.dataset.value_id;
    let standardValueIds = this.data.standardValueIds;
    let valueIds         = [];

    //standardValueIds记录了{ standard_id: standard.id, standard_value_id: valueItem.id }这样的一个数据结构
    //然后需要切换sku的时候，把其中的切换的替换掉就可以了，下面做的就是这个工作
    standardValueIds = standardValueIds.map(item=>{
      //查找到standard_id下的规格值，替换成新的规格ID
      if (item.standard_id == standardId){
        item.standard_value_id = valueId;
      }
      valueIds.push(item.standard_value_id);
      return item;
    })
    this.setData({ standardValueIds: standardValueIds})

    //获取到切换到所属的规格记录中，找到该商品的规格数据
    let theSku = '';
    let sku = this.data.goods.sku;
    for(let i=0; i<= sku.length; i++){
      let ret = true;
      sku[i].sku_standard_map.map(item=>{
        //判断sku记录中该规格的规格值是否都存在于valueIds中，如果全部都存在，说明就是我们要找的数据
        if (valueIds.indexOf(item.standard_value_id) < 0){
          ret = false;
        }
      })
      //全部都对了
      if(ret == true){
        theSku = sku[i];
        break;
      }
    }

    //查找需要选中的规格
    let skuNames = [];
    let standards = this.data.standards;
    standards.map(standard => {
      standard.standard_values.map(valueItem => {
        //判断是否是同一个规格下的规格值
        if(standard.id == standardId){
          if (valueItem.id == valueId) {
            valueItem.select = true;
            skuNames.push(valueItem.value);
          } else {
            valueItem.select = false;
          }
        } else if(valueItem.select == true){
          skuNames.push(valueItem.value);
        }
        return valueItem;
      })
      return standard;
    })

    this.setData({
      selecedtSku:theSku,
      skuNames: skuNames,
      standards: standards
    })
  },

  /**
   * 选择sku
   */
  selectSku: function(e) {
    // 用that取代this，防止不必要的情况发生
    this.setData({ showSkuContainer:true})
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 300,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(600).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      showSku: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  /**
   * 关闭sku选择面板
   */
  closeSku: function (e) {
    var that      = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(500).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        showSku: false
      })
    }, 200)

    setTimeout(function(){
      that.setData({
        showSkuContainer: false
      })
    },220)
  },

  /**
   * 加入购物车
   */
  firstAddCard:function(){
    if(this.data.goods.sku_type == 1){
      //打开规格页面
      this.selectSku();
    }else{
      //加入后台购物车
      this.postToCart();
    }
  },

  /**
   * 加入购物车
   */
  addCar:function(){
    this.closeSku();
    //加入后台购物车
    this.postToCart();
  },

  /**
   * 提交数据到后台
   */
  postToCart:function(){
    cart.submitCart(this.data.selecedtSku.id, this.data.purchaseNum,true,res=>{
      app.flushCartStatus();
      this.flushCartNum();
    })
  },

  /**
   * 跳往购物车页面
   */
  toCart:function(){
    wx.switchTab({
      url: '/pages/cart/index/index'
    })
  },

  /**
   * 更新购买数量
   */
  updatePurchase:function(e){
    let type        = e.currentTarget.dataset.type;
    let purchaseNum = this.data.purchaseNum;
    let limitNum    = this.data.goods.limit_purchase_num;
    if(type == 0){
      if(purchaseNum<=1){
        return false;
      }
      this.setData({
        purchaseNum: purchaseNum - 1
      })
    }else{
      if (this.data.goods.limit_purchase_num > 0 && purchaseNum >= limitNum){
        wx.showToast({
          title: '限购数量：' + limitNum,
          icon: "none"
        })
        return false;
      }
      this.setData({
        purchaseNum: purchaseNum + 1
      })
    }
  }
})