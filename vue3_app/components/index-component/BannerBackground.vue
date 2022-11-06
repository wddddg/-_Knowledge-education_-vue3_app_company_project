<template>
    <view class="content" :class="{on:isClass}">
<!--        <swiper autoplay indicator-dots :indicator-color="'rgba(255,255,255,0.5)'" :indicator-active-color="'rgba(255,255,255)'" :interval="3000" class="swiper_content">
			<template v-for="(item,index) in componentContent.websiteHtmlCustomModuleLinkVOList">
				<swiper-item>
					<image class="images" :src="item.imgUrl" mode="scaleToFill" style="width: 100%;height:100%;" @click="goUrl(item.contentUrl,item.linkType,item.courseType)"></image>
				</swiper-item>
			</template>
        </swiper > -->
		<u-swiper height="320" :list="list" mode="round" interval="5000" indicator-pos="topRight" @click="goUrl"></u-swiper>
    </view>
</template>
<script lang="ts" setup >
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	const props = defineProps(['componentContent','isClass'])
	let list = ref([])
	console.log(props.componentContent,'componentContent');
	props.componentContent.websiteHtmlCustomModuleLinkVOList.forEach((item,index)=>{
		list.value.push({image:item.imgUrl})
	})


	let indexPage = {
		'pages/index/index':true,
		'pages/course/index':true,
		'pages/question/index':true,
		'pages/community/index':true,
		'pages/mine/index':true,
	}
	function goUrl(i){
		let e = props.componentContent.websiteHtmlCustomModuleLinkVOList[i].contentUrl
		let linkType = props.componentContent.websiteHtmlCustomModuleLinkVOList[i].linkType
		let courseType = props.componentContent.websiteHtmlCustomModuleLinkVOList[i].courseType
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
		margin-bottom:-40rpx
	}
	.swiper_content{
		display: flex;
		align-items: center;
		height: 320rpx;
	}
</style>