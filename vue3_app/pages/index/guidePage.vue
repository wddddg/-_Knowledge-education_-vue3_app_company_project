<template>
	<view class="container">
		<view class="">
			<view class="junmp" v-if="current<pageData?.length-1" @click="onJump">{{`跳过${jumpTime==6?'':jumpTime+'s'}`}}</view>
			<view class="junmp" v-else @click="onJump">{{`立即体验`}}</view>
			<swiper  indicator-dots :indicator-color="'rgba(255,255,255,0.5)'" :indicator-active-color="'rgba(255,255,255)'" :interval="3000" :style="{height:windowHeight}" @animationfinish="animationfinish" class="swiper">
				<template v-for="(item,index) in pageData">
					<swiper-item>
						<view class="swiper-content">
							<image class="images" :src="item.url" mode="scaleToFill" style="width: 100%;height:100%;"></image>
						</view>
					</swiper-item>
				</template>
			</swiper >
		</view>
	</view>
</template>

<script setup>
	import {onLoad,onShow,onPullDownRefresh} from "@dcloudio/uni-app";
	import {ref,getCurrentInstance,nextTick,watch } from "vue"
	import {getImgByType} from '/common/questionApi.js'
	onLoad(async()=>{
		getPageData()
		windowHeight.value = uni.getStorageSync('useDevice').windowHeight + 'px'
	})
	let windowHeight = ref()
	let pageData = ref()
	let jumpTime = ref(6)
	let current = ref(0)
	
	function animationfinish(e) {
		current.value = e.detail.current;
	}
	function getPageData(){
		getImgByType({type:1}).then(res=>{
			pageData.value = res.result
			if(pageData.value.length <= 1){
				setInterval(()=>{
					jumpTime.value--
					if(jumpTime.value==0){
						onJump()
					}
				},1000)
			}
		})
	}
	function onJump(){
		uni.switchTab({
			url:'/pages/index/index'
		})
	}
	
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		.junmp{
			width: 152rpx;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			background: #3A3A3A;
			color: #fff;
			opacity: 0.5;
			border-radius: 8px;
			position: absolute;
			top: 160rpx;
			right: 60rpx;
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