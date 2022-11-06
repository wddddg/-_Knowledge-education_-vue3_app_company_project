<template>
    <view class="content" :class="{on:isClass}">
        <view class="logo_item" @click="goUrl(props.componentContent.websiteHtmlCustomModuleLinkVOList[0].contentUrl)">
			<view class="Statement">{{componentContent.copyright}}</view>
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
		justify-content: center;
		 // margin: 0 10rpx;
	}
	.Statement{	
		font-weight: 400;
		color: #C0C4CC;
	}
</style>