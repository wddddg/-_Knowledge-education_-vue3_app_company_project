<template>
	<view class="">
		<u-navbar title="积分明细"></u-navbar>
		<view class="my-points-details-box">
			<view class="my-points-details-title">我的积分</view>
			<view class="my-points-details-number">{{ userTotalIntegral }}</view>
			<view class="my-points-details-btn" @click="goAccumulatePoints" :style="{background: buttonColor}">
				前往任务中心
			</view>
		</view>
		<view class="my-points-details-source">
			<view class="my-points-details-source-item" v-for="(item,index) in pointsDetails" :key="item.id">
				<view class="my-points-details-source-left">
					<view class="my-points-details-source-state">{{ item.giveWayStr }}</view>
					<view class="my-points-details-source-time">{{ item.createTime }}</view>
				</view>
				<view class="my-points-details-source-right"
					:style="`color: #${ item.giveType == 1?'395AE1':'303133' };`">
					{{ item.giveType == 1? '+':'-' }}{{ item.integralAmount }}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import {
		getUserTotalIntegral,
		findIntegralUserRecordForPage
	} from '../Mall.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const userTotalIntegral = ref('')
	const pointsDetails = ref([])
	let params = {
		pageNo: 1,
		pageSize: 10
	}
	onLoad(async () => {
		await getUserTotalIntegral().then(res => {
			userTotalIntegral.value = res.result
		})
		await findIntegralUserRecordForPage(params).then(res => {
			pointsDetails.value = res.result.records
			console.log(pointsDetails.value);
		})
	})
	const goAccumulatePoints = () => {
		uni.navigateTo({
			url: '/mall/task/GetAccumulatePoints'
		})
	}
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.my-points-details-box {
		width: 100%;
		height: 320rpx;
		background: linear-gradient(180deg, #CBDEFF 0%, #FFFFFF 100%);
		padding: 0rpx 40rpx;
		text-align: center;
		border-top: 1rpx solid #CBDEFF;

		.my-points-details-title {
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #303133;
			line-height: 40rpx;
			margin: 64rpx 0rpx 20rpx;
		}

		.my-points-details-number {
			font-size: 80rpx;
			font-family: DINCond-Black, DINCond;
			font-weight: 900;
			color: #303133;
			line-height: 80rpx;
			margin: 0rpx 0rpx 58rpx;
		}

		.my-points-details-btn {
			width: 100%;
			height: 88rpx;
			border-radius: 8rpx;

			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
		}
	}

	.my-points-details-source {
		margin-top: 78rpx;
		padding: 0rpx 40rpx;

		.my-points-details-source-item {
			width: 100%;
			padding: 24rpx 0rpx;
			background: #FFFFFF;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.my-points-details-source-left {
				.my-points-details-source-state {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
					line-height: 40rpx;
					margin-bottom: 8rpx;
				}

				.my-points-details-source-time {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 32rpx;
				}
			}

			.my-points-details-source-right {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				line-height: 40rpx;
			}
		}
	}
</style>
