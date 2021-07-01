const APP = getApp();
export default class Request {
  constructor() {}
  init(options){
    this.that = options.that;
    this.url = options.url;
    this.type = options.type || 1;
    this.getStr = options.getStr || ''
    this.pushData = options.pushData || ''
  }
  getPageData(options){
    this.postData = options ? options.postData : {}
    APP.ajax({
      url: APP.api[this.url],
      data: this.postData,
      header: {
        'page-limit': 10,
        'page-num': this.that.data.FPage.pageNum,
      },
      success: (res) => {
        wx.stopPullDownRefresh();
        
      }
    })
  }
}