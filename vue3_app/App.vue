<script>
import {
	mapMutations
} from 'vuex'
import {
	version
} from './package.json'
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
import appUtils from '@/common/app-utils.js';
import { getWebsitePayRule, getWebsiteBottomIcon, getWebsiteTheme, getWebsiteHtmlCustom,getLoadingImg } from '@/common/commonApi.ts';

export default {
	onLaunch: async function () {
		// #ifdef H5
		console.log(
			`%c hello uniapp %c v${version} `,
			'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
			'background:#007aff ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;'
		)
		// #endif
		// 线上示例使用
		// console.log('%c uni-app官方团队诚邀优秀前端工程师加盟，一起打造更卓越的uni-app & uniCloud，欢迎投递简历到 hr2013@dcloud.io', 'color: red');
		console.log('App Launch');
		// #ifdef APP-PLUS
		// App平台检测升级，服务端代码是通过uniCloud的云函数实现的，详情可参考：https://ext.dcloud.net.cn/plugin?id=4542
		if (plus.runtime.appid !== 'HBuilder') { // 真机运行不需要检查更新，真机运行时appid固定为'HBuilder'，这是调试基座的appid
			checkUpdate()
		}

		// 一键登录预登陆，可以显著提高登录速度
		uni.preLogin({
			provider: 'univerify',
			success: (res) => {
				// 成功
				this.setUniverifyErrorMsg();
				console.log("preLogin success: ", res);
			},
			fail: (res) => {
				this.setUniverifyLogin(false);
				this.setUniverifyErrorMsg(res.errMsg);
				// 失败
				console.log("preLogin fail res: ", res);
			}
		})
		// #endif
		await this.init()

		// var root=document.querySelector(":root")
		// //获取
		// var bgColor= getComputedStyle(root).getPropertyValue("--theme-color")
		// console.log(bgColor)

		// //设置
		// root.style.setProperty("--theme-color","#000")
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	globalData: {
		test: '',
		orderPrepare: {
			maxCount: 0,
			totalNumber: 0,
			totalMoney: 0,
			address: {},
			time: {},
			spuList: []
		},
		cid: "",
		baseUrl: 'https://120.79.217.95:8051/system-api',
		staticUrl: 'https://120.79.217.95:8051/system-api/sys/common/static/',
	},
	methods: {
		...mapMutations(['setUniverifyErrorMsg', 'setUniverifyLogin']),
		async init() {
			await appUtils.getClientId()
			await appUtils.getDataType()
			let useDevice = uni.getStorageSync('useDevice')
			console.log(useDevice.uniPlatform, 'useDevice');
			if (useDevice.uniPlatform == 'web') {
				useDevice = 4
			} else if (useDevice.uniPlatform == 'mp-weixin') {
				useDevice = 3
			} else if (useDevice.uniPlatform == 'app') {
				if (useDevice.osName == 'android') {
					useDevice = 2
				} else {
					useDevice = 1
				}
			} else {
				useDevice = 4
			}
			let deviceType = useDevice.osName == 'android' ? 2 : 1
			
			await getWebsitePayRule({ useDevice: useDevice, deviceType: useDevice == 3 ? deviceType : '' }).then(res => {
				uni.setStorageSync('payRule', res.result)
			})
			await getWebsiteBottomIcon({ useDevice: useDevice }).then(res => {
				uni.setStorageSync('bottomIcon', res.result)
			})
			await getWebsiteTheme({ useDevice: useDevice }).then(res => {
				uni.setStorageSync('themeColor', '#' + res.result?.themeColor)
				uni.setStorageSync('otherThemeColor', res.result)
			})
			await getWebsiteHtmlCustom({ useDevice: useDevice }).then(res => {
				uni.setStorageSync('indexCustom', res.result)
			})
			await getLoadingImg().then(res => {
				uni.setStorageSync('LoadingImg', res.result)
			})
			// uni.setNavigationBarColor({
			//   frontColor: '#000000',
			//   // backgroundColor: '#000000'
			// })
		}
	}
}
</script>

<style lang="scss">
@import "./uni_modules/vk-uview-ui/index.scss";
/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';
@import '@/static/customicons.css';

/* H5 兼容 pc 所需 */
/* #ifdef H5 */
@media screen and (min-width: 768px) {
	body {
		overflow-y: scroll;
	}
}

/* 顶栏通栏样式 */
/* .uni-top-window {
	    left: 0;
	    right: 0;
	} */

page {
	background-color: #F5F5F5 !important;
	min-height: 100% !important;
	height: auto !important;
}

.uni-top-window uni-tabbar .uni-tabbar {
	background-color: #fff !important;
}

.uni-app--showleftwindow .hideOnPc {
	display: none !important;
}

/* #endif */



.fix-pc-padding {
	padding: 0 50px;
}

.uni-header-logo {
	padding: 30rpx;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 10rpx;
}

.uni-header-image {
	width: 100px;
	height: 100px;
}

.uni-hello-text {
	color: #7A7E83;
}

.uni-hello-addfile {
	text-align: center;
	line-height: 300rpx;
	background: #FFF;
	padding: 50rpx;
	margin-top: 10px;
	font-size: 38rpx;
	color: #808080;
}

.loadmore {
	padding: 30upx 0;
}

.twoLine {
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}

.u-radio__label {
	width: 100%;
}

.label-black {
	width: calc(90vw - 65px);
}

.centre {
	text-align: center;
	margin: 200upx auto;
	font-size: 32upx;

	image {
		width: 164upx;
		height: 164upx;
		/* border-radius: 50%; */
		margin-bottom: 20upx;
	}

	.tips {
		font-size: 24upx;
		color: #999999;
		margin-top: 20upx;
	}

	.btn {
		margin: 80upx auto;
		width: 200upx;
		border-radius: 32upx;
		line-height: 64upx;
		color: #ffffff;
		font-size: 26upx;
		background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
	}
}

.qu-item-name .dan {
	background: #FF761B !important;
}

.qu-item-name .duo {
	background: #00B7FD !important;
}

.qu-item-name .wen {
	background: #07A594 !important;
}

.qu-item-name .ding {
	background: #00B7FD !important;
}

.qu-item-name .tian {
	background: #08AB5C !important;
}

.qu-item-name .pan {
	background: #C57E22 !important;
}

.answer-select {
	background-color: #00B7FD !important;
}

uni-checkbox,
checkbox,
uni-radio,
radio {
	display: flex;
	align-items: center;
}

uni-radio .uni-radio-input,
radio .wx-radio-input {
	width: 40upx !important;
	height: 40upx !important;
}

uni-radio .uni-radio-input.uni-radio-input-checked,
radio .wx-radio-input.wx-radio-input-checked {
	background-color: #00B7FD !important;
	border-color: #FFFFFF !important;
}

.answer-select-error {
	background-color: red !important;
}

.answer-select-error uni-radio .uni-radio-input.uni-radio-input-checked,
.answer-select-error radio .wx-radio-input.wx-radio-input-checked {
	background-color: red !important;
}

.answer-select-error uni-radio .uni-radio-input.uni-radio-input-checked::before,
.answer-select-error radio .wx-radio-input.wx-radio-input-checked::before {
	content: "x";
	font-size: 40upx;
	margin-top: -8upx;
}

uni-checkbox .uni-checkbox-input,
checkbox .wx-checkbox-input {
	width: 40upx !important;
	height: 40upx !important;
	border-radius: 50%;
}

uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked,
checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	background-color: #00B7FD !important;
	border-color: #FFFFFF !important;
	color: #FFFFFF;
	border-color: #aaa;
}

uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked::before,
checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
	color: #FFFFFF;
}

.answer-select-error uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked,
.answer-select-error checkbox .wx-checkbox-input.wx-checkbox-input-checked {
	background-color: red !important;
}

.answer-select-error uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked::before,
.answer-select-error checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
	content: "x";
	font-size: 40upx;
	margin-top: -8upx;
}



.answer-select-ok {
	color: #FFFFFF;
}

.btn-quren {
	width: 100%;
	height: 80upx;
	line-height: 80upx;
	text-align: center;
	font-size: 28upx;
	border-radius: 50upx;
	color: #FFFFFF;
	background-color: #00B7FD;
	margin-top: 50upx;
}

/* #endif*/
scroll-view ::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
	display: none;
}

.navbar11 {
	margin-top: -14rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: $uni-bg-color;
	position: fixed;
	left: 0;
	right: 0;
	z-index: 12;
	padding: 0 30rpx 0 0;
	height: 88rpx;
	box-sizing: border-box;
	font-size: 24rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	color: $u-tips-color;
	box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
	border-bottom: 2rpx solid $u-form-item-border-color;

	.lefts {
		width: 5%;
		margin-left: 1%;
		display: flex;
		align-items: center;
	}

	.mdr {
		width: 32rpx;
		height: 32rpx;
		margin-top: 8rpx;
	}

	::v-deep .segmented-control--text {
		display: flex !important;
		align-items: center !important;
		width: 94% !important;
		overflow-x: scroll !important;
	}

	::v-deep .segmented-control__item {
		width: 24% !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		flex-shrink: 0 !important;
		flex: none !important;
	}

	::v-deep .segmented-control__text {
		font-weight: normal !important;
		color: $u-tips-color !important;
		font-size: 28rpx !important;
	}

	::v-deep .segmented-control__item--text {
		// color: $u-main-color!important;
		color: $u-type-primary !important;
		font-size: 28rpx !important;
	}
}

.MyPersonal {
	::v-deep .segmented-control--button {
		border-color: #395AE1;
	}

	::v-deep .segmented-control__text {
		color: $u-content-color !important;
	}

	::v-deep .segmented-control__item--button--active .segmented-control__text {
		color: $uni-text-color-inverse !important;
	}

	::v-deep .segmented-control__item--button--active {
		background: linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%) !important;
	}
}
</style>
