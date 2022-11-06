<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<u-navbar title="更换手机"></u-navbar>
		<view class="user-info">
			<view class="pd34 user-info-old-phone">
				<view>原手机号</view>
				<view>
					{{ oldPhone.substring(0,3) + '****' + oldPhone.substring(7) }}
				</view>
			</view>
			<view class="pd34">
				<view>
					新手机号
				</view>
				<view>
					<u-input v-model="form.phone" placeholder="请输入手机号" input-align="right"></u-input>
				</view>
			</view>
			<view class="pd34">
				<view>
					验证码
				</view>
				<view class="user-info-verify">
					<u-input v-model="form.verify" placeholder="请输入验证码" input-align="right"></u-input>
					<view class="user-info-verify-btn"
						:style="{border: `2rpx solid ${buttonColor}`, color: buttonColor}" @tap="getCode">
						<!-- @click="getVerisfy" -->
						<u-verification-code ref="uCodes" @change="codeChange" change-text="x" end-text="重新获取验证码">
						</u-verification-code>
						{{tips}}
					</view>
				</view>
			</view>
		</view>
		<view class="user-info-btn-box">
			<view class="user-info-btn" :style="{background: verifyTure && phoneVerifyTure ?buttonColor:'#C0C7D1'}"
				@click="changePhone">
				提交
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue'
	import {
		onLoad,
		onReady
	} from '@dcloudio/uni-app'
	import {
		sendCode,
		updatePhone,
		getUserMember
	} from '../Personal.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const form = ref({
		phone: '',
		verify: ''
	})
	const phoneVerifyTure = ref(false)
	const oldPhone = ref('')
	const verifyTure = ref(false)
	const sendCodeValue = ref(0)
	const uCodes = ref(null)
	const uToasts = ref(null)
	const tips = ref('')
	const locking = ref(true)
	const codeChange = (text) => {
		tips.value = text
	}
	const getCode = async () => {
		if (!phoneVerifyTure.value) {
			uni.showToast({
				title: '新手机号格式错误',
				icon: 'none'
			})
			return
		}
		if (uCodes.value.canGetCode) {
			uni.showLoading({
				title: '正在获取验证码'
			})
			await sendCode({
				mobile: form.value.phone
			}).then(res => {
				sendCodeValue.value = res.result
			}).finally(() => {
				uni.hideLoading();
			})
			uCodes.value.start();
		}
	}
	const changePhone = async () => {
		if(!locking.value) return
		let params = {
			newPhone: form.value.phone,
			inviteCode: form.value.verify,
			phone: oldPhone.value
		}
		if (!phoneVerifyTure.value && !verifyTure.value) return
		locking.value = false
		if (sendCodeValue.value === form.value.verify) {
			await updatePhone(params).then(res => {
				if (res.code === 200) {
					uni.showToast({
						title: '修改成功'
					})
					uni.navigateBack()
				}
			})
		} else {
			uni.showToast({
				icon: 'error',
				title: '验证码错误'
			})
		}
		locking.value = true
	}
	onLoad(async () => {
		await getUserMember().then(res => {
			oldPhone.value = res.result.phone || '18820430253'
		})
	})
	watch(() => form.value.phone, (value) => {
		if ((/^1[34578]\d{9}$/.test(value))) {
			phoneVerifyTure.value = true
		} else {
			phoneVerifyTure.value = false
		}
	})
	watch(() => form.value.verify, (value) => {
		if (value) {
			verifyTure.value = true
		} else {
			verifyTure.value = false
		}
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.user-info {
		padding: 0rpx 40rpx;

		.pd34 {
			padding: 34rpx 0rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.user-info-verify {
			display: flex;
			align-items: center;

			.user-info-verify-btn {
				background: #FFFFFF;
				border-radius: 8rpx;
				padding: 12rpx 24rpx;
				margin-left: 16rpx;
			}
		}
	}

	.user-info-btn-box {
		position: absolute;
		bottom: 76rpx;
		padding: 0rpx 40rpx;
		width: 100%;
		height: 88rpx;

		.user-info-btn {
			border-radius: 8rpx;
			width: 100%;
			text-align: center;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #fff;
			line-height: 88rpx;
		}
	}
</style>
