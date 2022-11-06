<template>
	<view>
		<u-navbar title="我的收藏"></u-navbar>
	</view>
	<view class="collection-tabs">
		<u-subsection :list="list" ref="subsection" :current="current" mode="subsection" active-color="#395AE1"
			@change="changeCurrentSubsection"></u-subsection>
	</view>
	<view class="" v-if="listPage.length">
		<view class="collection-list" v-if="!current">
			<view class="collection-item" v-for="item in listPage" :key="item.id" @click="goCourseDetails(item)">
				<view class="collection-item-left">
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
				<view class="collection-item-right">
					<view class="collection-item-right-title">{{ item.name }}</view>
					<view class="collection-item-right-number">{{ item.studyCount }}人已学</view>
				</view>
			</view>
		</view>
		<view class="collection-list" v-else>
			<view class="collection-item" v-for="item in listPage" :key="item.id" @click="goBooksDetails(item)">
				<view class="collection-item-book-left">
					<image :src="item.imgUrl" class="collection-item-image"></image>
				</view>
				<view class="collection-item-book-right">
					<view class="collection-item-right-title">{{ item.name }}</view>
					<view class="" style="display: flex;">
						<view class="collection-item-right-type-name">
							分类名称
						</view>
					</view>
					<view class="collection-item-right-number">{{ item.sourceContent }}</view>
				</view>
			</view>
		</view>
		<u-loadmore class="loadmore" :status="loadStatus" icon-type="flower" :load-text="loadText" />
	</view>
	<view class="" v-else>
		<NoState type="book" :isPage="true">
			<template #text>
				<view>{{ current? '暂无收藏书籍！':'暂无收藏课程！' }}</view>
			</template>
		</NoState>
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
		onPullDownRefresh
	} from "@dcloudio/uni-app";
	import {
		listForCollectionBookPage,
		listForCollectionCoursePage
	} from './Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	let toggleColor = ref(uni.getStorageSync('otherThemeColor').toggleColor ? '#' + uni.getStorageSync('otherThemeColor')
		.toggleColor : 'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)')
	let params = {
		pageNo: 1,
		pageSize: 10
	}
	const loadText = ref({
		loading: '正在加载',
		nomore: '没有更多了'
	})
	const loadStatus = ref('nomore')
	const list = [{
			name: '课程'
		},
		{
			name: '书籍'
		},
	]
	const current = ref(0)
	const listPage = ref([])
	const subsection = ref(null)
	const changeCurrentSubsection = async (e) => {
		current.value = e
		listPage.value = []
		params.pageNo = 1
		if (e) {
			await listForCollectionBookPage(params).then(res => {
				listPage.value = res.result.records
			})
		} else {
			await listForCollectionCoursePage(params).then(res => {
				listPage.value = res.result.records
			})
		}
	}
	const goCourseDetails = (e) => {
		uni.navigateTo({
			url:'/course/online-course/OnlineCourse?id=' + e.id + '&courseType=' + e.courseType
		})
	}
	const goBooksDetails = (e) => {
		uni.navigateTo({
			url:'/course/book/BookDetail?id=' + e
		})
	}
	onLoad(async () => {
		await listForCollectionCoursePage(params).then(res => {
			listPage.value = res.result.records
		})
	})
	onReady(() => {
		subsection.value.itemBgStyle.background = toggleColor
	})
	onReachBottom(async () => {
		loadStatus.value = 'loading'
		params.pageNo++
		if (current.value) {
			await listForCollectionBookPage(params).then(res => {
				listPage.value.push(...res.result.records)
				if (!res.result.records.length) {
					loadStatus.value = 'nomore'
				} else {
					loadStatus.value = 'loadmore'
				}
			})
		} else {
			await listForCollectionCoursePage(params).then(res => {
				listPage.value.push(...res.result.records)
				if (!res.result.records.length) {
					loadStatus.value = 'nomore'
				} else {
					loadStatus.value = 'loadmore'
				}
			})
		}
	})
	onPullDownRefresh(async () => {
		params.pageNo = 1
		if (current.value) {
			await listForCollectionBookPage(params).then(res => {
				listPage.value = res.result.records
			})
		} else {
			await listForCollectionCoursePage(params).then(res => {
				listPage.value = res.result.records
			})
		}
		uni.stopPullDownRefresh()
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.collection-tabs {
		padding: 32rpx 40rpx;
	}

	.collection-list {
		padding: 0rpx 40rpx;

		.collection-item {
			padding: 24rpx;

			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			margin-bottom: 32rpx;
			display: flex;
			// align-items: center;
			justify-content: space-between;

			.collection-item-left {
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

			.collection-item-right {
				margin-left: 24rpx;
				flex: 1;
				display: flex;
				// align-items: center;
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
				}

				.collection-item-right-number {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 34rpx;
				}
			}

			.collection-item-book-left {
				width: 160rpx;
				height: 196rpx;

				.collection-item-image {
					width: 100%;
					height: 196rpx;
					border-radius: 12rpx;
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
					height: 50%;
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
