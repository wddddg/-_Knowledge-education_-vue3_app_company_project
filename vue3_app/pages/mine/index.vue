<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<u-navbar :is-back="false" title="我的" :background="{background: '#CBDEFF'}">
			<!-- <template #right>
				<view class="user-avatar-name">
					<view class="setting-icon">
						<u-image :width="44" :height="40" src="@/static/user/setting.png" class="setting-image"
							@click="goSetting"></u-image>
						<u-badge type="error" :count="notCount" :offset="[-18,20]" @click="goMessageCenter"></u-badge>
						<u-image :width="40" :height="40" src="@/static/user/warn.png" class="warn-image"
							@click="goMessageCenter"></u-image>
					</view>
				</view>
			</template> -->
		</u-navbar>

		<view class="user-info-box">
			<view class="user-avatar-name">
				<view class="setting-icon">
					<!-- <view class="setting-icon"> -->
					<u-image :width="44" :height="40" src="@/static/user/setting.png" class="setting-image"
						@click="goSetting"></u-image>
					<u-badge type="error" :count="notCount" :offset="[-18,-10]" @click="goMessageCenter"></u-badge>
					<u-image :width="40" :height="40" src="@/static/user/warn.png" class="warn-image"
						@click="goMessageCenter"></u-image>
					<!-- </view> -->
				</view>
				<view class="user-avatar">
					<u-image src="@/static/user/user-avatar.png" :width="152" :height="152" borderRadius="50%"
						v-if="!userInfo.headImg" @click="goUserInfo"></u-image>
					<u-image :src="userInfo.headImg" :width="152" :height="152" borderRadius="50%" v-else
						@click="goUserInfo"></u-image>
					<view @click="goUserInfo">
						<label class="user-name">{{ isLogin ? userInfo.nickName : '未登录' }}</label>
						<label class="user-autograph">{{ userInfo.signDesc }}</label>
					</view>
				</view>
				<view>
					<view type="primary" class="user-sign" :class="userInfo.isSign?'user-sign-true':''"
						:style="{background:buttonColor}" @click="userSign" v-if="isLogin">
						{{ userInfo.isSign?'已签到':'签到' }}
					</view>
				</view>
			</view>
			<view class="user-vip"
				:style="`background: linear-gradient(90deg, ${ userInfo.memberType&& isLogin? '#333642':'#395AE1' } 0%, ${ userInfo.memberType&& isLogin? '#5E606D':'#3FB0E1' } 100%)`">
				<view class="vip-image-box">
					<image src="@/static/user/user-vip-image.png" mode="" class="user-vip-image"
						v-if="!userInfo.memberType"></image>
					<image src="@/static/user/user-vip-image-block.png" mode="" class="user-vip-image" v-else></image>
					<view class="user-vip-image-right">
						<label class="vip-state-text">{{ userInfo.memberType&&isLogin != 0 ? '尊敬的会员您好':'您还不是会员' }}
						</label>
						<label
							class="vip-state-autograph">{{ userInfo.memberType&&isLogin != 0 ? '到期时间为：' + (userInfo.endTimeDesc || ''):'开通会员立享特权' }}</label>
					</view>
				</view>
				<view type="primary" class="user-vip-sign"
					:style="`color: ${ userInfo.memberType? '#303133':'#395AE1' };`" @click="goVipOpenRenewalFee">
					{{ userInfo.memberType? '去续费':'去开通' }}
				</view>
			</view>
			<view class="user-learning">
				<view class="user-learning-info">
					<view class="user-learning-info-item">
						<view class="user-learning-info-item-number">
							<label>{{ userInfo.totalStudyTime }}</label><label style="font-size: 20rpx;">小时</label>
						</view>
						<view class="user-learning-info-item-title">
							累计学习
						</view>
					</view>
					<view class="user-learning-info-item">
						<view class="user-learning-info-item-number">
							<label>{{ userInfo.totalDoQuestionsCount }}</label><label
								style="font-size: 20rpx;">个</label>
						</view>
						<view class="user-learning-info-item-title">
							答案总数
						</view>
					</view>
					<view class="user-learning-info-item">
						<view class="user-learning-info-item-number">
							<label>{{ userInfo.questionCorrectRate }}</label><label style="font-size: 20rpx;">%</label>
						</view>
						<view class="user-learning-info-item-title">
							正确率
						</view>
					</view>
				</view>
				<view class="user-learning-iamge" @click="goMyStudies">
					<image src="@/static/user/my-study.png" mode="" style="width: 48rpx; height: 44rpx;"></image>
					<view class="">
						我的学习
					</view>
				</view>
			</view>
		</view>


		<view class="coin-class">
			<view class="coin-class-item icon-about-me-tab" v-for="(item,index) in coinIconList" :key="index"
				@click="openCorrelationView(item.title)">
				<u-image :src="item.imgUrl" :width="48" :height="48" mode="widthFix"></u-image>
				<view class="coin-class-item-title">
					{{ item.title }}
				</view>
			</view>
		</view>
		<view class="mall-and-invitations">
			<view class="mall-and-invitations-item" v-for="(item,index) in mallAndInvitationsList" :key="index"
				@click="goMallOfInvitations(item.title)">
				<view class="mall-and-invitations-text">
					<label class="mall-and-invitations-title">{{ item.title }}</label>
					<label class="mall-and-invitations-describe">{{ item.twoTitle }}</label>
				</view>
				<image :src="item.imgUrl" mode=""></image>
			</view>
		</view>
		<view class="about-me-info">
			<view class="about-me-info-item" v-for="(item,index) in aboutMeInfoList" :key="index"
				@click="goPersonalPages(item.title)">
				<view class="about-me-info-left">
					<u-image :src="item.imgUrl" :width="40" :height="40" mode="widthFix"></u-image>
					<view class="about-me-info-left-title">{{ item.title }}</view>
				</view>
				<view class="about-me-info-right">
					<view class="unread-information" v-if="index === 0 && userInfo.myCourseQaCount">
						{{ userInfo.myCourseQaCount }}
					</view>
					<view>
						<u-icon name="arrow-right" color="#909399" size="28"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
	<BottomTabbar :pagePath="'pages/mine/index'" />
</template>

<script setup>
	import {
		onLoad,
		onPullDownRefresh,
	} from "@dcloudio/uni-app";
	import {
		ref,
	} from "vue"
	import {
		getUserCenterHtmlCustom,
		getUserMember,
		getUserDetails,
		addUserSign,
		notRedCount
	} from './mine.api.ts'
	import {
		setTab
	} from "@/common/app-utils.js"
	import BottomTabbar from "@/components/BottomTabbar.vue"
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const coinIconList = ref([])
	const mallAndInvitationsList = ref([])
	const aboutMeInfoList = ref([])
	const userInfo = ref({})
	const notCount = ref(0)
	let isLogin = uni.getStorageSync("user") ? true : false
	const goMallOfInvitations = (value) => {
		if (!isLogin) return uni.showToast({
			icon: "none",
			title: "请登录后查看"
		})
		if (value === '积分商城') {
			uni.navigateTo({
				url: '/pages/accumulate-mall/AccumulateMall'
			})
		}
		if (value === '邀请有礼') {
			uni.navigateTo({
				url: '/personal/invitation-center/InvitationCenter'
			})
		}
	}
	const openCorrelationView = (value) => {
		if (!isLogin) return uni.showToast({
			icon: "none",
			title: "请登录后查看"
		})
		if (value === '我的订单') {
			uni.navigateTo({
				url: '/personal/order/Order'
			})
		}
		if (value === '学币') {
			uni.navigateTo({
				url: '/personal/LearnCurrency'
			})
		}
		if (value === '余额') {
			uni.navigateTo({
				url: '/personal/balance-withdrawal/BalanceWithdrawal'
			})
		}
		if (value === '优惠券') {
			uni.navigateTo({
				url: '/personal/my-coupon/MyCoupon'
			})
		}
		if (value === '兑换码') {
			uni.navigateTo({
				url: '/personal/Exchange'
			})
		}
	}
	const userSign = () => {
		// if (!e) {
		// 	await addUserSign().then(res => {

		// 	})
		// 	await getUserMember().then(res => {
		// 		userInfo.value = res.result
		// 	})
		// 	uni.showToast({
		// 		title: '签到成功',
		// 		icon: 'none'
		// 	});
		// } else {
		// 	return
		// }
		uni.navigateTo({
			url: '/mall/task/GetAccumulatePoints'
		})
	}
	const goSetting = () => {
		if (!isLogin) return uni.showToast({
			icon: "none",
			title: "请登录后查看"
		})
		uni.navigateTo({
			url: '/personal/setting/Setting'
		})
	}
	const goMessageCenter = () => {
		if (!isLogin) return uni.showToast({
			icon: "none",
			title: "请登录后查看"
		})
		uni.navigateTo({
			url: '/personal/MessageCenter'
		})
	}
	const goUserInfo = () => {
		if (!isLogin) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
			return
		}
		uni.navigateTo({
			url: '/personal/UserInfo'
		})
	}
	const goVipOpenRenewalFee = () => {
		if (!isLogin) {
			uni.navigateTo({
				url: '/pages/login/login'
			})
			return
		}
		uni.navigateTo({
			url: '/personal/VipOpenRenewalFee'
		})
	}
	const goPersonalPages = (value) => {
		if (!isLogin) return uni.showToast({
			icon: "none",
			title: "请登录后查看"
		})
		if (value === '我的问答') {
			userInfo.myCourseQaCount = 0
			uni.navigateTo({
				url: '/personal/MyInterlocution'
			})
		}
		if (value === '我的收藏') {
			uni.navigateTo({
				url: '/personal/MyCollection'
			})
		}
		if (value === '关注讲师') {
			uni.navigateTo({
				url: '/personal/FollowLecturer'
			})
		}
		if (value === '意见反馈') {
			uni.navigateTo({
				url: '/personal/FeedBack'
			})
		}
		if (value === '讲师入驻') {
			uni.navigateTo({
				url: '/personal/LecturerEnter'
			})
		}
	}
	const goMyStudies = () => {
		if (!isLogin) return uni.showToast({
			icon: "none",
			title: "请登录后查看"
		})
		uni.navigateTo({
			url: '/personal/my-studies/MyStudies'
		})
	}
	onLoad(async (e) => {
		uni.hideTabBar()
		// setTab()
		await getUserCenterHtmlCustom({
			useDevice: 1
		}).then(res => {
			console.log(res);
			coinIconList.value = res.result.userCenterFeeList
			mallAndInvitationsList.value = res.result.userCenterPromoteVOList
			aboutMeInfoList.value = res.result.userCenterCommonList
		})
		await getUserMember().then(res => {
			userInfo.value = res.result
		})
		await getUserDetails().then(res => {
			userInfo.value = Object.assign({}, userInfo.value, res.result)
		})
		await notRedCount().then(res => {
			console.log(res);
			if (res.result > 99) {
				notCount.value = 99
			} else {
				notCount.value = res.result || 0
			}
		})
	})
	onPullDownRefresh(async () => {
		await getUserCenterHtmlCustom({
			useDevice: 1
		}).then(res => {
			coinIconList.value = res.result.userCenterFeeList
			mallAndInvitationsList.value = res.result.userCenterPromoteVOList
			aboutMeInfoList.value = res.result.userCenterCommonList
		})
		await getUserMember().then(res => {
			userInfo.value = res.result
		})
		uni.stopPullDownRefresh()
	})
</script>


<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.container {
		// background: $u-global-color;
	}

	.user-avatar-name {
		// margin-top: 114rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 40rpx 0rpx 14rpx;
		position: relative;

		.setting-icon {
			position: absolute;
			top: 16rpx;
			right: 40rpx;
			width: 144rpx;
			display: flex;
			justify-content: space-around;

			.warn-image {
				width: 40rpx;
				height: 40rpx;
				margin-left: 28rpx;
			}

			.setting-image {
				width: 44rpx;
				height: 40rpx;
				// margin-right: 48rpx;
			}
		}

		.user-avatar {
			display: flex;
			align-items: center;

			image {
				width: 152rpx;
				height: 152rpx;
			}

			.user-name {
				// margin-top: 30rpx;
				margin-left: 10rpx;
				font-size: 36rpx;
				font-weight: 800;
				color: #303133;
				line-height: 50rpx;
				display: block;
				font-family: PingFang-SC-Heavy, PingFang-SC;
			}

			.user-autograph {
				margin-left: 10rpx;
				font-size: 24rpx;
				font-family: PingFang-SC-Regular, PingFang-SC;
				font-weight: 400;
				color: #606266;
				line-height: 34rpx;

				white-space: pre-line;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}

		.user-sign {
			width: 144rpx;
			height: 60rpx;
			border-radius: 8rpx;
			font-size: 24rpx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			color: #FFFFFF;
			line-height: 60rpx;
			text-align: center;
			margin-top: 40rpx;
		}

		.user-sign-true {
			background: #C0C7D1;
		}
	}

	.top-info-box {
		// height: 580rpx;
		// height: 536rpx;
		background: linear-gradient(180deg, #CBDEFF 0%, #FFFFFF 100%);
	}

	.user-info-box {
		width: 100%;
		height: 536rpx;
		border-top: 1rpx solid #CBDEFF;
		background: linear-gradient(180deg, #CBDEFF 0%, #FFFFFF 100%);

		.user-vip {
			height: 112rpx;
			border-radius: 20rpx 20rpx 0px 0px;
			margin: 28rpx 56rpx 0rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0rpx 32rpx;

			.vip-image-box {
				display: flex;
				align-items: center;

				.user-vip-image {
					width: 56rpx;
					height: 60rpx;
					flex: 0 0 56rpx;
				}

				.user-vip-image-right {
					padding: 0rpx 24rpx;
					width: 400rpx;
					width: 12.5rem;

					.vip-state-text {
						font-size: 28rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #FBDBB5;
						line-height: 40rpx;
						display: block;
					}

					.vip-state-autograph {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 32rpx;
						display: block;
					}

					label {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}

			.user-vip-sign {
				flex: 0 0 120rpx;
				width: 120rpx;
				height: 60rpx;
				background: linear-gradient(270deg, #FBDBB5 0%, #F9C58D 100%);
				border-radius: 8rpx;
				font-size: 24rpx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				line-height: 60rpx;
				text-align: center;
			}
		}

		.user-learning {
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			margin: 0rpx 40rpx;
			padding: 32rpx 0rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.user-learning-info {
				display: flex;
				align-items: center;
				flex: 1;
				border-right: 2rpx solid #DCDFE6;

				.user-learning-info-item {
					flex: 1;
					text-align: center;

					.user-learning-info-item-number {
						font-size: 36rpx;
						font-weight: 900;
						color: #303133;
						line-height: 44rpx;
					}

					.user-learning-info-item-title {
						font-size: 24rpx;
						font-weight: 400;
						color: #909399;
						line-height: 32rpx;
						margin-top: 8rpx;
					}
				}
			}

			.user-learning-iamge {
				width: 25%;
				text-align: center;
			}
		}
	}

	.coin-class {
		display: flex;
		align-items: center;
		margin: 0rpx 40rpx 40rpx;

		.coin-class-item {
			text-align: center;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.coin-class-item-title {
				margin-top: 12rpx;
			}
		}
	}

	.mall-and-invitations {
		display: flex;
		justify-content: space-between;
		margin: 0rpx 40rpx;

		.mall-and-invitations-item {
			position: relative;
			border-radius: 20rpx;
			overflow: hidden;

			.mall-and-invitations-text {
				position: absolute;
				z-index: 1;
				top: 40rpx;
				left: 24rpx;
				color: #FFFFFF;

				.mall-and-invitations-title {
					font-size: 30rpx;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					line-height: 42rpx;
					display: block;
				}

				.mall-and-invitations-describe {
					margin-top: 12rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 34rpx;
					display: block;
				}
			}

			image {
				width: 320rpx;
				height: 160rpx;
			}
		}
	}

	.about-me-info {
		margin: 32rpx 40rpx 18rpx;

		.about-me-info-item {
			padding: 28rpx 0rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.about-me-info-left {
				display: flex;
				align-items: center;

				.about-me-info-left-title {
					margin-left: 32rpx;
				}
			}

			.about-me-info-right {
				display: flex;
				align-items: center;

				.unread-information {
					margin-right: 24rpx;
					width: 48rpx;
					height: 32rpx;
					background: #EE5142;
					border-radius: 16rpx;
					padding: 2rpx 6rpx;
					font-size: 22rpx;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 32rpx;
					text-align: center;
				}
			}
		}
	}
	// .icon-about-me-tab:nth-child(1){
	// 	.u-image{
	// 		width: 40rpx !important;
	// 		height: 48rpx !important;
	// 	}
	// }
	// .icon-about-me-tab:nth-child(2){
	// 	.u-image{
	// 		width: 48rpx !important;
	// 		height: 48rpx !important;
	// 	}
	// }
	// .icon-about-me-tab:nth-child(3){
	// 	.u-image{
	// 		width: 48rpx !important;
	// 		height: 40rpx !important;
	// 	}
	// }
	// .icon-about-me-tab:nth-child(4){
	// 	.u-image{
	// 		width: 48rpx !important;
	// 		height: 48rpx !important;
	// 	}
	// }
	// .icon-about-me-tab:nth-child(5){
	// 	.u-image{
	// 		width: 44rpx !important;
	// 		height: 48rpx !important;
	// 	}
	// }
</style>
