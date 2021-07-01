const APP = getApp();
import PagingData from '../../utils/PagingData';
const Paging = new PagingData();
Page({
  data: {
    cartsList: [], // 购物车商品信息列表包含了sku信息组合

    selectObj: {}, // 选择的商品列表
    allPreice: 0.00, // 商品的总价
    goodsInfo: '',    // 商品详细信息
    thisClickId: '', // 当前编辑的那个商品
    selectAll: false,
    showBottomPopup: false,
    
    // 分页功能
    FPage: {
      pageNum: 1,
      hasData: true,
      noContent: false,
      noContentImg: APP.imgs.noContentImg
    },
    
    selectObjlen: 0,
  },
  onLoad(options) {

  },
  // 页面新显示的时候
  onShow: function () {
    // 初始化数据
    this.setData({
      selectObj: {},
      selectAll: false,
      cartsList: [],
      allPreice: 0.00,
      'FPage.pageNum': 1,
      thisClickId: '',
      selectObjlen: 0
    },()=>{
      // 初始化加载
      Paging.init({
        type: 2,
        that: this,
        url: 'getCartsAll',
        pushData: 'cartsList',
        getFunc: this.getOrderData
      })
      this.getOrderData()
      return
      // 判断登录状态
      if (!wx.getStorageSync('token')) {
        wx.redirectTo({
          url: '/pages/ComLogin/index',
        })
      } else {
        this.getOrderData()
      }
    })
  },
  // 获取分页数据
  getOrderData() {
    Paging.getPagesData()
  },
  // 上拉加载
  onReachBottom() {
    this.getOrderData()
  },
  // 下拉刷新
  onPullDownRefresh() {
    Paging.refresh()
  },
  // 更新sku数据
  confirm(e) {
    this.closeBottomPopup()
    let data = this.findItemById()
    data.spec_group_id = e.detail.findSku.id;
    this.update(data)
  },
  // 更新数量数据数据
  update(data) {
    let index = data.index;
    let cartsList = this.data.cartsList;
    APP.ajax({
      url: APP.api.getCartsUpdate,
      data: data,
      success: res => {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 500
        });
        this.setData({
          [`cartsList[${index}]`]: res.data
        }, () => {
          this.allPreice()
        })
      }
    })
  },
  // 找到当前编辑的那个宝贝信息
  findItemById() {
    let cartsList = this.data.cartsList;
    let index = cartsList.findIndex(item => {
      return item.id == this.data.thisClickId
    })
    let oneItem = cartsList[index]
    // 返回需要发送的信息
    return {
      index: index,
      id: this.data.thisClickId,
      goods_id: oneItem.goods_id,
      num: oneItem.num,
      spec_group_id: oneItem.spec_group_id,
    }
  },
  // 校验当前是全选还是非全选
  checkSelectAll() {
    let listLen = this.data.cartsList.length;
    let objLen = Object.keys(this.data.selectObj).length;
    let selectAll = objLen == listLen ? true : false;
    this.setData({
      selectAll: selectAll
    })
  },
  // 全选按钮
  selectAll() {
    this.setData({
      selectAll: !this.data.selectAll
    }, () => {
      let cartsList = this.data.cartsList;
      let selectObj = {};
      if (this.data.selectAll) {
        cartsList.forEach(item => {
          selectObj[item.id] = true;
        });
      }
      this.setData({
        selectObj: selectObj,
        selectObjlen: Object.keys(selectObj).length
      }, () => {
        this.allPreice()
      })
    })
  },
  // 总价计算
  allPreice() {
    let selectObj = this.data.selectObj;
    let cartsList = this.data.cartsList;
    let allPreice = 0;
    cartsList.forEach(item => {
      if (selectObj[item.id]) {
        let num = item.num;
        let price = 0;
        if (item.spec_group_info.sell_price) {
          price = item.spec_group_info.sell_price;
        } else {
          price = item.goods_info.sell_price;
        }
        let sum = price * num;
        allPreice += sum;
      }
    });
    this.setData({
      allPreice: allPreice
    })
  },
  // 单个宝贝的选择
  select(e) {
    let selectObj = this.data.selectObj;
    let id = APP.utils.getDataSet(e, 'id');
    if (selectObj[id]) {
      delete selectObj[id];
    } else {
      selectObj[id] = true
    }
    this.setData({
      selectObj: selectObj,
      selectObjlen: Object.keys(selectObj).length
    }, () => {
      this.checkSelectAll()
      this.allPreice()
    })
  },
  // 点击减的按钮
  minus(e) {
    let id = APP.utils.getDataSet(e, 'id');
    this.setData({
      thisClickId: id,
    }, () => {
      let sendData = this.findItemById();
      if (sendData.num == 1) {
        return;
      } else {
        sendData.num -= 1;
      }
      this.update(sendData)
    })
  },
  // 点击加的按钮
  plus(e) {
    let id = APP.utils.getDataSet(e, 'id');
    this.setData({
      thisClickId: id,
    }, () => {
      let sendData = this.findItemById();
      sendData.num += 1;
      this.update(sendData);
    })
  },
  // 打开弹出层
  openBottomPopup(e) {
    let goodsinfo = APP.utils.getDataSet(e, 'goodsinfo');
    let index = APP.utils.getDataSet(e, 'index');
    let id = APP.utils.getDataSet(e, 'id');
    if (!goodsinfo.goods_spec_group_info.length) {
      return
    }
    this.setData({
      showBottomPopup: true,
      thisClickId: id,
      goodsInfo: this.data.cartsList[index].goods_info,
      sendfindsku: this.data.cartsList[index].spec_group_info,
    }, () => {
      this.selectComponent("#selectsku").refresh();
    })
  },
  // 关闭弹出层
  closeBottomPopup() {
    this.setData({
      showBottomPopup: false
    })
  },
  // 批量删除购物车
  deleteCarts() {
    let keys = Object.keys(this.data.selectObj);
    wx.showModal({
      title: '提示',
      content: '确定要删除这些商品吗？',
      success: res => {
        if (res.confirm) {
          APP.ajax({
            url: APP.api.getCartsDelete,
            data: {
              id: keys
            },
            success: res => {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
              this.setData({
                selectObj: {},
                selectAll: false,
                cartsList: [],
                allPreice: 0.00,
                pageNum: 1,
                thisClickId: '',
                selectObjlen: 0
              }, () => {
                Paging.refresh()
              })
            }
          })
        }
      }
    })
  },
  // 批量加入收藏夹
  collectCarts() {
    let keys = Object.keys(this.data.selectObj);
    wx.showModal({
      title: '提示',
      content: '全部添加到收藏夹吗？',
      success: res => {
        if (res.confirm) {
          APP.ajax({
            url: APP.api.getCartsColleSave,
            data: {
              goods_ids: keys
            },
            success: res => {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  // 跳转到订单确认页面
  sendOrderAffirm() {
    let that = this;
    let orderConfirmGoodsList = [];
    this.data.cartsList.forEach(item => {
      if (that.data.selectObj[item.id]) {
        orderConfirmGoodsList.push({
          goodsInfo: item.goods_info,
          specGroupInfo: item.spec_group_info,
          num: item.num
        })
      }
    });
    if (!orderConfirmGoodsList.length) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return;
    }
    wx.setStorageSync('orderConfirmGoodsList', orderConfirmGoodsList);
    wx.navigateTo({
      url: '/pages/ComCreateOrder/index'
    })
  }
})