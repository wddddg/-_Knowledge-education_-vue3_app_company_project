<template>
	<u-modal v-model="showModal" :title="title" :show-confirm-button="false" :mask-close-able="true" @input="closeModal">
		<template #default>
			<view class="modal-content-text">{{ content }}</view>
			<view class="modal-content-btn">
				<view class="modal-content-btn-two" v-if="showCancelBtn">
					<view class="modal-content-btn-cancel" @click="closeModal">取消</view>
					<view class="modal-content-btn-confirm" @click="confirmModal">确定</view>
				</view>
				<view class="modal-content-btn-only" v-else>
					<view class="modal-content-btn-only-confirm" @click="confirmModal">{{confirmText}}</view>
				</view>
			</view>
		</template>
	</u-modal>
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
		}
	})
	const emit = defineEmits()
	const closeModal = () =>{
		emit('closeModal')
	}
	const confirmModal = () =>{
		emit('confirmModal')
	}
</script>

<style scoped lang="scss">
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
		padding: 0rpx 40rpx 40rpx;
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
				background: #C0C7D1;
				border-radius: 8rpx;
				text-align: center;
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 80rpx;
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
</style>
