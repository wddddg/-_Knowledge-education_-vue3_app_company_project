<template>
    <view class="content" :class="{on:isClass}">
		<view class="title">
			<view class="title_letf">
				<view class="title_icon"></view>
				<text style="margin: 0 0 0 16rpx ;">书籍</text>
			</view>
			<view class="title_right" style="color: #606266;" @click="onMore">更多<u-icon name="arrow-right"></u-icon></view>
		</view>
		<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" >
			<template v-for="(item,index) in componentContent.websiteHtmlCustomModuleLinkVOList">
				<view class="scroll-view-item_H" @click="goBookDetail(item)">
					<image class="images" :src="item.imgUrl" mode="scaleToFill" style="width: 100%;height:288rpx;border-radius: 12rpx;"></image>
					<view class="txt">
						<view class="itme_title">{{item.title}}</view>
						<!-- <view class="itme_dete">{{item.createTime.substr(5,11)}}</view> -->
					</view>
				</view>
			</template>
		</scroll-view>
    </view>
</template>
<script lang="ts" setup >
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	const props = defineProps(['componentContent','isClass'])
	
	function goBookDetail(e){
		uni.navigateTo({
			url:'/course/book/BookDetail'+'?id='+e.contentUrl
		})
	}
	
	function onMore(){
		uni.reLaunch({
		  url: `/pages/course/index?index=2`
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
		.title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 0 40rpx;
			margin-bottom: 24rpx;
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
		height: 440rpx;
	}
	.scroll-view-item_H {
		display: inline-block;
		width: 236rpx;
		height: 368rpx;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
		border-radius: 12rpx;
		margin: 32rpx 0 32rpx 40rpx;
		vertical-align: top;
		border: 1 solid transparent;
		position: relative;
		&:last-child{
			margin-right:40rpx;
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
			-webkit-line-clamp:1;//显示的行数
		}
		.itme_dete{
			position: absolute;
			bottom: 24rpx;
		}
	}
</style>