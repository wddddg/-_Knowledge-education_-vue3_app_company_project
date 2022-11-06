<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view class="">
			<u-navbar title="学币余额"></u-navbar>
		</view>
		<view class="learn-currency-tabs">
			<u-subsection :list="list" :current="current" mode="subsection" active-color="#395AE1" ref="subsection"
				@change="changeCurrentSubsection"></u-subsection>
		</view>
		<view class="learn-currency-content" v-if="!current"
			:style="`background: url(${learnBackgroundUrl}) no-repeat;`">
			<view class="learn-currency-content-image">
				<u-image src="@/static/user/learn-currency.png" :width="88" :height="88"></u-image>
				<view class="available-to-learn-coins">可用学币</view>
			</view>
			<view class="learn-currency-content-number">{{ balanceAmountMoney }}</view>
		</view>
		<view class="top-up-amount-content" v-if="!current">
			<view>
				<view class="top-up-amount-title">
					请选择充值金额
				</view>
			</view>
			<view class="warn-text-icon">
				<image src="../static/user/warn-learn-currency.png"></image>
				<label>充值可能会遇到延迟，请勿重复支付</label>
			</view>
			<view class="top-up-amount-list">
				<view class="top-up-amount-item" v-for="(item,index) in topUpAmountList" :key="item.number"
					@click="selectCurrentBox(item.number)"
					:style="{border:selectCurrentBoxItem == item.number? `2rpx solid ${buttonColor}` : ''}">
					<view class="top-up-amount-title" v-if="item.number != '自定义'">{{ item.number }} 学币</view>
					<view class="top-up-amount-money" v-if="item.number != '自定义'">¥{{ item.number }}</view>
					<view class="top-up-amount-custom" v-else>
						<label>其他金额</label>
						<input type="number" class="top-up-amount-ipt" v-model="customIpt">
					</view>
				</view>
			</view>
			<view class="recharge-btn" @click="showPayMoneyBtn" :style="{background:buttonColor}">
				充值
			</view>
			<view class="">
				<view class="warn-prompt-text">
					<view class="warn-prompt-text-bgcolor-box"></view>
					<view class="warn-prompt-text-test">充值温馨提示</view>
				</view>
				<view class="warn-prompt-text-paragraph">
					请务必正确输入正确的充值金额，由于输入金额不可退还，请谨慎充值。
				</view>
			</view>
		</view>
		<view class="keep-the-minutes-table" v-else>
			<view class="keep-the-minutes-table-header" v-if="learnMoneyList.length">
				<view class="keep-the-minutes-table-header-time">充值时间</view>
				<view class="keep-the-minutes-table-header-money">充值金额</view>
				<view class="keep-the-minutes-table-header-state">状态</view>
			</view>
			<view class="keep-the-minutes-table-item" v-for="item in learnMoneyList" :key="item.id"
				v-if="learnMoneyList.length">
				<view class="keep-the-minutes-table-time">{{ item.rechargeTime }}</view>
				<view class="keep-the-minutes-table-money">¥{{ item.payMoney }}</view>
				<view class="keep-the-minutes-table-state">{{ item.payStatus }}</view>
			</view>
			<view v-else>
				<NoState type="article" :isPage="true">
					<template #text>
						暂无充值记录！
					</template>
				</NoState>
			</view>
			<u-loadmore class="loadmore" :status="loadStatus" v-if="learnMoneyList.length" icon-type="flower"
				:load-text="loadText" />
		</view>
	</view>
	<view class="">
		<PayMoneyComponent :show="showPayMoneyComponent" @closePopup="closePopup" :orderInfo="orderInfo" />
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad,
		onReady,
		onReachBottom,
		onPullDownRefresh,
		onShow
	} from "@dcloudio/uni-app";
	import {
		getBalanceLearnMoney,
		getLearnMoneyList
	} from './Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	import PayMoneyComponent from '@/components/PayMoneyComponent.vue'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	let toggleColor = ref(uni.getStorageSync('otherThemeColor').toggleColor ? '#' + uni.getStorageSync('otherThemeColor')
		.toggleColor : 'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)')
	const subsection = ref(null)
	const orderInfo = ref({})
	const loadText = ref({
		loading: '正在加载',
		nomore: '没有更多了'
	})
	const loadStatus = ref('nomore')
	let params = {
		pageNo: 1,
		pageSize: 20
	}
	const list = [{
			name: '学币充值'
		},
		{
			name: '充值记录'
		},
	]
	const topUpAmountList = [{
			number: 1
		},
		{
			number: 5
		},
		{
			number: 8
		},
		{
			number: 10
		},
		{
			number: 20
		},
		{
			number: 50
		},
		{
			number: 100
		},
		{
			number: 200
		},
		{
			number: 500
		},
		{
			number: 1000
		},
		{
			number: 5000
		},
		{
			number: '自定义'
		},
	]
	const current = ref(0)
	const selectCurrentBoxItem = ref(0)
	const balanceAmountMoney = ref(0)
	const learnMoneyList = ref([])
	const customIpt = ref(0)
	const showPayMoneyComponent = ref(false)
	const learnBackgroundUrl = ref('')
	const changeCurrentSubsection = async (e) => {
		current.value = e
		if (!e) {
			await getBalanceLearnMoney().then(res => {
				learnBackgroundUrl.value = res.result.learnBackgroundUrl
				balanceAmountMoney.value = res.result.balanceAmount
			})
		} else {
			params.pageNo = 1
			await getLearnMoneyList(params).then(res => {
				learnMoneyList.value = res.result.records
			})
		}
	}
	const selectCurrentBox = (e) => {
		selectCurrentBoxItem.value = e
	}
	const closePopup = (e) => {
		showPayMoneyComponent.value = e
	}
	const showPayMoneyBtn = () => {
		if (!selectCurrentBoxItem.value) {
			return uni.showToast({
				title: '请选择充值金额',
				icon: 'none',
				duration: 2000
			})
		}
		if (selectCurrentBoxItem.value === '自定义') {
			orderInfo.value.payMoney = customIpt.value
		} else {
			orderInfo.value.payMoney = selectCurrentBoxItem.value
		}
		orderInfo.value.category = 10
		showPayMoneyComponent.value = true
	}
	onReady(() => {
		subsection.value.itemBgStyle.background = toggleColor
	})
	// onLoad(async () => {

	// })
	onReachBottom(async () => {
		if (current.value) {
			loadStatus.value = 'loading'
			params.pageNo++
			await getLearnMoneyList(params).then((res) => {
				learnMoneyList.value.push(...res.result.records)
				if (!res.result.records.length) {
					loadStatus.value = 'nomore'
				} else {
					loadStatus.value = 'loadmore'
				}
			})
		}
	})
	onPullDownRefresh(async () => {
		if (current.value) {
			params.pageNo = 1
			await getLearnMoneyList(params).then((res) => {
				learnMoneyList.value = res.result.records
			})
			uni.stopPullDownRefresh()
		} else {
			uni.stopPullDownRefresh()
		}
	})
	onShow(async () => {
		showPayMoneyComponent.value = false
		await getBalanceLearnMoney().then(res => {
			learnBackgroundUrl.value = res.result.learnBackgroundUrl
			balanceAmountMoney.value = res.result.balanceAmount
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.learn-currency-tabs {
		margin: 32rpx 40rpx 0rpx;
		height: 64rpx;
		border-radius: 8rpx;
	}

	.learn-currency-content {
		margin: 48rpx 40rpx;

		background-size: 100% !important;
		height: 160rpx;
		padding: 36rpx 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.learn-currency-content-image {
			display: flex;
			align-items: center;

			.available-to-learn-coins {
				margin-left: 12rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 32rpx;
			}
		}

		.learn-currency-content-number {
			font-size: 56rpx;
			font-family: DINCond-Black, DINCond;
			font-weight: 900;
			color: #FFFFFF;
			line-height: 68rpx;
		}
	}

	.top-up-amount-content {
		padding: 0rpx 40rpx;

		.top-up-amount-title {
			font-size: 36rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #1B1E27;
			line-height: 50rpx;
		}

		.warn-text-icon {
			margin-top: 16rpx;
			display: flex;
			align-items: center;

			label {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #EE5142;
				line-height: 36rpx;
				margin-left: 10rpx;
			}

			image {
				width: 28rpx;
				height: 28rpx;
			}
		}

		.top-up-amount-list {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;

			.top-up-amount-item {
				background: #fff;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
				border-radius: 12rpx;
				// width: 33%;
				width: 210rpx;
				height: 148rpx;
				margin: 32rpx 0rpx 0rpx;
				padding: 32rpx 0rpx;
				text-align: center;
				border: 2rpx solid #fff;

				.top-up-amount-title {
					font-size: 36rpx;
					font-family: DINCond-Black, DINCond;
					font-weight: 900;
					color: #303133;
					line-height: 44rpx;
				}

				.top-up-amount-money {
					margin-top: 6rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 32rpx;
				}

				.top-up-amount-custom {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
					line-height: 32rpx;
					padding: 0rpx 20rpx;

					label {
						margin-bottom: 12rpx;
					}

					.top-up-amount-ipt {
						margin-top: 12rpx;
						border-radius: 8rpx;
						border: 2rpx solid #DCDFE6;
					}
				}
			}
		}

		.recharge-btn {
			height: 88rpx;
			border-radius: 8rpx;
			text-align: center;
			margin: 48rpx 0rpx;

			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
		}

		.warn-prompt-text {
			display: flex;
			align-items: center;

			.warn-prompt-text-bgcolor-box {
				width: 16rpx;
				height: 16rpx;
				background: linear-gradient(180deg, #3F6EE1 0%, #7BC8E8 100%);
			}

			.warn-prompt-text-test {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #303133;
				line-height: 40rpx;
				margin-left: 16rpx;
			}
		}

		.warn-prompt-text-paragraph {
			margin-top: 16rpx;
			margin-left: 32rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #606266;
			line-height: 40rpx;
		}
	}

	.keep-the-minutes-table {
		margin-top: 36rpx;
		padding: 0rpx 40rpx;

		.keep-the-minutes-table-header {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #909399;
			line-height: 64rpx;
			height: 64rpx;
			justify-content: space-around;
			text-align: center;
			border-bottom: 2rpx solid #DCDFE6;

			.keep-the-minutes-table-header-time {
				width: 288rpx;
			}

			.keep-the-minutes-table-header-money {
				width: 230rpx;
			}

			.keep-the-minutes-table-header-state {
				width: 230rpx;
			}
		}

		.keep-the-minutes-table-item {
			display: flex;
			align-items: center;
			padding: 36rpx 0rpx;
			justify-content: space-between;
			text-align: center;
			border-bottom: 2rpx solid #DCDFE6;

			.keep-the-minutes-table-time {
				width: 288rpx;

				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 34rpx;
			}

			.keep-the-minutes-table-money {
				width: 230rpx;

				font-size: 28rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #303133;
				line-height: 40rpx;
			}

			.keep-the-minutes-table-state {
				width: 230rpx;

				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 40rpx;
			}
		}
	}
</style>
