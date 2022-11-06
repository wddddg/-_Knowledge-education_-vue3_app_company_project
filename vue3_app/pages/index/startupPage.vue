<template>
	<view class="container" :style="{height:windowHeight}">
		<view class="logo">
			<!-- 请稍等 -->
		</view>
	</view>
</template>

<script setup>
	import {onLoad,onShow,onPullDownRefresh} from "@dcloudio/uni-app";
	import {ref,getCurrentInstance,nextTick,watch } from "vue"
	import {getImgByType} from '/common/questionApi.js'
	onLoad(async()=>{
		windowHeight.value = uni.getStorageSync('useDevice').windowHeight + 'px'
		if(!uni.getStorageSync('showStartupTime')){
			uni.setStorageSync('showStartupTime',new Date().getTime())
			uni.navigateTo({
				url: '/pages/index/guidePage'
			})
			return
		}
		let nowTime = new Date().getTime()
		let oldTime = uni.getStorageSync('showStartupTime')
		console.log(nowTime, oldTime, 'time')
		// 86400000
		if ((nowTime - oldTime) > 86400000) {
			uni.setStorageSync('showStartupTime', nowTime)
			uni.navigateTo({
				url: '/pages/index/guidePage'
			})
		}else{
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
	})
	let windowHeight = ref()
	
	
</script>
<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
	.container {
		position: relative;
		.logo{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 999;
		}
		.swiper{
			.swiper-content {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>