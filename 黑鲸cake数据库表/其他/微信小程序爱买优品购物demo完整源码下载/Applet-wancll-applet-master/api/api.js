// 引入配置文件
import { defaultHost } from './config.js';
// 请求的api
export const api = {
  // 主页
  indexBanners: `${defaultHost}/api_articles/banners/lists`,
  indexConfigs: `${defaultHost}/api_query/configs/wap_index`,
  indexAnnoncements: `${defaultHost}/api_articles/annoncements/lists`,
  indexActivity: `${defaultHost}/api_query/market/activity`,
  indexAdvertisements: `${defaultHost}/api_articles/advertisements/lists`,
  indexWapIndex: `${defaultHost}/api_query/configs/wap_index`,

  // 通用文章页面
  articlesReg: `${defaultHost}/api_articles/rules/read`,
  articlesNotice: `${defaultHost}/api_articles/annoncements/read`,

  // 商品页面 
  goodsTree: `${defaultHost}/api_goods/goods_cates/lists_tree`,

  // 多页面公用
  goods: `${defaultHost}/api_goods/goods/lists`,
  setPayPass: `${defaultHost}/api_query/users/is_set_pay_password`,


  // 商品的详情页 
  detailRead: `${defaultHost}/api_goods/goods/read`,
  detailCollect: `${defaultHost}/api_query/goods/is_collect`,
  detailCollectCancel: `${defaultHost}/api_goods/goods_collections/cancel`,
  detailCollectSave: `${defaultHost}/api_goods/goods_collections/save`,
  detailComments: `${defaultHost}/api_query/goods/comments`,
  detailTemplate: `${defaultHost}/api_query/goods_cates/template`,
  detailCartsSave: `${defaultHost}/api_goods/carts/save`,

  // 确认订单
  orderAffimAddress: `${defaultHost}/api_query/users/default_address`,
  orderAffimView: `${defaultHost}/api_orders/orders/view`,
  orderAffimUser: `${defaultHost}/api_query/market/user`,
  orderSaveAll: `${defaultHost}/api_orders/orders/save`,

  // 购物车
  getCartsAll: `${defaultHost}/api_goods/carts/lists`,
  getCartsUpdate: `${defaultHost}/api_goods/carts/update`,
  getCartsDelete: `${defaultHost}/api_goods/carts/batch_delete`,
  getCartsColleSave: `${defaultHost}/api_goods/goods_collections/batch_save`,
  
  

  // 登录注册相关
  userLogin: `${defaultHost}/api_users/user_accounts/login`,
  userRegister: `${defaultHost}/api_users/user_accounts/register`,

  // 微信授权登录
  getSessionCode: `${defaultHost}/api_systems/oauth/applet_get_session_key`,
  getWechatUserInfo: `${defaultHost}/api_systems/oauth/applet_get_user_info`,
  queryUserByUnionId: `${defaultHost}/api_query/oauth/openid`,
  queryWechatBindStatus: `${defaultHost}/api_query/oauth/binding`,
  unbind: `${defaultHost}/api_users/binding/delete`,
  bindWechatInLogin: `${defaultHost}/api_users/binding/save_in_login`,
  bindMobileInNoLogin: `${defaultHost}/api_users/binding/save_in_no_login`,

  // 微信支付
  wechatPay: `${defaultHost}/api_orders/pay/wechat_pay_applet`,

  // 个人中心
  user: `${defaultHost}/api_users/users/read`,
  userCount: `${defaultHost}/api_query/orders/count`,
  userAsset: `${defaultHost}/api_query/users/asset`,
  userGrowLogs: `${defaultHost}/api_users/score_logs/lists`,
  userInfo: `${defaultHost}/api_query/systems/info`,
  userBonus:`${defaultHost}/api_bonus/rules/become_bonus_info`,
  userBonusRead: `${defaultHost}/api_bonus/user_apply_bonus/read`,
  userCompleteInfo: `${defaultHost}/api_users/users/complete_user_info`,
  userDrp: `${defaultHost}/api_drp/rules/become_distributor_info`,
  userDrpRead: `${defaultHost}/api_drp/user_apply_distributor/read`,
  
  

  // 个人中心设置
  userSettingCode: `${defaultHost}/api_systems/helper/send_code`,
  userSettingPass: `${defaultHost}/api_users/user_accounts/reset_password`,
  userSettingPayPass: `${defaultHost}/api_users/user_accounts/reset_pay_password`,
  userSettingUpdate: `${defaultHost}/api_users/users/update`,
  userSettingMobile: `${defaultHost}/api_users/user_accounts/change_mobile`,

  // 反馈
  submitHelpAndOption: `${defaultHost}/api_articles/feedbacks/save`,

  // 订单相关
  orderAll: `${defaultHost}/api_orders/orders/lists`,
  orderCancel: `${defaultHost}/api_orders/cancel_orders/user_cancel`,
  orderTip: `${defaultHost}/api_orders/tip_deliver/tip`,
  orderPrePay: `${defaultHost}/api_orders/pay/pre_pay`,
  orderMoney: `${defaultHost}/api_orders/pay/money`,
  // orderAliPayApp: `${defaultHost}/api_orders/pay/ali_pay_app`,
  // orderWechatPayApp: `${defaultHost}/api_orders/pay/wechat_pay_app`,
  orderRefound: `${defaultHost}/api_orders/return_goods/save`,
  orderUserSing: `${defaultHost}/api_orders/sign_orders/user_sign`,
  orderExpress100: `${defaultHost}/api_query/transport/read_by_kd100`,
  orderComments: `${defaultHost}/api_goods/goods_comments/save`,
  orderDelete: `${defaultHost}/api_orders/orders/delete`,
  orderDetail: `${defaultHost}/api_orders/orders/read`,

  // 订单是否支付
  orderIsPay: `${defaultHost}/api_query/pay/is_pay`,

  // 收藏夹
  collections: `${defaultHost}/api_goods/goods_collections/lists`,
  collectionsDelete: `${defaultHost}/api_goods/goods_collections/delete`,

  // 地址 
  addressList: `${defaultHost}/api_users/addresses/lists`,
  addressSetDefault: `${defaultHost}/api_users/addresses/set_default`,
  addressDelete: `${defaultHost}/api_users/addresses/delete`,
  addressRead: `${defaultHost}/api_users/addresses/read`,
  addressRegions: `${defaultHost}/api_systems/regions/index`,
  addressSave: `${defaultHost}/api_users/addresses/save`,
  addressUpdate: `${defaultHost}/api_users/addresses/update`,

  // 我的评论
  itemComments: `${defaultHost}/api_goods/goods_comments/lists`,

  // 我的钱包
  myWallet: `${defaultHost}/api_query/users/asset`,
  myWalletLog: `${defaultHost}/api_users/user_asset_logs/lists`,
  recharge: `${defaultHost}/api_users/user_recharges/save`,
  withdraw: `${defaultHost}/api_users/user_drawcashs/save`,

  // 我的银行卡
  myBankCard: `${defaultHost}/api_users/bank_cards/lists`,
  myBankCardRead: `${defaultHost}/api_users/bank_cards/read`,
  myBankCardUpdate: `${defaultHost}/api_users/bank_cards/update`,
  myBankCardSave: `${defaultHost}/api_users/bank_cards/save`,
  myBankCardDelete: `${defaultHost}/api_users/bank_cards/delete`,

  // 优惠券
  myDiscount: `${defaultHost}/api_users/user_coupons/lists`,
  myDiscountReceive: `${defaultHost}/api_users/user_coupons/receive`,
  myDiscountCoupon: `${defaultHost}/api_query/market/coupon`,
  myDiscountCouponSave: `${defaultHost}/api_users/user_coupons/save`,

  // 商品搜索
  goodsKeywordsList: `${defaultHost}/api_goods/goods_keywords/lists`,
  userGoodsKeywordsRead: `${defaultHost}/api_users/user_goods_keywords/read`,
  deleteKeywords: `${defaultHost}/api_users/user_goods_keywords/delete`,

  // 工具api
  uploadFile: `${defaultHost}/api_systems/helper/upload_file`,

  // 实名认证
  queryAuthStatus: `${defaultHost}/api_query/users/auth`,
  submitAuthInfo: `${defaultHost}/api_users/user_auths/save`,
  updateAuthInfo: `${defaultHost}/api_users/user_auths/update`,

  // 分销分红申请
  getDrpApply: `${defaultHost}/api_drp/user_apply_distributor/apply`,
  getBonusApply: `${defaultHost}/api_bonus/user_apply_bonus/apply`,

  // 分销中心
  drpCenter: `${defaultHost}/api_query/drp/distributor_info`,
  drpCenterInfo: `${defaultHost}/api_query/drp/commission_info`,
  drpRules: `${defaultHost}/api_drp/rules/index`,
  drpOrderList: `${defaultHost}/api_drp/drp_orders/lists`,
  drpApplysList: `${defaultHost}/api_drp/commission_applys/lists`,
  drpPaySave: `${defaultHost}/api_drp/commission_applys/save`,
  drpApplysRead: `${defaultHost}/api_drp/commission_applys/read`,
  drpChildUser: `${defaultHost}/api_drp/team/child_users`,
  drpTeamUser: `${defaultHost}/api_drp/team/team_users`,
  

  // 分红中心
  bonusCenter: `${defaultHost}/api_query/bonus/bonus_info`,
  bonusApplysList: `${defaultHost}/api_bonus/bonus_applys/lists`,
  bonusApplysRead: `${defaultHost}/api_bonus/bonus_applys/read`,
  bonusPaySave: `${defaultHost}/api_bonus/bonus_applys/save`,
  bonusOrderList: `${defaultHost}/api_bonus/bonus_orders/lists`,
  bonusTeamUser: `${defaultHost}/api_bonus/team/team_users`,
  bonusChildUser: `${defaultHost}/api_bonus/team/child_users`,
  bonusRules: `${defaultHost}/api_bonus/rules/index`,
  
  // 收款账户
  userRhirdAcc: `${defaultHost}/api_users/user_third_accounts/lists`,
  userRhirdUpdate: `${defaultHost}/api_users/user_third_accounts/update`,
  // userRhirdWxBind: `${defaultHost}/api_users/user_third_accounts/update`,
  
}