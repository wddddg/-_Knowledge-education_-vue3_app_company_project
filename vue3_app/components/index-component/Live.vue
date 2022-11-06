<template>
    <view class="content" :class="{on:isClass}">
		<view class="title">
			<view class="title_letf">
				<view class="title_icon"></view>
				<text style="margin: 0 0 0 16rpx ;">直播课</text>
			</view>
			<view class="title_right" style="color: #606266;" @click="onMore">更多<u-icon name="arrow-right"></u-icon></view>
		</view>
		<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" >
			<template v-for="(item,index) in componentContent.websiteHtmlCustomModuleLinkVOList">
				<view class="scroll-view-item_H" @click="goDetail(item)">
					<view class="top_box">
						<image class="images" :src="item.imgUrl" mode="scaleToFill" style="width: 100%;height:176rpx;border-radius: 12rpx;"></image>
						<view class="count">{{`${item.studyCount}人观看`}}</view>
						<view class="order">
							{{item.liveStatus==0?'未预约':item.liveStatus==1?'已预约':''}}
							<image src="@/static/index/live-icon.gif" mode="scaleToFill" style="width: 32rpx;height:28rpx;" v-if="item.liveStatus==2"></image>
						</view>
						
					</view>
					<view class="txt">
						<view class="itme_title">{{item.title}}</view>
						<view class="itme_dete" :style="{color:item.liveStatus==2?'#67C23A':''}">{{item.liveStatus==2?'直播中':item.createTime.substr(5,11)}}</view>
					</view>
				</view>
			</template>
		</scroll-view>
    </view>
</template>
<script lang="ts" setup >
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	const props = defineProps(['componentContent','isClass'])
	
	function goDetail (data){
		debugger
		uni.navigateTo({
			url:'/course/online-course/OnlineCourse'+'?id='+data.contentUrl+'&courseType='+1
		})
	}
	
	function onMore(){
		uni.reLaunch({
		  url: `/pages/course/index?index=1`
		})
	}
</script>
<style lang="scss" scoped>
	.on{
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
		border-radius: 12rpx;
		background: #fff;
		position: relative;
		z-index: 9;
	}
	.content{
			margin-bottom: 24rpx;
		.title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 0 40rpx;
			.title_letf{
				// width: 108rpx;
				height: 50rpx;
				font-size: 36rpx;
				font-weight: 800;
				color: #1B1E27;
				line-height: 50rpx;
				display: flex;
				align-items: center;
			}
			.title_icon{
				width: 8rpx;
				height: 32rpx;
				background: $u-global-color;
				border-radius: 4rpx;
			}
		}
	}
	.scroll-view_H{
		white-space: nowrap;
		width: 100%;
		height: 420rpx;
	}
	.scroll-view-item_H {
		display: inline-block;
		width: 236rpx;
		height: 336rpx;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
		border-radius: 12rpx;
		margin: 32rpx 0 32rpx 40rpx;
		vertical-align: top;
		border: 1 solid transparent;
		position: relative;
		&:last-child{
			margin-right:40rpx;
		}
		.top_box {
			position: relative;
			color: #fff;
			.count {
				font-size: 20rpx;
				position: absolute;
				top: 0;
				left: 0;
				width: 144rpx;
				height: 40rpx;
				background: #395AE1;
				opacity: 0.8;
				border-radius: 12rpx 0rpx 200rpx 0rpx;
				line-height: 40rpx;
				font-weight: 400;
				padding-left: 16rpx;
			}
			.order {
				position: absolute;
				bottom: 8rpx;
				left: 0;
				width: 100%;
				height: 40rpx;
				background: rgba(0,0,0,0.6);
				// opacity: 0.6;
				border-radius: 0rpx 0rpx 12rpx 12rpx;
				line-height: 40rpx;
				text-align: center;
				font-weight: 400;
			}
		}
		.txt{
			padding: 16rpx;
			word-wrap: break-word;
			word-break: break-all;
			white-space: pre-line;
		}
		.itme_title{
			// width: 236rpx;
			font-size: 28rpx;
			font-weight: 800;
			overflow:hidden;
			text-overflow:ellipsis;
			display:-webkit-box;
			-webkit-box-orient:vertical;
			-webkit-line-clamp:2;//显示的行数
		}
		.itme_dete{
			position: absolute;
			bottom: 24rpx;
		}
	}
</style>