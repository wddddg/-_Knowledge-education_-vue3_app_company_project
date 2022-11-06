<template>
	<view>
		<u-navbar title="确认订单"></u-navbar>
		<view class="order-box">
			<view class="order-box-title">
				商品清单
			</view>
			<view class="order-box-info">
				<view v-if="!(orderInfo.category === 6)">
					<u-image :src="orderInfo.imgUrl" :width="204" :height="156" class="order-box-info-image"></u-image>
				</view>
				<view class="order-box-info-right">
					<view class="order-box-info-right-title">{{ orderInfo.spuName }}</view>
					<view class="order-text-box-item-money">
						{{ orderInfo.payRule === 1 ? (orderInfo.unitIntegralAmount || 0) + '积分' : orderInfo.payRule === 2 ? '¥' + (orderInfo.originalPrice || 0) : (orderInfo.unitIntegralAmount || 0) + '积分' + '+' + '¥' + (orderInfo.originalPrice || 0) }}
					</view>
				</view>
			</view>
		</view>
		<view class="order-text-box">
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">商品</view>
				<view class="order-text-box-item-money">{{ orderInfo.unitIntegralAmount || 0 }}积分
				</view>
			</view>
			<view class="order-text-box-divider"></view>
			<view class="order-text-box-item" style="margin:0rpx;">
				<view class="order-text-box-item-title">共 <label
						style="color: #EE5142;">{{ orderInfo.buyNumber }}</label> 件商品
				</view>
				<view class="order-text-box-item-money"><label style="color: #303133; font-weight: 400;">合计积分</label>
					{{ orderInfo.integralAmount || 0 }}积分
				</view>
			</view>
		</view>
		<view class="bottom-btn-box-position"></view>
		<view class="bottom-btn-box">
			<view class="bottom-btn" @click="confirmOrder" :style="{background:buttonColor}"
				:class="orderInfo.integralAmount > orderInfo.currentTotalIntegral ? 'grey-bottom-btn' : '' ">提交订单</view>
		</view>
		<ThemeModal :showModal="showThemePopup" content="是否确认兑换该商品？" @confirmModal="confirmModal"
			@closeModal="closeModal" />
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import {
		getGoodsDetails,
		putConfirmOrderDetails,
		waitOrderPay
	} from '../Mall.api.ts'
	import {
		ref
	} from 'vue'
	import ThemeModal from '@/components/ThemeModal.vue'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const orderInfo = ref({})
	const showThemePopup = ref(false)
	const confirmOrder = () => {
		if (orderInfo?.value?.integralAmount > orderInfo.value.currentTotalIntegral) {
			return;
		}
		showThemePopup.value = true
	}
	const confirmModal = async () => {
		let params = {
			buyNumber: orderInfo.value.buyNumber,
			spuId: orderInfo.value.spuId,
			category: orderInfo.value.goodsType,
			payType: 8,
			category: 7
		}
		const value = uni.getStorageSync('user')
		params.userId = value.userId
		await waitOrderPay(params).then(res => {
			if (res.code === 200) {
				uni.showToast({
					icon: 'success',
					title: '兑换成功'
				})
				setTimeout(() => {
					uni.navigateBack({
						delta: 2
					})
				}, 1000)
			}
		})
		closeModal()
	}
	const closeModal = () => {
		showThemePopup.value = false
	}
	onLoad(async (item) => {
		await putConfirmOrderDetails({
			spuId: item.id,
			buyNumber: item.payNumber,
			category: 7,
			normsId: item.normsId
		}).then(res => {
			orderInfo.value = res.result
			console.log(orderInfo.value);
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.bottom-btn-box-position {
		width: 100%;
		height: 164rpx;
	}

	.bottom-btn-box {
		position: fixed;
		bottom: 76rpx;
		width: 100%;
		height: 88rpx;
		background: #FFFFFF;
		padding: 0rpx 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.bottom-btn {
			width: 100%;
			height: 100%;
			border-radius: 8rpx;
			text-align: center;
			line-height: 88rpx;

			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
		}

		.grey-bottom-btn {
			background: #C0C7D1 !important;
		}
	}

	.order-box {
		margin: 32rpx 40rpx;
		padding: 32rpx 24rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 12rpx;

		.order-box-title {
			font-size: 24rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #606266;
			line-height: 32rpx;
			margin-bottom: 24rpx;
		}

		.order-box-info {
			display: flex;
			// justify-content: space-between;

			.order-box-info-image {
				border-radius: 12rpx;
				margin-right: 24rpx;
			}

			.order-box-info-right {
				width: 100%;

				.order-box-info-right-title {
					font-size: 30rpx;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #303133;
					line-height: 44rpx;
					white-space: pre-line;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.order-box-info-right-info {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 16rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 32rpx;
				}

				.order-text-box-item-money {
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 800;
					color: #EE5142;
					line-height: 28rpx;
					margin-top: 16rpx;
				}
			}
		}

	}

	.order-text-box {
		margin: 0rpx 40rpx;
		padding: 32rpx 24rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 12rpx;
		margin-bottom: 32rpx;

		.order-text-box-bottom {
			.order-text-box-bottom-money {
				width: 100%;
				text-align: right;
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 800;
				color: #EE5142;
				line-height: 28rpx;
			}
		}

		.order-text-box-item {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.order-text-box-item-message {
				display: flex;
				align-items: center;
			}

			.order-text-box-item-title {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #909399;
				line-height: 40rpx;

				.order-text-box-item-text {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
					line-height: 40rpx;
				}

			}

			.order-text-box-item-content {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 40rpx;
			}

			.order-text-box-item-money {
				font-size: 28rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #EE5142;
				line-height: 40rpx;
			}

			margin-bottom: 24rpx;
		}

		.order-text-box-divider {
			width: 100%;
			height: 1rpx;
			background: #DCDFE6;
			margin-bottom: 24rpx;
		}
	}
</style>
