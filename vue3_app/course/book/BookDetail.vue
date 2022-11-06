<template>
	<page>
	<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	<view class="container u-skeleton" :style="{'--button-color':buttonColor}">
		<u-navbar :z-index="'9999'" title-width="150" title="书籍详情">
			<template #right>
				<image class="images" v-if="pageData?.isCollection==0" @click="onCollection(pageData?.isCollection)" src="@/static/course/bei-f2x.png" mode="scaleToFill" style="width: 40rpx;height:40rpx;margin-right: 15rpx;"></image>
				<image class="images" v-if="pageData?.isCollection==1" @click="onCollection(pageData?.isCollection)" src="@/static/course/bie-z2x.png" mode="scaleToFill" style="width: 40rpx;height:40rpx;margin-right: 15rpx;"></image>
				<image class="images"  @click="onRetail" src="@/static/course/feng-xian2x.png" mode="scaleToFill" style="width: 35rpx;height:35rpx;margin-right: 15rpx;"></image>
			</template>
		</u-navbar>
		<view class="top_box">
			<image class="images" :src="pageData?.imgUrl" mode="scaleToFill" style="width: 160rpx;height:180rpx;border-radius: 12rpx;"></image>
			<view class="is-finish" v-if="pageData?.isComplete==1" :style="{color:themeFontColor}">已完结</view>
			<view class="top_box_right">
				<view class="title">{{pageData?.name}}</view>
				<view class="book_message">
					<view class="price">
						<text class="current_price" v-if="pageData?.costType==1" style="color: #67C23A;">{{'免费'}}</text>
						<text class="current_price" v-else-if="pageData?.costType==2" style="color: #395AE1;">{{'会员'}}</text>
						<text class="current_price" v-else-if="pageData?.costType==3" style="color: #EE5142;">{{'￥'+pageData?.presentPrice}}<text class="original_cost">{{'￥'+pageData?.originalPrice}}</text></text>
					</view>
					<view :style="{color:pageData?.isComplete==1?'#606266':'#395AE1'}">{{pageData?.isComplete==1?'已完结':'更新中'}}</view>
				</view>
			</view>
		</view>
		<view class="teacher_message">
			<view class="teacher">
				<image class="images" :src="pageData?.teacherHeadImg" mode="scaleToFill" style="width: 36rpx;height:36rpx;border-radius: 36rpx;"></image>
				<text>{{pageData?.teacherName}}</text><text style="margin: 0 16rpx;">|</text><text>{{pageData?.sourceType==1?'原创':'转载'}}</text>
			</view>
			<view class="date">{{`最近更新时间：${pageData?.updateTime?pageData?.updateTime?.substr(0,11):''}`}}</view>
		</view>
		<view class="remark">
			<view class="remark_text">{{pageData?.remark}}</view>
		</view>
		<view class="section-List">
			<view class="section-text" @click="openSectionList">
				<view class="section-text-left">{{'目录'}}</view>
				<view class="section-text-right">{{`共${pageData?.parentBookSectionList?pageData?.parentBookSectionList?.length:'0'}节`}}<u-icon name="arrow-right"></u-icon></view>
			</view>
		</view>
		<view class="text_content">
			<u-parse :html="pageData?.content"></u-parse>
		</view>
		<!-- <view class="text_content">{{pageData?.content}}</view> -->
		<u-popup v-model="show" mode="bottom" border-radius="12" closeable>
			<view class="popup" v-if="show">
				<image class="images" src="@/static/course/top2x.png" mode="scaleToFill" style="width: 248rpx;height:24rpx;position: absolute;left: 50%;transform: translateX(-50%);"></image>
				<!-- <u-icon name="close" @click="onClose" style="float: right;" size="28"></u-icon> -->
				<view class="popup-itme">
					<scroll-view  scroll-y="true" class="node" >
						<u-collapse accordion="false">
							<u-collapse-item :title="item.name" v-for="(item, index) in itemList" :key="index" :open="item.open" :disabled="item.disabled">
								<view class="node-itme" v-for="(j,i) in item?.childBookSectionList"  style="margin: 32rpx 0;">
									<image class="images" v-if="j.isStutyStatus==0" src="@/static/course/suo-bian2x.png" mode="scaleToFill" style="width: 26rpx;height:28rpx;margin-right: 16rpx;"></image>
									<view class="node-title" @click="goBookReader(j.bookId,j.id)">
										<text v-if="j.isTryLook==1" style="color: #395AE1;margin-right: 16rpx;">{{'| 试看 |'}}</text>
										<text  :style="{color:j.isStutyStatus==1?'#303133':'#909399'}">{{j.name}}</text>
									</view>
								</view>
							</u-collapse-item>
						</u-collapse>
					</scroll-view>
				</view>
			</view>
		</u-popup>
	</view>
	<view class="bottom-box">
		<view class="button" v-if="pageData?.costType==1||pageData?.isStutyStatus==1" @click="goBookReader(pageData.id)" :style="{background:buttonColor,color:themeFontColor}">{{'立即阅读'}}</view>
		<view class="button" v-if="pageData?.costType==3&&pageData?.isStutyStatus==0" @click="onPay" :style="{background:buttonColor,color:themeFontColor}">{{'立即购买'}}</view>
		<view class="button" v-if="pageData?.costType==2&&pageData?.isStutyStatus==0" :style="{background:'linear-gradient(90deg, #333642 0%, #5E606D 100%)',color:'#FBDBB5'}" >{{'开通会员'}}</view>
	</view>
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
	<RetailPopup :showModal="showRetail" @close="retailClose"></RetailPopup>
	</page>
</template>

<script setup>
	import {onLoad,onShow,onPullDownRefresh,onReachBottom} from "@dcloudio/uni-app";
	import {ref,getCurrentInstance,nextTick} from "vue"
	import ThemeModal from "@/components/ThemeModal.vue"
	import ThemePopup from "@/components/ThemePopup.vue"
	import RetailPopup from "@/components/RetailPopup.vue"
	import {getBookDetailsById,addCollectionBook} from "../Course.api.ts"
	import appUtils from '@/common/app-utils.js';
	onLoad((e)=>{
		id = e.id
		setDetailsById()
	})
	onPullDownRefresh(async()=>{
		await setDetailsById()
		uni.stopPullDownRefresh()
	})
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor?'#'+uni.getStorageSync('otherThemeColor').buttonColor:'#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor?'#'+uni.getStorageSync('otherThemeColor').themeFontColor:'#fff')
	let id = ''
	let pageData = ref({})
	let show = ref(false)
	function openSectionList(){
		show.value = true
	}
	let itemList = ref([])
	function setDetailsById(){
		getBookDetailsById({id:id}).then(res=>{
			pageData.value = res.result
			itemList.value = res.result.parentBookSectionList
			// res.result.isStutyStatus=='1'?show.value = false:show.value = true
			loading.value = false
		})
	}
	let loading = ref(true)
	let showMember = ref(false)
	let showPay = ref(false)
	let showOther = ref(false)
	function onPay(){
		showPay.value = false
		showOther.value = false
		showMember.value = false
		if(pageData.value.costType=='2'&&(payRule.value.aliPayStatus==1||payRule.value.iosPayStatus==1||payRule.value.learnPayStatus==1||payRule.value.wechatPayStatus==1)&&payRule.value.isClosePay==0){
			// nextTick(()=>{
				showMember.value = true
			// })
		}
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
	
	function onDownload(e){
		appUtils.Download(e)
	}
	function onCollection(e){
		let param = {
			operateStatus:e==1?0:1,
			bookId:id
		}
		addCollectionBook(param).then(res=>{
			if(res.code ==200 ){
				pageData.value.isCollection = pageData.value.isCollection==1?pageData.value.isCollection=0 :pageData.value.isCollection=1
			}
		})
	}
	function close (){
		showOther.value = false
		showMember.value = false
		showPay.value = false
	}
	let showRetail = ref(false)
	function onRetail(){
		showRetail.value = true
	}
	function retailClose(){
		showRetail.value = false
	}
	
	function goBookReader(bookId,chapterId){
		let pageIndax = ''
		if(chapterId){
			pageIndax = 0
			for(let i=0;i<itemList.value.length;i++){
				let isReturn = false
				if(itemList.value[i]?.childBookSectionList?.length != 0){
					for(let j=0;j<itemList.value[i]?.childBookSectionList?.length;j++){
							console.log(itemList.value[i]?.childBookSectionList[j]?.id,'id');
							
							// debugger
						if(chapterId == itemList.value[i]?.childBookSectionList[j]?.id){
							isReturn = true
							break 
						}
						pageIndax++
					}
				}
				if(isReturn){
					break
				}
			}
		}
		uni.navigateTo({
			url: '/course/book/BookReader?bookId='+bookId+'&pageIndax='+pageIndax
		});
	}
	function goOrder(){
		uni.navigateTo({
			url:'/personal/order/OrderDetails?isOrder=0'+'&id='+pageData.value?.id+'&buyMonth='+1+'&category='+5
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
		height: 180rpx;
		display: flex;
		position: relative;
		.is-finish{
			width: 112rpx;
			height: 40rpx;
			background: #395AE1;
			border-radius: 12rpx 0rpx 200rpx 0rpx;
			opacity: 0.8;
			position: absolute;
		}
		.top_box_right {
			width: 398rpx;
			position: relative;
			margin-left: 32rpx;
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
			.book_message {
				width: 398rpx;
				display: flex;
				justify-content: space-between;
				position: absolute;
				bottom: 36rpx;
				.original_cost{
					text-decoration:line-through;
					font-size: 24rpx;
					font-weight: 400;
					color: #909399;
					margin-left: 16rpx;
				}
			}
			.current_price{
				font-size: 28rpx;
				font-weight: 800;
			}
		}

	}
	.teacher_message {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 24rpx;
		.teacher{
			font-weight: 400;
			color: #606266;
			display: flex;
			align-items: center;
		}
		.date {
			font-weight: 400;
			color: #909399;
		}
	}
	.remark {
		background: #F6F6F6;
		border-radius: 12px;
		padding: 24rpx;
		margin-top: 24rpx;
		.remark_text{
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
		}
	}
	.section-List{
		padding: 32rpx 24rpx;
		height: 108rpx;
		background: linear-gradient(270deg, #FFFFFF 0%, #CBDEFF 100%);
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
		border-radius: 12rpx;
		margin-top: 24rpx;
		.section-text{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.section-text-left{
				font-size: 28rpx;
				font-weight: 800;
				color: #303133;
				line-height: 44rpx;
			}
			.section-text-right {
				font-weight: 400;
				color: #909399;
				line-height: 44rpx;
			}
		}
	}
	.text_content {
		margin-top: 64rpx;
		&::after {
			display: block;
			content: '';
			height: 200rpx;
		}
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
		.button {
			height: 88rpx;
			// background: #395AE1;
			border-radius: 8rpx;
			text-align: center;
			line-height: 88rpx;	
		}
	}
	
	.popup {
		padding: 40rpx 40rpx 192rpx 40rpx ;
		height: 746rpx;
		border-radius: 12rpx 12rpx 0rpx 0rpx;
		background: #FFFFFF;
		position: relative;
		.popup-itme{
			margin-top: 80rpx;
			.node{
				height: 400rpx;
			}
		}
	}
</style>
