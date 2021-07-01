// 引入配置文件
import {headers} from './config.js';

// 封装原来的请求 添加公共请求头的配置
export function ajax(option) {
  // 添加默认的配置 header
  let headerMust = {
    'auth': headers.auth,
    'client-type': headers.clientType,
  }
  // 合并 header 参数
  let header = {};
  if(option.header){
    header = Object.assign(option.header, headerMust);
  }else{
    header = headerMust;
  }
  //判断本地是否有token
  let token = wx.getStorageSync('token');
  if (token) {
    let tokenHeader = Object.assign({ 'token': token.token }, header)
    request(option, tokenHeader)
  } else {
    request(option, header)
  }
}
// 微信请求的封装
function request(option, header) {
  // 其他参数
  let options = option || {};
  let url = options.url || '';
  let data = options.data || {};
  let method = options.method || 'POST';
  let success = options.success;
  let fail = options.fail;
  // 0.8秒后显示加载的动态
  // 暂时取消请求的loding
  // setTimeout(()=>{
  //   wx.showLoading({
  //     title: '数据加载中...',
  //   })
  // })
  // 请求的封装
  wx.request({
    url: url,
    data: data,
    header: header,
    method: method,
    dataType: 'json',
    responseType: 'text',
    success: res => {
      // 根据code判断操作 1为返回成功 0为获取失败 其他为异常操作
      // wx.hideLoading();
      if (res.data.code == 1) {
        success(res.data);
      } else if (res.data.code == 0) {
        if (res.data.msg != -41003){
          wx.showToast({
            title: res.data.msg.toString(),
            icon: 'none',
          })
        }
      } else {
        // 异常操作 清除本地存储 跳转到首页
        wx.clearStorageSync();
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    },
    fail(err) {
      // 清除加载状态
      wx.hideLoading()
      // clearTimeout(timer)
      // 错误内容
      console.log(err);
      fail && fail(err);
    }
  })
}