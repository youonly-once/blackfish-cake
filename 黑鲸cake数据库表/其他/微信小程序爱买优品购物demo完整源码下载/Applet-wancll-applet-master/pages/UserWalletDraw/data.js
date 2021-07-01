const APP = getApp();
const cardNameMapping = {
  '中国农业银行': { color: '#018a6e', fontClass: 'icon-nongyeyinxing' },
  '中国建设银行': { color: '#0c4290', fontClass: 'icon-jiansheyinxing' },
  '中国工商银行': { color: '#b0091a', fontClass: 'icon-gongshangyinxing' },
  '中国银行': { color: '#d90000', fontClass: 'icon-zhongguoyinxing' },
  '招商银行': { color: '#cb0101', fontClass: 'icon-zhaoshangyinhangbank1193432easyiconnet' },
  '光大银行': { color: '#52047b', fontClass: 'icon-guangdayinxing' },
  '中国邮政储蓄银行': { color: '#0b6c37', fontClass: 'icon-youzhengyinxing' },
  '兴业银行': { color: '#143981', fontClass: 'icon-changyonglogo05' },
  '中信银行': { color: '#d50202', fontClass: 'icon-zhongxinyinxing' },
  '浦发银行': { color: '#062561', fontClass: 'icon-pufayinxing' },
  '广发银行': { color: '#a01d1d', fontClass: 'icon-yinhangqia' },
  '平安银行': { color: '#f15a21', fontClass: 'icon-yinhangqia' },
  '交通银行': { color: '#003267', fontClass: 'icon-jiaotongyinxing' },
  '华夏银行': { color: '#d50202', fontClass: 'icon-changyonglogo17' },
  '民生银行': { color: '#28a1a3', fontClass: 'icon-minshengyinxing' },
};
export function getData(that) {
  APP.ajax({
    url: APP.api.myBankCard,
    header: {
      'page-limit': 10,
      'page-num': that.data.pageNum
    },
    success(res) {
      let newList = res.data.map(i => {
        i.fontClass = cardNameMapping[i.bank_name].fontClass;
        i.color = cardNameMapping[i.bank_name].color;
        return i;
      })
      that.setData({
        cards: that.data.cards.concat(newList),
        pageNum: ++that.data.pageNum,
      })
    }
  })
}

export function submit(that) {
  APP.ajax({
    url: APP.api.withdraw,
    data: {
      asset_type: 'money',
      type: 'withdrawToBankCard',
      money: that.data.money,
      bank_card_id: that.data.card.id,
      pay_password: that.data.pass
    },
    success(res) {
      wx.showToast({
        title: res.msg,
        type: 'none'
      })
      that.togglePassPopup();
    }
  })
}