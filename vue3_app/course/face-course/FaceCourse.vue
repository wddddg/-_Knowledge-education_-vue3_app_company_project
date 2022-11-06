<template>
	<page>
	<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	<view class="container u-skeleton">
		<u-navbar :z-index="'9999'" title="授课详情">
			<template #right>
				<image class="images"  @click="onRetail" src="@/static/course/feng-xian2x.png" mode="scaleToFill" style="width: 35rpx;height:35rpx;margin-right: 40rpx;"></image>
			</template>
		</u-navbar>
		<view class="face-course-bgcolor-box">
			<view class="face-course-box">
				<view class="face-course-box-text">
					<label class="face-course-box-tag">面授课</label>
					<label class="face-course-box-title">{{pageData?.name}}</label>
				</view>
				<view class="face-course-line"></view>
				<view class="arddess">
					<image class="images" src="@/static/course/di-z2x.png" mode="scaleToFill" style="width: 32rpx;height:32rpx;margin-right: 16rpx;"></image>
					<label class="arddess-text">{{`${pageData?.provinceName?pageData?.provinceName:''}${pageData?.cityName?pageData?.cityName:''}`}}</label>
				</view>
				<view class="course-time" @click="onAddress">
					<view class="course-time-text">
						<image class="images" src="@/static/course/shi-j2x.png" mode="scaleToFill" style="width: 32rpx;height:32rpx;margin-right: 16rpx"></image>
						<label class="">{{`${pageData.startTime?pageData.startTime?.substr(0,10):''} - ${pageData.endTime?pageData.endTime?.substr(0,10):''}`}}</label>
					</view>
					<u-icon name="arrow-right"></u-icon>
				</view>
				<view class="course-count">
					<view class="count">{{`共${pageData?.courseSectionCount?pageData?.courseSectionCount:''}课时`}}</view>
					<view style="margin: 0 16rpx;">|</view>
					<view class="static" :style="{color:pageData?.offlineStatus==1?'#67C23A':'#606266 '}">{{pageData?.offlineStatus==1?'已开课':'未开课'}}</view>
				</view>
			</view>
		</view>
		<u-tabs :list="list"  @change="changeTabs" :is-scroll="false" :current="currentTabs" :active-color="themeColor" class="tab"></u-tabs>
		<view class="teacher" v-show="currentTabs==0">
<!-- 			<uni-list>
				<template v-for="(item,index) in pageData?.courseTeacherVOList">
					<uni-list-chat :avatar-circle="true" :title="item.teacherName" :avatar="item.headImg" :note="item.subjectName" @click="goTeacherDetail(itme)"></uni-list-chat>
				</template>
			</uni-list> -->
			<view class="teacher-list">
				<view class="teacher-list-itme" v-for="(itme,index) in pageData?.courseTeacherVOList" @click="goTeacherDetail(itme)">
					<image class="images"  :src="itme.headImg" mode="scaleToFill" ></image>
					<view class="teacher-message">
						<view class="teacher-teacherName">{{itme.teacherName}}</view>
						<view class="teacher-subjectName">{{itme.subjectName}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="detail" v-show="currentTabs==1">
			<u-parse :html="pageData?.content"></u-parse>
		</view>
		<view class="section-parent-list" v-if="currentTabs==2">
			<scroll-view  scroll-y="true" class="node" >
				<u-collapse accordion="false" :head-style="{color: '#303133'}" >
					<u-collapse-item :title="item.name" v-for="(item, index) in pageData?.sectionParentList" :key="index" :open="item.open" :disabled="item.disabled">
						<view class="node-itme" v-for="(j,i) in item?.courseSectionVOList"  style="margin: 40rpx;">
							<view class="node-itme-letf">
								<view style="color: #303133;font-size: 28rpx;">{{j.name}}</view>
								<view class="">{{`${j.startTime?.substr(5,2)}月${j.startTime?.substr(8,2)}日 ${j.startTime?.substr(12,5)}-${j.endTime?.substr(12,5)}`}}</view>
								<view class="">{{`讲师：${j.teacherName?j.teacherName:''}`}}</view>
							</view>
							<view class="node-itme-right">
								<view class="static" :style="{color:pageData?.offlineStatus==1?'#67C23A':pageData?.offlineStatus==1?'#395AE1':'#909399'}">{{pageData?.offlineStatus==1?'待开始':pageData?.offlineStatus==2?'正在上课':'已结束'}}</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
			</scroll-view>
		</view>
		<view class="bottom-box" v-if="isShowbutton">
			<view style="display: flex;align-items: center;">
				<image class="images" src="@/static/course/ke-h2x.png" mode="scaleToFill" style="width: 44rpx;height:44rpx;margin-right: 16rpx;" @click="goCustomService(pageData)"></image>
				<image class="images" v-show="payRule.learnPayStatus==1&&payRule.isClosePay==0" src="@/static/index/qian2x.png" mode="scaleToFill" style="width: 32rpx;height:34rpx;"></image>
				<text style="color: #EE5142;" v-show="(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1)&&payRule.isClosePay==0">￥</text>
				<text class="current_price" style="color: #EE5142;" v-show="(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1||payRule.learnPayStatus==1)&&payRule.isClosePay==0">
					{{pageData?.isActivity==1?pageData?.presentPrice:pageData?.originalPrice}}
						<text class="original_cost" v-if="pageData?.isActivity==1">
							{{'￥'+pageData?.originalPrice}}
						</text>
				</text>
			</view>
			<view class="button" v-if="pageData?.isStutyStatus==0" :style="{background:buttonColor,color:themeFontColor}" @click="onPay">{{payRule?.isClosePay==0?'立即购买':payRule?.buttonName}}</view>
			<view class="button" v-if="pageData?.isStutyStatus==1" :style="{background:'#C0C7D1',color:'#fff'}">{{'已报名'}}</view>
		</view>
		<view class="pay-button" v-if="!isShowbutton">
			<view class="button" :style="{background:'#C0C7D1',color:'#fff'}" @click="onClose" >{{'取消'}}</view>
			<view class="button"  :style="{background:buttonColor,color:themeFontColor}">{{'立即购买'}}</view>
		</view>
		<ThemeModal content="成为会员免费解锁" confirmText="了解会员详情" :showCancelBtn="false" :showModal="showMember" @confirmModal="goMember"/>
		<ThemePopup :showModal="showOther" :title="payRule?.alertTitle" :showCancelBtn="false" confirmText="保存图片"  @confirmModal="onDownload(payRule?.alertUrl)" @close = "close">
			<template #content>
				<view style="display: flex;justify-content: center;margin-bottom: 30rpx;" v-if="showOther"> 
					<image class="images" :src="payRule?.alertUrl" mode="scaleToFill" style="width: 160rpx;height:160rpx;"></image>
				</view>
			</template>
		</ThemePopup>
		<u-popup v-model="showPay" mode="bottom" border-radius="12" closeable @close="switchButton">
			<view class="popup-pay">
				<view class="popup-title">
					{{pageData?.name}}
					<u-icon name="close" @click="onClose" style="float: right;" size="28"></u-icon>
				</view>
				<view style="display: flex;justify-content: center;">
					<image class="images" v-show="payRule.learnPayStatus==1&&payRule.isClosePay==0" src="@/static/index/qian2x.png" mode="scaleToFill" style="width: 32rpx;height:34rpx;"></image>
					<text style="color: #EE5142;" v-show="(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1)&&payRule.isClosePay==0">￥</text>
					<view class="popup-price" >{{` ${pageData.coursePriceVOList?pageData.coursePriceVOList[selectCurrentBoxItem]?.presentPrice:''}`}}</view>
				</view>
				<view class="top-up-amount-list">
					<view class="top-up-amount-item" v-for="(item,index) in pageData?.coursePriceVOList" :key="index"
						@click="onSelectCurrentBox(index)"
						:class="selectCurrentBoxItem == index? 'active-top-up-amount-item' : ''">
						<view class="top-up-amount-title" v-if="item.specsCount != 0">{{ item.specsCount }} 天</view>
						<view class="top-up-amount-title" v-if="item.specsCount == 0">永久有效</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-popup v-model="showAddress" mode="bottom" border-radius="12" closeable>
			<view class="popup-address">
				{{ `${pageData?.startTime} - ${pageData?.endTime} ${pageData?.address}`}}
			</view>
		</u-popup>
		<RetailPopup :showModal="showRetail" @close="retailClose"></RetailPopup>
	</view>
	</page>
</template>

<script setup>
	import {onLoad,onShow,onPullDownRefresh,onReachBottom} from "@dcloudio/uni-app";
	import {ref,getCurrentInstance,nextTick } from "vue"
	import ThemeModal from "@/components/ThemeModal.vue"
	import ThemePopup from "@/components/ThemePopup.vue"
	import {getOfflineCourseDetails} from "../Course.api.ts"
	import RetailPopup from "@/components/RetailPopup.vue"
	import appUtils from '@/common/app-utils.js';
	onLoad((e)=>{
		id = e.id
		setDetailsById()
	})
	onPullDownRefresh(async()=>{
		await setDetailsById()
		uni.stopPullDownRefresh()
	})
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor?'#'+uni.getStorageSync('otherThemeColor').themeColor:'#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor?'#'+uni.getStorageSync('otherThemeColor').buttonColor:'#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor?'#'+uni.getStorageSync('otherThemeColor').themeFontColor:'#fff')
	let id = ''
	let pageData = ref({})
	let loading = ref(true)
	let list = ref([{
					name: '老师',
				}, {
					name: '详情',
				}, {
					name: '大纲',
				},])
	let currentTabs = ref(0)
	let showAddress = ref(false)
	function onAddress(){
		showAddress.value = true
	}
	function changeTabs(index) {
		currentTabs.value = index;
	}
	
	let selectCurrentBoxItem = ref(0)
	function onSelectCurrentBox(e){
		selectCurrentBoxItem.value = e
	}
	let payRule = ref(uni.getStorageSync('payRule'))
	let isShowbutton = ref(true)
	let showMember = ref(false)
	let showPay = ref(false)
	let showOther = ref(false)
	let showRetail = ref(false)
	function onPay(){
		showPay.value = false
		showMember.value = false
		showOther.value = false
		if(pageData.value.costType=='3'&&(payRule.value.aliPayStatus==1||payRule.value.iosPayStatus==1||payRule.value.learnPayStatus==1||payRule.value.wechatPayStatus==1)&&payRule.value.isClosePay==0){
			nextTick(()=>{
				showMember.value = true
			})
		}
		if(pageData.value.costType=='4'&&(payRule.value.aliPayStatus==1||payRule.value.iosPayStatus==1||payRule.value.learnPayStatus==1||payRule.value.wechatPayStatus==1)&&payRule.value.isClosePay==0){
			nextTick(()=>{
				showPay.value = true
				isShowbutton.value = false
			})
		}else{
			nextTick(()=>{
				showOther.value = true
			})
		}
		
	}
	function switchButton() {
		isShowbutton.value = true
	}
	function close (){
		showOther.value = false
	}
	
	function onDownload(e){
		appUtils.Download(e)
	}
	function onClose (){
		showPay.value = false
	}
	function onRetail(){
		showRetail.value = true
	}
	function retailClose(){
		showRetail.value = false
	}
	
	function setDetailsById(){
		getOfflineCourseDetails({courseId:id}).then(res=>{
			pageData.value = res.result
			loading.value = false
		})
	}
	function goTeacherDetail(e){
		uni.navigateTo({
			url:'/course/teacher/TeacherDetail'+'?id='+e.teacherId
		})
	}
	function goCustomService(e){
		uni.navigateTo({
			url:'/course/custom-service/CustomService'+'?id='+e.id
		})
	}
	function goMember(){
		showMember.value = false
		uni.navigateTo({
			url:'/personal/VipOpenRenewalFee'
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
	.face-course-bgcolor-box{
		height: 320rpx;
		background: linear-gradient(180deg, #CBDEFF 0%, #FFFFFF 100%);
		border-top: 1rpx solid #CBDEFF;
		margin-bottom: 110rpx;
		.face-course-box{
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
			border-radius: 12rpx;
			margin: 32rpx 40rpx;
			padding: 48rpx 32rpx 32rpx;
			.face-course-box-text{
				font-size: 32rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #303133;
				line-height: 44rpx;
				.face-course-box-tag{
					font-size: 24rpx;
					padding: 4rpx 16rpx;
					line-height: 40rpx;
					border-radius: 0px 12rpx 0px 12rpx;
					border: 2rpx solid #7BC8E8;
					margin-right: 16rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #3F6EE1;
					line-height: 32rpx;
				}
				.face-course-box-title {
					height: 50rpx;
					line-height: 50rpx;
				}
			}
			.face-course-line {
				height: 2rpx;
				border: 2rpx solid #DCDFE6;
				margin-top: 32rpx;
			}
			.arddess {
				margin-top: 30rpx;
				vertical-align: middle;
				display: flex;
				align-items: center;
			}
			.course-time {
				margin-top: 16rpx;
				vertical-align: middle;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.course-time-text {
				display: flex;
				align-items: center;
			}
			.course-count {
				margin-top: 24rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.count{
					height: 40rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #606266;
					line-height: 40rpx;
				}
				.static{
					height: 40rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #67C23A;
					line-height: 40rpx;
				}
			}
		}
	}
	.tab{
		margin-top: 110rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
		z-index: 99999;
	}
	.teacher {
		margin-top: 50rpx;
		margin: 0 40rpx;
		.teacher-list{
			width: 100%;
			margin: 30rpx 40rpx 30rpx 10rpx;
			.teacher-list-itme {
				height: 100rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #DCDFE6;
				padding-bottom: 20rpx;
				margin-top: 20rpx;
				.images {
					width: 80rpx;
					height:80rpx;
					border-radius: 80rpx;
					box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(47,69,162,0.3);
					border: 4rpx solid #FFFFFF;
				}
				.teacher-message {
					height:100%;
					margin:0 16rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.teacher-teacherName {
						font-size: 28rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #303133;
					}
					.teacher-subjectName {
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
					}
				}
			}
		}
		&::after {
			display: block;
			content: '';
			height: 200rpx;
		}
	}
	.detail {
		padding: 48rpx 40rpx;
		&::after {
			display: block;
			content: '';
			height: 200rpx;
		}
	}
	.section-parent-list {
		padding: 48rpx 40rpx;
		&::after {
			display: block;
			content: '';
			height: 200rpx;
		}
	}
	.node-itme{
		display: flex;
		.node-itme-letf {
			color: #909399;
		}
		.node-itme-right {
			width: 130rpx;
		}
	}
	.bottom-box {
		height: 192rpx;
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0px -4px 16px 0px rgba(0,0,0,0.1);
		padding: 28rpx 40rpx 76rpx 40rpx ;
		position: fixed;
		bottom:0rpx;
		z-index: 999999;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.original_cost{
			text-decoration:line-through;
			font-size: 24rpx;
			font-weight: 400;
			color: #909399;
			margin-left: 16rpx;
		}
		
		.button {
			width: 180rpx;
			height: 72rpx;
			// background: #395AE1;
			border-radius: 8rpx;
			text-align: center;
			line-height: 72rpx;	
		}
	}
	.pay-button {
		width: 100%;
		position: fixed;
		bottom:0rpx;
		z-index: 999999;
		display: flex;
		background: #FFFFFF;
		box-shadow: 0px -4px 16px 0px rgba(0,0,0,0.1);
		padding: 28rpx 40rpx 76rpx 40rpx ;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 172rpx;
		.button {
			width: 304rpx;
			height: 88rpx;
			font-size: 28rpx;
			font-weight: 500;
			border-radius: 8rpx;
			text-align: center;
			line-height: 88rpx;	
		}
	}
}
.popup-pay {
	padding: 40rpx 40rpx 192rpx 40rpx ;
	height: 770rpx;
	border-radius: 12rpx 12rpx 0rpx 0rpx;
	background: #FFFFFF;
	position: relative;
	z-index: 9999;
	.popup-title{
		text-align:center;
		font-size: 32rpx;
		font-family: PingFang-SC-Heavy, PingFang-SC;
		font-weight: 800;
		color: #1B1E27;
		margin-bottom: 56rpx;
	}
	.popup-price{
		text-align:center;
		font-size: 32rpx;
		font-family: PingFang-SC-Heavy, PingFang-SC;
		font-weight: 800;
		color: #EE5142;
	}
	.top-up-amount-list {
		display: flex;
		align-items: center;
		justify-content: s;
		flex-wrap: wrap;

		.top-up-amount-item {
			background: #fff;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			// width: 33%;
			width: 210rpx;
			height: 148rpx;
			border: 2rpx solid #fff;
			position: relative;
			margin-top: 40rpx;
			.top-up-amount-title {
				font-size: 36rpx;
				font-family: DINCond-Black, DINCond;
				font-weight: 900;
				color: #303133;
				line-height: 44rpx;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				white-space: nowrap;
			}
		}

		.active-top-up-amount-item {
			border: 2rpx solid #395AE1;
		}
	}
	&::after {
		display: block;
		content: '';
		height: 300rpx;
	}
}
	.popup-address {
		padding: 40rpx 40rpx 192rpx 40rpx ;
		height: 746rpx;
		border-radius: 12rpx 12rpx 0rpx 0rpx;
		background: #FFFFFF;
		position: relative;
	}

</style>
