<template>
    <view class="content">
		<u-navbar :z-index="'9999'" title="搜索"></u-navbar>
        <!-- <view class="logo_item"><uni-easyinput type="text" prefixIcon="search" styles="{background:#F6F6F6}" placeholder="搜索课程、书籍、考点、讲师" v-model="inputValue" @iconClick="onConfirm" @confirm="onConfirm" /> </view> -->
		<u-search  shape="square" :focus="true" :show-action="false" placeholder="搜索课程、书籍、考点、讲师" v-model="inputValue" @search="onConfirm"></u-search>
		<view class="hot">
			<view>热门搜索</view>
			<view class="hot-item" >
				<text class="hot-item-text" v-for="(item,index) in pageData" @click="onName(item.name)">{{item.name}}</text>
			</view>
		</view>
		<view class="history">
			<view class="history-title">
				<view class="history-search">历史搜索</view>
				<image class="images" src="@/static/course/sha-c2x.png" mode="scaleToFill" style="width: 32rpx;height:32rpx;" @click="isShowMember"></image>
			</view>
			
			<view class="history-content" v-for="(item,index) in historySearchList">
				<view class="history-search-title">
					<image class="images" src="@/static/course/shi-c2x.png" mode="scaleToFill" style="width: 24rpx;height:24rpx;margin-right: 12rpx;"></image>
					<view class="history-search-name" @click="onName(item)">{{item}}</view>
				</view>
				<image class="images" src="@/static/course/delete2x.png" mode="scaleToFill" style="width: 24rpx;height:24rpx;" @click="delOneHistory(index)"></image>
			</view>
		</view>
		<ThemeModal title="删除提示" content="是否清空历史记录" confirmText="确认" :showCancelBtn="true" :showModal="showMember" @closeModal="()=>showMember = false" @confirmModal="delHistory"/>
    </view>
</template>

<script lang="ts" setup >import {
	onLoad,
	onReady
} from '@dcloudio/uni-app'
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	import ThemeModal from "@/components/ThemeModal.vue"
	import {systemHot} from "../Course.api.ts"
	onLoad((e)=>{
		setDetailsById()
		
		historySearchList.value = uni.getStorageSync('historySearch')?uni.getStorageSync('historySearch'):[]
	})
	let showMember = ref(false)
	let pageData = ref()
	let inputValue = ref()
	let historySearchList = ref([])
	async function setDetailsById(){
		await systemHot({category:2}).then(res=>{
			pageData.value = res.result
		})
	}
	function onConfirm(){
		if(inputValue.value){
			uni.$emit('courseParam',inputValue.value)
			historySearchList.value.push(inputValue.value)
			uni.setStorageSync('historySearch',historySearchList.value)
			uni.switchTab({
				url:'/pages/course/index'
			})
		}else{
			uni.showToast({
				icon:'none',
				title:'请输入搜索内容'
			})
		}
	}
	function onName(e){
		 inputValue.value=e
	} 
	function delOneHistory(e){
		historySearchList.value?.splice(e,1)
		uni.setStorageSync('historySearch',historySearchList.value)
	}
	
	function isShowMember(){
		if(!uni.getStorageSync('historySearch')||uni.getStorageSync('historySearch').length==0){
			uni.showToast({
				icon:'none',
				title:'暂无搜索记录'
			})
		}else{
			showMember.value = true
		}
	}
	function delHistory(){
		historySearchList.value = []
		uni.setStorageSync('historySearch',historySearchList.value)
		showMember.value = false
	}
</script>
<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
	.content{
		padding: 40rpx;
		.logo_item{}
		.hot {
			margin-top: 64rpx;
			.hot-item{
				border: 1rpx solid transparent;
				margin-top: 16rpx;
				display: flex;
				flex-wrap: wrap;
				.hot-item-text{
					margin:0  16rpx 16rpx 0;
					padding:12rpx 24rpx;
					// height: 60rpx;
					border-radius: 8rpx;
					border: 1rpx solid #DCDFE6;
					// line-height: 60rpx;
					// text-align: center;
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
					white-space: nowrap;
				}
			}
		}
		.history{
			margin-top: 64rpx;
			.history-title{
				display: flex;
				justify-content: space-between;
				padding-bottom: 16rpx;
				border-bottom: 1rpx solid #DCDFE6;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #909399;
			}
			.history-content{
				display: flex;
				justify-content: space-between;
				padding-bottom: 16rpx;
				border-bottom: 1rpx solid #DCDFE6;
				margin-top: 16rpx;
				.history-search-title {
					display: flex;
					align-items: center;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
				}
			}
		}
	}
</style>