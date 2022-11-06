<template>
	<page>
    <view class="content">
		<!-- <u-navbar :z-index="'9999'" title="授课详情"></u-navbar> -->
		<web-view :src="pageData.videoUrl"></web-view>
    </view>
	</page>
</template>

<script lang="ts" setup >import {
	onLoad,
	onReady,
	onUnload
} from '@dcloudio/uni-app'
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	import {getCourseSectionDetails,getLiveSectionBackUrl} from "../Course.api.ts"
	onLoad((e)=>{
		id = e.id
		setDetailsById(e.isPlayBack)
	})
	onUnload(() => {
	})
	let id = ref()
	let pageData = ref()
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor?'#'+uni.getStorageSync('otherThemeColor').themeFontColor:'#fff')
	async function setDetailsById(isPlayBack){
		
		if(isPlayBack==1){
			await getLiveSectionBackUrl({sectionId:id}).then(res=>{
				pageData.value = res.result
				// #ifdef MP-WEIXIN
					pageData.value.videoUrl = pageData.value.videoUrl + '&dsp=1&disable_ppt_animate=1'
				// #endif
			})
		}else {
			await getCourseSectionDetails({sectionId:id}).then(res=>{
				pageData.value = res.result
				// #ifdef MP-WEIXIN
					pageData.value.videoUrl = pageData.value.videoUrl + '&enterH5=true&dsp=1&disable_ppt_animate=1'
				// #endif
			})
		}
		// // #ifdef H5
		// 	window.location.href=pageData.value.videoUrl;
		// // #endif
		// // #ifdef APP-PLUS
		// 	plus.runtime.openURL(pageData.value.videoUrl);
		// // #endif
	}
	
</script>
<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
	.content{
	
	}
</style>