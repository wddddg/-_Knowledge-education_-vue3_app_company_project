<template>
	<page>
	<view class="">
		<u-navbar title="联系客服"></u-navbar>
		<view class="setting-box">
			<view class="setting-item" v-for="(item,index) in settingList" :key="index" @click="">
				<view class="setting-item-left">
					<image class="images" :src="item.img" mode="scaleToFill" style="width: 44rpx;height:44rpx;margin-right: 20rpx;" ></image>
					<view class="">
						<view class="setting-title">{{ item.title }}</view>
						<view class="setting-contact">{{item.number}}</view>
					</view>
				</view>
				<view>
					<view class="button" @click="onbutton(item.number)">{{item.buttonText}}</view>
				</view>
			</view>
		</view>
		<view class="feed-back-box">
			<view class="feed-back-title">
				留下您的联系方式
			</view>
			<view class="feed-back-textarea" :style="`background: #${ textareaContent?'FFFFFF':'F6F6F6' };`">
				<u-input type="textarea" v-model="textareaContent" placeholder="请输入文字" :maxlength="99999999"
					:auto-height="false" />
			</view>
			<view class="feed-back-btn-box">
				<view class="feed-back-btn" @click="submitConetent">
					提交
				</view>
			</view>
		</view>
		<ThemePopup :showModal="showMember" title=""  closeText="复制号码" confirmText="保存图片" @closeModal="copy" @confirmModal="save">
			<template #content>
				<view style="display: flex;justify-content: center;margin-bottom: 30rpx;" v-if="showMember"> 
					<u-qrcode ref="qr" canvas-id="qr" :value="content"  :size="88"></u-qrcode>
				</view>
			</template>
		</ThemePopup>
	</view>
	</page>
</template>

<script setup>
	import {
		ref,nextTick
	} from 'vue'
	import {onLoad,onShow,onPullDownRefresh,onReachBottom} from "@dcloudio/uni-app";
	import {addCourseApplyUserConnect,getCourseContactByCourseId} from "../Course.api.ts"
	import ThemePopup from "@/components/ThemePopup.vue"
	onLoad( async(e)=>{
		id = e.id
		await setDetailsById()
	})
	const settingList = ref([
		{
			title: '在线客服',
			buttonText: '进入',
			img:'/static/course/ke-h2x.png',
			number:''
		},
		{
			title: '微信客服',
			buttonText: '复制',
			img:'/static/course/wei-x2x.png',
			number:''
		},
		{
			title: 'QQ客服',
			buttonText: '复制',
			img:'/static/course/qq2x.png',
			number:''
		},
		{
			title: '咨询电话',
			buttonText: '拨打',
			img:'/static/course/lu-j2x.png',
			number:''
		},
		{
			title: '企业微信',
			buttonText: '进入',
			img:'/static/course/qi-wei2x.png',
			number:''
		},
	])
	const textareaContent = ref('')
	let showMember = ref(false)
	let content = ref('')
	let pageData = ref({})
	let id = ref('')
	const qr = ref()
	function setDetailsById(){
		getCourseContactByCourseId({courseId:id}).then(res=>{
			pageData.value = res.result
			// nextTick(()=>{
				settingList.value[0].number = res.result.onlineContactUrl
				settingList.value[1].number = res.result.wechatNumber
				settingList.value[2].number = res.result.qqNumber
				settingList.value[3].number = res.result.contactPhone
				settingList.value[4].number = res.result.enterpriseContactUrl
			// })
		})
	}
	function copy(){
		uni.setClipboardData({
			data: content.value,
			success: function () {
				uni.showToast({
					title:'复制成功'
				})
			}
		})
	}
	function save(){
		qr.value.save({
		  success: () => {
			uni.showToast({
			  icon: 'success',
			  title: '保存成功'
			});
		  }
		})
	}
	function onbutton(e){
		content.value = e
		showMember.value = false
		nextTick(()=>{
			showMember.value = true
		})
		
	}
	const submitConetent = async () => {
		let params = {
			content: textareaContent.value,
		}
		addCourseApplyUserConnect(params).then(res=>{
			uni.showToast({
				title:'提交成功'
			})
		})
	}
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.setting-box {
		padding: 0rpx 40rpx;

		.setting-item {
			padding: 34rpx 0rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #DCDFE6;
			.setting-item-left {
				display: flex;
				align-items: center;
				.setting-title {
					width: 112rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #303133;
				}
				.setting-contact {
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
				}
			}

			.button {
				width: 112rpx;
				height: 60rpx;
				border-radius: 8rpx;
				border: 2rpx solid #395AE1;
				color: #395AE1;
				line-height: 60rpx;
				text-align: center;
			}
			.setting-two-title {
				font-size: 30rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #395AE1;
				margin-right: 24rpx;
				line-height: 40rpx;
			}
		}
	}
	.feed-back-box {
		padding: 0rpx 40rpx;
		position: fixed;
		width: 100%;
		bottom: 50rpx;
		.feed-back-title {
			font-size: 36rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #1B1E27;
			line-height: 50rpx;
			margin: 48rpx 0rpx 32rpx;
		}

		.feed-back-textarea {
			height: 256rpx;
			border-radius: 12rpx;
			border: 2rpx solid #DCDFE6;
			padding: 22rpx 24rpx;
			overflow: hidden;
		}
		.feed-back-btn-box {
			bottom: 76rpx;
			// padding: 0rpx 40rpx;
			width: 100%;
			margin-top: 48rpx;
			.feed-back-btn {
				height: 88rpx;
				background: #395AE1;
				border-radius: 8rpx;
				text-align: center;
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 88rpx;
			}
		}
	}
</style>
