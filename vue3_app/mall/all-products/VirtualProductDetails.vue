<template>
	<view class="">
		<u-navbar title="商品详情"></u-navbar>
	</view>
	<view class="product-box">
		<view class="product-details-top">
			<view class="product-details-top-type">{{ productItem.name }}</view>
			<view class="product-details-top-price"><label
					v-if="productItem.payRule != 1">¥</label>{{ (productItem.price || 0) }}<label
					v-if="productItem.payRule == 1">积分</label>
			</view>
			<view class="product-details-top-condition">{{ productItem.useDesc }}</view>
		</view>
		<view class="product-details-center">
			<view class="product-details-center-price">
				{{ productItem.payRule === 1 ? (productItem.integralAmount || 0) + '积分' : productItem.payRule === 2 ? '¥' + (productItem.price || 0) : (productItem.integralAmount || 0) + '积分' + '+' + '¥' + (productItem.price || 0) }}
			</view>
			<view class="product-details-center-sold">
				已售 {{ productItem.sales }}
			</view>
		</view>
		<view class="product-details-divider"></view>
		<view class="product-details-bottom">
			<view class="product-details-bottom-title">
				适用平台
			</view>
			<view>
				{{ productItem.useScenesStr }}
			</view>
		</view>
		<view class="product-details-bottom">
			<view class="product-details-bottom-title">
				有效期至
			</view>
			<view>
				{{ productItem.endTime }}
			</view>
		</view>
		<view class="product-details-bottom">
			<view class="product-details-bottom-title">
				详细说明
			</view>
			<view v-html="productItem.content" v-if="productItem.content">
			</view>
		</view>
	</view>
	<view class="product-details-btn-box">
		<view class="product-details-btn" @click="goVirtualProductOrder" :style="{background:buttonColor}">
			立即兑换
		</view>
	</view>
</template>
<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		getGoodsDetails
	} from '../Mall.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const productItem = ref({})
	const currentOrderId = ref('')
	const goVirtualProductOrder = () => {
		uni.navigateTo({
			url: '/mall/all-products/ConfirmVirtualProductOrder?id=' + currentOrderId.value
		})
	}
	onLoad(async (value) => {
		currentOrderId.value = value.id
		await getGoodsDetails({
			id: value.id
		}).then(res => {
			productItem.value = res.result
			console.log(res.result);
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.product-box {
		margin-bottom: 174rpx;

		.product-details-top {
			width: 750rpx;
			// height: 320rpx;
			background: linear-gradient(180deg, #CBDEFF 0%, #FFFFFF 100%);
			text-align: center;
			padding: 64rpx 0rpx 68rpx;

			.product-details-top-type {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #303133;
				line-height: 40rpx;
			}

			.product-details-top-price {
				font-size: 80rpx;
				font-family: DIN-Bold, DIN;
				font-weight: bold;
				color: #303133;
				line-height: 80rpx;
				margin: 20rpx 0rpx 24rpx;

				label {
					font-size: 48rpx;
				}
			}

			.product-details-top-condition {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #606266;
				line-height: 24rpx;
			}
		}

		.product-details-center {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0rpx 40rpx;
			margin: 52rpx 0rpx 32rpx;

			.product-details-center-price {
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #EE5142;
				line-height: 32rpx;
			}

			.product-details-center-sold {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #909399;
				line-height: 24rpx;
			}
		}

		.product-details-divider {
			margin: 0rpx 40rpx;
			height: 1rpx;
			background: #DCDFE6;
			margin-bottom: 48rpx;
		}

		.product-details-bottom {
			padding: 0rpx 40rpx;
			display: flex;

			// align-items: center;
			.product-details-bottom-title {
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #909399;
				line-height: 36rpx;
				margin-right: 32rpx;
				flex: 0 0 110rpx;
			}

			margin-bottom: 24rpx;
		}
	}

	.product-details-btn-box {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 170rpx;
		// 6rpx
		padding: 0rpx 40rpx;
		background-color: #FFFFFF;

		.product-details-btn {
			margin-top: 6rpx;
			width: 100%;
			height: 88rpx;
			border-radius: 8rpx;

			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
			text-align: center;
		}
	}
</style>
