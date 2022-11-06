<template>
	<u-popup v-model="showModal" mode="center" :show-confirm-button="false" :mask-close-able="false" :custom-style="{background:'transparent',overflow:'visible'}" border-radius="12">
		<view class="popup">
			<view class="backgroundImg">
				<view class="modal-content-title">{{title}}</view>
				<scroll-view :style="'height: 400rpx'"
				  @refresherrefresh="refresherrefresh" @scrolltolower="onReachBottoms" class="scroll-Y"
				  :refresher-triggered="triggered" :scroll-y="true" :refresher-threshold="45" :scroll-anchoring="true"
				  >
					<view class="modal-content-text">{{content}}</view>
				</scroll-view>
				<view class="modal-content-btn">
					<view class="modal-content-btn-two" v-if="showCancelBtn">
						<view class="modal-content-btn-cancel" @click="closeModal">{{closeText}}</view>
						<view class="modal-content-btn-confirm" @click="confirmModal">{{confirmText}}</view>
					</view>
					<view class="modal-content-btn-only" v-else>
						<view class="modal-content-btn-only-confirm" @click="confirmModal">{{confirmText}}</view>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup>
	import {
		ref,
		watch,
		defineProps,
		defineEmits
	} from 'vue'
	import {getNewVersion} from "@/common/commonApi.ts"
	// const props =  defineProps({
	// 	showModal:{
	// 		type:Boolean,
	// 		default: false
	// 	},
	// 	title:{
	// 		type:String,
	// 		default: () =>{
	// 			return '新版本特性'
	// 		}
	// 	},
	// 	content:{
	// 		type:String,
	// 		default: () =>{
	// 			return ''
	// 		}
	// 	},
	// 	showCancelBtn:{
	// 		type:Boolean,
	// 		default: true
	// 	},
	// 	confirmText:{
	// 		type:String,
	// 		default: () =>{
	// 			return '立即升级'
	// 		}
	// 	},
	// 	closeText:{
	// 		type:String,
	// 		default: () =>{
	// 			return '下次再说'
	// 		}
	// 	}
	// })
	
	const emit = defineEmits()
	const closeModal = () =>{
		showModal.value = false
		emit('closeModal')
	}
	const confirmModal = () =>{
		// #ifdef APP-PLUS
			plus.runtime.openURL(versionData.value.downUrl);
		// #endif
		emit('confirmModal')
	}
	let title = ref('新版本特性')
	let content = ref('')
	let showModal = ref()
	let confirmText = ref('立即升级')
	let closeText  = ref('下次再说')
	let versionData = ref()
	let showCancelBtn = ref(true)
	
	let useDevice = uni.getStorageSync('useDevice')
	if (useDevice.osName == 'android') {
		useDevice = 1
	} else {
		useDevice = 0
	}
	getNewVersion({type:useDevice}).then(res=>{
		versionData.value = res.result
		// #ifdef APP-PLUS
			let appVersion  = 0.0
			plus.runtime.getProperty(plus.runtime.appid,(appInfo)=>{
				// appInfo为当前应用程序的所有信息
				console.log(appInfo);
				appVersion = appInfo.version
				if(res.result.version > appVersion){
					if(res.result.isElide == 1){
						showCancelBtn.value = false
					}
					content.value = res.result.dispersion
					showModal.value = true
				}
				console.log(res.result,res.result.isElide,appVersion,'APPupdate');
			});
		// #endif
		// showModal.value = true
	})
</script>

<style scoped lang="scss">
.popup {
	background: transparent;
	width: 500rpx;
	overflow: visible;
	.backgroundImg{
		margin-top: -30rpx;
		width: 100%;
		height: 776rpx;
		background: transparent url(@/static/app-plus/sheng-j@2x.png) no-repeat;
		background-size: contain;
		padding: 0 15rpx;
		padding-top: 228rpx;
	}
	.modal-content-title {
		height: 30rpx;
		font-size: 32rpx;
		font-family: PingFang-SC-Heavy, PingFang-SC;
		font-weight: 800;
		color: #1B1E27;
		// text-align: center;
	}
	.modal-content-text {
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #606266;
		line-height: 40rpx;
		// text-align: center;
		margin: 32rpx 0rpx 40rpx;
	}

	.modal-content-btn {
		.modal-content-btn-only-confirm{
			height: 80rpx;
			background: #395AE1;
			border-radius: 8rpx;
			text-align: center;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 80rpx;
			width: 100%;
		}
		.modal-content-btn-two{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.modal-content-btn-cancel {
				width: 224rpx;
				height: 80rpx;
				background: #fff;
				border-radius: 8rpx;
				text-align: center;
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #395AE1;
				line-height: 80rpx;
				border: 2rpx solid #395AE1;
			}
			
			.modal-content-btn-confirm {
				width: 224rpx;
				height: 80rpx;
				background: #395AE1;
				border-radius: 8rpx;
				text-align: center;
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 80rpx;
			}
		}
		
	}
	
}
</style>
