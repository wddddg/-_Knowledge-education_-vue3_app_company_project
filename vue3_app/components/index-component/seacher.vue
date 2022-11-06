<template>
    <view class="content" :class="{on:isClass}">
        <view class="logo_item">
			<image class="images" v-if="componentContent.moduleCode=='1001'||componentContent.moduleCode=='1004'" :src="componentContent.webLogo" mode="scaleToFill" style="width: 64rpx;height:64rpx;margin-right: 16rpx;"></image>
			<div @click="goSearch" style="width: 80%;">
				<!-- <uni-easyinput type="text" prefixIcon="search" class="logo_input" placeholder="请输入搜索内容" value="" /> -->
				<u-search maxlength="0" :clearabled="true" shape="square" :show-action="false" placeholder="请输入搜索内容"></u-search>
			</div>
			<image class="images" v-if="componentContent.moduleCode=='1001'||componentContent.moduleCode=='1003'" src="@/static/index/qian_dao.png" mode="scaleToFill" style="width: 48rpx;height:48rpx;margin-left: 16rpx;" @click="gotask"></image>
        </view>
    </view>
</template>
<script lang="ts" setup >
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	const props = defineProps(['componentContent','isClass'])
	function goSearch() {
		uni.navigateTo({
			url:'/course/search/Search'
		})
	}
	function gotask(){
		uni.navigateTo({
			url:'/mall/task/GetAccumulatePoints'
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
			margin: 20rpx 40rpx;
			margin-bottom: 24rpx;
	}
	.logo_item{
		display: flex;
		align-items: center;
		 // margin: 0 10rpx;
		 width: 100%;
	}
	.images{
		width: 15%;
	}
	.logo_input{
		 border-radius: 15rpx;
		 // height: 40rpx;
		 // margin: 10rpx 30rpx;
	}
</style>