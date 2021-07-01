
var app = getApp()
Page({
  data: {
    // content:'自定义toast组件',
    toastText:'提交成功',
    showtoast:'none',
    isuploaderror:0,
    picpath:[],
    clicksex:0,
    addrtip:'block',
    showaddress:'none',
    clickId: 0,
    date: '2016-09-01',
    goodspic: 'http://only5201314.com/uploads/2017/04/181412206332.jpg',
    goodsTitle: '火狐之猎---驾驶雪上摩托，穿上雪谢在芬兰追猎北极光个第一给我',
    nowPrice: '20.00',
    src: '',
    goodsNumber: '1',
    username:'',
    sexs:['男','女'],
    region:['江西省','南昌市','西湖区'],
    moreaddr:'',
    hobbys: [{ name: '看书', value: '0', checked: true },
    { name: '动漫', value: '1', checked: false },
    { name: '游泳', value: '2', checked: false },
    { name: '打游戏', value: '3', checked: false },
    { name: '写代码', value: '4', checked: false }  ],
    introducetext:'',
    introduce: 'block',
    hobby: 'block',
    address: 'block',
    birthday: 'block',
    sex: 'block',
    name: 'block',
    cardstate: '（未购买）',
    needmoney: 'block',
    payaction: '购买'
  },
  // onLoad: function(){
  //   let app = getApp();
  //   new app.ToastPannel();
  // },
  // openToastPannel:function(){
  //   this.show(this.data.content);
  // },
  // 爱好选择
  hobbysChange: function (e) {
    console.log(e.detail)
    var hobbys = this.data.hobbys;
    // console.log(hobbys)
    // console.log(e.detail.value)
    // hs选择的爱好数组集合
    var hs = [];
    for(i in e.detail.value){
       hs[i] = hobbys[i].name 
    }
    console.log(hs)
    var checkArr = e.detail.value;
    for (var i = 0; i < hobbys.length; i++) {
      if (checkArr.indexOf(i + "") != -1) {
        hobbys[i].checked = true;
      } else {
        hobbys[i].checked = false;
      }
    }
    this.setData({
      hobbys: hobbys
    })
  }  ,
  // 表单提交
  formSubmit: function (e) {
    // 姓名的输入判断和提示
    if(this.data.username.length<1){
      this.setData({
        toastText:'请输入您的姓名',
        showtoast:'block'
      })
      var that = this;
     setTimeout(function hide(){
       that.setData({
         showtoast: 'none'
       })
     },3000)
      console.log('请输入您的姓名')
      return false;
    }
    // 地址选择的判断和提示
    // if(this.data.region.length<1){
    //   this.setData({
    //     toastText: '请选择您的地址',
    //     showtoast: 'block'
    //   })
    //   var that = this;
    //   setTimeout(function hide() {
    //     that.setData({
    //       showtoast: 'none'
    //     })
    //   }, 3000)
    //   console.log('请选择您的地址')
    //   return false;
    // }
    // 详细地址的输入判断和提示
    if(this.data.moreaddr.length<1){
      this.setData({
        toastText:'请输入您的详细地址',
        showtoast:'block'
      })
      var that = this;
     setTimeout(function hide(){
       that.setData({
         showtoast: 'none'
       })
     },3000)
      console.log('请输入您的详细地址')
      return false;
    }
    // 自我介绍的输入和提示
    if (this.data.introducetext.length < 1) {
      this.setData({
        toastText: '请介绍一下自己',
        showtoast: 'block'
      })
      var that = this;
      setTimeout(function hide() {
        that.setData({
          showtoast: 'none'
        })
      }, 3000)
      console.log('请介绍一下自己')
      return false;
    }
     if (this.data.picpath.length < 1) {
      this.setData({
        toastText: '您还没有上传图片哦',
        showtoast: 'block'
      })
      var that = this;
      setTimeout(function hide() {
        that.setData({
          showtoast: 'none'
        })
      }, 3000)
      console.log('您还没有上传图片哦')
      return false;
    }
    // 报名成功的提示
    this.setData({
      toastText: '报名成功',
      showtoast: 'block'
    })
    var that = this;
    setTimeout(function hide() {
      that.setData({
        showtoast: 'none'
      })
    }, 3000)
    // 报名成功后的跳转
    wx.redirectTo({
      url: '../paynow/paynow',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 输入名字
  nameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  // 详细地址
  addressText: function (e) {
    this.setData({
      moreaddr: e.detail.value
    })
  },
  // 自我介绍
  introduceText:function(e){
    this.setData({
      introducetext: e.detail.value
    })
    console.log(e.detail.value)
  },
  // 选择性别
  chooseSex:function(e){
    var that = this;
    console.log(e.currentTarget)
    that.setData({
      clicksex: e.currentTarget.id
    })
    console.log(that.data.sexs[e.currentTarget.id])
  },
  // 选择生日
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 选择爱好
  choosehobby:function(e){
    var that = this;
    console.log(e.currentTarget)
    that.setData({
      clickId: e.currentTarget.id
    })
  },
// 选择地址
  bindRegionChange: function (e) {
    console.log(e.detail.value)
    var addr = e.detail.value;
    this.setData({
      region: addr,
      addrtip:'none',
      showaddress:'block'
    })
  },
  // 商品数量加
  add: function (e) {
    var num = this.data.goodsNumber;
    num++;
    this.setData({
      goodsNumber: num
    })
  },
  // 商品数量减
  reduce: function () {
    var num = this.data.goodsNumber;
    if (num > 1) {
      num--;
      this.setData({
        goodsNumber: num
      })
    }
  },
  // 跳转到购买粉丝卡的页面
  buycard: function () {
    wx: wx.navigateTo({
      url: '../buynow/buynow',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 上传图片
  uploadImage: function (e) {
    var that = this;
    that.setData({
      isuploaderror: 0
    });
    var nowLen = that.data.src.length;
    var remain = 9 - nowLen;
    wx.chooseImage({
      count: remain,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var length = res.tempFilePaths.length; //总共个数
        var i = 0; //第几个
        console.log(res.tempFilePaths, successUp, failUp, i, length);
        var nowpic = this.data.picpath.concat(res.tempFilePaths)
        that.setData({
          picpath: nowpic
        })
      },
    });
  },
  // 删除图片
  deleteImg: function (e) {
    console.log(this.data.picpath)
    var images = this.data.picpath;
    var index = e.currentTarget.dataset.index;
    images.splice(index, 1);
    console.log(images)
    this.setData({
      picpath:images
    })
  }
})