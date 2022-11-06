<template>
	<u-popup v-model="showModal" mode="center" :show-confirm-button="false" :mask-close-able="true"  border-radius="12" closeable @close="close">
		<view class="popup">
			<view class="modal-content-title">{{title}}</view>
			<slot name="content"></slot>
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
	</u-popup>
</template>

<script setup>
	import {
		ref,
		watch,
		defineProps,
		defineEmits
	} from 'vue'
	defineProps({
		showModal:{
			type:Boolean,
			default: false
		},
		title:{
			type:String,
			default: () =>{
				return '温馨提示'
			}
		},
		content:{
			type:String,
			default: () =>{
				return ''
			}
		},
		showCancelBtn:{
			type:Boolean,
			default: true
		},
		confirmText:{
			type:String,
			default: () =>{
				return '确定'
			}
		},
		closeText:{
			type:String,
			default: () =>{
				return '取消'
			}
		}
	})
	const emit = defineEmits()
	const closeModal = () =>{
		emit('closeModal')
	}
	const confirmModal = () =>{
		emit('confirmModal')
	}
	const close = () =>{
		emit('close')
	}
</script>

<style scoped lang="scss">
.popup {
	margin: 40rpx;
	width: 500rpx;
	.modal-content-title {
		// height: 30rpx;
		font-size: 32rpx;
		font-family: PingFang-SC-Heavy, PingFang-SC;
		font-weight: 800;
		color: #1B1E27;
		text-align: center;
		margin-bottom: 10rpx;
	}
	.modal-content-text {
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #606266;
		line-height: 40rpx;
		text-align: center;
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
