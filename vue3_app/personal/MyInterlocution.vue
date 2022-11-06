<template>
	<view>
		<u-navbar title="我的问答"></u-navbar>
	</view>
	<view class="card-interlocution-box" v-if="answersList.length">
		<view class="card-interlocution-box-item" v-for="item in answersList" :key="item.id">
			<view class="header-user-info">
				<view class="user-avatar-nickName">
					<u-avatar :src="item.teacherHeadImg" :size="56"></u-avatar>
					<view class="username">{{ item.teacherName }}</view>
				</view>
				<view>{{ item.replyTime }}</view>
			</view>
			<view class="teacher-reply-content">{{ item.replyContent }}</view>
			<view class="user-introduce-a-question">{{ item.content }}</view>
			<view class="teacher-reply-link" @click="goTeachingDetails(item.courseId)">
				<label>{{ item.courseName }}</label>
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
	</view>
	<view class="" v-else>
		<NoState type="question" :isPage="true">
			<template #text>
				<view>暂无问答！</view>
			</template>
		</NoState>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import {
		ref
	} from 'vue'
	import {
		listForAnswersPage
	} from './Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	let params = {
		pageNo: 1,
		pageSize: 10
	}
	const answersList = ref([])
	onLoad(async () => {
		await listForAnswersPage(params).then(res => {
			answersList.value = res.result.records
		})
	})
	const goTeachingDetails = (id) =>{
		uni.navigateTo({
			url:'/course/face-course/FaceCourse?id=' + id
		})
	}
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.card-interlocution-box {
		padding: 0rpx 40rpx;

		.card-interlocution-box-item {
			padding: 40rpx 0rpx;
			border-bottom: 1rpx solid #DCDFE6;

			.header-user-info {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.user-avatar-nickName {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.username {
						margin-left: 16rpx;
						font-size: 28rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #303133;
						line-height: 40rpx;
					}
				}

			}

			.teacher-reply-content {
				margin-top: 22rpx;
				margin-left: 72rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 48rpx;
			}

			.user-introduce-a-question {
				margin-left: 72rpx;
				background: #F6F6F6;
				border-radius: 12rpx;
				padding: 24rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #606266;
				line-height: 40rpx;
				margin-top: 16rpx;
				margin-bottom: 16rpx;
			}

			.teacher-reply-link {
				margin-left: 72rpx;
				padding: 16rpx 24rpx;
				background: linear-gradient(270deg, #FFFFFF 0%, #CBDEFF 100%);
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #909399;

				label {
					color: #606266;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>
