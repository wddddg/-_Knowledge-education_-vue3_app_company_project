<template>
	<view class="accumulate-points-navbar container"
		:style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor,'--toggle-color': toggleColor, background: `url(${currentUserInfo.signBackgroundUrl})`}">
		<u-navbar :is-fixed="false" title="签到领积分" :background="{ background: 'Clear' }" :border-bottom="false"
			back-icon-color="#fff" title-color="#fff"></u-navbar>
		<view class="accumulate-points-navbar-right">
			<view class="accumulate-points-navbar-right-item" :style="{background: buttonColor}">
				当前积分 {{ currentUserInfo.currentTotalIntegral || 0 }}
			</view>
		</view>
		<view class="accumulate-points-navbar-content">
			<view class="continuation-day-title">已连续签到 {{ currentUserInfo.continueDayCount }} 天</view>
			<view class="continuation-day-box">
				<view class="continuation-day-item" v-for="(item,index) in currentUserInfo.weekSignList" :key="index">
					<view class="continuation-day-item-box"
						:style="{ background: item.isSign ? 'linear-gradient(360deg, #3F6EE1 0%, #7BC8E8 100%)' : '#F6F6F6'}">
						<u-image src="@/static/mall/continuation-day-answer.png" :width="40" :height="42"
							class="continuation-day-item-box-image"></u-image>
						<label :style="{color: item.isSign ?'#fff' : '#909399'}">+{{ item.signCount }}</label>
					</view>
					<view class="continuation-day-item-text">{{ item.ownMonth }}.{{ item.ownDay }}</view>
				</view>
			</view>
			<view class="continuation-day-btn" @click="goSignCenter"
				:style="{ background: isSend ? '#C0C7D1' : buttonColor }">
				{{ isSend? '已签到' : '立即签到' }}
			</view>
			<view>
				<uni-calendar :insert="true" :lunar="false" :showMonth="false" :selected="selected"
					@monthSwitch="changeCurrentMonth" @change="changeCurrentDay" />
			</view>
			<view class="get-points-text">
				做任务得积分
			</view>
			<view class="get-points-box" v-for="(item,index) in currentUserInfo.userTaskRecordVOList">
				<view class="get-points-box-content">
					<view class="get-points-box-title">{{ item.title || '&nbsp;' }}</view>
					<view class="get-points-box-number">
						{{ item.everyScore }}积分/次（{{ item.finishCount }}/{{ item.finishTotalCount === 1 || item.finishTotalCount === -1 ? '无上限' : item.finishTotalCount }}）
					</view>
					<view class="get-points-box-line-progress">
						<u-line-progress active-color="#3F6EE1" :percent="item.finishRate" class="line-progress"
							:height="8" :show-percent="false"></u-line-progress>
					</view>
				</view>
				<view class="get-points-btn" @click="goJumpUrl(item.jumpUrl)"
					:style="{ background: item.isFinish ? '#C0C7D1' : buttonColor }">
					{{item.isFinish ? '已完成' : '去完成'}}
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
		onReady
	} from "@dcloudio/uni-app";
	import {
		getMonthSignList,
		getSignCenter,
		addUserSign,
		getUserCenter,
	} from '../Mall.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	let toggleColor = ref(uni.getStorageSync('otherThemeColor').toggleColor ? '#' + uni.getStorageSync('otherThemeColor')
		.toggleColor : 'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)')
	const selected = ref([])
	const isSend = ref(false)
	const currentUserInfo = ref({})
	const taskList = ref([])
	const changeCurrentMonth = async (e) => {
		if (e.month < 10) {
			e.month = '0' + e.month
		}
		let data = await getCurrentMonthInfo(e.year + '-' + e.month)
		selected.value = data.map((item) => {
			return {
				have: false,
				date: item.ownTime,
				info: '已签到',
			}
		})
	}
	const changeCurrentDay = async (e) => {
		if (uni.$u.date(new Date(), 'yyyy-mm-dd') == e.fulldate) {
			let data = await getCurrentMonthInfo(e.year + '-' + e.month)
			selected.value = data.map((item) => {
				return {
					have: false,
					date: item.ownTime,
					info: '已签到',
				}
			})
		}
	}
	const goSignCenter = async () => {
		await addUserSign().then(res => {
			if (res.code === 200) {
				uni.showToast({
					icon: 'success',
					title: '签到成功'
				})
			}
		})
	}
	const getCurrentMonthInfo = async (value) => {
		return await getMonthSignList({
			ownTime: value
		}).then(res => {
			return res.result
		})
	}
	const goJumpUrl = (e) => {
		if (e.split('/')[1] === 'pages') {
			uni.switchTab({
				url: e
			})
		} else {
			uni.navigateTo({
				url: e
			})
		}
	}
	onLoad(async () => {
		let data = await getCurrentMonthInfo(uni.$u.date(new Date(), 'yyyy-mm'))
		selected.value = data.map((item) => {
			return {
				have: false,
				date: item.ownTime,
				info: '已签到',
			}
		})
		await getUserCenter().then(res => {
			isSend.value = res.result.isSend === 1
		})
		await getSignCenter().then(res => {
			currentUserInfo.value = res.result
			console.log(currentUserInfo.value.userTaskRecordVOList);
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.accumulate-points-navbar {
		background-size: 100%;
		height: 496rpx;

		.accumulate-points-navbar-right {
			position: relative;
			height: 88rpx;
			margin: 32rpx 0rpx;

			.accumulate-points-navbar-right-item {
				position: absolute;
				right: 0;
				width: 252rpx;
				height: 88rpx;
				border-radius: 200rpx 0rpx 0rpx 200rpx;
				opacity: 0.8;

				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 88rpx;
				text-align: center;
			}
		}

		.accumulate-points-navbar-content {
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 0rpx 0rpx;
			padding: 40rpx;

			.continuation-day-title {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #303133;
				line-height: 40rpx;
				margin-bottom: 24rpx;
			}

			.continuation-day-box {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.continuation-day-item {
					text-align: center;

					.continuation-day-item-box {
						width: 82rpx;
						height: 108rpx;
						border-radius: 8rpx;
						border-top: 1rpx solid #ffffff00;
						display: flex;
						align-items: center;
						justify-content: space-around;
						flex-direction: column;

						.continuation-day-item-box-image {
							// margin: 16rpx 22rpx 0rpx;

						}

						label {
							font-size: 28rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #FFFFFF;
							line-height: 28rpx;
							margin-top: 6rpx;
							display: block;
						}
					}

					.continuation-day-item-text {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #303133;
						line-height: 24rpx;
						margin-top: 16rpx;
					}
				}
			}

			.continuation-day-btn {
				margin: 40rpx 0rpx 0rpx;
				height: 88rpx;
				border-radius: 8rpx;

				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 88rpx;
				text-align: center;
			}

			.get-points-text {
				font-size: 36rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #212121;
				line-height: 50rpx;
				margin: 56rpx 0rpx 8rpx;
			}

			.get-points-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 24rpx 0rpx;

				.get-points-box-content {
					width: 70%;

					.get-points-box-title {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #303133;
						line-height: 40rpx;
					}

					.get-points-box-number {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
						line-height: 32rpx;
						margin: 8rpx 0rpx;
					}

					.get-points-box-line-progress {
						width: 240rpx;
					}

					// .get-points-box-line-progress {
					// 	width: 240rpx;
					// 	height: 8rpx;
					// 	overflow: hidden;
					// 	border-radius: 8rpx;

					// 	.line-progress {
					// 		width: 240rpx;
					// 		height: 8rpx;
					// 	}
					// }
				}

				.get-points-btn {
					width: 136rpx;
					height: 60rpx;
					border-radius: 8rpx;

					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 60rpx;
					text-align: center;
				}
			}
		}
	}

	// ::v-deep .uni-calendar-item--checked {
	// 	background: $u-global-color;
	// }

	// ::v-deep .uni-calendar-item--isDay {
	// 	background: $u-global-color;
	// }
	::v-deep .u-active {
		background: $u-toggle-color;
		transform: rotate(180deg);
	}
</style>
