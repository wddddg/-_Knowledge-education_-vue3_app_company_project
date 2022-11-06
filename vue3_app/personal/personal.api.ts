import $http from "@/common/requestConfig"

enum Api {
	messageList = '/api/systemMessage/list',
	getUserMember = '/api/memberCenter/getUserMember',
	findMemberManager = '/api/memberCenter/findMemberManager',
	getBalanceLearnMoney = '/api/learnMoneyReport/getBalanceLearnMoney',
	getLearnMoneyList = '/api/learnMoneyReport/listForPage',
	findRelationRecordList = '/api/userRelation/findRelationRecordList',
	myCouponListForPage = '/api/couponInfo/myCouponListForPage',
	couponListForPage = '/api/couponInfo/couponListForPage',
	addUserCoupon = '/api/couponInfo/addUserCoupon',
	couponExchange = '/api/couponInfo/couponExchange',
	getCouponDetails = '/api/couponInfo/getCouponDetails',
	camePayInfo = '/api/camePayInfo/listForApiPage',
	getCamePayByKey = '/api/camePayInfo/getCamePayByKey',
	camePayExchange = '/api/camePayInfo/camePayExchange',
	getUserRetailRuleDetails = '/api/retailRule/getUserRetailRuleDetails',
	listForUserRelationPage = '/api/retailRule/listForUserRelationPage',
	listForAnswersPage = '/api/userCenter/listForAnswersPage',
	listForCollectionBookPage = '/api/userCenter/listForCollectionBookPage',
	listForCollectionCoursePage = '/api/userCenter/listForCollectionCoursePage',
	listForCollectionTeacherPage = '/api/userCenter/listForCollectionTeacherPage',
	applyTeacher = '/api/userCenter/applyTeacher',
	listForRetailPosterImg = '/api/retailRule/listForRetailPosterImg',
	messageQueryById = '/api/systemMessage/queryById',
	getRelationDetails = '/api/userRelation/getRelationDetails',
	listForBookRecordPage = '/api/userCenter/listForBookRecordPage',
	listForClassCoursePage = '/api/userCenter/listForClassCoursePage',
	listForKnowledgeRecordPage = '/api/userCenter/listForKnowledgeRecordPage',
	listForReserveRecordPage = '/api/userCenter/listForReserveRecordPage',
	listForStudyCourseRecordPage = '/api/userCenter/listForStudyCourseRecordPage',
	systemMemberEdit = '/api/systemMember/edit',
	sendCode = '/api/systemMember/sendCode',
	updatePhone = '/api/systemMember/updatePhone',
	updatePwd = '/api/systemMember/updatePwd',
	editUserMessage = '/api/systemMember/editUserMessage',
	orderGetById = '/api/systemMemberOrder/getById',
	getDoc = '/api/systemDoc/list',
	putBalanceWithdraw = '/api/userRelation/putBalanceWithdraw',
	addWechatOpenId = 'api/userCenter/addWechatOpenId',
	wechatLoginGetOpenId = '/api/systemMember/wechatLoginGetOpenId',
	putConfirmOrderDetails = '/api/systemMemberOrder/putConfirmOrderDetails',
	findMyCouponInfoList = '/api/systemMemberOrder/findMyCouponInfoList',
	getUserCenter = '/api/userCenter/getUserCenter',
	getUserDetails = '/api/systemMember/getUserDetails',
	deleteOrderById = '/api/systemMemberOrder/deleteOrderById',
	userAddOpinion ='/api/userCenter/userAddOpinion'
}

//查询积分
export const messageList = (params) =>
	$http.get({ url: Api.messageList, params });

//查询个人中心信息
export const getUserMember = (params) =>
	$http.get({ url: Api.getUserMember, params });

//查询会员价格
export const findMemberManager = () =>
	$http.get({ url: Api.findMemberManager });

//查询可用学币数量
export const getBalanceLearnMoney = () =>
	$http.get({ url: Api.getBalanceLearnMoney });

//查询充值记录
export const getLearnMoneyList = (params) =>
	$http.get({ url: Api.getLearnMoneyList, params });

//查询收支明细List
export const findRelationRecordList = (params) =>
	$http.get({ url: Api.findRelationRecordList, params });

//用户(我的)优惠券-分页列表查询
export const myCouponListForPage = (params) =>
	$http.get({ url: Api.myCouponListForPage, params });

//查询领券中心-分页列表查询
export const couponListForPage = (params) =>
	$http.get({ url: Api.couponListForPage, params });

//领取优惠券
export const addUserCoupon = (params) =>
	$http.post({ url: Api.addUserCoupon, data: params });

//优惠券详情-密钥兑换
export const couponExchange = (params) =>
	$http.post({ url: Api.couponExchange, data: params });

//优惠券详情-根据id查询
export const getCouponDetails = (params) =>
	$http.get({ url: Api.getCouponDetails, params });

//优惠券详情-根据id查询
export const camePayInfo = (params) =>
	$http.get({ url: Api.camePayInfo, params });

//卡密查询-根据卡密查询
export const getCamePayByKey = (params) =>
	$http.get({ url: Api.getCamePayByKey, params });

//卡密-卡密兑换
export const camePayExchange = (params) =>
	$http.get({ url: Api.camePayExchange, params });

//用户拉新-查询分销规则信息及邀请人数
export const getUserRetailRuleDetails = (params) =>
	$http.post({ url: Api.getUserRetailRuleDetails, data: params });

//用户拉新-分页列表查询
export const listForUserRelationPage = (params) =>
	$http.get({ url: Api.listForUserRelationPage, params });

//我的问答-分页查询
export const listForAnswersPage = (params) =>
	$http.get({ url: Api.listForAnswersPage, params });

//收藏书籍-分页查询
export const listForCollectionBookPage = (params) =>
	$http.get({ url: Api.listForCollectionBookPage, params });

//收藏课程-分页查询
export const listForCollectionCoursePage = (params) =>
	$http.get({ url: Api.listForCollectionCoursePage, params });

//关注讲师-分页查询
export const listForCollectionTeacherPage = (params) =>
	$http.get({ url: Api.listForCollectionTeacherPage, params });

//讲师入驻
export const applyTeacher = (params) =>
	$http.post({ url: Api.applyTeacher, data: params });

//用户拉新海报-列表查询
export const listForRetailPosterImg = (params) =>
	$http.get({ url: Api.listForRetailPosterImg, params });

//系统消息-通过id查询
export const messageQueryById = (params) =>
	$http.get({ url: Api.messageQueryById, params });

//收支明细-详情
export const getRelationDetails = (params) =>
	$http.get({ url: Api.getRelationDetails, params });

//我的学习-我的书籍
export const listForBookRecordPage = (params) =>
	$http.get({ url: Api.listForBookRecordPage, params });

//我的学习-我的班课（分页）
export const listForClassCoursePage = (params) =>
	$http.get({ url: Api.listForClassCoursePage, params });

//我的学习-我的资料（分页）
export const listForKnowledgeRecordPage = (params) =>
	$http.get({ url: Api.listForKnowledgeRecordPage, params });

//我的学习-预约记录（分页）
export const listForReserveRecordPage = (params) =>
	$http.get({ url: Api.listForReserveRecordPage, params });

//我的学习-我的课程（分页）
export const listForStudyCourseRecordPage = (params) =>
	$http.get({ url: Api.listForStudyCourseRecordPage, params });

//我的信息修改
export const systemMemberEdit = (params) =>
	$http.post({ url: Api.systemMemberEdit, data: params });

//发送登录验证码
export const sendCode = (params) =>
	$http.get({ url: Api.sendCode, params });

//修改手机
export const updatePhone = (params) =>
	$http.get({ url: Api.updatePhone, params });

//修改密码
export const updatePwd = (params) =>
	$http.get({ url: Api.updatePwd, params });

//用户信息-信息推送开关
export const editUserMessage = (params) =>
	$http.post({ url: Api.editUserMessage, data: params });

// 订单详情
export const orderGetById = (params) =>
	$http.get({ url: Api.orderGetById, params });

// 政策详情
export const getDoc = (params) =>
	$http.get({ url: Api.getDoc, params });

// 收支明细-余额提现
export const putBalanceWithdraw = (params) =>
	$http.post({ url: Api.putBalanceWithdraw, data: params });

//微信绑定
export const addWechatOpenId = (params) =>
	$http.post({ url: Api.addWechatOpenId, data: params });

//会员-小程序登录获取openid
export const wechatLoginGetOpenId = (params) =>
	$http.get({ url: Api.wechatLoginGetOpenId, params, noToken: true });

// 我的订单-确认订单或预下单（普通订单）
export const putConfirmOrderDetails = (params) =>
	$http.post({ url: Api.putConfirmOrderDetails, data: params });

// 我的订单-确认订单或预下单（普通订单）
export const findMyCouponInfoList = (params) =>
	$http.get({ url: Api.findMyCouponInfoList, params });

// 个人信息
export const getUserCenter = () =>
	$http.get({ url: Api.getUserCenter });

// 个人默认信息
export const getUserDetails = () =>
	$http.get({ url: Api.getUserDetails })
	
// 我的订单-订单删除
export const deleteOrderById = (params) =>
	$http.post({ url: Api.deleteOrderById, data: params, header:{'content-Type':'application/x-www-form-urlencoded'}  });

// 用户反馈
export const userAddOpinion = (params) =>
	$http.post({ url: Api.userAddOpinion, data: params, header:{'content-Type':'application/x-www-form-urlencoded'}  });