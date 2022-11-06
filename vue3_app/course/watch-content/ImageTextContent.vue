<template>
	<page>
    <view class="content">
		<u-navbar :z-index="'9999'" title="章节详情"></u-navbar>
		<view class="course-activity" >
			<text class="course-activity-tag" :style="{color:themeFontColor}">{{`已学${pageData?.studyDuration}`}}</text>
			<text class="course-activity-time">
				{{`总时长${pageData?.durationCh}`}}
			</text>
		</view>
		<view class="text-content">
			<!-- {{pageData?.content}} -->
			<u-parse :html="pageData?.content"></u-parse>
		</view>
    </view>
	</page>
</template>

<script lang="ts" setup >import {
	onLoad,
	onReady,
	onUnload
} from '@dcloudio/uni-app'
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	import {getCourseSectionDetails,addCourseUserStudyRecord} from "../Course.api.ts"
	onLoad((e)=>{
		id = e.id
		setDetailsById()
	})
	onUnload(() => {
		clearInterval(clock)
		uni.$emit('stopRecord')
	})
	let id = ref()
	let pageData = ref()
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor?'#'+uni.getStorageSync('otherThemeColor').themeFontColor:'#fff')
	async function setDetailsById(){
		await getCourseSectionDetails({sectionId:id}).then(res=>{
			pageData.value = res.result
		})
	}
	
	let day = ref()
	let hours= ref()
	let Minutes= ref()
	let Seconds= ref()
	function showtime(){
	    let nowtime = new Date(),  //获取当前时间
	        // endtime = new Date(new Date().getTime()+topicData.endDate*60*1000);  //定义结束时间
	        endtime = new Date(pageData.value.studyDuration?.replace(/-/g, "/"));  //定义结束时间
	    let lefttime = endtime.getTime() - nowtime.getTime(),  //距离结束时间的毫秒数
	        leftd = Math.floor(lefttime/(1000*60*60*24)),  //计算天数
	        lefth = Math.floor(lefttime/(1000*60*60)%24),  //计算小时数
	        leftm = Math.floor(lefttime/(1000*60)%60),  //计算分钟数
	        lefts = Math.floor(lefttime/1000%60);  //计算秒数
			if(leftd==0&&lefth==0&&leftm==0&&lefts==0){
				setDetailsById()
			}
			day.value = leftd
			hours.value = lefth
			Minutes.value = leftm
			Seconds.value = lefts
	    return leftd + "天 " + lefth + ":" + leftm + ":" + lefts;  //返回倒计时的字符串
	}
	let clock = ''
	function interval(){
		clock = setInterval (function () {
			showtime();
		}, 1000)
	} 
	
</script>
<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
	.content{
		.course-activity{
			height: 72rpx;
			background: linear-gradient(270deg, #FEF0DE 0%, #FFE2BF 100%);
			display: flex;
			justify-content: space-between;
			padding: 0 20rpx;
			position: relative;
			z-index: 999;
			color: #52301A;
			.course-activity-tag{
				// width: 128rpx;
				height: 48rpx;
				background: linear-gradient(270deg, #F1B466 0%, #E85535 100%);
				border-radius: 4rpx;
				line-height: 48rpx;
				padding: 0 16rpx;
				margin: 12rpx;
				font-weight: 800;
			}
			.course-activity-time {
				height: 48rpx;
				border-radius: 4rpx;
				line-height: 48rpx;
				padding: 0 16rpx;
				margin: 12rpx;
				.time-style {
					width: 48rpx;
					height: 48rpx;
					padding: 8rpx 5rpx;
					background: #F29E3F;
					border-radius: 4rpx;
					opacity: 0.8;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #FFFFFF;
				}
			}
		}
		.text-content{
			margin: 40rpx;
		}
	}
</style>