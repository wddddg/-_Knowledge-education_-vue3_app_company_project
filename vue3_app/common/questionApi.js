import $http from "@/common/requestConfig"

let Api = {
	getSearch : '/ebapi/store_api/hot_search',
	getInfo : '/ebapi/public_api/index',
	userLogin : '/user-dayun-api/api/user/login',// 获取用餐地点 ||  查询可选套餐
	venueArea : '/system-dayun-api/api/system/venue/area',// 获取用餐地点
	dictList : '/system-dayun-api/api/system/dict/list',// 字典配置
	reserveCount : '/order-dayun-api/api/order/reserve/count',
	spuList : '/order-dayun-api/api/spu/list',//获取每人可预定套餐数量
	orderCreate : '/order-dayun-api/api/order/create',//提交订单信息
	orderList : '/order-dayun-api/api/order/list',//订单列表界面
	orderInfo : '/order-dayun-api/api/order/info',// 订单详情
	orderCancel : '/order-dayun-api/api/order/cancel',// 取消订单
	orderDrawGet : '/order-dayun-api/api/order/draw/get',// 核单界面-根据领餐码查询订单信息
	orderReceiving : '/order-dayun-api/api/order/receiving',//核单界面-确认领餐
	wxJssdkConfig : '/user-dayun-api/api/wechat/jssdk/config',
	orderReceivingLog : '/order-dayun-api/api/order/receiving/log',//核单界面-确认领餐记录
	spuPublicMenu : '/order-dayun-api/api/spu/public/menu',//菜单公示
	orderCreateEndDate : '/user-dayun-api/api/user/provider/getStartDate',
	commonUpload : '/api/common/upload',
	getCateList : '/api/systemCategory/list',
	getChild : '/api/systemCategory/getChild',
	listAll : '/api/systemCategory/listAll',
	chapterlist : '/api/systemQuestions/list',
	getDoc : '/api/systemDoc/list',//文档查询
	getInformaton : '/api/systemInformaton/list',
	getInformatonInfo : '/api/systemInformaton/queryById',
	getHotList : '/api/systemHot/list',
	getSystemMeans : '/api/systemMeans/list',
	getChapterList : '/api/systemQuestions/chapter/list',
	getQuestionCount : '/api/systemQuestions/count/list',
	getQuestionListCount : '/api/systemQuestions/practice/list',
	questionInfo : '/api/systemQuestions/info',
	cleanRecord : '/api/systemQuestions/clean/record',//清除联系记录
	getIsCollect : '/api/systemQuestions/is/collect',//查询是否收藏
	addCollect : '/api/systemQuestions/add/collect',
	deleteCollect : '/api/systemQuestions/delete/collect',
	addNote : '/api/systemQuestions/add/note',
	addErro : '/api/systemQuestions/add/error',
	searchQuestion : '/api/systemQuestions/search',
	addRecord : '/api/systemQuestions/add/record',
	addPlantLog : '/api/plant/log/add',
	getIndexCount : '/api/systemQuestions/index/count',
	getCollectList : '/api/systemQuestions/getCollectList',
	getErrorList : '/api/systemQuestions/getErrorList',
	getStudyList : '/api/systemQuestions/getStudyList',
	codeLogin : '/api/systemMember/codeLogin',
	pwdLogin : '/api/systemMember/pwdLogin',
	updateUser : '/api/systemMember/edit',
	getUser : '/api/systemMember/queryById',
	sendCode : '/api/systemMember/sendCode',
	getExam : '/api/systemExam/list',
	getExamList : '/api/systemQuestions/exam/list',
	getTodayList : '/api/systemQuestions/today/list',
	getToday : '/api/systemQuestions/exam/today',
	getHistoryExam : '/api/systemQuestions/history/exam/list',
	getHistoryQuestion : '/api/systemQuestions/history/question/list',
	getNoteList : '/api/systemQuestions/getAllNote',
	updatUserPwd : '/api/systemMember/updatePwd',
	updatUserPhone : '/api/systemMember/updatePhone',
	getExamLog : '/api/systemExam/log/list',
	getOrderList : '/api/systemMemberOrder/list',
	getImgByType : '/api/sysImages/list',//获取开机的轮播动画
	deleteNote : '/api/systemQuestions/deleteNote',
	deleteRecord : '/api/systemQuestions/deleteRecord',
	deleteCollectById : '/api/systemQuestions/deleteCollect',
	addInformatonDz : '/api/systemInformaton//prasise/add',
	delInformatonDz : '/api/systemInformaton/prasise/delete',
	isPrasise : '/api/systemInformaton/prasise',
	addComment : '/api/systemInformaton/comment/add',
	getPlantList : '/api/systemQuestionsPlant/list',
	addPlant : '/api/systemQuestionsPlant/add',
	deletePlant : '/api/systemQuestionsPlant/delete',
	getPlantInfo : '/api/systemQuestionsPlant/queryById',
	updatePlantInfo : '/api/systemQuestionsPlant/update',
	getPQuestionCount : '/api/systemQuestionsPlant/getQuestionCount',
	wechatLogin : '/api/systemMember/wechatLogin',
	bindPhone : '/api/systemMember/bindPhone',
	notRedCount : '/api/systemMessage/notRedCount',
	messageInfoList : '/api/systemMessage/list',
	messageInfo : '/api/systemMessage/queryById',
	getPayList : '/api/systemCategory/getPayList',
	addOrder : '/api/systemMemberOrder/add',
	wxOrzfbPay : '/api/systemMemberOrder/pay',
	newAddPlant : '/api/plant/add',
	newPlantList : '/api/plant/list',
	newUpdate : '/api/plant/update',
	statistics : '/api/plant/statistics',
	catePlantList : '/api/plant/list',
	getNewVersiont : '/api/getNewVersion/list',
	getNewQuestionCount : '/api/plant/getQuestionCount',
	plantUpdate : '/api/plant/update',
	newStatistics : '/api/systemMember/statistics',
	newDelete : '/api/plant/delete',
	newPlantCountList : '/api/systemQuestions/plant/list',
	getReport : '/api/systemExam/getReport',
	getAllLog : '/api/systemQuestions/getAllLog',
	getAllNewLog : '/api/systemQuestions/getExamLog',
	addExamLogItem : '/api/systemExam/addExamLogItem',
	sumbitExam : '/api/systemExam/sumbitExam',
	checkIsPay : '/api/systemMember/checkIsPay',
	allErrorList : '/api/systemQuestions/error/list',
	findExamQuestionRecord : '/api/systemQuestions/findExamQuestionRecord',
	wechatLoginGetOpenId : '/api/systemMember/wechatLoginGetOpenId',
	courseSectionPractice : '/api/systemQuestions/courseSection/practice',
	addCourseSectionPracticeRecord : '/api/systemQuestions/addCourseSectionPracticeRecord',
	mallGoodsClassify : '/api/mallGoodsClassify/findListAll',
	waitOrderPay: '/api/systemMemberOrder/waitOrderPay',
	getBalanceLearnMoney: '/api/learnMoneyReport/getBalanceLearnMoney',
}


export const getSearch = (params) =>
  $http.get({url: Api.getSearch, params});

export const getInfo = (params) =>
  $http.get({url: Api.getInfo, params});
  
export const userLogin = (params) =>
  $http.get({url: Api.userLogin, params});
  
export const venueArea = (params) =>
  $http.get({url: Api.venueArea, params});
  
export const dictList = (params) =>
  $http.get({url: Api.dictList, params});
  
export const reserveCount = (params) =>
  $http.get({url: Api.reserveCount, params});
  
export const spuList = (params) =>
  $http.get({url: Api.spuList, params});
  
export const orderCreate = (params) =>
  $http.get({url: Api.orderCreate, params});
  
export const orderList = (params) =>
  $http.get({url: Api.orderList, params});
  
export const orderCancel = (params) =>
  $http.get({url: Api.orderCancel, params});
  
export const orderDrawGet = (params) =>
  $http.get({url: Api.orderDrawGet, params});
  
export const orderReceiving = (params) =>
  $http.get({url: Api.orderReceiving, params});
  
export const wxJssdkConfig = (params) =>
  $http.get({url: Api.wxJssdkConfig, params});
  
export const orderReceivingLog = (params) =>
  $http.get({url: Api.orderReceivingLog, params});
  
export const spuPublicMenu = (params) =>
  $http.get({url: Api.spuPublicMenu, params});
  
export const orderCreateEndDate = (params) =>
  $http.get({url: Api.orderCreateEndDate, params});
  
export const commonUpload = (params) =>
  $http.get({url: Api.commonUpload, params});
  
export const getCateList = (params) =>
  $http.get({url: Api.getCateList, params});
  
export const getChild = (params) =>
  $http.get({url: Api.getChild, params});
  
export const listAll = (params) =>
  $http.get({url: Api.listAll, params})
  
export const chapterlist = (params) =>
  $http.get({url: Api.chapterlist, params});
  
export const getDoc = (params) =>
  $http.get({url: Api.getDoc, params});
  
export const getInformaton = (params) =>
  $http.get({url: Api.getInformaton, params});
  
export const getInformatonInfo = (params) =>
  $http.get({url: Api.getInformatonInfo, params});
  
export const getHotList = (params) =>
  $http.get({url: Api.getHotList, params});
  
export const getSystemMeans = (params) =>
  $http.get({url: Api.getSystemMeans, params});
  
export const getChapterList = (params) =>
  $http.get({url: Api.getChapterList, params});
  
export const getQuestionCount = (params) =>
  $http.get({url: Api.getQuestionCount, params});
  
export const getQuestionListCount = (params) =>
  $http.get({url: Api.getQuestionListCount, params});
  
export const questionInfo = (params) =>
  $http.get({url: Api.questionInfo, params});
  
export const cleanRecord = (params) =>
  $http.get({url: Api.cleanRecord, params});
  
export const getIsCollect = (params) =>
  $http.get({url: Api.getIsCollect, params});
  
export const addCollect = (params) =>
  $http.get({url: Api.addCollect, params});
  
export const deleteCollect = (params) =>
  $http.get({url: Api.deleteCollect, params});
  
export const addNote = (params) =>
  $http.get({url: Api.addNote, params});
  
export const addErro = (params) =>
  $http.get({url: Api.addErro, params});
  
export const searchQuestion = (params) =>
  $http.get({url: Api.searchQuestion, params});
  
export const addRecord = (params) =>
  $http.get({url: Api.addRecord, params});
  
export const addPlantLog = (params) =>
  $http.get({url: Api.addPlantLog, params});
  
export const getIndexCount = (params) =>
  $http.get({url: Api.getIndexCount, params});
  
export const getCollectList = (params) =>
  $http.get({url: Api.getCollectList, params});
  
export const getErrorList = (params) =>
  $http.get({url: Api.getErrorList, params});
  
export const getStudyList = (params) =>
  $http.get({url: Api.getStudyList, params});
  
export const codeLogin = (params) =>
  $http.get({url: Api.codeLogin, params});
  
export const pwdLogin = (params) =>
  $http.get({url: Api.pwdLogin, params});
  
export const updateUser = (params) =>
  $http.get({url: Api.updateUser, params});
  
export const getUser = (params) =>
  $http.get({url: Api.getUser, params});
  
export const sendCode = (params) =>
  $http.get({url: Api.sendCode, params});
  
export const getExam = (params) =>
  $http.get({url: Api.getExam, params});
  
export const getExamList = (params) =>
  $http.get({url: Api.getExamList, params});
  
export const getTodayList = (params) =>
  $http.get({url: Api.getTodayList, params});
  
export const getToday = (params) =>
  $http.get({url: Api.getToday, params});
  
export const getHistoryExam = (params) =>
  $http.get({url: Api.getHistoryExam, params});
  
export const getHistoryQuestion = (params) =>
  $http.get({url: Api.getHistoryQuestion, params});
  
export const getNoteList = (params) =>
  $http.get({url: Api.getNoteList, params});
  
export const updatUserPwd = (params) =>
  $http.get({url: Api.updatUserPwd, params});
  
export const updatUserPhone = (params) =>
  $http.get({url: Api.updatUserPhone, params});
  
export const getExamLog = (params) =>
  $http.get({url: Api.getExamLog, params});
  
export const getOrderList = (params) =>
  $http.get({url: Api.getOrderList, params});
  
export const getImgByType = (params) =>
  $http.get({url: Api.getImgByType, params,noToken:true});
  
export const deleteNote = (params) =>
  $http.get({url: Api.deleteNote, params});
  
export const deleteRecord = (params) =>
  $http.get({url: Api.deleteRecord, params});
  
export const deleteCollectById = (params) =>
  $http.get({url: Api.deleteCollectById, params});
  
export const addInformatonDz = (params) =>
  $http.get({url: Api.addInformatonDz, params});
  
export const delInformatonDz = (params) =>
  $http.get({url: Api.delInformatonDz, params});
  
export const isPrasise = (params) =>
  $http.get({url: Api.isPrasise, params});

export const addComment = (params) =>
  $http.get({url: Api.addComment, params});

export const getPlantList = (params) =>
  $http.get({url: Api.getPlantList, params});

export const addPlant = (params) =>
  $http.get({url: Api.addPlant, params});

export const deletePlant = (params) =>
  $http.get({url: Api.deletePlant, params});

export const getPlantInfo = (params) =>
  $http.get({url: Api.getPlantInfo, params});

export const updatePlantInfo = (params) =>
  $http.get({url: Api.updatePlantInfo, params});

export const getPQuestionCount = (params) =>
  $http.get({url: Api.getPQuestionCount, params});

export const wechatLogin = (params) =>
  $http.get({url: Api.wechatLogin, params});

export const bindPhone = (params) =>
  $http.get({url: Api.bindPhone, params});

export const notRedCount = (params) =>
  $http.get({url: Api.notRedCount, params});

export const messageInfoList = (params) =>
  $http.get({url: Api.messageInfoList, params});

export const messageInfo = (params) =>
  $http.get({url: Api.messageInfo, params});

export const getPayList = (params) =>
  $http.get({url: Api.getPayList, params});

export const addOrder = (params) =>
  $http.get({url: Api.addOrder, params});

export const wxOrzfbPay = (params) =>
  $http.get({url: Api.wxOrzfbPay, params});

export const newAddPlant = (params) =>
  $http.post({url: Api.newAddPlant, data:params});

export const newPlantList = (params) =>
  $http.get({url: Api.newPlantList, params});

export const newUpdate = (params) =>
  $http.post({url: Api.newUpdate, data:params});

export const statistics = (params) =>
  $http.get({url: Api.statistics, params});

export const catePlantList = (params) =>
  $http.get({url: Api.catePlantList, params});

export const getNewVersiont = (params) =>
  $http.get({url: Api.getNewVersiont, params});

export const getNewQuestionCount = (params) =>
  $http.get({url: Api.getNewQuestionCount, params});

export const plantUpdate = (params) =>
  $http.post({url: Api.plantUpdate, data:params});

export const newStatistics = (params) =>
  $http.get({url: Api.newStatistics, params});

export const newDelete = (params) =>
  $http.get({url: Api.newDelete, params});

export const newPlantCountList = (params) =>
  $http.get({url: Api.newPlantCountList, params});

export const getReport = (params) =>
  $http.get({url: Api.getReport, params});

export const getAllLog = (params) =>
  $http.get({url: Api.getAllLog, params});

export const getAllNewLog = (params) =>
  $http.get({url: Api.getAllNewLog, params});

export const addExamLogItem = (params) =>
  $http.get({url: Api.addExamLogItem, params});

export const sumbitExam = (params) =>
  $http.get({url: Api.sumbitExam, params});

export const checkIsPay = (params) =>
  $http.get({url: Api.checkIsPay, params});

export const allErrorList = (params) =>
  $http.get({url: Api.allErrorList, params});

export const findExamQuestionRecord = (params) =>
  $http.get({url: Api.findExamQuestionRecord, params});

export const wechatLoginGetOpenId = (params) =>
  $http.get({url: Api.wechatLoginGetOpenId, params});

export const courseSectionPractice = (params) =>
  $http.get({url: Api.courseSectionPractice, params});

export const addCourseSectionPracticeRecord = (params) =>
  $http.post({url: Api.addCourseSectionPracticeRecord, data:params});

export const mallGoodsClassify = () =>
  $http.get({url: Api.mallGoodsClassify});

export const waitOrderPay = (params) =>
  $http.post({url: Api.waitOrderPay, data:params});

export const getBalanceLearnMoney = () =>
  $http.get({url: Api.getBalanceLearnMoney});