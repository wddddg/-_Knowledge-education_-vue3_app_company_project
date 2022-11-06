import $http from "@/common/requestConfig"

enum Api {
	getUserTotalIntegral = '/api/integralUserInfo/getUserTotalIntegral',
	findIntegralUserRecordForPage = '/api/integralUserInfo/findIntegralUserRecordForPage',
	orderGetById = '/api/systemMemberOrder/getById',
	addressListForPage = '/api/mallUserAddress/listForPage',
	addUserAddress = '/api/mallUserAddress/addUserAddress',
	addressDeleteById = '/api/mallUserAddress/deleteById',
	addressGetDetailsById = '/api/mallUserAddress/getDetailsById',
	editUserAddress = '/api/mallUserAddress/editUserAddress',
	findAreaList = '/api/commonApi/findAreaAllList',
	listForGoodsPage = '/api/mallGoods/listForGoodsPage',
	getGoodsDetails = '/api/mallGoods/getGoodsDetails',
	putConfirmOrderDetails = '/api/systemMemberOrder/putConfirmOrderDetails',
	waitOrderPay = '/api/systemMemberOrder/waitOrderPay',
	getMonthSignList = '/api/userClock/getMonthSignList',
	getSignCenter = '/api/userClock/getSignCenter',
	addUserSign = '/api/userClock/addUserSign',
	getUserCenter = '/api/userCenter/getUserCenter',
	wechatLoginGetOpenId = '/api/systemMember/wechatLoginGetOpenId'
}

//查询积分
export const getUserTotalIntegral = () =>
	$http.get({ url: Api.getUserTotalIntegral });

//查询积分详情list
export const findIntegralUserRecordForPage = (params) =>
	$http.get({ url: Api.findIntegralUserRecordForPage, params });

//详情-根据id查询订单详情（普通订单、商城订单）
export const orderGetById = (params) =>
	$http.get({ url: Api.orderGetById, params });

// 收货地址list
export const addressListForPage = (params) =>
	$http.get({ url: Api.addressListForPage, params });

// 用户收货地址-添加
export const addUserAddress = (params) =>
	$http.post({ url: Api.addUserAddress, data: params });

// 用户收货地址-左滑通过id删除
export const addressDeleteById = (params) =>
	$http.delete({ url: Api.addressDeleteById, params });

// 用户收货地址-通过id查询
export const addressGetDetailsById = (params) =>
	$http.get({ url: Api.addressGetDetailsById, params });

// 用户收货地址-编辑
export const editUserAddress = (params) =>
	$http.post({ url: Api.editUserAddress, data: params });

// 用户收货地址-编辑
export const findAreaList = (params) =>
	$http.get({ url: Api.findAreaList, params });

// 积分商城-全部商品分页查询
export const listForGoodsPage = (params) =>
	$http.get({ url: Api.listForGoodsPage, params });

// 积分商城-根据id查询商品详情
export const getGoodsDetails = (params) =>
	$http.get({ url: Api.getGoodsDetails, params });

// 我的订单-确认订单或预下单（普通订单、商城订单）
export const putConfirmOrderDetails = (params) =>
	$http.post({ url: Api.putConfirmOrderDetails, data:params });

// 预订单-微信支付宝支付
export const waitOrderPay = (params) =>
	$http.post({ url: Api.waitOrderPay, data:params });

// 查询某月签到情况列表
export const getMonthSignList = (params) =>
	$http.get({ url: Api.getMonthSignList, params });
	
// 任务中心、签到-主页
export const getSignCenter = (params) =>
	$http.get({ url: Api.getSignCenter, params });
	
// 用户签到
export const addUserSign = () =>
	$http.post({ url: Api.addUserSign });

// 个人中心-主页
export const getUserCenter = () =>
	$http.get({ url: Api.getUserCenter });

//会员-小程序登录获取openid
export const wechatLoginGetOpenId = (params) =>
  $http.get({url: Api.wechatLoginGetOpenId, params,noToken:true});