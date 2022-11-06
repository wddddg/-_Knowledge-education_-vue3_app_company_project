<template>
	<view>
		<u-navbar title="订单详情"></u-navbar>
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
					<view class="order-text-box-item-money">{{ orderInfo.unitIntegralAmount || 0 }}积分
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
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">共 <label style="color: #EE5142;">{{ orderInfo.buyNumber }}</label> 件商品</view>
				<view class="order-text-box-item-money"><label style="color: #303133;">合计积分</label>  {{ orderInfo.unitIntegralAmount || 0 }}积分
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
	import {
		orderGetById
	} from '../Mall.api.ts'
	import {
		ref
	} from 'vue'
	const orderInfo = ref({})
	onLoad(async (item) => {
		await orderGetById({
			id: item.id,
			orderType: 2
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
				.order-text-box-item-money{
					margin-top: 16rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #EE5142;
					line-height: 28rpx;
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
			}

			.order-text-box-item-money {
				font-size: 28rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #303133;
				line-height: 40rpx;
			}
			.order-text-box-item-money{
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
