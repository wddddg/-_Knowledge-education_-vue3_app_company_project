<template>
	<view>
		<u-navbar title="关注讲师"></u-navbar>
	</view>
	<view class="follow-lecturer-list" v-if="teacherPage.length">
		<view class="follow-lecturer-item" v-for="item in teacherPage" :key="item.id" @click="goTeacherDetail(item.id)">
			<view class="follow-lecturer-item-left">
				<u-avatar :src="item.headImg" :size="80"></u-avatar>
				<view class="follow-lecturer-item-left-text">
					<view class="follow-lecturer-item-teacher-name">{{ item.name }}</view>
					<view class="follow-lecturer-item-teacher-type">{{ item.subjectName }}</view>
				</view>
			</view>
			<view>
				<u-icon name="arrow-right" color="#909399"></u-icon>
			</view>
		</view>
	</view>
	<view v-else>
		<NoState type="teacher" :isPage="true">
			<template #text>
				<view>暂无关注讲师！</view>
			</template>
		</NoState>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		listForCollectionTeacherPage
	} from './Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	let params = {
		pageNo: 1,
		pageSize: 10
	}
	const teacherPage = ref([])
	const goTeacherDetail = (value) => {
		uni.navigateTo({
			url: '/course/teacher/TeacherDetail?id=' + value
		})
	}
	onLoad(async () => {
		await listForCollectionTeacherPage(params).then(res => {
			teacherPage.value = res.result.records
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.follow-lecturer-list {
		padding: 0rpx 40rpx;

		.follow-lecturer-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 32rpx 0rpx;
			border-bottom: 1rpx solid #DCDFE6;

			.follow-lecturer-item-left {
				display: flex;
				align-items: center;

				.follow-lecturer-item-left-text {
					margin-left: 16rpx;

					.follow-lecturer-item-teacher-name {
						font-size: 28rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #303133;
						line-height: 40rpx;
					}

					.follow-lecturer-item-teacher-type {
						margin-top: 8rpx;
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
						line-height: 32rpx;
					}
				}
			}
		}
	}
</style>
