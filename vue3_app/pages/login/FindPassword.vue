<template>
	<view class="uni-container content">
		<u-navbar title="找回密码"></u-navbar>
		<view class="">
			<view class="password_title">
				找回密码
			</view>
			<view class="tabs">
				<view :class="step==1?'tabs-item':'tabs-item-s'" @click="switchTab(1)">
					<view :class="step==1?'icon-count':'icon-count-s'">1</view>
					<text>验证手机号码</text>
				</view>
				<view :class="step==2?'tabs-item':'tabs-item-s'" @click="switchTab(2)">
					<view :class="step==2?'icon-count':'icon-count-s'">2</view>
					<text>设置新密码</text>
				</view>
			</view>
			<view class="">
				<view class="input_item" v-if="step==1">
					<uni-easyinput class="" placeholder="请输入注册手机号码" v-model="model.phone" />
				</view>
				<view class="input_item " v-if="step==1">
					<view class="codeInput">
						<uni-easyinput  placeholder="请输入短信验证码" v-model="model.inviteCode"/>
						<view class="code" @click="getCode">{{tips}}</view>
					</view>
				</view>
				<view class="input_item" v-if="step==2">
					<uni-easyinput class="" type="password" maxlength="20" placeholder="请设置6-20位新的登录密码" v-model="model.userName" />
				</view>
				<view class="input_item" v-if="step==2">
					<uni-easyinput class="" type="password" maxlength="20" placeholder="请再次输入新的登录密码" v-model="model.password"/>
				</view>
				<button type="primary" class="login_but" @click="onVerify" v-if="step==1">下一步</button>
				<button type="primary" class="login_but" @click="Onlogin" v-if="step==2">提交</button>
			</view>
		</view>
		<u-verification-code start-text="发送验证码" :seconds="seconds" @end="end" @start="start" ref="uCode" 
		@change="codeChange"></u-verification-code>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script setup>
import {
	onLoad,
	onShow,
} from "@dcloudio/uni-app";
import { ref, getCurrentInstance } from "vue"
import { sendCode, pwdLogin, codeLogin, getWebsiteBottomIcon, wechatLoginGetOpenId, getWebsiteTheme, getWebsiteHtmlCustom,updatePwd } from "./login.api.ts"
import store from "@/store/index.js"
import xskCodeInput from "@/components/xsk-code-input/xsk-code-input";
import appUtils from '@/common/app-utils.js';
let showPassword = ref(true)
let model = ref({
	phone:'',
	inviteCode:'',
	userName: '',
	password: ''
})
let step = ref(1)
let tips = ref('')

let uCode = ref()
let uToast = ref()
function getCode(){
	if (model.value.phone.length == 0) {
		uni.showToast({
			title: '请输入手机号',
			icon: "none"
		})
		return;
	}
	if(uCode.value.canGetCode) {
		// 模拟向后端请求验证码
		uni.showLoading({
			title: '正在获取验证码'
		})
		sendCode({ mobile: model.value.phone }).then(res => {
			if(res.code == 200){
				// 这里此提示会被this.start()方法中的提示覆盖
				uni.$u.toast('验证码已发送');
				// 通知验证码组件内部开始倒计时
				uCode.value.start();
			}
		}).finally(() => {
				uni.hideLoading();
		})
	} else {
		uni.$u.toast('倒计时结束后再发送');
	}
}
function codeChange(text) {
	tips.value = text;
}

function switchTab(e){
	step.value = e
}

function onVerify(){
	step.value = 2
}
function Onlogin(){
	if (model.value.phone.length == 0) {
		uni.showToast({
			title: '请输入手机号',
			icon: "none"
		})
		return;
	}
	if (model.value.inviteCode.length == 0) {
		uni.showToast({
			title: '请输入验证码',
			icon: "none"
		})
		return;
	}
	if(model.value.password.length<6||model.value.userName.length<6){
		uni.showToast({
			title: '密码至少输入6位字符',
			icon: "none"
		})
		return
	}
	if(model.value.password != model.value.userName){
		uni.showToast({
			title: '两次输入密码不一致',
			icon: "none"
		})
		return
	}
	let param = {
		password: model.value.password,
		inviteCode: model.value.inviteCode,
		phone: model.value.phone
	}
	updatePwd(param).then(res => {
		if(res.code == 200){
			uni.showToast({
				title: '修改成功,请登录',
				icon: ""
			})
			setTimeout(()=>{
				uni.navigateBack()
			},1500)
		}
	})
}

function end(){
	// uni.$u.toast('倒计时结束');
}
function start(){
	// uni.$u.toast('倒计时开始');
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
	margin-bottom: 32rpx;
}

.tabs{
	width: 100%;
	display: flex;
	.tabs-item{
		width: 100%;
		border-bottom: 5rpx solid #303133;
		display: flex;
		align-items: center;
	}
	.icon-count {
		width: 28rpx;
		height: 28rpx;
		line-height: 28rpx;
		text-align: center;
		border-radius: 28rpx;
		background: #303133;
		color: #fff;
		margin-right: 10rpx;
	}
	.tabs-item-s{
		width: 100%;
		border-bottom: 5rpx solid #C0C7D1;
		display: flex;
		align-items: center;
		color: #C0C7D1;
	}
	.icon-count-s {
		width: 28rpx;
		height: 28rpx;
		line-height: 28rpx;
		text-align: center;
		border-radius: 28rpx;
		background: #C0C7D1;
		color: #fff;
		margin-right: 10rpx;
	}
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
.codeInput {
	display: flex;
	align-items: center;
	.code {
		height: 60rpx;
		background: #fff;
		line-height: 60rpx;
		font-size: 28rpx;
		color: #395AE1;
	}
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



.login_but {
	margin: 32rpx 0 0 0;
}


</style>
