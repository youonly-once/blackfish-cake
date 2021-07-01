const APP = getApp()
Page({
  data: {
    // 轮播参数
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,

    // tab组件参数
    tabList: [{
      id: 1,
      title: '详情'
    }, {
      id: 2,
      title: '评价'
    }],
    tabListSelectedId: 1,
    tabListScroll: true,
    tabListHeight: 45,

    // 类型 是否有活动参与
    activityId: 0,
    discount: [], // 所有的活动数据
    discountItem: {}, // 当前显示宝贝的活动数据
    full: [],
    timeDown: '0天 00 : 00 : 00', // 倒计时

    // 数据
    goodsId: -1, //   商品的id
    goodsInfo: '', //  商品信息 read:res.data
    isCollect: 0, //  默认是否收藏

    comments: [], // comments:res.data
    lineValue: {}, // 当前点击的sku数据
    findSku: '', // 点击后筛选出的sku
    cartsDetail: [], // 加入购物车后返回的
    attrs: [], // 产品的属性列表

    // 控制
    showTab: 1,
    hasSku: false, // 是否含有sku内容
    hasAttr: false, // 是否有产品参数内容
    showSkuPopup: false,
    showAttrPopup: false,
    openType: '', // 打开sku的类型是点击加入购物车还是立即购买
  },
  onLoad(options) {
    // 请求活动数据
    if (options.discountid) {
      APP.ajax({
        url: APP.api.indexActivity,
        success: res => {
          this.setData({
            activityId: options.discountid,
            discount: res.data.discount ? res.data.discount : [],
            full: res.data.full ? res.data.full : [],
          }, () => {
            let rulesInfo = this.data.discount[0].rule_info;
            let ruleInfo = rulesInfo.find(item => {
              return item.goods_id == options.id
            });
            this.setData({
              discountItem: ruleInfo
            })
            // 默认执行一次
            APP.utils.timeDown(this, this.data.discount[0].end_timestamp * 1000)
            setInterval(() => {
              APP.utils.timeDown(this, this.data.discount[0].end_timestamp * 1000)
            }, 1000)
          })
        }
      })
    }

    // 请求商品数据
    APP.ajax({
      url: APP.api.detailRead,
      data: {
        id: options.id
      },
      success: res => {
        // 成功后请求sku模板数据
        APP.ajax({
          url: APP.api.detailTemplate,
          data: {
            goods_cate_id: res.data.goods_cate_id
          },
          success: rest => {
            // 判断是否有产品参数
            if (rest.data.attr_template.id) {
              this.setData({
                hasAttr: true,
                attrs: rest.data.attr_template.names
              })
            } else {
              this.setData({
                hasAttr: false,
                attrs: []
              })
            }
            // 判断是否有产品sku
            if (rest.data.spec_template.id) {
              this.setData({
                hasSku: true
              })
            } else {
              this.setData({
                hasSku: false
              })
            }
          }
        })
        // 图片富文本替换为宽度100%
        res.data.desc = res.data.desc.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block"')
        // 保存商品数据
        // console.log(res.data.desc)
        this.setData({
          goodsId: options.id,
          goodsInfo: res.data,
        }, () => {
          // 判断是否是登录状态 然后获取收藏状态
          if (wx.getStorageSync('token')) {
            this.isCollect()
          }
        })
      }
    })
    // 请求评论数据
    APP.ajax({
      url: APP.api.detailComments,
      data: {
        goods_id: options.id
      },
      success: res => {
        this.setData({
          comments: res.data.map(comment => {
            comment.user_info.nick_name = comment.user_info.nick_name ? comment.user_info.nick_name : '匿名用户';
            comment.user_info.avatar = comment.user_info.avatar ? comment.user_info.avatar : APP.imgs.avatar;;
            return comment;
          })
        })
      }
    })
  },
  // 倒计时

  // 默认加载时候判断是否收藏的商品
  isCollect() {
    APP.ajax({
      url: APP.api.detailCollect,
      data: {
        goods_id: this.data.goodsId
      },
      success: (res) => {
        this.setData({
          isCollect: res.data.is_collect
        })
      }
    })
  },
  // 点击的时候判断商品是否收藏
  changeCollect() {
    let token = wx.getStorageSync('token')
    if (!token) {
      wx.showToast({
        title: "请先登录",
        icon: 'none',
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/ComLogin/index'
        })
      }, 1000)
    } else {
      let url = '';
      if (this.data.isCollect) {
        url = APP.api.detailCollectCancel
      } else {
        url = APP.api.detailCollectSave
      }
      APP.ajax({
        url: url,
        data: {
          goods_id: this.data.goodsId
        },
        success: (res) => {
          wx.showToast({
            title: res.msg,
            icon: 'none',
          })
          let isCollect = res.data.id ? 1 : 0
          this.setData({
            isCollect: isCollect
          })
        }
      })
    }
  },
  // 点击购物车按钮
  goCarts() {
    wx.switchTab({
      url: '/pages/BarCarts/index'
    })
  },
  // 切换详情和评价
  changeTab() {
    let id = this.selectComponent("#tab").data.selectedId
    this.setData({
      showTab: id
    })
  },
  // 点击确定按钮关闭的时候
  confirm(e) {
    this.setData({
      lineValue: e.detail.lineValue,
      findSku: e.detail.findSku,
      showSkuPopup: false
    }, () => {
      let type = APP.utils.getDataSet(e, 'type');
      if (this.data.openType == "buy") {
        setTimeout(() => {
          this.sendBuyNow('buy')
        }, 500)
      } else if (this.data.openType == "carts") {
        setTimeout(() => {
          this.addCarts('carts')
        }, 500)
      }
    })
  },
  // 点击加入购物车
  addCarts(e) {
    let type = e == 'carts' ? 'carts' : APP.utils.getDataSet(e, 'type');
    this.setData({
      openType: type
    }, () => {
      let token = wx.getStorageSync('token')
      if (!token) {
        wx.showToast({
          title: "请先登录",
          icon: 'none',
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/ComLogin/index'
          })
        }, 1000)
      } else {
        if (this.data.hasSku) {
          if (this.data.findSku) {
            APP.ajax({
              url: APP.api.detailCartsSave,
              data: {
                goods_id: this.data.goodsInfo.id,
                spec_group_id: this.data.findSku.id,
                status: this.data.goodsInfo.status,
                num: 1
              },
              success: (res) => {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                })
                this.setData({
                  cartsDetail: [res.data]
                })
              }
            })
          } else {
            this.openSkuPopup();
          }
        } else {
          APP.ajax({
            url: APP.api.detailCartsSave,
            data: {
              goods_id: this.data.goodsInfo.id,
              spec_group_id: 0,
              status: this.data.goodsInfo.status,
              num: 1
            },
            success: (res) => {
              wx.showToast({
                title: res.msg,
                icon: 'none',
              })
              this.setData({
                cartsDetail: [res.data]
              })
            }
          })
        }
      }
    })
  },
  // 点击立即购买
  buyNow(e) {
    let type = e == 'buy' ? 'buy' : APP.utils.getDataSet(e, 'type');
    this.setData({
      openType: type
    }, () => {
      let token = wx.getStorageSync('token')
      if (!token) {
        wx.showToast({
          title: "请先登录",
          icon: 'none',
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/ComLogin/index'
          })
        }, 1000)
      } else {
        if (this.data.hasSku) {
          if (this.data.findSku) {
            this.sendBuyNow();
          } else {
            this.openSkuPopup();
          }
        } else {
          this.sendBuyNow();
        }
      }
    })
  },
  // 跳转到订单详情页
  sendBuyNow() {
    if (this.data.hasSku) {
      wx.setStorageSync('orderConfirmGoodsList', [{ goodsInfo: this.data.goodsInfo, specGroupInfo: this.data.findSku, num: 1 }])
    } else {
      wx.setStorageSync('orderConfirmGoodsList', [{ goodsInfo: this.data.goodsInfo, specGroupInfo: 0, num: 1 }])
    }
    wx.navigateTo({
      url: `/pages/ComCreateOrder/index?isDiscountGoods=${this.data.activityId}`
    })
  },
  // 打开弹出层sku选择器
  openSkuPopup() {
    this.setData({
      showSkuPopup: true
    })
  },
  // 子组件的关闭按钮点击时候也同时关闭
  closeSkuPopup() {
    this.setData({
      showSkuPopup: false
    })
  },
  // 打开弹出层sku选择器
  openAttrPopup() {
    this.setData({
      showAttrPopup: true
    })
  },
  // 子组件的关闭按钮点击时候也同时关闭
  closeAttrPopup() {
    this.setData({
      showAttrPopup: false
    })
  },
  onShareAppMessage: function () {
    return {
      title:this.data.goodsInfo.name,
      path: `${this.route}?id=${this.data.goodsId}`
    }
  }
})