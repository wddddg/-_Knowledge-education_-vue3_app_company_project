import $http from "@/common/requestConfig"

enum Api {
  pwdLogin = '/api/systemMember/pwdLogin',
  sendCode = '/api/systemMember/sendCode',
  codeLogin = '/api/systemMember/codeLogin',
  getWebsiteBottomIcon = '/api/websiteConfig/getWebsiteBottomIcon',
  wechatLoginGetOpenId = '/api/systemMember/wechatLoginGetOpenId',
  getWebsiteTheme = '/api/websiteConfig/getWebsiteTheme',
  getWebsiteHtmlCustom = '/api/websiteConfig/getWebsiteHtmlCustom',
  getWebsitePayRule = '/api/websiteConfig/getWebsitePayRule',
  listForRetailPosterImg = '/api/retailRule/listForRetailPosterImg',
  getWebsiteAdvert = '/api/websiteConfig/getWebsiteAdvert',
  getNewVersion = '/api/getNewVersion/list',
  getLoadingImg = '/api/websiteConfig/getLoadingImg',
}

//发送登录验证码
export const sendCode = (params) =>
  $http.get({url: Api.sendCode, params,noToken:true});

//密码登录
export const pwdLogin = (params) =>
  $http.get({url: Api.pwdLogin, params,noToken:true});

//验证码登录
export const codeLogin = (params) =>
  $http.get({url: Api.codeLogin, params,noToken:true});

//获取网站底部导航
export const getWebsiteBottomIcon = (params) =>
  $http.get({url: Api.getWebsiteBottomIcon, params,noToken:true});

//查看店铺主题
export const getWebsiteTheme = (params) =>
  $http.get({url: Api.getWebsiteTheme, params,noToken:true});

//获取自定义装修首页
export const getWebsiteHtmlCustom = (params) =>
  $http.get({url: Api.getWebsiteHtmlCustom, params,noToken:true});

//会员-小程序登录获取openid
export const wechatLoginGetOpenId = (params) =>
  $http.get({url: Api.wechatLoginGetOpenId, params,noToken:true});

//支付规则
export const getWebsitePayRule = (params) =>
  $http.get({url: Api.getWebsitePayRule, params,noToken:true});
  
//用户拉新海报-列表查询
export const listForRetailPosterImg = (params) =>
  $http.get({url: Api.listForRetailPosterImg, params,noToken:true,noLogdImg:true});
    
//获取首页弹窗广告
export const getWebsiteAdvert = (params) =>
  $http.get({url: Api.getWebsiteAdvert, params,noToken:true,noLogdImg:true});    
  
//app版本升级-查询最新版本
export const getNewVersion = (params) =>
  $http.get({url: Api.getNewVersion, params,noToken:true,noLogdImg:true});  
  
//加载页-获取加载页面图标
export const getLoadingImg = (params) =>
  $http.get({url: Api.getLoadingImg, params,noToken:true,noLogdImg:true});