<template>
    <view class="content" :class="{on:isClass}">
        <view class="logo_item" @click="goUrl(componentContent.websiteHtmlCustomModuleLinkVOList[0].contentUrl,componentContent.websiteHtmlCustomModuleLinkVOList[0].linkType,componentContent.websiteHtmlCustomModuleLinkVOList[0].courseType)">
			<image class="images" :src="componentContent.websiteHtmlCustomModuleLinkVOList[0].imgUrl" mode="scaleToFill" style="width: 100%;height:144rpx;"></image>
        </view>
    </view>
</template>
<script lang="ts" setup >
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	const props = defineProps(['componentContent','isClass'])
	console.log(props);

	let indexPage = {
		'pages/index/index':true,
		'pages/course/index':true,
		'pages/question/index':true,
		'pages/community/index':true,
		'pages/mine/index':true,
	}
	function goUrl(e,linkType,courseType){
		if(linkType==1||linkType==2){
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
		}else if(linkType==3){
			debugger
			if(courseType == 4){
				uni.navigateTo({
					url:'/course/class-course/ClassCourse'+'?id='+e
				})
			}else if(courseType == 1||courseType == 2){
				uni.navigateTo({
					url:'/course/online-course/OnlineCourse'+'?id='+e+'&courseType='+(courseType)
				})
			}else if(courseType == 3){
				uni.navigateTo({
					url:'/course/face-course/FaceCourse'+'?id='+e
				})
			}
		}else if(linkType == 4){
			uni.navigateTo({
				url:'/course/class-course/ClassCourse'+'?id='+e
			})
		}else if(linkType == 5){
			uni.navigateTo({
				url:'/course/knowledge/KnowledgeDetail'+'?id='+e
			})
		}else if(linkType == 6){
			uni.navigateTo({
				url:'/course/book/BookDetail'+'?id='+e
			})
		}else if(linkType == 7){
			uni.navigateTo({
				url:'/mall/all-products/PhysicalGoodsDetails'+'?id='+e
			})
		}else if(linkType == 7){
			// 详情页面跳转
			uni.navigateTo({
				url: `/community/newDetails?id=${e}`
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
</style>