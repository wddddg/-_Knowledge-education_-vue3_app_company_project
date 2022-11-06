<template>
    <view class="content" :class="{on:isClass}">
        <view class="navigation">
			<template v-for="(item,index) in componentContent.websiteHtmlCustomModuleLinkVOList">
				<view class="navigation_itme" :style="{width:85/componentContent.lineCount+'%'}" @click="goUrl(item.contentUrl)">
					<image class="images" :src="item.imgUrl" mode="scaleToFill" style="width: 60rpx;height:60rpx;"></image>
					<view class="navigation_itme_title">{{item.title}}</view>
				</view>
			</template>
        </view>
    </view>
</template>
<script lang="ts" setup >
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	const props = defineProps(['componentContent','isClass'])
	
	let indexPage = {
		'pages/index/index':true,
		'pages/course/index':true,
		'pages/question/index':true,
		'pages/community/index':true,
		'pages/mine/index':true,
	}
	function goUrl(e){
		console.log(e);
		
		if(indexPage[e]||e.indexOf('?')!=-1){
				if(e.indexOf('?')!=-1){
					uni.reLaunch({
						url:'/'+e
					})
				}else{
					uni.switchTab({
						url:'/'+e
					})
				}
		}else{
			uni.navigateTo({
				url:'/'+e
			})
		}
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
			margin: 0 40rpx;
			margin-bottom: 24rpx;
	}
	.logo_item{
		display: flex;
		align-items: center;
		 // margin: 0 10rpx;
	}
	.navigation{
		 border-radius: 15rpx;
		 // height: 40rpx;
		 margin: 10rpx 10rpx;
		 display: flex;
		 justify-content: space-between;
		 flex-wrap: wrap;
		 .navigation_itme {
			 text-align: center;
			 margin: 18rpx 0;
			 .navigation_itme_title {
				 height: 34rpx;
				 font-size: 24rpx;
				 font-weight: 400;
				 color: #303133;
				 line-height: 34rpx;
			 }
		 }
	}
</style>