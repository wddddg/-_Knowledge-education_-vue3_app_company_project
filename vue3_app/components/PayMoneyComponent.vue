<template>
	<view>
		<u-popup v-model="show" mode="bottom" border-radius="12" :closeable="true">
			<view class="popupStyle">
				<view class="mode-of-payment">请选择支付方式</view>
				<view class="wx-of-zfb-of-learn-currency">
					<view class="pay-select-box" v-for="(item,index) in payList" :key="index"
						@click="changeCurrentSelectItem(item.icon)">
						<view class="pay-select-item-icon" v-if="item.showItem">
							<u-image src="../static/wechat-pay.png" :width="48" :height="42"
								v-if="item.icon === 'wechat'"></u-image>
							<u-image src="../static/alipay-pay.png" :width="48" :height="48"
								v-if="item.icon === 'alipay'"></u-image>
							<u-image src="../static/learn-currency-pay.png" :width="48" :height="48"
								v-if="item.icon === 'learn-currency'"></u-image>
							<view class="pay-select-item-title" :style="`margin-top: ${ false?'24rpx':'0rpx' };`"
								v-if="item.chakRemainder">
								{{ item.title }}
								<label class="pay-select-item-two-title">（余额：¥{{ currentBalanceAmount }}）</label>
								<view class="pay-select-item-three-title">
									{{ currentBalanceAmount < parseInt(orderInfo.payMoney) ?'账户余额不足':'' }}
								</view>
							</view>
							<view class="pay-select-item-title" v-else>
								{{ item.title }}
							</view>
						</view>
						<view class="select-box"
							:style="{background: item.icon === currentSelectItem ? buttonColor : '', border: item.icon === currentSelectItem ? `2rpx solid ${buttonColor}` : ''}"
							v-if="item.showItem">
							<u-image src="../static/answer.png" width="28rpx" height="24rpx"></u-image>
						</view>
					</view>
				</view>
				<view class="pay-button" @click="immediatelyPay" :style="{background: buttonColor}">
					立即支付 ¥{{ parseInt(orderInfo.payMoney) || orderInfo.payMoney }}
				</view>
			</view>
		</u-popup>
		<view class="alipaysubmit" v-html="formContent"></view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch,
		defineProps,
		nextTick
	} from 'vue'
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import {
		getBalanceLearnMoney,
		waitOrderPay
	} from '@/common/questionApi.js'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const phoneType = uni.getSystemInfoSync().uniPlatform
	const showTypeInfo = ref(true)
	const props = defineProps({
		show: {
			type: Boolean,
			default: false
		},
		isLearnCurrency: {
			type: Boolean,
			default: false
		},
		orderInfo: {
			type: Object
		}
	})
	const emit = defineEmits()
	const formContent = ref('')
	const payList = ref([{
			title: '微信支付',
			icon: 'wechat',
			chakRemainder: false,
			showItem: true
		},
		{
			title: '支付宝支付',
			icon: 'alipay',
			chakRemainder: false,
			showItem: true
		},
		{
			title: '学币支付',
			icon: 'learn-currency',
			chakRemainder: true,
			showItem: props.isLearnCurrency
		}
	])
	onLoad(async () => {
		if (props.isLearnCurrency) {
			await getBalanceLearnMoney().then(res => {
				currentBalanceAmount.value = res.result.balanceAmount
			})
		}
	})
	const currentBalanceAmount = ref(0)
	const currentSelectItem = ref('wechat')
	watch(() => props.show, (value) => {
		if (!value) {
			emit('closePopup', false)
		}
	})
	const changeCurrentSelectItem = (value) => {
		currentSelectItem.value = value
	}
	const immediatelyPay = async () => {
		let params = {
			category: props.orderInfo.category,
			buyNumber: props.orderInfo.buyNumber || 1,
			openId: props.orderInfo.openId || '',
			buyMonth: props.orderInfo.buyMonth || '',
			addressId: props.orderInfo.addressId || '',
			couponId: props.orderInfo.couponId || '',
			spuId: props.orderInfo.spuId || '',
			userRemarks: props.orderInfo.userRemarks || '',
			buyTerminal: null,
			price: props.orderInfo.payMoney || 0
		}
		if (uni.getSystemInfoSync().uniPlatform === 'app') {
			if (uni.getSystemInfoSync().platform === 'android') {
				params.buyTerminal = 3
			} else {
				params.buyTerminal = 4
			}
		} else {
			if (uni.getSystemInfoSync().uniPlatform === 'mp-weixin') {
				params.buyTerminal = 1
			} else {
				params.buyTerminal = 2
			}
		}
		if (uni.getSystemInfoSync().platform === 'android') {
			if (phoneType === 'web') {
				if (currentSelectItem.value === 'wechat') {
					params.payType = 2
					await waitOrderPay(params).then(res => {
						let orderInfo = {}; // 订单相关信息
						try { // 获取后端返回的链接和提示信息
							let location = '' //回调地址，不配置会默认回调支付发起页面
							if (res.result.code === '200') { //成功判断依据
								if (res.result.payUrl) { //直接跳转链接
									window.location.href = res.result.payUrl;
								}
							} else {
								alert(res.msg || '提交订单失败')
							}
						} catch (error) {
							alert('提交订单失败' || error)
						}
					})
				} else {
					params.payType = 1
					await waitOrderPay(params).then(res => {
						formContent.value = res.result.alipayRequest;
						nextTick(() => {
							document.forms['punchout_form'].submit();
						});
					})
				}
				return;
			}
			await nextTick(async () => {
				if (currentSelectItem.value === 'wechat') {
					params.payType = 2
					await waitOrderPay(params).then(res => {
						console.log(res);
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: {
								"appid": uni.getAccountInfoSync().miniProgram
									.appId, // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
								"noncestr": res.result.noncestr, // 随机字符串
								"package": res.result.package, // 固定值
								"partnerid": res.result.partnerid, // 微信支付商户号
								"prepayid": res.result.prepayid, // 统一下单订单号 
								"timestamp": res.timestamp, // 时间戳（单位：秒）
								"sign": res.result.sign // 签名，这里用的 MD5/RSA 签名
							},
							success: (res) => {
								if (res.code === 200) {
									showTypeInfo.value = true
								} else {
									showTypeInfo.value = false
								}
							}
						})
					})
				} else if (currentSelectItem.value === 'alipay') {
					params.payType = 1
					await waitOrderPay(params).then(res => {
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: res.result.orderInfo,
							success: (res) => {
								if (res.code === 200) {
									showTypeInfo.value = true
								} else {
									showTypeInfo.value = false
								}
							}
						})
					})
				} else if (currentSelectItem.value === 'learn-currency') {
					params.payType = 4
					await waitOrderPay(params).then(res => {
						if (res.code === 200) {
							showTypeInfo.value = true
						} else {
							showTypeInfo.value = false
						}
					})
				}
			})
		} else {
			params.payType = 3
			await waitOrderPay(params).then(res => {
				console.log(res);
				// uni.requestPayment({
				// 	provider: 'alipay',
				// 	orderInfo: res.result.orderInfo,
				// 	success: (res) => {
				// 		if (res.code === 200) {
				// 			showTypeInfo.value = true
				// 		} else {
				// 			showTypeInfo.value = false
				// 		}
				// 	}
				// })
			})
		}


		if (showTypeInfo.value) {
			uni.navigateTo({
				url: '/personal/order/OrderTypeInfo?type=1&delta=' + (props.orderInfo.category === 10 ?
					'1' : '2')
			})
		} else {
			uni.navigateTo({
				url: '/personal/order/OrderTypeInfo?type=0&delta=' + (props.orderInfo.category === 10 ?
					'1' : '2')
			})
		}
	}
</script>

<style scoped lang="scss">
	.alipaysubmit {
		display: none;
	}

	.popupStyle {
		background: #FFFFFF;
		text-align: center;

		.mode-of-payment {
			margin: 48rpx 0rpx;
			font-size: 32rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #1B1E27;
			line-height: 44rpx;
		}

		.wx-of-zfb-of-learn-currency {
			padding: 0rpx 40rpx;

			.pay-select-box {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.pay-select-item-icon {
					display: flex;
					align-items: center;
					padding: 36rpx 0rpx;

					.pay-select-item-title {
						margin-left: 32rpx;

						font-size: 30rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #303133;
						line-height: 42rpx;
						text-align: left;

						.pay-select-item-two-title {
							color: #909399;
							font-size: 24rpx;
						}

						.pay-select-item-three-title {
							margin-top: 4rpx;
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #909399;
							line-height: 32rpx;
						}
					}
				}

				.select-box {
					width: 40rpx;
					height: 40rpx;
					border-radius: 8rpx;
					border: 2rpx solid #DCDFE6;
					padding: 0rpx 4rpx;
					background: #FFFFFF;
				}
			}
		}

		.pay-button {
			margin: 8rpx 40rpx 68rpx;
			height: 88rpx;
			border-radius: 8rpx;

			text-align: center;
			color: #FFFFFF;
			line-height: 88rpx;
		}
	}
</style>
