<template>
	<view>
		<u-navbar title="课程评价"></u-navbar>
	</view>
	<view class="feed-back-box">
		<view class="feed-back-textarea" :style="`background: #${ textareaContent?'FFFFFF':'F6F6F6' };`">
			<u-input type="textarea" v-model="textareaContent" placeholder="请输入评价..." :maxlength="99999999"
				:auto-height="false" />
		</view>
		<view class="feed-back-title">
			课程评价
		</view>
		<uni-rate  activeColor="#E85535" disabledColor="#E85535"  size="30" v-model="score" />
	</view>
	<view class="feed-back-btn-box">
		<view class="feed-back-btn" @click="submitConetent">
			发表
		</view>
	</view>
</template>

<script setup>
import {
	ref
} from 'vue'
import {
	onLoad,
	onReady,
	onUnload
} from '@dcloudio/uni-app'
import baseURL from '@/common/baseURL.js'
import {addCourseComment} from "../Course.api.ts"
onLoad((e)=>{
	id = e.id
})
onUnload(()=>{
	uni.$emit('courseDataUpdate')
})
const imgUrlList = ref([])
const isAnonymous = ref(true)
const textareaContent = ref('')
const uploads = ref(null)
let score = ref(0)
let id = ''
const cancelAnonymous = () => {
	isAnonymous.value = !isAnonymous.value
}
const submitConetent = async () => {
	let params = {
		commentType: 1,
		complexScore: score.value,
		content: textareaContent.value,
		courseId: id,
	}
	addCourseComment(params).then(res=>{
		debugger
		if(res.code == 200){
			uni.navigateBack()
		}
	})
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
		margin-top: 40rpx;
	}

	.feed-back-title {
		font-size: 36rpx;
		font-family: PingFang-SC-Heavy, PingFang-SC;
		font-weight: 800;
		color: #1B1E27;
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
