<template>
    <view class="content" :class="{on:isClass}">
		<swiper 
		indicator-dots :indicator-color="'rgba(0,0,0,0.2)'" 
		:indicator-active-color="themeColor" 
		:interval="5000" 
		:current="currentIndex"
		@change="changeSwiper"
		class="swiper_content"
		:style="{ height: swiperHeight + 'rpx' }"
		>
				<swiper-item v-for="(i) in pages">
					<view class="navigation" :id="'content-wrap' + (i-1)">
						<template v-for="(item,index) in componentContent.websiteHtmlCustomModuleLinkVOList">
							<view class="navigation_itme" :style="{width:85/componentContent.lineCount+'%'}" @click="goUrl(item.contentUrl)"
							v-show="(index+1 <= pageItme*i)&&(index>=componentContent.lineCount*(i-1)*componentContent.pageCount)">
								<image class="images" :src="item.imgUrl" mode="scaleToFill" style="width: 60rpx;height:60rpx;"></image>
								<view class="navigation_itme_title">{{item.title}}</view>
							</view>
						</template>
					</view>
				</swiper-item>
		</swiper >
    </view>
</template>
<script lang="ts" setup >
	import { ref, defineProps, watch, unref,watchEffect,nextTick,onMounted } from 'vue';
	const props = defineProps(['componentContent','isClass'])
	let pages = ref(0)
	let totalItme = props?.componentContent.websiteHtmlCustomModuleLinkVOList.length
	let pageItme = ref(props?.componentContent.lineCount*props?.componentContent.pageCount)
	let themeColor = ref(uni.getStorageSync('themeColor')?uni.getStorageSync('themeColor'):'#395AE1')
	if(totalItme>pageItme.value){
		let residual = totalItme%pageItme.value
		pages.value = ((totalItme-residual)/pageItme.value)+1
	}else{
		pages.value = 1
	}

	//动态获取轮播图内容进行设置高度
	
	let currentIndex = ref(0)
	let swiperHeight = ref(props?.componentContent.pageCount*150)
	// function setSwiperHeight(){
	// 	let element = "#content-wrap" + currentIndex.value;
	// 	const query = uni.createSelectorQuery()
	// 	query.select(element).boundingClientRect(res=>{});
	// 	query.exec((res) => {
	// 		if (res && res[0]) {
	// 			swiperHeight.value = (res[0].height+20)
	// 		}
	// 	});
	// }
	// function changeSwiper(e){
	// 	currentIndex.value = e.detail.current;
	// 	nextTick(() => {
	// 		setSwiperHeight();
	// 	})
	// }
	onMounted(()=>{
		// nextTick(() => {
		//   setSwiperHeight();
		// });
	})

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
	.swiper_content {
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