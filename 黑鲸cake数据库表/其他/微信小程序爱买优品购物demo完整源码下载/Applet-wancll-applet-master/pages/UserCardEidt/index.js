const APP = getApp();
const bank = [
  '请选择您的开户银行',
  '中国农业银行',
  '中国建设银行',
  '中国工商银行',
  '中国银行',
  '招商银行',
  '光大银行',
  '中国邮政储蓄银行',
  '兴业银行',
  '中信银行',
  '浦发银行',
  '广发银行',
  '平安银行',
  '交通银行',
  '华夏银行',
  '民生银行',
]
Page({
  data: {
    isEdit: false,
    id: 0,
    index: 0,
    bankArray: bank,
    enterName: '',
    enterCard: '',
    loading: false,
  },
  onLoad(options) {
    let that = this
    if (options.id != 'new') {
      APP.ajax({
        url: APP.api.myBankCardRead,
        data: { id: options.id },
        success(res) {
          that.setData({
            isEdit: true,
            index: that.selectBank(res.data.bank_name),
            enterName: res.data.card_holder,
            enterCard: res.data.card_number,
            id: res.data.id,
          })
        }
      })
    }
  },
  // 默认选择的银行
  selectBank(str) {
    let index = bank.findIndex((item) => {
      return item == str
    })
    return index;
  },
  bindPickerChange(e) {
    this.setData({ index: e.detail.value })
  },
  enterName(e) {
    this.setData({ enterName: e.detail.value })
  },
  enterCard(e) {
    this.setData({ enterCard: e.detail.value })
  },
  send() {
    let that = this;
    if (!that.data.enterName) {
      wx.showToast({
        title: '输入持卡人姓名',
        icon: 'none',
      })
      return
    }
    if (!that.data.enterCard) {
      wx.showToast({
        title: '输入卡号',
        icon: 'none',
      })
      return
    }
    if (!that.data.index) {
      wx.showToast({
        title: '请选择您的开户银行',
        icon: 'none',
      })
      return
    }
    let api = '';
    let toUrl = '';
    if (that.data.isEdit) {
      api = APP.api.myBankCardUpdate;
    } else {
      api = APP.api.myBankCardSave;
    }
    this.setData({
      loading: true,
    })
    APP.ajax({
      url: api,
      data: {
        id: that.data.id,
        bank_name: that.data.bankArray[that.data.index],
        card_holder: that.data.enterName,
        card_number: that.data.enterCard
      },
      success(res) {
        wx.showToast({ title: res.msg, icon: 'none', });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000)
      }
    })
  },
  deleteCard() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该银行卡吗？',
      success: function (res) {
        if (res.confirm) {
          APP.ajax({
            url: APP.api.myBankCardDelete,
            data: { id: that.data.id },
            success: (res) => {
              wx.showToast({ title: res.msg, icon: 'none', });
              setTimeout(() => {
                wx.navigateBack();
              }, 1000)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }
})