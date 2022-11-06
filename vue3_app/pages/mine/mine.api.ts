import $http from "@/common/requestConfig"

enum Api {
	getUserCenterHtmlCustom = '/api/websiteConfig/getUserCenterHtmlCustom',
	getUserMember = '/api/memberCenter/getUserMember',
	addUserSign = '/api/userClock/addUserSign',
	notRedCount = '/api/systemMessage/notRedCount',
	getUserDetails = '/api/systemMember/getUserDetails'
}

//查询个人中心icon
export const getUserCenterHtmlCustom = (params) =>
	$http.get({ url: Api.getUserCenterHtmlCustom, params });

//查询个人中心信息
export const getUserMember = (params) =>
	$http.get({ url: Api.getUserMember, params });

//签到
export const addUserSign = () =>
	$http.post({ url: Api.addUserSign });

//消息
export const notRedCount = () =>
	$http.get({ url: Api.notRedCount });

// 个人默认信息
export const getUserDetails = () =>
	$http.get({ url: Api.getUserDetails });