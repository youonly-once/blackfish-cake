const APP = getApp();
Page({

  data: {
    ali: {},
    wx:{},
    hidden: true,
    nocancel: false,
    account:'',
    name:'',
  },
  onLoad: function (options) {
    this.getData();
  },
  getData(){
    APP.ajax({
      url: APP.api.userRhirdAcc,
      success: res => {
        let ali = res.data.find(item=>{
          return item.client_type == 'applet' && item.type =='ali' 
        })
        let wx = res.data.find(item => {
          return item.type == 'wechat'
        })
        this.setData({
          ali: ali,
          wx: wx
        })
      }
    })
  },
  bindAccunt:function(e){
    this.setData({
      account: e.detail.value
    });
  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  // 打开模态框
  bindAliAccunt:function(){
    this.setData({
      hidden: false
    });
  },
  cancel: function () {
    this.setData({
      hidden: true,
      account: '',
      name: '',
    });
  },
  confirm: function () {
    this.setData({
      hidden: true
    });
    wx.showLoading({
      title: '提交中...',
    })
    APP.ajax({
      url: APP.api.userRhirdUpdate,
      data: {
        type: 'ali',
        account: this.data.account,
        name: this.data.name
      },
      success: res => {
        this.setData({
          account: '',
          name: '',
        })
        wx.hideLoading()
        wx.showToast({
          title: res.msg,
          icon: 'none',
        })
        setTimeout(() => {
          this.getData()
        }, 500)
      }
    })
  },
  bindWeiChartAccunt(){
    wx.showLoading({
      title:'正在绑定...'
    })
    // 微信登录获取临时code
    wx.login({
      success:(res1) =>{
        // 通过临时code 从服务端换取 session_code,openid等信息，如果用户已经在其他平台登陆则可以直接获取union_id
        APP.ajax({
          url: APP.api.getSessionCode,
          data: {
            code: res1.code
          },
          success:(res2)=> {
            // console.log(res2.data)
            // wx.hideLoading();
            APP.ajax({
              url: APP.api.userRhirdUpdate,
              data: {
                type: 'wechat',
                account: res2.data.openid,
                name: 'openid',
              },
              success:(res3)=> {
                wx.hideLoading()
                wx.showToast({
                  title: res3.msg,
                  icon: 'none',
                })
                setTimeout(() => {
                  this.getData()
                }, 500)
              }
            })
           
          }
        })
      }
    })
  }
})