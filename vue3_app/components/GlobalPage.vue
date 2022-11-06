<template>
	<view class="">
		<slot></slot>
		<u-mask :show="isShowLoading" z-index="9999999" :custom-style="{background: 'rgba(255, 255, 255,1)'}">
			<view style="display: flex;justify-content: center;align-items: center;height: 100%;">
				<text style="color: #000;">加载中</text>
				<!-- <u-loading mode="flower" size="60" /> -->
				<image :src="loadImg" height="20rpx" width="20rpx" mode="" style="height:40rpx;width:40rpx;"></image>
			</view>
		</u-mask>
	</view>
</template>

<script setup>	
import {ref,watch,nextTick,onMounted} from 'vue'
	let isShowLoading = ref(true)
		uni.$off('apiLoadNo')
		uni.$off('apiLoadOff')
	onMounted(()=>{
		uni.$on('apiLoadNo',()=>{
			isShowLoading.value = true
		})
		uni.$on('apiLoadOff',()=>{
			isShowLoading.value = false
		})
		
	})
	let loadImg = ref(uni.getStorageSync('LoadingImg').loadImg)

</script>

<style>
</style>