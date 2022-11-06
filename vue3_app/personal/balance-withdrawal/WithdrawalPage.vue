<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view>
			<u-navbar title="余额提现"></u-navbar>
		</view>
		<view class="balance-withdrawal-bgcolor-box">
			<view class="balance-withdrawal-bgcolor-toptips-box">
			</view>
			<view class="balance-withdrawal-bgcolor-money"><label>¥</label>{{ balanceAmount }}</view>
			<view class="balance-withdrawal-bgcolor-text">可提现金额</view>
		</view>
		<view class="binding-weChat-box">
			<view class="withdrawal-method">
				<label class="withdrawal-method-toptips">提现方式</label>
				<view class="withdrawal-method-type">
					<view class="withdrawal-method-type-flex" v-for="(item,index) in withdrawalMethodList" :key="index"
						@click="changeCurrentWithdrawalMethod(index)">
						<view class="withdrawal-method-type-box"
							:style="{ background:selectWithdrawalMethod === index?buttonColor:''}">
							<u-image src="../../static/answer.png" :width="28" :height="24"></u-image>
						</view>
						<view class="withdrawal-method-type-text">{{ item.title }}</view>
					</view>
				</view>
			</view>
			<view class="divider"></view>
			<view class="binding-weChat" v-if="selectWithdrawalMethod === 0">
				<view class="">
					<label class="binding-weChat-toptips">绑定微信 &nbsp;</label>
					<label class="binding-weChat-name">{{ wxName }}</label>
				</view>
				<label class="binding-weChat-btn" :style="{ color:buttonColor}">绑定</label>
			</view>
			<view class="alipay-withdraw-box" v-else>
				<view class="alipay-withdraw-box-item">
					<label>收款者姓名</label>
					<u-input placeholder="请输入收款者姓名" v-model="alipayName" />
				</view>
				<view class="alipay-withdraw-box-item">
					<label>支付宝账号</label>
					<u-input placeholder="请输入支付宝账号" v-model="alipayNumber" />
				</view>
			</view>
		</view>
		<view class="withdrawal-amount-money-box">
			<view class="withdrawal-amount-money-title">提现金额</view>
			<view class="withdrawal-amount-money-ipt">
				<label class="withdrawal-amount-money-symbol">¥</label>
				<u-input v-model="balanceAmountMoney" placeholder="请输入提现金额"></u-input>
				<label class="withdrawal-amount-money-btn" @click="allClickBtn" :style="{ color:buttonColor}">全部</label>
			</view>
		</view>
		<view class="withdraw-deposit-btn-box">
			<view class="withdraw-deposit-btn" :style="{ background:buttonColor}" @click="withdrawDeposit">
				提现
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
	import {
		getRelationDetails,
		putBalanceWithdraw
	} from '../Personal.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const selectWithdrawalMethod = ref(0)
	const wxName = ref('')
	const wxOpenid = ref('')
	const balanceAmount = ref(0)
	const balanceAmountMoney = ref(null)
	const alipayNumber = ref('')
	const alipayName = ref('')
	const withdrawalMethodList = [{
		title: '微信'
	}, {
		title: '支付宝'
	}]
	let params = {
		operateType: 3,
	}
	const changeCurrentWithdrawalMethod = (e) => {
		selectWithdrawalMethod.value = e
	}
	const allClickBtn = () => {
		balanceAmountMoney.value = balanceAmount.value
	}
	const withdrawDeposit = async () => {
		if ((!wxOpenid.value) && (!selectWithdrawalMethod.value)) {
			return uni.showToast({
				title: '请绑定微信后重试',
				icon: 'none'
			})
		}
		if (balanceAmountMoney.value <= balanceAmount.value) {
			params.withdrawAmount = balanceAmountMoney.value
		} else {
			return uni.showToast({
				title: '余额不足',
				icon: 'error'
			})
		}
		if (selectWithdrawalMethod.value) {
			params.alipayName = alipayNumber.value
			params.alipayNumber = alipayNumber.value
			params.category = 2
		} else {
			params.category = 1
		}

		await putBalanceWithdraw(params).then(res => {
			if (res.code === 200) {
				uni.navigateTo({
					url: '/personal/balance-withdrawal/WithdrawalSuccess'
				})
			} else {
				return uni.showToast({
					title: '提现失败',
					icon: 'error'
				})
			}
		})
	}
	onShow(async () => {
		await getRelationDetails().then(res => {
			wxName.value = res.result.wxName
			wxOpenid.value = res.result.wxOpenid
			balanceAmount.value = res.result.balanceAmount
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.withdraw-deposit-btn-box {
		position: absolute;
		height: 88rpx;
		padding: 0rpx 40rpx;
		bottom: 76rpx;
		width: 100%;

		.withdraw-deposit-btn {
			border-radius: 8rpx;
			text-align: center;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
		}
	}

	.balance-withdrawal-bgcolor-box {
		width: 100%;
		height: 320rpx;
		background: linear-gradient(180deg, #CBDEFF 0%, #FFFFFF 100%);
		padding: 0rpx 40rpx;
		border-top: 1rpx solid #CBDEFF;

		.balance-withdrawal-bgcolor-toptips-box {
			margin-top: 32rpx;
			position: relative;
			height: 32rpx;

			.balance-withdrawal-bgcolor-toptips {
				display: flex;
				align-items: center;
				position: absolute;
				right: 0%;

				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #606266;
				line-height: 32rpx;

				label {
					margin-left: 8rpx;
				}
			}
		}

		.balance-withdrawal-bgcolor-money {
			font-size: 80rpx;
			font-family: DIN-Bold, DIN;
			font-weight: bold;
			color: #303133;
			line-height: 58rpx;
			text-align: center;
			margin: 56rpx 0rpx 24rpx;
			height: 94rpx;

			label {
				font-size: 48rpx;
			}
		}

		.balance-withdrawal-bgcolor-text {
			height: 88rpx;

			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #606266;
			line-height: 32rpx;
			text-align: center;
		}
	}

	.binding-weChat-box {
		margin: 8rpx 40rpx 32rpx;
		background: #FFFFFF;
		padding: 32rpx 24rpx;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 12rpx;

		.withdrawal-method {
			display: flex;
			align-items: center;
			justify-content: space-between;
			line-height: 40rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;

			.withdrawal-method-toptips {
				color: #909399;
			}

			.withdrawal-method-type {
				display: flex;
				align-items: center;

				// width: 50%;
				// justify-content: space-between;
				.withdrawal-method-type-flex {
					display: flex;
					align-items: center;

					.withdrawal-method-type-box {
						width: 40rpx;
						height: 40rpx;
						border-radius: 8rpx;
						border: 2rpx solid #DCDFE6;
						background-color: #fff;
						margin-right: 16rpx;
						padding: 0rpx 4rpx;
					}

					margin-left: 48rpx;

					// .active-type-box {
					// 	background-color: $u-global-color;
					// }
				}
			}
		}

		.divider {
			height: 1rpx;
			background: #DCDFE6;
			margin: 32rpx 0rpx;
		}

		.binding-weChat {
			display: flex;
			align-items: center;
			justify-content: space-between;
			line-height: 40rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;

			.binding-weChat-toptips {
				color: #909399;
			}

			.binding-weChat-name {
				color: #303133;
			}

			.binding-weChat-btn {}
		}

		.alipay-withdraw-box {
			.alipay-withdraw-box-item {
				display: flex;
				align-items: center;

				label {
					margin-right: 12rpx;
					color: #909399;
				}
			}
		}
	}

	.withdrawal-amount-money-box {
		background: #FFFFFF;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 12rpx;
		margin: 0rpx 40rpx;
		padding: 32rpx 24rpx 40rpx;

		.withdrawal-amount-money-title {
			font-size: 30rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #303133;
			line-height: 48rpx;
			margin-bottom: 32rpx;
		}

		.withdrawal-amount-money-ipt {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.withdrawal-amount-money-symbol {
				font-size: 56rpx;
				font-family: DIN-Bold, DIN;
				font-weight: bold;
				color: #303133;
				line-height: 68rpx;
				margin-right: 24rpx;
			}

			.withdrawal-amount-money-btn {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				line-height: 40rpx;
				margin-left: 24rpx;
			}
		}
	}
</style>
