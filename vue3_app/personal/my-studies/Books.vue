<template>
	<view class="books-list">
		<view class="" v-if="listPage.length">
			<view class="books-item" v-for="item in listPage" :key="item.id">
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
			<u-loadmore class="loadmore" :status="loadStatus" icon-type="flower" :load-text="loadText" />
		</view>
		<view class="" v-else>
			<NoState type="book" :isPage="true">
				<template #text>
					<view>暂无书籍！</view>
				</template>
			</NoState>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onBeforeMount
	} from 'vue'
	import {
		onLoad,
		onReachBottom,
		onPullDownRefresh
	} from "@dcloudio/uni-app";
	import {
		listForBookRecordPage
	} from '../Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	const loadText = ref({
		loading: '正在加载',
		nomore: '没有更多了'
	})
	const loadStatus = ref('nomore')
	let params = {
		pageNo: 1,
		pageSize: 10
	}
	const listPage = ref([])
	onBeforeMount(async () => {
		await listForBookRecordPage(params).then(res => {
			listPage.value = res.result.records
		})
	})
	onReachBottom(async () => {
		loadStatus.value = 'loading'
		params.pageNo++
		await listForBookRecordPage(params).then((res) => {
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
		await listForBookRecordPage(params).then(res => {
			listPage.value = res.result.records
		})
		uni.stopPullDownRefresh()
	})
</script>

<style scoped lang="scss">
	.books-list {
		margin-top: 38rpx;

		.books-item {
			margin-bottom: 32rpx;

			width: 100%;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			padding: 24rpx;
			display: flex;
			justify-content: space-between;

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
