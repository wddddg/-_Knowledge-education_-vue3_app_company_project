<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view>
			<u-navbar title="意见反馈"></u-navbar>
		</view>
		<view class="feed-back-box">
			<view class="feed-back-title">
				您的反馈是我们前进的动力
			</view>
			<view class="feed-back-textarea" :style="`background: #${ textareaContent?'FFFFFF':'F6F6F6' };`">
				<u-input type="textarea" v-model="textareaContent" placeholder="请填写您的问题描述以便我们提供更好地帮助"
					:maxlength="99999999" :auto-height="false" />
			</view>
			<view class="upload-iamge">
				<u-upload ref="uploads" @on-choose-complete="uploadImage" :preview-full-image="false"
					:auto-upload="false" upload-text="添加"></u-upload>
			</view>
			<view class="anonymous-complaint" @click="cancelAnonymous">
				<view class="image-box" :class="isAnonymous?'':'select-anonymous'"
					:style="{background: buttonColor, border: `2rpx solid ${buttonColor}`}">
					<u-image src="@/static/answer.png" :width="28" :height="24"></u-image>
				</view>
				<view class="anonymous-complaint-text">匿名投诉/建议</view>
			</view>
		</view>
		<view class="feed-back-btn-box">
			<view class="feed-back-btn" @click="submitConetent" :style="{background: buttonColor}">
				提交
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad,
		onReady
	} from '@dcloudio/uni-app'
	import baseURL from '@/common/baseURL.js'
	import {
		userAddOpinion
	} from './Personal.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const imgUrlList = ref([])
	const isAnonymous = ref(true)
	const textareaContent = ref('')
	const locking = ref(true)
	const uploads = ref(null)
	const cancelAnonymous = () => {
		isAnonymous.value = !isAnonymous.value
	}
	const submitConetent = async () => {
		let params = {
			content: textareaContent.value,
			imgUrlList: [...imgUrlList.value],
			isSign: isAnonymous.value ? 1 : 0,
		}
		if (locking.value) {
			if (!params.content) {
				return uni.showToast({
					icon: 'none',
					title: '请输入您要反馈的内容'
				})
			}
			await userAddOpinion(params).then(res => {
				if (res.code === 200) {
					uni.showToast({
						title: '反馈已提交',
						duration: 2000
					});
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}
			})
		}
		locking.value = false
	}
	const uploadImage = async (file) => {
		const formData = new FormData()
		formData.append('file', file[0].file)
		uni.uploadFile({
			url: baseURL + '/api/common/upload',
			file: file[0].file,
			formData,
			header: {
				token: uni.getStorageSync("user").token,
				"X-Access-Token": uni.getStorageSync("user").token
			},
			success: (res) => {
				let data = JSON.parse(res.data)
				imgUrlList.value.push(data.message)
			}
		})
	}
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.feed-back-box {
		padding: 0rpx 40rpx;

		.feed-back-title {
			font-size: 36rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #1B1E27;
			line-height: 50rpx;
			margin: 48rpx 0rpx 32rpx;
		}

		.feed-back-textarea {
			height: 400rpx;
			border-radius: 12rpx;
			border: 2rpx solid #DCDFE6;
			padding: 22rpx 24rpx;
			overflow: hidden;
		}

		.upload-iamge {
			margin-top: 40rpx;
		}

		.anonymous-complaint {
			margin-top: 64rpx;
			display: flex;
			align-items: center;

			.image-box {
				width: 40rpx;
				height: 40rpx;
				border-radius: 8rpx;
				padding: 0rpx 3rpx;
			}

			.anonymous-complaint-text {
				margin-left: 16rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 40rpx;
			}
		}
	}

	.select-anonymous {
		border: 1rpx solid #DCDFE6 !important;
		background-color: #fff !important;
	}

	.feed-back-btn-box {
		position: absolute;
		bottom: 76rpx;
		padding: 0rpx 40rpx;
		width: 100%;

		.feed-back-btn {
			height: 88rpx;
			border-radius: 8rpx;
			text-align: center;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
		}
	}

	::v-deep .u-list-item {
		background: #fff;
		margin: 0rpx;
		width: 180rpx !important;
		height: 180rpx !important;
		border-radius: 12rpx;
		border: 2rpx solid #DCDFE6;
		margin-right: 20rpx;
	}
</style>
