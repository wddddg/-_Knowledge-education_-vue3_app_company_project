<template>
	<page>
	<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	<view class="container u-skeleton">
		<u-navbar :z-index="'99999'" title="资料详情" @click="false" @touchmove.stop.prevent="false"></u-navbar>
		<view class="top_box">
			<image class="images" :src="pageData?.imgUrl" mode="scaleToFill" style="width: 240rpx;height:180rpx;border-radius: 12rpx;"></image>
			<view class="top_box_right">
				<view class="title">{{pageData?.name}}</view>
				<view class="teacher">
					<image class="images" :src="pageData?.teacherHeadImg" mode="scaleToFill" style="width: 36rpx;height:36rpx;border-radius: 36rpx;"></image>
					<text>{{pageData?.teacherName}}</text><text style="margin: 0 16rpx;">|</text><text>{{`阅读数：${pageData?.studyCount?pageData?.studyCount:''}`}}</text>
				</view>
				<view class="date">{{`发布日期：${pageData?.createTime?pageData?.createTime?.substr(0,11):''}`}}</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="text_content">
			<!-- {{pageData?.content}} -->
			<u-parse :html="pageData?.content"></u-parse>
		</view>

		<u-popup v-model="show" mode="bottom" :mask-custom-style="{background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, #FFFFFF 100%)'}" :mask-close-able="false">
			<view class="bottom">
				<view class="button" @click="pageData?.costType==2?onMember():pageData?.costType==3?onPay():''">
					<image class="images" src="@/static/course/suo2x.png" mode="scaleToFill" style="width: 36rpx;height:36rpx;margin-right: 16rpx;"></image>
					<view class="" v-if="pageData?.costType==2" @click="onMember">{{'会员解锁'}}</view>
					<view class="" v-if="pageData?.costType==3" @click="onPay">
						<!-- <image class="images" v-show="payRule.learnPayStatus==1&&payRule.isClosePay==0" src="@/static/index/qian2x.png" mode="scaleToFill" style="width: 32rpx;height:34rpx;"></image> -->
						<!-- <text style="color: #EE5142;" v-show="(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1)&&payRule.isClosePay==0">￥</text> -->
						<text v-if="payRule?.isClosePay==0">{{`￥${pageData?.presentPrice?pageData?.presentPrice:''}`}}</text>
						{{`${payRule?.isClosePay==0?'购买解锁':payRule?.buttonName}`}}
					</view>
				</view>
			</view>
		</u-popup>
		<ThemeModal content="成为会员免费解锁" confirmText="了解会员详情" :showCancelBtn="false" :showModal="showMember" @confirmModal="goMember"/>
		<ThemePopup :showModal="showPay" :title="pageData?.name"  confirmText="购买" @closeModal="showPay = false" @confirmModal="goOrder" @close = "close">
			<template #content>
				<view style="display: flex;justify-content: center;height: 100rpx;line-height: 100rpx;color: #EE5142;" v-if="showPay"> 
					<text>{{`￥${pageData?.presentPrice}`}}</text>
				</view>
			</template>
		</ThemePopup>
		<ThemePopup :showModal="showOther" :title="payRule?.alertTitle" :showCancelBtn="false" confirmText="保存图片"  @confirmModal="onDownload(payRule?.alertUrl)" @close = "close">
			<template #content>
				<view style="display: flex;justify-content: center;margin-bottom: 30rpx;" v-if="showOther"> 
					<image class="images" :src="payRule?.alertUrl" mode="scaleToFill" style="width: 160rpx;height:160rpx;"></image>
				</view>
			</template>
		</ThemePopup>
	</view>
	</page>
</template>

<script setup>
	import {onLoad,onShow,onPullDownRefresh,onReachBottom} from "@dcloudio/uni-app";
	import {ref,getCurrentInstance,nextTick } from "vue"
	import ThemeModal from "@/components/ThemeModal.vue"
	import ThemePopup from "@/components/ThemePopup.vue"
	import appUtils from '@/common/app-utils.js';
	import {getDetailsById} from "../Course.api.ts"
	onLoad((e)=>{
		id = e.id
		setDetailsById()
	})
	onPullDownRefresh(async()=>{
		await setDetailsById()
		uni.stopPullDownRefresh()
	})
	let id = ''
	let pageData = ref({})
	let show = ref(true)
	let payRule = ref(uni.getStorageSync('payRule'))
	function setDetailsById(){
		getDetailsById({id:id}).then(res=>{
			pageData.value = res.result
			res.result.isStutyStatus=='1'?show.value = false:show.value = true
			loading.value = false
		})
	}
	let loading = ref(true)
	let showMember = ref(false)
	function onMember(){
		showMember.value = false
		nextTick(()=>{
			showMember.value = true
		})
	}
	let showPay = ref(false)
	let showOther = ref(false)
	function onPay(){
		
		debugger
		showPay.value = false
		showOther.value = false
		if(pageData.value.costType=='3'&&(payRule.value.aliPayStatus==1||payRule.value.iosPayStatus==1||payRule.value.learnPayStatus==1||payRule.value.wechatPayStatus==1)&&payRule.value.isClosePay==0){
			// nextTick(()=>{
				showPay.value = true
			// })
		}else{
			// nextTick(()=>{
				showOther.value = true
			// })
		}
	}
	
	function close (){
		showPay.value = false
		showOther.value = false
	}
	function onDownload(e){
		appUtils.Download(e)
	}
	
	function goMember(){
		showMember.value = false
		uni.navigateTo({
			url:'/personal/VipOpenRenewalFee'
		})
	}
	function goOrder(){
		uni.navigateTo({
			url:'/personal/order/OrderDetails?isOrder=0'+'&id='+pageData.value?.id+'&buyMonth='+1+'&category='+6
		})
	}
</script>


<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
.container{
	padding: 40rpx;
	.top_box{
		width: 100%;
		height: 180rpx;
		display: flex;
		position: relative;
		.top_box_right{
			margin-left: 32rpx;
		}
		.title {
			width: 398rpx;
			font-size: 32rpx;
			font-weight: 800;
			color: #303133;
			overflow:hidden;
			word-wrap: break-word;
			word-break: break-all;
			white-space: pre-line;
			text-overflow:ellipsis;
			display:-webkit-box;
			-webkit-box-orient:vertical;
			-webkit-line-clamp:2;//显示的行数
		}
		.teacher{
			font-weight: 400;
			color: #606266;
			position: absolute;
			top: 50%;
			display: flex;
			align-items: center;
		}
		.date {
			font-weight: 400;
			color: #909399;
			position: absolute;
			bottom: 0;
		}
	}
	.line {
		height: 2rpx;
		background: #DCDFE6;
		margin: 48rpx 0;
	}
}

	.bottom {
		padding: 0 40rpx;
		margin-bottom: 80rpx;
		color: #FBDBB5;
		.button {
			background: linear-gradient(90deg, #333642 0%, #5E606D 100%);
			height: 88rpx;
			width: 100%;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
