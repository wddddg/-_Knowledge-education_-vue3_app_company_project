<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view class="">
			<u-navbar title="我的优惠券">
				<template #right>
					<view class="search-btn" @click="goBack">
						<u-image src="../../static/search.png" mode="" :width="40" :height="40"></u-image>
					</view>
				</template>
			</u-navbar>
		</view>
		<view class="detailed-content-box">
			<view class="detailed-content-bg-color">
				<view class="member-is-recommend">
					<u-image src="../../static/user/trapezoid.png" :width="136" :height="136"></u-image>
					<view class="member-is-recommend-text">
						新到
					</view>
				</view>
				<view class="bg-color-top">
					<view class="coupon-title">全品类通用券{{ itemData.title }}</view>

					<view class="coupon-money"><label class="coupon-money-symbol"
							v-if="!itemData.discount">¥</label>{{ itemData.discount?itemData.discount:itemData.fullAmount }}<label
							class="coupon-money-symbol" v-if="itemData.discount">折</label>
					</view>
					<view class="coupon-toptips">满{{ itemData.useLimitAmount }}元可用</view>
				</view>
				<!-- <view class="divider"></view> -->
				<view class="divider">
					<u-image src="../../static/user/card-divider.png" :width="638" :height="32"></u-image>
				</view>
				<view class="bg-color-bottom">
					<view class="flex-content">
						<view class="flex-content-title">
							适用平台
						</view>
						<view class="flex-content-text">
							{{
							itemData.useScenes === 1? '全平台':
							itemData.useScenes === 2? '普通课程':
							itemData.useScenes === 3? '直播课':
							itemData.useScenes === 4? '线下课':
							itemData.useScenes === 5? '班级课':
							itemData.useScenes === 6? '会员':
							itemData.useScenes === 7? '电子书':'资料库'	
						}}
						</view>
					</view>
					<view class="flex-content">
						<view class="flex-content-title">
							有效期至
						</view>
						<view class="flex-content-text">
							{{ itemData.endTime }}
						</view>
					</view>
					<view class="flex-content">
						<view class="flex-content-title">
							详细说明
						</view>
						<view class="flex-content-text">
							{{ itemData.useDesc }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="user-box">
			<view class="user-btn" @click="userClickBtn"  :style="{ background:buttonColor}">
				立即使用
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import {
		getCouponDetails
	} from '../Personal.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const itemData = ref({})
	const userClickBtn = () => {
		uni.switchTab({
			url: '/pages/course/index'
		})
	}
	const goBack = () =>{
		uni.navigateBack()
	}
	onLoad(async (id) => {
		await getCouponDetails(id).then(res => {
			itemData.value = res.result
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.bg-color-top {
		height: 50%;
		background-color: #fff;
	}

	.bg-color-bottom {
		height: 50%;
		background-color: #fff;
	}

	.search-btn {
		margin-right: 40rpx;
	}

	.detailed-content-box {
		margin: 32rpx 40rpx 0rpx;
		height: 644rpx;
		background: linear-gradient(360deg, #3F6EE1 0%, #7BC8E8 100%);
		padding: 16rpx;
		border-radius: 8rpx;

		.detailed-content-bg-color {
			width: 100%;
			height: 100%;
			// background: #fff;
			position: relative;
			// padding: 0rpx 16rpx;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.member-is-recommend {
				position: absolute;
				top: 0;
				right: 0;

				.member-is-recommend-text {
					position: absolute;
					top: 30rpx;
					transform: rotate(45deg);
					color: #fff;
					right: 20rpx;
					font-size: 24rpx;
				}
			}

			.coupon-title {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #303133;
				line-height: 40rpx;
				margin-top: 64rpx;
			}

			.coupon-money {
				font-size: 48rpx;
				font-family: DINCond-Black, DINCond;
				font-weight: 900;
				color: #EE5142;
				line-height: 80rpx;
				margin: 20rpx 0rpx 24rpx;

				.coupon-money-symbol {
					font-size: 32rpx;
				}
			}

			.coupon-toptips {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #606266;
				line-height: 24rpx;
			}

			.divider {
				// width: 100%;
				// height: 4rpx;
				// border: 1rpx solid #395AE1;
				// padding: 0rpx 16rpx;

			}

			.flex-content {
				display: flex;
				text-align: left;
				align-items: flex-start;
				margin: 24rpx 32rpx;

				.flex-content-title {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 36rpx;
					width: 25%;
				}

				.flex-content-text {
					width: 75%;
					// padding-right: 32rpx;
				}
			}
		}
	}

	.user-box {
		position: absolute;
		bottom: 76rpx;
		padding: 0rpx 40rpx;
		width: 100%;

		.user-btn {
			height: 88rpx;
			border-radius: 8rpx;
			width: 100%;
			text-align: center;

			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
		}
	}
</style>
