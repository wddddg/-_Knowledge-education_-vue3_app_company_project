<template>
	<view class="wrap">
		<u-navbar title="数据报告"></u-navbar>
		<view class="title">预测分</view>
		<view class="circle">
			<u-circle-progress width='250' border-width='25' :active-color="buttonColor"
				:percent="statisticsData.average_value">
				<view class="u-progress-content">
					<view class="u-progress-dot"></view>
					<text
						class='u-progress-info'>{{statisticsData.average_value?statisticsData.average_value.toFixed(2):0}}</text>
				</view>
			</u-circle-progress>
		</view>
		<view class="container">
			<view class="item">
				<view class="item-num" :style="{color: themeColor}">{{statisticsData.max_all_value?statisticsData.max_all_value:0}}</view>
				<view class="item-txt">全站最高分</view>
			</view>
			<view class="item">
				<view class="item-num" :style="{color: themeColor}">
					{{statisticsData.all_average_value?statisticsData.all_average_value.toFixed(2):0}}
				</view>
				<view class="item-txt">全站平均分</view>
			</view>
			<view class="item">
				<view class="item-num" :style="{color: themeColor}">{{statisticsData.examLogMy?statisticsData.examLogMy:0}}<text
						style="color: #000000;opacity: .5;font-size: 36upx;">/{{statisticsData.examLogCount?statisticsData.examLogCount:0}}</text>
				</view>
				<view class="item-txt">我的得分排名</view>
			</view>
			<view class="item">
				<view class="item-num" :style="{color: themeColor}">{{statisticsData.practice_max_count?statisticsData.practice_max_count:0}}</view>
				<view class="item-txt">全站最高题量</view>
			</view>
			<view class="item">
				<view class="item-num" :style="{color: themeColor}">{{statisticsData.practice_my_count?statisticsData.practice_my_count:0}}</view>
				<view class="item-txt">我的答题量</view>
			</view>
			<view class="item">
				<view class="item-num" :style="{color: themeColor}">{{statisticsData.ok_value?statisticsData.ok_value:0}}</view>
				<view class="item-txt">正确率</view>
			</view>
			<view class="item">
				<view class="item-num" :style="{color: themeColor}">{{statisticsData.practiceCountMy?statisticsData.practiceCountMy:0}}<text
						style="color: #000000;opacity: .5;font-size: 36upx;">/{{statisticsData.practiceCount?statisticsData.practiceCount:0}}</text>
				</view>
				<view class="item-txt">我的答题排名</view>
			</view>

		</view>
		<view class="btn">
			<view class="btn-wrap">
				<view class="btn-num" :style="{color: themeColor}">{{statisticsData.practice_day?statisticsData.practice_day:0}}</view>
				<view class="btn-txt">练习天数</view>
			</view>
			<view class="btn-wrap">
				<view class="btn-num" :style="{color: themeColor}">{{statisticsData.practice_minute?statisticsData.practice_minute:0}}</view>
				<view class="btn-txt">练习用时</view>
			</view>
			<view class="btn-wrap">
				<view class="btn-num" :style="{color: themeColor}">{{statisticsData.practice_cs?statisticsData.practice_cs:0}}</view>
				<view class="btn-txt">创建练习次数</view>
			</view>
		</view>
		<view class="bom" :style="{backgroundColor: themeColor + '20',color: themeColor}">
			<view class="bom-txt">最近生成报告时间：{{statisticsData.report_date}}</view>
		</view>
	</view>
</template>

<script>
	import {
		newStatistics
	} from "@/common/questionApi.js"
	export default {
		data() {
			return {
				themeColor: uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
					.themeColor : '#395AE1',
				buttonColor: uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync(
						'otherThemeColor')
					.buttonColor : '#395AE1',
				themeFontColor: uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
					'otherThemeColor').themeFontColor : '#fff',
				statisticsData: "",
			}
		},
		onLoad() {
			this.getDoc();
		},
		methods: {
			getDoc() {
				let user = uni.getStorageSync("user");
				newStatistics({
					memberId: user.userId
				}).then(ret => {
					console.log(ret);
					if (ret.result != null) {
						this.statisticsData = ret.result;
					}
				});
			}
		}
	}
</script>

<style>
	.wrap {
		padding: 0 20upx;
		background-color: #FFF;
		height: 100vh;
	}

	.title {
		margin-top: 30upx;
		padding-left: 40upx;
		font-size: 30upx;
		font-weight: 700;
	}

	.circle {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 30upx 0;
	}

	.container {
		padding-left: 40upx;
		display: flex;
		flex-wrap: wrap;
	}

	.item {
		margin: 20upx 0;
		width: 33.3%;
	}

	.item-num {
		font-size: 20px;
		font-weight: 500;
	}

	.item-txt {
		font-size: 10px;
		font-weight: 500;
		opacity: .5;
	}

	.btn {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 50upx auto;
		width: 90%;
		height: 200upx;
		background-color: #f7f8fb;
		border-radius: 20upx;
	}

	.btn-wrap {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}

	.btn-num {
		font-size: 20px;
		font-weight: 500;
	}

	.btn-txt {
		font-size: 10px;
		font-weight: 500;
	}

	.bom {
		position: fixed;
		bottom: 20upx;
		line-height: 80upx;
		width: 85%;
		left: 60upx;
		border-radius: 20upx;
		text-align: center;
		font-weight: 700;
	}
</style>
