<template>
	<view class="vip-top-navbar">
		<u-navbar title="会员中心" back-icon-color="#fff" title-color="#fff" :border-bottom="false"
			:background="{ background: 'Clear' }"></u-navbar>

		<view class="vip-user-info">
			<view class="vip-card" :style="`background: url(${vipBackgroundImage})`">
				<view class="vip-info-avatar">
					<u-image src="@/static/user/user-avatar.png" :width="100" :height="100" borderRadius="50%"
						v-if="!userInfo.headImg"></u-image>
					<u-image :src="userInfo.headImg" :width="100" :height="100" borderRadius="50%" v-else></u-image>
					<view class="vip-state">
						<view class="vip-state-title">
							{{ userInfo.memberType === 0? '开通畅会员': userInfo.memberType === 1? '畅会员':'超级会员' }}
						</view>
						<view class="vip-state-introduce" v-if="userInfo.memberType">
							到期时间 &nbsp; {{ userInfo.endTimeDesc }}
						</view>
						<view class="vip-state-introduce" v-else>
							享有刷题、课程等特权
						</view>
					</view>
					<view class="vip-icon-box" v-if="userInfo.memberType">
						<u-image src="../static/user/vip-icon.png" :width="34" :height="34"></u-image>
						<label>{{ userInfo.memberType === 1? '畅会员':'超级会员' }}</label>
					</view>
				</view>
			</view>
		</view>
	</view>
	<view class="vip-open-renewal">
		<view class="tabs-list">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"
				:active-item-style="{ color:'#303133' }"></u-tabs>
		</view>
		<view class="vip-open-renewal-time">
			<scroll-view class="scroll-view_H" scroll-x="true">
				<template v-for="(item,index) in scrollViewBox" :key="item.id">
					<view class="scroll-view-box" :class="currentScrollView === item.id? 'active-scroll-view-box':'' "
						@click="changeScrollViewBgColor(item.id)">
						<view class="member-time">{{ item.title }}</view>
						<view class="member-money">{{ item.price }}</view>
						<view class="member-monovalent">{{ item.remarks || '&nbsp;'}} <!-- 0.01元/天 -->
						</view>
						<view class="member-is-recommend" v-if="item.isRecommend">
							<u-image src="@/static/user/trapezoid.png" :width="72" :height="72"></u-image>
							<view class="member-is-recommend-text">
								推荐
							</view>
						</view>
						<view class="vip-active-box" v-if="currentScrollView === item.id">
							<u-image src="@/static/user/vip-active-box.png" :width="38" :height="38"></u-image>
						</view>
					</view>
				</template>
			</scroll-view>
		</view>
		<view :class="current? 'active-open-btn':'open-btn'" @click="payVipTime">
			{{ !userInfo.memberType?'立即开通': userInfo.memberType === current + 1 || userInfo.memberType === 2 ? '立即续费' : '立即开通' }}
		</view>
		<view class="vip-privilege">
			<view class="vip-privilege-title">
				特权
			</view>
			<view class="vip-privilege-list">
				<view class="vip-privilege-item" v-for="item in vipPrivilegeList" :key="item.id">
					<u-image :src="item.imgUrl" :width="80" :height="80"></u-image>
					<label>{{ item.name }}</label>
				</view>
			</view>
		</view>
		<view class="super-vip-privilege">
			<view class="super-vip-privilege-title">
				超级会员特权
			</view>
			<view class="super-vip-privilege-list">
				<view class="super-vip-privilege-item" v-for="item in superVipPrivilege" :key="item.id">
					<u-image :src="item.imgUrl" :width="48" :height="48" class="super-vip-privilege-item-image">
					</u-image>
					<label>{{ item.name }}</label>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import {
		findMemberManager,
		getUserMember
	} from './Personal.api.ts'
	import PayMoneyComponent from '@/components/PayMoneyComponent.vue'
	const list = [{
		name: '畅会员'
	}, {
		name: '超级会员'
	}, ]
	const scrollViewBox = ref([])
	const vipBackgroundImage = ref('')
	const current = ref(0)
	const payMoney = ref(0)
	const currentScrollView = ref(0)
	const vipPrivilegeList = ref([])
	const vipScrollViewBox = ref([])
	const superVipPrivilege = ref([])
	const superVipScrollViewBox = ref([])
	const userInfo = ref({})
	const currentCategory = ref(8)
	const change = (e) => {
		current.value = e
		if (e) {
			scrollViewBox.value = [...superVipScrollViewBox.value] || []
			currentCategory.value = 9
		} else {
			scrollViewBox.value = [...vipScrollViewBox.value] || []
			currentCategory.value = 8
		}
		changeScrollViewBgColor(scrollViewBox?.value[0]?.id)
	}
	const changeScrollViewBgColor = (value) => {
		if (value) {
			currentScrollView.value = value
		}
	}
	const payVipTime = () => {
		let currentItem = scrollViewBox.value.filter(item => item.id == currentScrollView.value)[0]
		payMoney.value = currentItem.price
		let termCount = currentItem.termCount
		let id = currentItem.id
		uni.navigateTo({
			url: '/personal/order/OrderDetails?isOrder=0' + '&buyMonth=' + termCount + '&category=' +
				currentCategory.value + '&normsId=' + id
		})
	}
	onLoad(async () => {
		await getUserMember().then(res => {
			userInfo.value = res.result
		})
		await findMemberManager().then(res => {
			console.log(res);
			vipScrollViewBox.value = res?.result?.changMemberList || []
			vipPrivilegeList.value = res?.result?.commonPrivilegeList || []
			superVipPrivilege.value = res.result.superPrivilegeList || []
			superVipScrollViewBox.value = res.result.superMemberList || []
			scrollViewBox.value = [...vipScrollViewBox.value]
			vipBackgroundImage.value = res.result.memberBackgroundUrl || ''
			changeScrollViewBgColor(scrollViewBox?.value[0]?.id)
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.active-scroll-view-box {
		background: rgba(251, 219, 181, 0.3) !important;
		border: 2rpx solid #F9C58D !important;
	}

	.active-open-btn {
		background: linear-gradient(90deg, #333642 0%, #5E606D 100%) !important;
		margin: 0rpx 40rpx;
		height: 88rpx;
		border-radius: 8rpx;
		text-align: center;
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FBDBB5;
		line-height: 88rpx;
	}

	.vip-top-navbar {
		width: 750rpx;
		background: linear-gradient(180deg, #545454 0%, #282828 100%);
	}

	.vip-user-info {
		.vip-card {
			margin-top: 34rpx;
			background-repeat: no-repeat !important;
			background-size: 100% !important;
			height: 424rpx;
			width: 750rpx;
			padding: 48rpx 80rpx;

			.vip-info-avatar {
				display: flex;
				align-items: center;
				position: relative;

				.vip-icon-box {
					position: absolute;
					top: -20rpx;
					right: -20rpx;
					display: flex;
					align-items: center;

					label {
						margin-left: 8rpx;
						font-size: 24rpx;
						font-family: SourceHanSansCN-Heavy, SourceHanSansCN;
						font-weight: 800;
						color: #D49049;
						line-height: 36rpx;
					}
				}

				.vip-state {
					margin-left: 38rpx;

					.vip-state-title {
						font-size: 30rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #303133;
						line-height: 40rpx;
					}

					.vip-state-introduce {
						margin-top: 16rpx;
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #AD7031;
						line-height: 32rpx;
					}
				}
			}
		}
	}

	.vip-open-renewal {
		width: 750rpx;
		background: #FFFFFF;
		border-radius: 24rpx 24rpx 0px 0px;
		margin-top: -190rpx;
		border-top: 1rpx solid #FFFFFF;

		.tabs-list {
			margin-top: 60rpx;
			background: #FFFFFF;
			box-shadow: 0px 20rpx 40rpx 0px rgba(0, 0, 0, 0.1);
		}

		.vip-open-renewal-time {
			margin: 40rpx;

			.scroll-view_H {
				white-space: nowrap;
				display: flex;

				.scroll-view-box {
					display: inline-block;
					position: relative;
					margin: 0rpx 16rpx;
					width: 204rpx;
					height: 224rpx;
					box-shadow: 0rpx 8rpx 14rpx 0rpx rgba(249, 197, 141, 0.1);
					border-radius: 12rpx;
					background: #FFFFFF;
					border: 2rpx solid #DCDFE6;
					padding: 40rpx;
					text-align: center;

					.member-time {
						font-size: 30rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #303133;
						line-height: 32rpx;
					}

					.member-money {
						margin: 16rpx 0rpx 24rpx;

						font-size: 48rpx;
						font-family: DINCond-Black, DINCond;
						font-weight: 900;
						color: #EE5142;
						line-height: 48rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap; 
					}

					.member-monovalent {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
						line-height: 24rpx;
					}

					.member-is-recommend {
						position: absolute;
						top: 0;
						right: 0;

						.member-is-recommend-text {
							position: absolute;
							top: 6rpx;
							transform: rotate(45deg);
							color: #fff;
							right: 4rpx;
							font-size: 24rpx;
						}
					}
					.vip-active-box{
						position: absolute;
						bottom: 0;
						right: 0;
					}
				}

				.scroll-view-box:nth-child(1) {
					margin-left: 0rpx;
				}

				.scroll-view-box:last-child {
					margin-right: 0rpx;
				}
			}
		}

		.open-btn {
			margin: 0rpx 40rpx;
			height: 88rpx;
			background: linear-gradient(270deg, #FBDBB5 0%, #F9C58D 100%) !important;
			border-radius: 8rpx;

			text-align: center;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #303133;
			line-height: 88rpx;
		}

		.vip-privilege {
			padding: 0rpx 40rpx;
			margin: 56rpx 0rpx 8rpx;

			.vip-privilege-title {
				font-size: 36rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #212121;
				line-height: 50rpx;
				margin-bottom: 32rpx;
			}

			.vip-privilege-list {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				text-align: center;
				justify-content: space-between;

				.vip-privilege-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 20%;
					margin-bottom: 48rpx;

					label {
						margin-top: 8rpx;

						font-size: 26rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #303133;
						line-height: 36rpx;
					}
				}
			}
		}

		.super-vip-privilege {
			padding: 0rpx 40rpx;

			.super-vip-privilege-title {
				font-size: 36rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #212121;
				line-height: 50rpx;
				margin-bottom: 32rpx;
			}

			.super-vip-privilege-list {
				height: 242rpx;
				background: #DCDFE6;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				justify-content: space-between;

				.super-vip-privilege-item {
					width: 334rpx;
					background-color: #fff;
					height: 121rpx;
					display: flex;
					align-items: center;

					.super-vip-privilege-item-image {
						margin-left: 76rpx;
					}

					label {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #303133;
						line-height: 40rpx;
						margin-left: 24rpx;
					}
				}

				.super-vip-privilege-item:nth-child(1),
				.super-vip-privilege-item:nth-child(2) {
					margin-bottom: 2rpx;
				}
			}
		}
	}
</style>
