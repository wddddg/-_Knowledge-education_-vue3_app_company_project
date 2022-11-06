<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view>
			<u-navbar :title="typeInfo? '支付成功':'支付失败'"></u-navbar>
		</view>
		<view class="success-box">
			<view>
				<u-image src="@/static/success-icon.png" :width="160" :height="160" v-if="typeInfo"></u-image>
				<u-image src="@/static/error-icon.png" :width="160" :height="160" v-else></u-image>
			</view>
			<view class="title">{{ typeInfo? '订单支付成功！':'订单支付失败！' }}</view>
			<view class="btn" :style="{ color:buttonColor,border: `2rpx solid ${buttonColor}` }" @click="goBack">
				返回上级页面
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
		onShow,
	} from "@dcloudio/uni-app";
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const typeInfo = ref(true)
	const delta = ref('')
	const goBack = () => {
		uni.navigateBack({
			delta: delta.value === '1' ? 1 : 2
		})
	}
	onLoad((value) => {
		delta.value = value.delta
		typeInfo.value = parseInt(value.type)
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.success-box {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		.title {
			font-size: 30rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #606266;
			line-height: 60rpx;
			margin: 32rpx 0rpx 40rpx;
		}

		.btn {
			background: #FFFFFF;
			border-radius: 8rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			line-height: 40rpx;
			padding: 16rpx 32rpx;
		}
	}
</style>
