<template>
	<view class="user-info">
		<view class="user-info-top">
			<u-image src="@/static/user/user-avatar.png" :width="120" :height="120" borderRadius="50%" v-if="!userInfo.headImg"></u-image>
			<u-avatar :src="userInfo.headImg" :width="120" :height="120" borderRadius="50%" v-else></u-avatar>
			<view class="user-info-top-name">
				{{ userInfo.nickName || userInfo.wxName || '' }}
			</view>
		</view>
		<view class="user-info-bottom">
			<view class="go-study" @click="goCoursePage">
				<u-image src="@/static/user/user-info-study.png" :width="56" :height="56"></u-image>
				<view class="">
					去学习
				</view>
			</view>
			<view class="center-box"></view>
			<view class="go-exam" @click="goExamPage">
				<u-image src="@/static/user/user-info-exam.png" :width="56" :height="56"></u-image>
				<view class="">
					去考试
				</view>
			</view>
		</view>
	</view>
	<view class="courese-list">
		<view class="courese-list-title">
			我的课程
		</view>
		<u-subsection :list="list" ref="subsection" :current="current" mode="subsection" active-color="#395AE1"
			@change="changeCurrentSubsection"></u-subsection>
		<view class="" v-if="listPage.length">
			<view class="courese-item" v-for="(item,index) in listPage" :key="item.id">
				<view class="courese-item-box">
					<view class="collection-item-book-left">
						<view>
							<image :src="item.imgUrl" class="collection-item-image"></image>
						</view>
						<view class="collection-item-shadow-box"></view>
						<view class="collection-item-shadow-text">{{
							item.sectionType === 1? '视频':
							item.sectionType === 2? '图文':
							item.sectionType === 3? '直播':
							item.sectionType === 4? '线下': '音频'
						}}</view>
					</view>
					<view class="collection-item-book-right">
						<view class="collection-item-right-title">{{ item.name }}</view>
						<view class="collection-item-right-bottom">
							<view class="collection-item-right-type-name">
								{{ item.oneCateName || '分类名称' }}
							</view>
						</view>
					</view>
				</view>
				<view class="progress-bar">
					<u-line-progress active-color="#2979ff" :height="16" :percent="item.totalRate" :show-percent="false">
					</u-line-progress>
					<label>学习进度 {{ item.totalRate }}%</label>
				</view>
			</view>
			<u-loadmore class="loadmore" :status="loadStatus" icon-type="flower" :load-text="loadText" />
		</view>
		<view class="no-state" v-else>
			<NoState type="book" :isPage="false">
				<template #text>
					<view>暂无课程！</view>
				</template>
			</NoState>
			<view class="no-state-btn" @click="goCoursePage">
				去学习
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		unref,
		onBeforeMount
	} from 'vue'
	import {
		onLoad,
		onReachBottom,
		onPullDownRefresh
	} from "@dcloudio/uni-app";
	import {
		listForStudyCourseRecordPage,
		getUserCenter
	} from '../Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	let toggleColor = ref(uni.getStorageSync('otherThemeColor').toggleColor ? '#' + uni.getStorageSync('otherThemeColor')
		.toggleColor : 'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)')
	const loadText = ref({
		loading: '正在加载',
		nomore: '没有更多了'
	})
	const loadStatus = ref('nomore')
	const userInfo = ref({})
	let params = {
		pageNo: 1,
		pageSize: 10,
		liveStatus: 1
	}
	const list = [{
			name: '学习中'
		},
		{
			name: '已完成'
		}
	]
	const listPage = ref([])
	const current = ref(0)
	const subsection = ref(null)
	const changeCurrentSubsection = async (e) => {
		current.value = e
		listPage.value = []
		params.pageNo = 1
		if (e === 0) {
			params.liveStatus = 1
		} else if (e === 1) {
			params.liveStatus = 2
		} else {
			params.liveStatus = 3
		}
		await listForStudyCourseRecordPage(params).then(res => {
			listPage.value = res.result.records
		})
	}
	const goCoursePage = () =>{
		uni.switchTab({
			url: '/pages/course/index'
		})
	}
	const goExamPage = () =>{
		uni.switchTab({
			url: '/pages/question/index'
		})
	}
	onBeforeMount(async () => {
		console.log('params');
		await listForStudyCourseRecordPage(params).then(res => {
			listPage.value = res.result.records
		})
		await getUserCenter().then(res =>{
			userInfo.value = res.result
		})
	})
	onMounted(() => {
		subsection.value.itemBgStyle.background = toggleColor
	})
	onReachBottom(async () => {
		loadStatus.value = 'loading'
		params.pageNo++
		await listForStudyCourseRecordPage(params).then((res) => {
			listPage.value.push(...res.result.records)
			if (!res.result.records.length) {
				loadStatus.value = 'nomore'
			} else {
				loadStatus.value = 'loadmore'
			}
		})
	})
	onPullDownRefresh(async () => {
		params.pageNo = 1
		await listForStudyCourseRecordPage(params).then(res => {
			listPage.value = res.result.records
		})
		uni.stopPullDownRefresh()
	})
</script>

<style scoped lang="scss">
	::v-deep .u-active {
		background: linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%);
	}
	
	.user-info {
		height: 320rpx;
		background: linear-gradient(180deg, #CBDEFF 0%, #FFFFFF 100%);
		margin: 0rpx -40rpx;
		padding: 48rpx 40rpx 0rpx;

		.user-info-top {
			display: flex;
			align-items: center;

			.user-info-top-name {
				font-size: 36rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #303133;
				line-height: 50rpx;
				margin-left: 20rpx;
			}
		}

		.user-info-bottom {
			margin-top: 32rpx;
			height: 120rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.center-box {
				width: 2rpx;
				background: #DCDFE6;
				height: 56rpx;
			}

			.go-study,
			.go-exam {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 49%;

				view {
					margin-left: 16rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
					line-height: 40rpx;
				}
			}
		}
	}

	.courese-list {
		.no-state{
			width: 100%;
		}
		.no-state-btn{
			margin: auto;
			width: 148rpx;
			height: 72rpx;
			background: #FFFFFF;
			border-radius: 8rpx;
			border: 2rpx solid #395AE1;
			font-size: 28rpx;
			text-align: center;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #395AE1;
			line-height: 72rpx;
		}
		// margin-top: 48rpx;
		.courese-list-title {
			margin: 64rpx 0rpx 32rpx;
			font-size: 36rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #1B1E27;
			line-height: 50rpx;
		}

		.courese-item {
			margin-top: 32rpx;

			width: 100%;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			padding: 24rpx;

			.courese-item-box {
				display: flex;
				justify-content: space-between;
			}

			.progress-bar {
				margin-top: 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				label {
					width: 50%;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 32rpx;
					margin-left: 16rpx;
				}
			}

			.collection-item-book-left {
				position: relative;
				width: 204rpx;
				height: 156rpx;

				.collection-item-image {
					width: 100%;
					height: 156rpx;
					border-radius: 12rpx 12rpx 12rpx 12rpx;
				}

				.collection-item-shadow-box {
					position: absolute;
					bottom: 0;
					width: 100%;
					height: 40rpx;
					background: #000000;
					border-radius: 0rpx 0rpx 12rpx 12rpx;
					opacity: 0.6;
				}

				.collection-item-shadow-text {
					position: absolute;
					bottom: 2rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					width: 100%;
					text-align: center;
				}
			}

			.collection-item-book-right {
				margin-left: 24rpx;
				flex: 1;
				display: flex;
				justify-content: space-between;
				flex-direction: column;

				.collection-item-right-title {
					font-size: 30rpx;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #303133;
					line-height: 48rpx;

					white-space: pre-line;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					// height: 50%;
				}

				.collection-item-right-bottom {
					display: flex;

					.avatar-item:nth-child(1) {
						position: relative;
						left: 16rpx;
						z-index: 3;
					}

					.avatar-item:nth-child(2) {
						position: relative;
						left: 8rpx;
						z-index: 2;
					}
				}

				.collection-item-right-number {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 34rpx;
				}

				.collection-item-right-type-name {
					padding: 0rpx 16rpx;
					height: 40rpx;
					background: linear-gradient(90deg, #29A28A 0%, #4CDC90 100%);
					border-radius: 0rpx 12rpx 0rpx 12rpx;
					text-align: center;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 40rpx;
				}
			}
		}
	}
</style>
