<template>
	<view>
		<u-navbar :title="title"></u-navbar>
		<view class="order-box">
			<view class="order-box-title">
				{{
					orderInfo.category === 6 ? '考点资料':
					orderInfo.category === 8 || orderInfo.category === 9 ? '会员充值':
					orderInfo.category === 10 ? '学币充值': '课程'
				}}
			</view>
			<view class="order-box-info">
				<view v-if="orderInfo.category === 6">
					<u-image :src="orderInfo.imgUrl" :width="204" :height="156" class="order-box-info-image"></u-image>
				</view>
				<view class="order-box-info-right">
					<view class="order-box-info-right-title">{{ orderInfo.spuName }}</view>
					<view class="order-box-info-right-info" v-if="orderInfo.category === 6">
						<view>规格：{{ orderInfo.normsName || 0 }}天</view>
						<view>¥{{ orderInfo.originalPrice || 0 }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-text-box">

			<view class="order-text-box-item">
				<view class="order-text-box-item-title">订单编号</view>
				<view class="order-text-box-item-content">{{ orderInfo.orderNumber }}</view>
			</view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">下单时间</view>
				<view class="order-text-box-item-content">{{ orderInfo.startTime }}</view>
			</view>
			<view class="order-text-box-item" @click="goSelectCoupon">
				<view class="order-text-box-item-title">优惠券</view>
				<view class="order-text-box-item-content" style="width: 200rpx; height: 38rpx; text-align: right;"
					v-if="orderInfo.couponPrice != null">
					-￥{{ orderInfo.couponPrice || 0 }}
				</view>
				<view class="order-text-box-item-content-select-coupon" v-else>
					<label>请选择优惠券</label>
					<u-icon name="arrow-right" :size="24"></u-icon>
				</view>
			</view>
			<view class="order-text-box-divider"></view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">商品总价</view>
				<view class="order-text-box-item-money">¥{{ orderInfo.originalPrice || 0 }}</view>
			</view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">优惠活动</view>
				<view class="order-text-box-item-money" style="color: #EE5142;">- ¥{{ orderInfo.activityPrice || 0 }}
				</view>
			</view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">优惠券</view>
				<view class="order-text-box-item-money" style="color: #EE5142;">
					-￥{{ orderInfo.couponPrice || 0 }}
				</view>
			</view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">折扣</view>
				<view class="order-text-box-item-money" style="color: #EE5142;">-
					¥{{ orderInfo.memberDiscountPrice || 0 }}
				</view>
			</view>
			<view class="order-text-box-divider" v-if="type != '0'"></view>
			<view class="order-text-box-bottom-totalPrice" v-if="type != '0'">
				实际支付 <label>¥{{ orderInfo.totalPrice }}</label>
			</view>
		</view>
		<view class="bottom-btn-box" v-if="type == '0'">
			<view class="order-text-box-bottom-totalPrice">
				实际支付 <label>¥{{ orderInfo.totalPrice }}</label>
			</view>
			<view class="bottom-btn" @click="goPay" :style="{background: buttonColor}">去支付</view>
		</view>
		<PayMoneyComponent :show="showPayMoneyComponent" :isLearnCurrency="true" :orderInfo="payOrderInfo"
			@closePopup="closePopup" />
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import {
		orderGetById,
		putConfirmOrderDetails,
		wechatLoginGetOpenId
	} from '../Personal.api.ts'
	import {
		ref
	} from 'vue'
	import PayMoneyComponent from '@/components/PayMoneyComponent.vue'
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	const orderInfo = ref({})
	const payOrderInfo = ref({})
	const isOrder = ref('')
	const title = ref('')
	const type = ref('')
	const showPayMoneyComponent = ref(false)
	const currentUserWechatLoginGetOpenId = ref('')
	const params = ref({})
	const goPay = () => {
		console.log(orderInfo.value);
		payOrderInfo.value = {
			spuId: orderInfo.value.spuId,
			id: orderInfo.value.id,
			couponId: orderInfo.value.couponId,
			buyNumber: orderInfo.value.buyNumber,
			buyMonth: orderInfo.value.buyMonth,
			openId: currentUserWechatLoginGetOpenId.value,
			category: orderInfo.value.category,
			payMoney: orderInfo.value.totalPrice
		}
		showPayMoneyComponent.value = true
	}
	const closePopup = (value) => {
		showPayMoneyComponent.value = value
	}
	const goSelectCoupon = () => {
		uni.navigateTo({
			url: '/personal/order/SelectCoupon?totalPrice=' + (orderInfo.value.originalPrice || 0) +
				'&category=' +
				orderInfo.value.category
		})
		uni.$on('selectedCoupon', async (id) => {
			params.value.couponId = id
			if (isOrder.value === '0') {
				await putConfirmOrderDetails(params.value).then(res => {
					orderInfo.value = res.result
				})
			} else {
				await orderGetById(params.value).then(res => {
					orderInfo.value = res.result
				})
			}
		})
	}
	onLoad(async (item) => {
		isOrder.value = item.isOrder
		if (item.isOrder === '0') {
			title.value = '订单支付'
			type.value = '0'
			params.value = {
				id: item.id || '',
				category: parseInt(item.category),
				buyNumber: parseInt(item.buyNumber) || 0,
				buyMonth: item.buyMonth || 0,
				normsId: item.normsId || ''
			}
			await putConfirmOrderDetails(params.value).then(res => {
				orderInfo.value = res.result
			})
		} else {
			type.value = item.type
			if (item.type === 'undefined') {
				item.type = '1'
			}
			title.value = item.type === '1' ? '订单详情' : '订单支付'
			params.value = {
				id: item.id,
				orderType: 1
			}
			await orderGetById(params.value).then(res => {
				orderInfo.value = res.result
			})
		}
		// await wechatLoginGetOpenId().then(res =>{
		// 	currentUserWechatLoginGetOpenId.value = res.result.openid
		// })
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.bottom-btn-box {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 176rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -4rpx 16rpx 0rpx rgba(0, 0, 0, 0.1);
		padding: 28rpx 40rpx 76rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.bottom-btn {
			width: 180rpx;
			height: 72rpx;
			border-radius: 8rpx;
			text-align: center;
			line-height: 72rpx;

			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
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
			}
		}

	}

	.order-text-box {
		margin: 0rpx 40rpx;
		padding: 32rpx 24rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 12rpx;

		.order-text-box-item {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.order-text-box-item-title {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #909399;
				line-height: 40rpx;
			}

			.order-text-box-item-content {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 40rpx;

				.order-text-box-item-content-select-coupon {
					font-size: 20rpx;
					font-weight: 400;
					color: #999999;
					line-height: 40rpx;
				}
			}

			.order-text-box-item-money {
				font-size: 28rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #303133;
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

	.order-text-box-bottom-totalPrice {
		text-align: right;
		padding-right: 12rpx;

		label {
			margin-left: 10rpx;
			color: #EE5142;
			font-size: 28rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			line-height: 40rpx;
		}
	}
</style>
