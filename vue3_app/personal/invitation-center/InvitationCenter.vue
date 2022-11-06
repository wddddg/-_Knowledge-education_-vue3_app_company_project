<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view class="invitation-center-bg-image" :style="`background: url(${retailRule.backgroundUrl});`">
			<u-navbar :isFixed="false" title="邀请中心" back-icon-color="#fff" title-color="#fff" :border-bottom="false"
				:background="{ background: 'Clear' }">
				<template #right>
					<view class="right-icon" @click.stop="clickRules">
						<u-image src="@/static/user/white-warning.png" :width="40" :height="40"></u-image>
					</view>
				</template>
			</u-navbar>
			<view class="invitation-center-box-btn-box">
				<view class="invitation-center-box-btn" @click="goInvitePosters" :style="{background: buttonColor}">
					立即邀请
				</view>
			</view>
			<view class="invitation-center-box-image">
				<u-image :src="retailRule.posterBackgroundUrl" :width="692" :height="562"></u-image>
			</view>
		</view>
		<view class="invite-strategy-box">
			<view class="invite-strategy-title">邀请攻略</view>
			<view class="invite-strategy-first-list">
				<view class="invite-strategy-first-item" v-for="(item,index) in retailRule.retailRuleListOne"
					:key="index">
					<view v-if="index" class="invite-strategy-first-item-image-box">
						<image src="@/static/user/reticent.png" class="invite-strategy-first-item-image"></image>
					</view>
					<view class="invite-strategy-item-box">
						<view class="invite-strategy-item">
							{{ '0' + (index + 1) }}
						</view>
						<view class="invite-strategy-item-text">
							{{ item }}
						</view>
					</view>
				</view>
			</view>
			<view class="invite-strategy-second-list">
				<block v-for="(item,index) in retailRule.retailRuleListTwo" :key="index">
					<view v-if="index" class="invite-strategy-first-item-image-box">
						<image src="@/static/user/reticent.png" class="invite-strategy-first-item-image"></image>
					</view>
					<view class="invite-strategy-first-item">
						<view class="invite-strategy-item-box">
							<view class="invite-strategy-item">
								{{ '0' + (index + 4) }}
							</view>
							<view class="invite-strategy-item-text"
								:style="item.length < 9 ? 'width: 120rpx' : 'width: 140rpx'">
								{{ item }}
							</view>
						</view>
					</view>
				</block>

			</view>
		</view>
		<view class="my-invitation-box">
			<view class="my-invitation-title">我的邀请 <label>{{ retailRule.totalInvite }}</label> 人</view>
			<view class="my-invitation-money-box">
				<view class="my-invitation-money-item">
					<view class="my-invitation-money-box-text">已得现金</view>
					<view class="my-invitation-money-box-money"><label>¥</label>{{ retailRule.totalAmount }}</view>
				</view>
				<view class="my-invitation-money-box-btn" @click="goWithdrawCash" :style="{background: buttonColor, border: `2rpx solid ${buttonColor}`}">
					去提现
				</view>
			</view>
			<template v-if="invitationsList.length">
				<view class="my-invitation-box-items" v-for="item in invitationsList" :key="item.id">
					<view class="invitation-box-phone">{{ item.phone }}</view>
					<view class="invitation-box-time">{{ item.createTime }}</view>
					<view class="invitation-box-type">注册成功</view>
				</view>
			</template>
			<view v-else>
				<NoState :isPage="false" type="article">
					<template #text>
						<view>暂无邀请记录！</view>
					</template>
				</NoState>
			</view>
		</view>
		<u-popup v-model="showPopup" mode="center" :closeable="true" :custom-style="{margin:'0rpx 96rpx'}"
			:border-radius="12">
			<view class="popup-content">{{ retailRule.retailRuleTitle || retailRule.ruleDesc }}</view>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad,
	} from "@dcloudio/uni-app";
	import {
		getUserRetailRuleDetails,
		listForUserRelationPage
	} from '../Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const showPopup = ref(false)
	const retailRule = ref({})
	let params = {
		pageNo: 1,
		pageSize: 10
	}
	const invitationsList = ref([])
	const clickRules = () => {
		showPopup.value = true
	}
	const goInvitePosters = () => {
		uni.navigateTo({
			url: '/personal/invitation-center/InvitePosters'
		})
	}
	const goWithdrawCash = () => {
		uni.navigateTo({
			url: '/personal/balance-withdrawal/BalanceWithdrawal'
		})
	}
	onLoad(async () => {
		await listForUserRelationPage(params).then(res => {
			invitationsList.value = res.result.records
		})
		await getUserRetailRuleDetails().then(res => {
			retailRule.value = res.result
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.invitation-center-bg-image {
		background-size: 100% !important;
		width: 750rpx;
		height: 720rpx;
		position: relative;

		.right-icon {
			margin-right: 40rpx;
		}

		.invitation-center-box-btn-box {
			position: absolute;
			bottom: -76rpx;
			z-index: 2;
			padding: 0rpx 72rpx;
			width: 100%;
			text-align: center;

			.invitation-center-box-btn {
				width: 100%;
				height: 88rpx;
				background: $u-global-color;
				border-radius: 8rpx;

				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 88rpx;
			}
		}

		.invitation-center-box-image {
			position: absolute;
			bottom: -140rpx;
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}

	.popup-content {
		padding: 80rpx 40rpx 60rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #606266;
		line-height: 44rpx;
	}

	.invite-strategy-box {
		padding: 0rpx 40rpx;
		margin-top: 196rpx;

		.invite-strategy-title {
			font-size: 36rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #212121;
			line-height: 50rpx;
		}

		.invite-strategy-first-list {
			margin-top: 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: nowrap;

			.invite-strategy-first-item {
				display: flex;
				justify-content: space-between;
			}

			.invite-strategy-item-box {
				.invite-strategy-item {
					margin: auto;
					width: 80rpx;
					height: 80rpx;
					background: rgba(57, 90, 225, 0.1);
					border-radius: 50%;
					text-align: center;
					font-size: 34rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #395AE1;
					line-height: 80rpx;
				}

				.invite-strategy-item-text {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
					line-height: 36rpx;
					margin-top: 16rpx;
					text-align: center;
				}
			}
		}

		.invite-strategy-first-item-image-box {
			// flex: 1;
			padding-top: 12rpx;
			// width: 60%;
			margin: 0rpx 40rpx;
			text-align: center;

			.invite-strategy-first-item-image {
				width: 34rpx;
				height: 6rpx;
			}
		}

		.invite-strategy-second-list {
			margin-top: 48rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: nowrap;

			.invite-strategy-first-item-image-box {
				// padding-top: 12rpx;
				margin: 0rpx 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.invite-strategy-first-item-image {
					width: 34rpx;
					height: 6rpx;
				}
			}

			.invite-strategy-first-item {
				display: flex;
				&:first-child{
					.invite-strategy-item-box{
						margin-left: 31rpx;
					}
				}
			}

			.invite-strategy-item-box {
				display: flex;
				text-align: left;
				align-items: center;

				.invite-strategy-item {
					width: 80rpx;
					height: 80rpx;
					background: rgba(57, 90, 225, 0.1);
					border-radius: 50%;
					text-align: center;
					font-size: 34rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #395AE1;
					line-height: 80rpx;
				}

				.invite-strategy-item-text {
					width: 130rpx;
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
					line-height: 36rpx;
					margin-left: 16rpx;
					flex: 1;
				}
			}
		}

	}

	.my-invitation-box {
		margin-top: 56rpx;
		padding: 0rpx 40rpx;

		.my-invitation-title {
			font-size: 36rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #212121;
			line-height: 50rpx;

			label {
				color: #395AE1;
			}

			margin-bottom: 32rpx;
		}

		.my-invitation-money-box {
			padding: 32rpx 24rpx;
			background: linear-gradient(270deg, #CBDEFF 0%, #FFFFFF 100%);
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 32rpx;

			.my-invitation-money-item {
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.my-invitation-money-box-text {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
					line-height: 36rpx;
					margin-bottom: 16rpx;
				}

				.my-invitation-money-box-money {
					font-size: 64rpx;
					font-family: DINCond-Black, DINCond;
					font-weight: 900;
					color: #303133;
					line-height: 76rpx;

					label {
						font-style: 32rpx;
					}
				}
			}

			.my-invitation-money-box-btn {
				background: $u-global-color;
				border-radius: 8rpx;
				text-align: center;
				padding: 16rpx 32rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 34rpx;
			}
		}

		.my-invitation-box-items {
			display: flex;
			border-bottom: 2rpx solid #DCDFE6;
			align-items: center;
			justify-content: space-between;
			padding: 32rpx 0rpx;

			.invitation-box-phone {
				font-size: 28rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #303133;
				line-height: 40rpx;
			}

			.invitation-box-time {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 32rpx;
			}

			.invitation-box-type {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #67C23A;
				line-height: 32rpx;
			}
		}
	}
</style>
