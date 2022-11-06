<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view>
			<u-navbar title="余额提现"></u-navbar>
		</view>
		<view class="balance-withdrawal-bgcolor-box">
			<view class="balance-withdrawal-bgcolor-toptips-box">
				<view class="balance-withdrawal-bgcolor-toptips">
					<u-image src="../../static/user/info-warning.png" mode="" :width="32" :height="32"></u-image>
					<label>满1元可提现</label>
				</view>
			</view>
			<view class="balance-withdrawal-bgcolor-money"><label>¥</label>{{ balanceAmount }}</view>
			<view class="balance-withdrawal-bgcolor-btn" @click="goWithdarwalPage"
				:style="{ background: balanceAmount > 1 ? buttonColor : '#C0C7D1'}">申请提现</view>
		</view>
		<view class="binding-weChat">
			<view class="">
				<label class="binding-weChat-toptips">绑定微信 &nbsp;</label>
				<label class="binding-weChat-name">{{ wxName }}</label>
			</view>
			<label class="binding-weChat-btn" :style="{ color:buttonColor}" @click="getUserInfo">绑定</label>
		</view>
		<view class="balance-withdrawal-tabs">
			<u-subsection :list="list" :current="current" mode="subsection" active-color="#395AE1" ref="subsection"
				@change="changeCurrentSubsection"></u-subsection>
		</view>
		<view class="balance-withdrawal-income-situation" v-if="!current">
			<view class="balance-withdrawal-income" v-for="(item,index) in distributionStatistics" :key="index">
				<view class="balance-withdrawal-income-title" :style="`background: ${ item.bgColor };`">{{ item.title }}
				</view>
				<view class="balance-withdrawal-today-income">
					<label>{{ item.todayMoney }}</label>
					<view class="balance-withdrawal-today-income-text">
						今日收入
					</view>
				</view>
				<view class="balance-withdrawal-month-income">
					<label>{{ item.monthMoney }}</label>
					<view class="balance-withdrawal-today-income-text">
						本月收入
					</view>
				</view>
				<view class="balance-withdrawal-accumulate-income">
					<label>{{ item.accumulateMoney }}</label>
					<view class="balance-withdrawal-today-income-text">
						累计收入
					</view>
				</view>
			</view>
		</view>
		<view class="balance-withdrawal-income-list" v-else>
			<view class="balance-withdrawal-income-selectTimeOfState"  v-if="balanceWithdrawalIncomeList.length">
				<u-dropdown @open="openPicker" ref="dropdown">
					<u-dropdown-item v-model="valueState" :title="optionsState[valueState].label"
						:options="optionsState">
					</u-dropdown-item>
					<u-dropdown-item :title="valueTime" v-model="valueTime"></u-dropdown-item>
				</u-dropdown>
				<u-picker mode="time" v-model="showPicker" :params="params" @confirm="selectPicker" ref="upickers"
					@cancel="closePicker" :default-time="defaulTime"></u-picker>
			</view>
			<view class="balance-withdrawal-income-item" v-for="(item,index) in balanceWithdrawalIncomeList"
				:key="index"  v-if="balanceWithdrawalIncomeList.length">
				<view class="balance-withdrawal-income-item-left">
					<view class="balance-withdrawal-income-item-title">
						{{ item.operateTypeStr }}
					</view>
					<view class="balance-withdrawal-income-item-time">{{ item.operateTime }}</view>
				</view>
				<view class="balance-withdrawal-income-item-right"
					:style="`color: #${item.amount >= 0? '303133':'EE5142'};`">{{ item.amount >= 0? '+':'-' }}
					¥{{ item.amount >= 0? item.amount: Math.abs(item.amount) }}</view>
			</view>
			<view class="" v-else>
				<NoState type="article" :isPage="false">
					<template #text>
						<view>暂无明细！</view>
					</template>
				</NoState>
				<view class="go-earn-money-btn" @click="goInvitationCenter">
					去赚钱
				</view>
			</view>
		</view>
		<ThemeModal :showModal="showModal" content="提现需要先绑定微信，是否绑定？" @closeModal="closeModal"
			@confirmModal="confirmModal" />
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue'
	import {
		onLoad,
		onReady,
	} from "@dcloudio/uni-app";
	import {
		findRelationRecordList,
		getRelationDetails,
		addWechatOpenId,
		wechatLoginGetOpenId
	} from '../Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	import ThemeModal from '@/components/ThemeModal.vue'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	let toggleColor = ref(uni.getStorageSync('otherThemeColor').toggleColor ? '#' + uni.getStorageSync('otherThemeColor')
		.toggleColor : 'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)')
	const subsection = ref(null)
	const upickers = ref(null)
	const list = [{
			name: '分销统计'
		},
		{
			name: '收支明细'
		},
	]
	const showModal = ref(false)
	const current = ref(0)
	const distributionStatistics = ref([{
			title: '收入',
			twoTitle: '收入',
			bgColor: 'linear-gradient(90deg, #E85535 0%, #F1B466 100%)',
			todayMoney: '0',
			monthMoney: '0',
			accumulateMoney: '0'
		},
		{
			title: '提现',
			twoTitle: '提现',
			bgColor: 'linear-gradient(90deg, #29A28A 0%, #8BE7A9 100%)',
			todayMoney: '0',
			monthMoney: '0',
			accumulateMoney: '0'
		},
		{
			title: '邀请',
			twoTitle: '提现',
			bgColor: 'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)',
			todayMoney: '0',
			monthMoney: '0',
			accumulateMoney: '0'
		}
	])
	const optionsState = [{
			label: '全部',
			value: 0,
		},
		{
			label: '拉新',
			value: 1,
		},
		{
			label: '分销',
			value: 2,
		},
		{
			label: '提现',
			value: 3,
		}
	]
	const valueState = ref(0)
	const params = {
		year: true,
		month: true,
		day: false,
		hour: false,
		minute: false,
		second: false
	}
	const showPicker = ref(false)
	const todayTime = new Date()
	const valueTime = ref(todayTime.getFullYear() + '年' + parseInt(todayTime.getMonth() + 1) + '月')
	const defaulTime = ref(todayTime.getFullYear() + '-' + parseInt(todayTime.getMonth() + 1) + '-' + todayTime.getDate())
	const dropdown = ref(null)
	const balanceWithdrawalIncomeList = ref([])
	const paramsRelationRecordList = ref({
		operateTime: '',
		operateType: 0
	})
	const balanceAmount = ref(0)
	const wxName = ref('')
	const wxOpenid = ref('')
	const changeCurrentSubsection = (e) => {
		current.value = e
	}
	const openPicker = (e) => {
		if (e) {
			showPicker.value = true
		}
	}
	const selectPicker = async (e) => {
		paramsRelationRecordList.value.operateTime = e.year + '-' + e.month
		await findRelationRecordList(paramsRelationRecordList.value).then(res => {
			balanceWithdrawalIncomeList.value = res.result.records
		})

		valueTime.value = e.year + '年' + e.month + '月'
		dropdown.value.current = null
		dropdown.value.maskClick()
		defaulTime.value = e.year + '-' + e.month 
	}
	const goWithdarwalPage = () => {
		if (balanceAmount.value > 1) {
			if (wxOpenid.value) {
				uni.navigateTo({
					url: '/personal/balance-withdrawal/WithdrawalPage'
				})
			} else {
				showModal.value = true
			}
		} else {
			return
		}
		// uni.navigateTo({
		// 	url: '/personal/balance-withdrawal/WithdrawalPage'
		// })
	}
	const closeModal = () => {
		showModal.value = false
	}
	const confirmModal = () => {
		closeModal()
	}
	const bindingWeChat = (res) => {
		uni.login({
			"provider": "weixin",
			"onlyAuthorize": true, // 微信登录仅请求授权认证
			success: function(event) {
				const {
					code
				} = event
				console.log('微信登录仅请求授权认证', res);
				wechatLoginGetOpenId({
					code: code
				}).then(resp => {
					console.log(resp, 33333, uni.getStorageSync('user'));
					const parasm = {
						"inviteCode": "",
						"userId": uni.getStorageSync('user').userId,
						"wxAuthDevice": 1,
						"wxName": res.userInfo.nickName,
						"wxOpenid": resp.result.openid || '',
						"wxUnionid": resp.result.unionid || '',
					}
					addWechatOpenId({
						...parasm
					}).then((rep) => {
						console.log(rep);
					})
				})
			},
			fail: function(err) {
				// 登录授权失败  
				// err.code是错误码
			}
		})
	}
	const getUserInfo = async (e) => {
		uni.getUserProfile({
			desc: "授权信息登录",
			lang: "zh-CN",
			success: async (res) => {
				bindingWeChat(res)
			},
		});
	
	}
	const goInvitationCenter = () =>{
		uni.navigateTo({
			url: '/personal/invitation-center/InvitationCenter'
		})
	}
	onLoad(async () => {
		await findRelationRecordList().then(res => {
			balanceWithdrawalIncomeList.value = res.result.records
		})
		await getRelationDetails().then(res => {
			wxName.value = res.result.wxName || ''
			wxOpenid.value = res.result.wxOpenid
			balanceAmount.value = res.result.balanceAmount
			// isApply: 0
			// isWechatStatus: 0

			distributionStatistics.value[0].todayMoney = res.result.todayAmount
			distributionStatistics.value[0].monthMoney = res.result.monthAmount
			distributionStatistics.value[0].accumulateMoney = res.result.totalAmount
			distributionStatistics.value[1].todayMoney = res.result.todayWithdraw
			distributionStatistics.value[1].monthMoney = res.result.monthWithdraw
			distributionStatistics.value[1].accumulateMoney = res.result.totalWithdraw
			distributionStatistics.value[2].todayMoney = res.result.todayInvite
			distributionStatistics.value[2].monthMoney = res.result.monthInvite
			distributionStatistics.value[2].accumulateMoney = res.result.totalInvite
		})
	})
	onReady(() => {
		subsection.value.itemBgStyle.background = toggleColor
	})
	watch(showPicker, (value) => {
		if (!value) {
			dropdown.value.current = null
			dropdown.value.maskClick()
		}
	})
	watch(valueState, async (value) => {
		paramsRelationRecordList.value.operateType = value
		await findRelationRecordList(paramsRelationRecordList.value).then(res => {
			balanceWithdrawalIncomeList.value = res.result.records
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.go-earn-money-btn {
		width: 148rpx;
		height: 72rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
		border: 2rpx solid #395AE1;
		margin: auto;

		text-align: center;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #395AE1;
		line-height: 72rpx;
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
			margin: 56rpx 0rpx 48rpx;
			height: 94rpx;

			label {
				font-size: 48rpx;
			}
		}

		.balance-withdrawal-bgcolor-btn {
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

	.binding-weChat {
		margin: 78rpx 40rpx 48rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 12rpx;
		padding: 32rpx 24rpx;
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

	.balance-withdrawal-tabs {
		padding: 0rpx 40rpx;
	}

	.balance-withdrawal-income-situation {
		padding: 0rpx 40rpx;

		.balance-withdrawal-income {
			margin-top: 32rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.balance-withdrawal-income-title {
				padding: 32rpx 20rpx;
				width: 80rpx;
				height: 148rpx;
				border-radius: 12rpx 0rpx 0rpx 12rpx;

				font-size: 30rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #FFFFFF;
				line-height: 42rpx;
				text-align: center;

				label {
					display: block;
				}
			}

			.balance-withdrawal-today-income,
			.balance-withdrawal-month-income,
			.balance-withdrawal-accumulate-income {
				flex: 1;
				text-align: center;

				label {
					font-size: 36rpx;
					font-family: DINCond-Black, DINCond;
					font-weight: 900;
					color: #303133;
					line-height: 44rpx;
				}

				.balance-withdrawal-today-income-text {
					margin-top: 8rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 32rpx;
				}
			}
		}

		.balance-withdrawal-withdraw-deposit {
			margin: 32rpx 0rpx;
		}
	}

	.balance-withdrawal-income-list {
		margin: 32rpx 0rpx 20rpx;

		.balance-withdrawal-income-item {
			margin: 0rpx 40rpx;
			display: flex;
			align-items: center;
			padding: 24rpx 0rpx;
			justify-content: space-between;

			.balance-withdrawal-income-item-left {
				.balance-withdrawal-income-item-title {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
					line-height: 40rpx;
				}

				.balance-withdrawal-income-item-time {
					margin-top: 8rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 32rpx;
				}
			}

			.balance-withdrawal-income-item-right {
				font-size: 28rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				line-height: 40rpx;
			}
		}
	}
</style>
