<template>
	<view class="classes-list">
		<u-subsection :list="list" ref="subsection" :current="current" mode="subsection" active-color="#395AE1"
			@change="changeCurrentSubsection"></u-subsection>
		<view class="" v-if="listPage.length">
			<view class="classes-item" v-for="item in listPage" :key="item.id">
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
						<view class="collection-item-right-type-name">分类名称</view>
						<view class="">
							<u-avatar src="../../static/user/learn-currency.png" class="avatar-item" :size="40"></u-avatar>
							<u-avatar src="../../static/user/learn-currency.png" class="avatar-item" :size="40"></u-avatar>
							<u-avatar src="../../static/user/learn-currency.png" class="avatar-item" :size="40"></u-avatar>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore class="loadmore" :status="loadStatus" icon-type="flower" :load-text="loadText" />
		</view>
		<view class="" v-else>
			<NoState type="book" :isPage="true">
				<template #text>
					<view>暂无班课！</view>
				</template>
			</NoState>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onBeforeMount
	} from 'vue'
	import {
		onLoad,
		onReachBottom,
		onPullDownRefresh
	} from "@dcloudio/uni-app";
	import {
		listForClassCoursePage
	} from '../Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	let toggleColor = ref(uni.getStorageSync('otherThemeColor').toggleColor ? '#' + uni.getStorageSync('otherThemeColor')
		.toggleColor : 'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)')
	const loadText = ref({
		loading: '正在加载',
		nomore: '没有更多了'
	})
	const loadStatus = ref('nomore')
	let params = {
		pageNo: 1,
		pageSize: 10,
		liveStatus: 1
	}
	const list = [{
			name: '进行中'
		},
		{
			name: '未开始'
		},
		{
			name: '已结课'
		},
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
		} else if(e === 1) {
			params.liveStatus = 2
		}else{
			params.liveStatus = 3
		}
		await listForClassCoursePage(params).then(res => {
			listPage.value = res.result.records
		})
	}
	onBeforeMount(async () => {
		await listForClassCoursePage(params).then(res => {
			listPage.value = res.result.records
		})
	})
	onMounted(() => {
		subsection.value.itemBgStyle.background = toggleColor
	})
	onReachBottom(async () => {
		loadStatus.value = 'loading'
		params.pageNo++
		await listForClassCoursePage(params).then((res) => {
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
		await listForClassCoursePage(params).then(res => {
			listPage.value = res.result.records
		})
		uni.stopPullDownRefresh()
	})
</script>

<style scoped lang="scss">
	.classes-list {
		margin-top: 48rpx;

		.classes-item {
			margin-top: 32rpx;

			width: 100%;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			padding: 24rpx;
			display: flex;
			justify-content: space-between;

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
				.collection-item-right-bottom{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.avatar-item:nth-child(1){
						position: relative;
						left: 16rpx;
						z-index: 3;
					}
					.avatar-item:nth-child(2){
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
					width: 128rpx;
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
