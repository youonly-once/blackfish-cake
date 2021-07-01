const APP = getApp();
import { uploadFile } from '../../utils/common.js';
Page({
  data: {
    name: '',
    idcard: '',
    idcardFront: APP.imgs.idcardFrontExample,
    idcardBack: APP.imgs.idcardBackExample,
    uploadCardFront: APP.imgs.uploadCardFront,
    uploadCardBack: APP.imgs.uploadCardBack,

    status: '',
    id: '',

    loading: false,
  },
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id,
        status: options.status
      })
    }
  },
  onReady: function () {

  },
  nameChange(e) {
    this.setData({
      name: e.detail.value
    })
  },
  idcardChange(e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  uploadFile(e) {
    let that = this;
    uploadFile((imgPath) => {
      that.setData({
        [e.currentTarget.dataset.type]: imgPath,
      })
    })
  },
  submit() {
    if (!this.data.name) {
      wx.showToast({
        title: '请填写真实姓名',
        icon: 'none'
      });
      return;
    }
    if (!this.data.idcard) {
      wx.showToast({
        title: '请填写身份证号码',
        icon: 'none'
      });
      return;
    }
    if (this.data.idcardFront == APP.imgs.idcardFrontExample) {
      wx.showToast({
        title: '情上传身份证正面照',
        icon: 'none'
      });
      return;
    }
    if (this.data.idcardBack == APP.imgs.idcardBackExample) {
      wx.showToast({
        title: '情上传身份证反面照',
        icon: 'none'
      });
      return;
    }

    let data = {
      id_card_front_img: this.data.idcardFront,
      id_card_back_img: this.data.idcardBack,
      status: 1,
      name: this.data.name,
      id_card: this.data.idcard
    };
    let url = '';
    if (this.data.id) {
      url = APP.api.updateAuthInfo;
      data.id = this.data.id
    } else {
      url = APP.api.submitAuthInfo;
    }
    this.setData({
      loading: true
    })
    APP.ajax({
      url: url,
      data: data,
      success(res) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack();
        }, 500)
      }
    })
  },
  onShareAppMessage: function () {

  }
})