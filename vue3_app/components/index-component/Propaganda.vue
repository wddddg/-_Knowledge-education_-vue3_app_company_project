<template>
    <view>
        <view class="content" :class="{on:isClass}">
            <view class="left_one" :style="`background: url(${props.componentContent.websiteHtmlCustomModuleLinkVOList[0].leftOneImgUrl}) no-repeat;background-size: cover;`" @click="goUrl(props.componentContent.websiteHtmlCustomModuleLinkVOList[0].leftOneUrl)">
                <!-- <img src="../static/bg_ziwoceshi.png" style="height:100px"> -->
                <view class="left_one_text">
                    <view style="font-size: 30rpx;margin-bottom: 16rpx;">{{props.componentContent.websiteHtmlCustomModuleLinkVOList[0].leftOneOneRows}}</view>
                    <view>{{props.componentContent.websiteHtmlCustomModuleLinkVOList[0].leftOneTwoRows}}</view>
                </view>
            </view>
            <view class="right">
                <view class="right_one" :style="`background: url(${props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightOneImgUrl}) no-repeat;background-size: cover;`" @click="goUrl(props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightOneUrl)">
                    <view class="right_text">{{props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightOneOneRows}}</view>
                </view>
                <view style="height:10%"></view>
                <view class="right_two" :style="`background: url(${props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightTwoImgUrl}) no-repeat;background-size: cover;`" @click="goUrl(props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightTwoUrl)">
                    <view class="right_text">{{props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightTwoOneRows}}</view>
                </view>
            </view>
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
.title{
    text-align: center;
    margin-bottom: 20rpx;
}
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 352rpx;
    color: #fff;
}
.left_one{
    width: 45%;
    height: 100%;
    // border: 1rpx solid #ccc;
    border-radius: 12rpx;
    // background: url(@/static/index/bo_f2x.png) no-repeat ;
    // background-size: cover;
}
.left_one_text{
    margin: 40rpx 0 0 24rpx;
    // text-align: center;
}
.right{
    width: 50%;
    height: 100%;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    // text-align: center;  
}
.right_one{
    height: 45%;
    border: 1rpx solid transparent;
    // background: url(@/static/index/kao_d2x.png) no-repeat;
    // background-size: cover;
    border-radius: 12rpx;
}
.right_two{
    height: 45%;
    border: 1rpx solid transparent;
    // background: url(@/static/index/shu_j@2x.png) no-repeat;
    // background-size: cover;
    border-radius: 12rpx;
}
.right_text{
    margin: 0 0 0 24rpx;
	margin-top: 23%;
	transform: translateY(-50%);
	font-size: 30rpx;
}
</style>