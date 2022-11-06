<template>
	<view>
		<u-navbar title="订单支付"></u-navbar>
		<view class="address-box" v-if="userCurrentAddressDefault.mallUserAddressVO" @click="goAddAddressList">
			<view class="address-text-box">
				<view class="address-text-icon">
					<u-icon name="map" :size="32" color="#909399"></u-icon>
				</view>
				<view class="address-text">
					<view class="address-text-title">
						{{ userCurrentAddressDefault.mallUserAddressVO.provinceName + userCurrentAddressDefault.mallUserAddressVO.cityName + userCurrentAddressDefault.mallUserAddressVO.countyName + userCurrentAddressDefault.mallUserAddressVO.addressDetails }}
					</view>
					<view class="address-text-name">
						<label>{{ userCurrentAddressDefault.mallUserAddressVO.receivedName }}</label>
						<label
							style="color: #909399;">{{ userCurrentAddressDefault.mallUserAddressVO.receivedPhone }}</label>
					</view>
				</view>
			</view>
			<view>
				<u-icon name="arrow-right" :size="24" color="#909399"></u-icon>
			</view>
		</view>
		<view class="address-box" v-else>
			<view class="add-address-box" @click="goAddAddress">
				<u-icon name="plus" :color="buttonColor" :size="24"></u-icon>
				<label :style="{color:buttonColor}">新建收货地址</label>
			</view>
		</view>
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
				<view class="order-text-box-item-title">订单编号</view>
				<view class="order-text-box-item-text">
					<label>{{ orderInfo.orderNumber }}</label>
					<label style="margin-left: 16rpx;" :style="{color: buttonColor}"
						@click="clipboardData(orderInfo.orderNumber)">复制</label>
				</view>
			</view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">商品总额</view>
				<view class="order-text-box-item-money">￥{{ orderInfo.originalPrice || 0 }}
				</view>
			</view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">积分</view>
				<view class="order-text-box-item-money">{{ orderInfo.unitIntegralAmount || 0 }}积分
				</view>
			</view>
			<view class="order-text-box-divider"></view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">配送方式</view>
				<view class="order-text-box-item-text">
					{{ orderInfo.sendName }}
				</view>
			</view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">运费</view>
				<view class="order-text-box-item-text" style="color: #303133;">￥{{ orderInfo.expressAmount || 0 }}
				</view>
			</view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">买家留言</view>
				<view class="order-text-box-item-message" @click="showPopupFun">
					<u-input :height="40" :autoHeight="false"
						:customStyle="{ width:'400rpx', height: '40rpx' , marginRight: '16rpx',padding:'0rpx' }"
						inputAlign="right" v-model="orderInfo.userRemarks" placeholder="无备注" @focus="showPopupFun">
					</u-input>
					<u-icon name="arrow-right" :size="24" @click="showPopupFun"></u-icon>
				</view>
			</view>
			<view class="order-text-box-divider"></view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">共 <label
						style="color: #EE5142;">{{ orderInfo.buyNumber }}</label> 件商品</view>
				<view class="order-text-box-item-money"><label style="color: #303133; font-weight: 400;">合计金额</label>
					￥{{ orderInfo.totalPrice || 0 }}
				</view>
			</view>
			<view class="order-text-box-bottom">
				<view class="order-text-box-bottom-money"><label style="color: #303133; font-weight: 400;">合计积分</label>
					{{ orderInfo.unitIntegralAmount || 0 }}积分
				</view>
			</view>
		</view>

		<view class="order-text-box">
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">状态</view>
				<view class="order-text-box-item-text">
					{{
						orderInfo.isSend === 1 ? '已发货' : 
						orderInfo.isSend === 2 ? '未发货' :
						orderInfo.isSend === 3 ? '无需发货' : '确认收货'
					 }}
				</view>
			</view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">快递</view>
				<view class="order-text-box-item-text">{{ orderInfo.expressName }}
				</view>
			</view>
			<view class="order-text-box-item">
				<view class="order-text-box-item-title">物流单号</view>
				<view class="order-text-box-item-text">
					<label>{{ orderInfo.expressNumber }}</label>
					<label style="margin-left: 16rpx; " :style="{color: buttonColor}"
						@click="clipboardData(orderInfo.expressNumber)" v-if="orderInfo.expressNumber">复制</label>
				</view>
			</view>
		</view>
		<view class="bottom-btn-box-position"></view>
		<view class="bottom-btn-box">
			<view class="bottom-btn" @click="goPay"
				:style="{background:userCurrentAddressDefault.mallUserAddressVO?buttonColor:'#C0C7D1'}">去支付</view>
		</view>
		<u-popup v-model="showPopup" mode="bottom" border-radius="12rpx" :closeable="true">
			<view class="popup-box">
				<view class="popup-box-title">
					买家留言
				</view>
				<view class="">
					<u-input type="textarea" placeholder="选填（对本次交易需求给商家留言）" :autoHeight="false" :height="336"
						:maxlength="99999" v-model="textareaValue"
						:customStyle="{height:'336rpx',margin:'48rpx 0rpx 40rpx',padding:'32rpx 24rpx',background:'#F6F6F6',border:' 2rpx solid #DCDFE6',borderRadius: '12px'}">
					</u-input>
				</view>
				<view class="popup-info-btn" @click="confirmMessage" :style="{background:buttonColor}">
					确定
				</view>
			</view>
		</u-popup>
		<PayMoneyComponent :show="showPayMoney" :isLearnCurrency="true" :orderInfo="payOrderInfo"
			@closePopup="closePayMoney" />
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import {
		orderGetById,
		addressGetDetailsById,
		wechatLoginGetOpenId
	} from '../Mall.api.ts'
	import {
		ref
	} from 'vue'
	import PayMoneyComponent from '@/components/PayMoneyComponent.vue'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const orderInfo = ref({})
	const payOrderInfo = ref({})
	const userCurrentAddressDefault = ref({})
	const currentUserWechatLoginGetOpenId = ref('')
	const showPopup = ref(false)
	const showPayMoney = ref(false)
	const textareaValue = ref('')
	const clipboardData = (value) => {
		uni.setClipboardData({
			data: value,
			success: function() {
				uni.showToast({
					icon: 'success',
					title: '复制成功'
				})
			}
		});
	}
	const showPopupFun = () => {
		textareaValue.value = orderInfo.value.userRemarks
		showPopup.value = true
	}
	const confirmMessage = () => {
		orderInfo.value.userRemarks = textareaValue.value
		showPopup.value = false
	}
	const goAddAddressList = () => {
		uni.navigateTo({
			url: '/mall/shipping-address/ShippingAddress?type=select'
		})
	}
	const goAddAddress = () => {
		uni.navigateTo({
			url: '/mall/shipping-address/ShippingAddress?type=select'
		})
	}
	const goPay = async () => {
		if (!userCurrentAddressDefault.value.mallUserAddressVO) {
			return;
		}
		payOrderInfo.value = {
			spuId: orderInfo.value.spuId,
			id: orderInfo.value.orderNumber,
			userRemarks: orderInfo.value.userRemarks,
			couponId: orderInfo.value.couponId,
			addressId: userCurrentAddressDefault.value.mallUserAddressVO.id,
			buyNumber: orderInfo.value.buyNumber,
			buyMonth: orderInfo.value.buyMonth,
			openId: currentUserWechatLoginGetOpenId.value,
			category: 7,
			payMoney: orderInfo.value.totalPrice
		}
		showPayMoney.value = true
	}
	onLoad(async (item) => {
		await orderGetById({
			id: item.id,
			orderType: 2
		}).then(res => {
			orderInfo.value = res.result || {}
			console.log(res.result);
			userCurrentAddressDefault.value.mallUserAddressVO = res?.result?.mallUserAddressVO || {}
		})
		await wechatLoginGetOpenId().then(res => {
			currentUserWechatLoginGetOpenId.value = res.result.openid
		})
	})
	onShow(async () => {
		await uni.$on('currentDetailsAddress', async (data) => {
			await addressGetDetailsById({
				id: data
			}).then(res => {
				userCurrentAddressDefault.value.mallUserAddressVO = res.result
			})
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
		bottom: 0rpx;
		width: 100%;
		height: 174rpx;
		background: #FFFFFF;
		padding: 0rpx 40rpx;
		.bottom-btn {
			width: 100%;
			height: 88rpx;
			border-radius: 8rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 10rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
		}
	}

	.address-box {
		width: 100%;
		padding: 24rpx 40rpx;
		background: #FFFFFF;
		box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: space-between;

		.add-address-box {
			text-align: center;
			width: 100%;

			label {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				line-height: 40rpx;
				margin-left: 16rpx;
			}

			margin: 24rpx 0rpx;
		}

		.address-text-box {
			display: flex;
			align-items: flex-start;

			.address-text {
				margin: 0rpx 30rpx 0rpx 16rpx;

				.address-text-title {
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #303133;
					line-height: 40rpx;
					overflow: hidden;
					white-space: pre-line;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}

				.address-text-name {
					margin-top: 16rpx;
					font-size: 26rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #606266;
					line-height: 36rpx;

					label {
						margin-right: 16rpx;
					}
				}
			}
		}

		.address-text-icon {
			margin-top: 4rpx;
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
			font-weight: 400;
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
					font-weight: 400;
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
					margin-top: 16rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 800;
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
				white-space: nowrap;
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

	.popup-box {
		height: 736rpx;
		background: #FFFFFF;
		padding: 48rpx 40rpx 68rpx;

		.popup-box-title {
			font-size: 32rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #1B1E27;
			line-height: 44rpx;
			text-align: center;
		}

		.popup-info-btn {
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			width: 100%;
			border-radius: 8rpx;

			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
</style>
