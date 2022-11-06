import ajax from '@/uni_modules/u-ajax/js_sdk'
import store from "@/store/index.js"
import {goLogin} from "@/common/app-utils.js"

import baseURL from './baseURL.js'
import noTokenUTL from './noTokenUTL.js'
const $http = ajax.create({
	baseURL
})

// 添加请求拦截器
$http.interceptors.request.use(
	config => {
		// 在发送请求前做些什么
		//请求前加入token
		let imglist = uni.getStorageSync('LoadingImg')
		if(!config?.noLogdImg){
			// uni.showLoading({
			// 	title: '正在加载...',
			// 	mask: true
			// })
			uni.$emit('apiLoadNo')
		}
		config.header.device = uni.getSystemInfoSync().platform;
		config.header.version = '1.0';
		config.header.language = 'zh';
		config.header.secretkey = 'AC304E61586960YJHU13TR219MTR23TR';
		// debugger
		// let storeUserInfo = store.state.user;
		// if (!storeUserInfo?.token) { // nvue页面读取不到vuex里面数据，将取缓存
			let storeUserInfo = uni.getStorageSync("user");
			if (!storeUserInfo?.token) {
				if(!config?.noToken){
					goLogin()
					// uni.hideLoading();
					uni.$emit('apiLoadOff')
					return Promise.reject({
						config,
						errMsg: 'request:fail intercepted'
					})
				}
				return config
			}
		// }
		if (storeUserInfo.token) {
			// config.header['Authorization'] = 'Bearer ' + storeUserInfo.token;
			config.header['X-Access-Token'] = storeUserInfo.token;
		};
		// config.params.device = uni.getSystemInfoSync().platform;
		// config.params.version = '1.0';
		// config.params.secretkey = 'AC304E61586960YJHU13TR219MTR23TR';
		// config.params.token = storeUserInfo.token;
		return config
	},
	error => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

// 添加响应拦截器
$http.interceptors.response.use(
	response => {
		setTimeout(() => {
			// uni.hideLoading();
			uni.$emit('apiLoadOff')
		}, 500);
		// 对响应数据做些什么
		if (response.data.code == 500) {
			uni.showToast({
			title: response.data.message||'系统有误，请联系管理员',
				duration: 1000,
				icon: "none"
			});
		}
		if (response.data.code == 510) {
			uni.showToast({
				title: '操作过时，请重新登录',
				duration: 1000,
				icon: "none"
			});
		}
		return response.data
	},
	error => {
		setTimeout(() => {
			// uni.hideLoading();
			uni.$emit('apiLoadOff')
		}, 500);
		if(error.statusCode == 404){
			uni.showToast({
				title: '未找到该地址',
				duration: 1000,
				icon: "none"
			});
		}else{
			uni.showToast({
				title: '请求错误',
				duration: 1000,
				icon: "none"
			});
		}

		// 对响应错误做些什么
		return Promise.reject(error)
	}
)

export default $http