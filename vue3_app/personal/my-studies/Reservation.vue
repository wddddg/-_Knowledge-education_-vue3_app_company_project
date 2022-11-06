<template>
	<view class="courese-list">
		<view class="courese-list-title">
			学习日历
		</view>
		<view class="">
			<zzx-calendar @calendar-selectData="selectDate" />
		</view>
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
						<view class="collection-item-right-title">
							<view class="collection-item-right-bottom">
								<view class="collection-item-right-type-name">
									{{ item.oneCateName || '分类名称' }}
								</view>
							</view>
							<label>{{ item.name }}</label>
						</view>
						<view class="collection-item-left-timer">
							开始时间：{{ item.createTime }}
						</view>
					</view>
				</view>
				<view class="progress-bar">
					距离开始：{{ item.remainingTime }}
				</view>
			</view>
			<u-loadmore class="loadmore" :status="loadStatus" icon-type="flower" :load-text="loadText" />
		</view>
		<view class="no-state" v-else>
			<NoState type="book" :isPage="false">
				<template #text>
					<view>今日无课程，给自己放个假吧！</view>
				</template>
			</NoState>
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
		listForReserveRecordPage
	} from '../Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	const loadText = ref({
		loading: '正在加载',
		nomore: '没有更多了'
	})
	const loadStatus = ref('nomore')
	let params = {
		pageNo: 1,
		pageSize: 10,
		liveStatus: 1,
		belongDate: uni.$u.date(new Date() , 'yyyy-mm-dd')
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
	const calendar = ref(null)
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
		await listForReserveRecordPage(params).then(res => {
			listPage.value = res.result.records
		})
	}
	const goCoursePage = () => {
		uni.switchTab({
			url: '/pages/course/index'
		})
	}
	const goExamPage = () => {
		uni.switchTab({
			url: '/pages/question/index'
		})
	}
	const selectDate = async (e) => {
		params.belongDate = e
		await listForReserveRecordPage(params).then(res => {
			listPage.value = res.result.records
		})
	}
	onBeforeMount(async () => {
		await listForReserveRecordPage(params).then(res => {
			listPage.value = res.result.records
		})
	})
	onReachBottom(async () => {
		loadStatus.value = 'loading'
		params.pageNo++
		await listForReserveRecordPage(params).then((res) => {
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
		await listForReserveRecordPage(params).then(res => {
			listPage.value = res.result.records
		})
		uni.stopPullDownRefresh()
	})
</script>

<style scoped lang="scss">
	::v-deep .u-active {
		background: linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%);
	}

	.courese-list {
		.no-state {
			width: 100%;
		}

		.no-state-btn {
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
				margin-top: 16rpx;
				background: #EBEEF5;
				border-radius: 8rpx;

				padding: 8rpx 16rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #606266;
				line-height: 48rpx;
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
					display: flex;
					white-space: pre-line;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					// height: 50%;
					float: left;

					label {
						margin-left: 16rpx;
					}
				}

				.collection-item-left-timer {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 32rpx;
					width: 380rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					white-space: nowrap;
				}

				.collection-item-right-bottom {
					float: left;
					display: flex;
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
					background: linear-gradient(90deg, #29A28A 0%, #4CDC90 100%);
					border-radius: 0rpx 12rpx 0rpx 12rpx;
					text-align: center;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 48rpx;
				}
			}
		}
	}
</style>
