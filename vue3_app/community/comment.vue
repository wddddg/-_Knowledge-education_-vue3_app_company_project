<template>
	<view>
		<view>
			<u-navbar title="写评论"></u-navbar>
		</view>
		<view class="feed-back-box">
			<view class="feed-back-textarea" :style="textareaContent ? 'background:#FFFFFF' : 'background:#F6F6F6'">
				<u-input type="textarea" v-model="textareaContent" placeholder="请填写评论" :maxlength="99999999"
					:auto-height="false" />
			</view>
			<view class="upload-iamge">
				<u-upload ref="uploads" @on-remove="removeImage" @on-choose-complete="uploadImage"
					:preview-full-image="false" :auto-upload="false" upload-text="添加"></u-upload>
			</view>
		</view>
		<view class="feed-back-btn-box">
			<view class="feed-back-btn" :class="{ 'feed-back-act': textareaContent || imgUrlList.length > 0 }"
				@click="submitConetent">发布</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import baseURL from '@/common/baseURL.js'
import { pushComment } from '@/community/community.api'
const imgUrlList = ref([])
const isAnonymous = ref(true)
const textareaContent = ref('')
const uploads = ref(null)
const newsId = ref('')
const parentCommentId = ref('')
onLoad((option) => {
	if (option.newsId) {
		newsId.value = option.newsId
	}
	if (option.parentCommentId) {
		//一级评论id（若为第二级则传上一级，id一级不填写）
		parentCommentId.value = option.parentCommentId
	}
})
const cancelAnonymous = () => {
	isAnonymous.value = !isAnonymous.value
}
const submitConetent = async () => {
	let params = {
		content: textareaContent.value,
		// imgUrlList: [...imgUrlList.value],
		// isSign: isAnonymous.value ? 1 : 0,
		newsId: newsId.value,
		parentCommentId: parentCommentId.value || '',//一级评论id（若为第二级则传上一级，id一级不填写）
	}
	if (imgUrlList.value && imgUrlList.value.length > 0) {
		params.newsCoverImgVOList = [
			{
				coverImg: imgUrlList.value.toString()
			}
		]
	}
	if (textareaContent.value || imgUrlList.value && imgUrlList.value.length > 0) {
		const res = await pushComment({ ...params });
		if (res.code == 200) {
			textareaContent.value = ''
			imgUrlList.value = []
			uni.navigateBack({
				delta: 1// 返回层数，2则上上页
			})
			// uni.navigateTo({
			// 	url: `/community/success`
			// })
		}
	} else {
		uni.showToast({
			title: '请填写内容或上传图片！',
			duration: 2000
		});
	}

	// uni.uploadFile({
	// 	url: baseURL + '/api/userCenter/userAddOpinion',
	// 	formData: { newsCommentApiDTO: params },
	// 	header: {
	// 		token: uni.getStorageSync("user").token,
	// 		"X-Access-Token": uni.getStorageSync("user").token
	// 	},
	// 	success: (res) => {
	// 		let data = JSON.parse(res.data)
	// 		if (data.code) {
	// 			textareaContent.value = ''
	// 			imgUrlList.value = ''
	// 			uni.navigateTo({
	// 				url: `/community/success`
	// 			})
	// 		}
	// 	}
	// })
}
const uploadImage = async (file) => {
	// const formData = new FormData()
	// formData.append('file', file[0].file)
	uni.uploadFile({
		url: baseURL + '/api/common/upload',
		filePath: file[0].url,
		fileType: 'image',
		name: "file",
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

const removeImage = (index, lists) => {
	imgUrlList.value = []
	lists && lists.length > 0 && lists.map((item) => {
		imgUrlList.value.push(item.url)
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
	padding: 40rpx 40rpx 0;

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
			background: #395AE1;
			border-radius: 8rpx;
			border: 2rpx solid #395AE1;
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
		background: $uni-text-color-disable;
		border-radius: 8rpx;
		text-align: center;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 88rpx;
	}

	.feed-back-act {
		background: $u-type-primary;
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
