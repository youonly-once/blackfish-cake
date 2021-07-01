const APP = getApp();
export function getOtherData(that) {
  // 获取首页轮播图  
  let proImgUrls = new Promise((resolve) => {
    APP.ajax({
      url: APP.api.indexBanners,
      data: {
        type: "wap首页轮播"
      },
      success: (res) => {
        resolve(res.data);
      }
    })
  })
  // 获取首页公告  
  let proNotice = new Promise((resolve) => {
    let notice = {};
    notice.img = APP.imgs.notice;
    APP.ajax({
      url: APP.api.indexAnnoncements,
      data: {
        type: "wap首页公告"
      },
      success: (res) => {
        notice.data = res.data
        resolve(notice);
      }
    })
  })
  // 获取促销列表
  let proSellList = new Promise((resolve) => {
    let title = ['新品', '精品', '热销', '折扣', '清仓']
    let smallImg = APP.imgs.smallImg;
    let sellList = [];
    title.forEach((item, index) => {
      sellList.push({
        title: item,
        img: smallImg[index]
      })
    });
    resolve(sellList);
  })
  // 获取限时折扣
  let proActivity = new Promise((resolve) => {
    APP.ajax({
      url: APP.api.indexActivity,
      success: (res) => {
        resolve(res.data);
      }
    })
  })
  // 获取广告+轮播产品列表
  let proWapIndex = new Promise((resolve) => {
    APP.ajax({
      url: APP.api.indexWapIndex,
      success: (res) => {
        resolve(res.data);
      }
    })
  })

  // 获取商品列表
  // 下拉刷新要不要重新刷新商品？？？？

  // 输出结果
  Promise.all([
    proImgUrls,
    proNotice,
    proSellList,
    proActivity,
    proWapIndex,
  ]).then((values) => {
    that.setData({
      imgUrls: values[0],
      notice: values[1],
      sellList: values[2],
      discount: values[3].discount ? values[3].discount : [],
      full: values[3].full ? values[3].full : [],
      wapIndex:values[4],
      ready: true
    }, () => {
      // console.log(values[1])
      let timer = setTimeout(() => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        clearTimeout(timer);
      }, 500)
      // 设置倒计时
      setInterval(() => {
        APP.utils.timeDown(that, that.data.discount[0].end_timestamp * 1000)
      }, 1000)
    })
  })
}