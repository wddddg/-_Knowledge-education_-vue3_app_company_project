import $http from "@/common/requestConfig"

enum Api {
  pwdLogin = '/api/systemMember/pwdLogin',
  sendCode = '/api/systemMember/sendCode',
  codeLogin = '/api/systemMember/codeLogin',
  getWebsiteBottomIcon = '/api/websiteConfig/getWebsiteBottomIcon',
  wechatLoginGetOpenId = '/api/systemMember/wechatLoginGetOpenId',
  getWebsiteTheme = '/api/websiteConfig/getWebsiteTheme',
  getWebsiteHtmlCustom = '/api/websiteConfig/getWebsiteHtmlCustom',
  wechatLogin = '/api/systemMember/wechatLogin',
  updatePwd = '/api/systemMember/updatePwd',
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
  
//用户-微信登录
export const wechatLogin = (params) =>
  $http.get({url: Api.wechatLogin, params,noToken:true});

//学员管理表-修改密码
export const updatePwd = (params) =>
  $http.get({url: Api.updatePwd, params,noToken:true});
