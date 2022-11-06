<template>
	<view class="uni-container content">
		<u-navbar title="登录"></u-navbar>
		<view class="">
			<view class="password_title" v-if="loginType == 1">
				密码登入
			</view>
			<view class="password_title" v-if="loginType == 2">
				验证码登录
			</view>
			<view class="hint" v-if="loginType == 1||(loginType != 1&&!showCode)">
				新用户登录成功后默认生成账号
			</view>
			<view class="hint" v-if="loginType != 1&&showCode">
				{{`验证码已发送至${model.userName}`}}
			</view>
			<view class="">
				<view class="input_item" v-if="!showCode||loginType==1">
					<uni-easyinput class="" placeholder="请输入手机号码" v-model="model.userName"
						 />
				</view>
				<view class="input_item" v-if="loginType != 2">
					<uni-easyinput class="" type="password" placeholder="请输入密码" v-model="model.password"
						 />
				</view>
				<!-- 				<view class="input_wrapper" v-if="loginType != 2">
					<text class="uni-icon" :class="[!showPassword ? 'uni-eye-active' : '']" @click="changePassword">&#xe568;</text>	
				</view> -->
				<xskCodeInput v-model:value="codeValue" backgroundColor="#fff" showVal="true" @confirm="onLogin"
					v-if="loginType == 2&&showCode"></xskCodeInput>
				<view class="forget" v-if="loginType != 2" @click="goFindPassword">
					忘记密码？
				</view>
				<view class="agree">
					<checkbox-group @change="onCheckbox">
						<label style="display: flex;align-items: center;">
							<checkbox value="cb" checked="true" color="#395AE1" style="transform:scale(0.5)" />
							我已阅读并同意<a href="/pages/tabBar/component/component" style="color:#395AE1;">《用户协议》</a>和
							<a href="/pages/tabBar/component/component" style="color:#395AE1;">《隐私政策》</a>
						</label>
					</checkbox-group>
				</view>
				<button type="primary" class="login_but" @click="onLogin" v-if="isLogin">登录</button>
				<button type="primary" class="login_but" @click="getCode" v-if="!isLogin">获取验证码</button>
				<view class="other_line">
					<view class="line"></view>
					<view class="teste">其他登录方式</view>
					<view class="line"></view>
				</view>
				<view class="other">
					<view class="weixin align-img"  @click="setLoginType(3)">
						<image class="images" src="@/static/wechat-logo.png" mode="scaleToFill" style="width: 88rpx;height:88rpx;"></image>
						<text>微信</text>
					</view>
					<view class="code align-img" v-if="loginType != 2" @click="setLoginType(2)">
						<image class="images" src="@/static/images/shou-j@2x.png" mode="scaleToFill" style="width: 88rpx;height:88rpx;"></image>
						<text>验证码</text>
					</view>
					<view class="code align-img" v-if="loginType != 1" @click="setLoginType(1)">
						<image class="images" src="@/static/images/mi-ma@2x.png" mode="scaleToFill" style="width: 88rpx;height:88rpx;"></image>
						<text>账号密码</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {
	onLoad,
	onShow,
} from "@dcloudio/uni-app";
import { ref, getCurrentInstance } from "vue"
import { sendCode, pwdLogin, codeLogin, getWebsiteBottomIcon, wechatLoginGetOpenId, getWebsiteTheme, getWebsiteHtmlCustom,wechatLogin} from "./login.api.ts"
import store from "@/store/index.js"
import xskCodeInput from "@/components/xsk-code-input/xsk-code-input";
import appUtils from '@/common/app-utils.js';
appUtils.getClientId()
appUtils.getDataType()
let showPassword = ref(true)
let model = ref({
	userName: '18511660138',
	password: '123456'
})
let loginType = ref(1)
let isLogin = ref(true)
let codeValue = ref(0)
let showCode = ref(false)
let isAgree = true
let clientId = uni.getSystemInfoSync().deviceId

function changePassword() {
	showPassword.value = !showPassword.value
}
function onCheckbox(e) {
	isAgree = e.detail?.value[0]
}
function reset() {
	model.value = {
		userName: '',
		password: ''
	}
	codeValue.value = 0
	showCode.value = false
}
function setLoginType(value) {
	if (value == 3) {
		uni.getUserProfile({
			desc: "授权信息登录",
			lang: "zh-CN",
			success:  (res) => {
				weixinLogin(res)
			},
		});
		return
	}
	loginType.value = value
	if (loginType.value == 2) {
		isLogin.value = false
		reset()
	} else if (loginType.value == 1) {
		isLogin.value = true
		reset()
	}
}

function weixinLogin (info){
	let platform;
	// #ifdef MP-WEIXIN
	platform = 'weixin';
	// #endif
	uni.login({
		provider: platform,
		success: function (data) {
			wechatLoginGetOpenId({ code: data.code }).then(res => {
				debugger
				let type = uni.getStorageSync('useDevice')
				if (type.uniPlatform == 'web') {
					type = 3
				} else if (type.uniPlatform == 'mp-weixin') {
					type = 2
				} else if (type.uniPlatform == 'app') {
					type = 1
				} else {
					type = 2
				}
				const parasm = {
					"inviteCode": "",
					"nickName": info.userInfo.nickName,
					"openId": res.result.openid || '',
					"wxUnionid": res.result.unionid || '',
					"type":type,
					"clientId":clientId,
					"headImg":info.userInfo.avatarUrl
				}
				wechatLogin(parasm).then(async resp=>{
					if (resp.code == 200) {
						uni.setStorage({
							key:'user',
							data:resp.result
						})
						await setWebsiteBottomIcon()
						await setWebsiteTheme()
						await setWebsiteHtmlCustom()
						store.commit('login',resp.result)
					}
				})
			})
		}
	})
}


let useDevice = uni.getStorageSync('useDevice')
console.log(useDevice.uniPlatform,'useDevice');
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
async function setWebsiteBottomIcon() {
	await getWebsiteBottomIcon({ useDevice: useDevice }).then(res => {
		uni.setStorageSync('bottomIcon', res.result)
	})
}
async function setWebsiteTheme() {
	await getWebsiteTheme({ useDevice: useDevice }).then(res => {
		uni.setStorageSync('themeColor', '#' + res.result?.themeColor)
		uni.setStorageSync('otherThemeColor', res.result)
	})
}
async function setWebsiteHtmlCustom() {
	await getWebsiteHtmlCustom({ useDevice: useDevice }).then(res => {
		uni.setStorageSync('indexCustom', res.result)
	})
}


function getCode() {
	if (model.value.userName.length == 0) {
		uni.showToast({
			title: '请输入手机号',
			icon: "none"
		})
		return;
	}
	sendCode({ mobile: model.value.userName }).then(res => {
		if(res.code == 200){
			showCode.value = true
			isLogin.value = true
		}
	})
}
function onLogin() {
	if (!isAgree) {
		uni.showToast({
			title: '先阅读并同意同意用户隐私政策',
			duration: 2000,
			icon: "none"
		});
	};
	function handleSuccess() {
		uni.showToast({
			title: '登入成功',
			duration: 2000,
			icon: "success"
		});
	}
	if (loginType.value == 1) {
		console.log(model.value.userName);
		if (model.value.userName.length == 0) {
			uni.showToast({
				title: '请输入用户名',
				icon: "none"
			})
			return;
		}
		if (model.value.password.length == 0) {
			uni.showToast({
				title: '请输入密码',
				icon: "none"
			})
			return;
		}
		model.value.clientId = clientId
		pwdLogin(model.value).then(async res => {
			if (res.code == 200) {
				uni.setStorage({
					key:'user',
					data:res.result
				})
				await setWebsiteBottomIcon()
				await setWebsiteTheme()
				await setWebsiteHtmlCustom()
				handleSuccess()
				store.commit('login',res.result)
			}
		})
	} else if (loginType.value == 2) {
		codeLogin({ mobile: model.value.userName, verifyCode: codeValue.value, clientId: clientId }).then(res => {
		})
	}
}
function goFindPassword(){
	uni.navigateTo({
		url:'/pages/login/FindPassword'
	})
}
</script>
<style>
page {
	background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(37, 208, 193, 0.1) 52%, rgba(57, 90, 225, 0.4) 100%);
}
</style>
<style scoped lang="scss">
.content {
	padding: 64rpx;
}

.password_title {
	width: 100%;
	height: 74rpx;
	font-size: 52rpx;
	font-weight: 500;
	color: #1B1E27;
	line-height: 74rpx;
}

.hint {
	width: 448rpx;
	height: 44rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: #606266;
	line-height: 44rpx;
}

.input_item {
	font-size: 28rpx;
	background-color: transparent;
	height: 96rpx;
	// width: 100%;
	// border: 1rpx solid rgba(153, 153, 153, 0.36);
	border-radius: 8rpx;
	// padding-left: 30rrpx;
	margin-top: 32rpx;
}

.input_wrapper {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	padding: 16rpx 26rpx;
	flex-direction: row;
	flex-wrap: nowrap;
	border: 1rpx solid rgba(153, 153, 153, 0.36);
	border-radius: 8rpx;
	margin-top: 32rpx;
}

.uni-input {
	height: 60rpx;
	line-height: 56rpx;
	font-size: 30rpx;
	padding: 0rpx;
	flex: 1;
	background-color: transparent;
}

.uni-icon {
	font-family: uniicons;
	font-size: 48rpx;
	font-weight: normal;
	font-style: normal;
	width: 48rpx;
	height: 48rpx;
	line-height: 48rpx;
	color: #999999;
}

.uni-eye-active {
	color: #007AFF;
}

.forget {
	width: 140rpx;
	height: 40rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: #606266;
	line-height: 40rpx;
	float: right;
	margin: 16rpx 0 0 0;
}

.agree {
	height: 32rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: #909399;
	line-height: 34rpx;
	margin: 96rpx 0 0 0;
}

.login_but {
	margin: 32rpx 0 0 0;
}

.other_line {
	width: 100%;
	height: 40rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: #909399;
	line-height: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 256rpx 0 0 0;

	.teste {
		margin: 0 26rpx;
	}

	.line {
		display: inline-block;
		width: 200rpx;
		height: 2rpx;
		background: #C0C7D1;
	}
}

.other {
	margin-top: 66rpx;
	display: flex;
	justify-content: space-around;
	font-size: 28rpx;
	font-weight: 400;
	color: #606266;
	.align-img {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}
</style>
