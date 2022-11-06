<template>
	<view>
		<view>
			<u-navbar title="写动态"></u-navbar>
		</view>
		<view class="feed-back-box">
			<view class="qingxun" @click="showMask = true" v-if="category==1">
				<view>分类：</view>
				<template v-if="categoryData && categoryData.length == 0">
					请选择分类 <view class="sja"></view>
				</template>
				<view class="tas" v-else>
					<view v-for="(item, index) in categoryData" :key="index">
						<uni-tag :inverted="true" :text="item.text" type="primary" />
					</view>
				</view>
			</view>
			<view class="tank" v-if="showMask">
				<view class="mask" @click="showMask = false"></view>
				<view class="cont">
					<view class="closr" @click="showMask = false"><text>x</text></view>
					<view class="uni-data-checkbox">
						<uni-data-checkbox @change="changeCategory" v-model="categoryIds" :localdata="categoryList"
							selected-color="#395AE1" selected-text-color="#fff" mode="tag"></uni-data-checkbox>
					</view>
					<view class="sure" @click="showMask = false">确定</view>
				</view>
			</view>
			<view class="feed-back-textarea" :style="textareaContent ? 'background: #FFFFFF' : 'background:#F6F6F6'">
				<u-input type="textarea" v-model="textareaContent" placeholder="分享这一刻的动态" :maxlength="99999999"
					:auto-height="false" />
			</view>
			<view class="upload-iamge">
				<u-upload ref="uploads" @on-choose-complete="uploadImage" @on-remove="removeImage"
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
import { systemCategory, pushNews } from '@/community/community.api'
const imgUrlList = ref([])
const isAnonymous = ref(true)
const textareaContent = ref('')
const uploads = ref(null)
const category = ref('')
const cancelAnonymous = () => {
	isAnonymous.value = !isAnonymous.value
}
const oneCateId = ref('')
const categoryList = ref([])
const showMask = ref(false)

onLoad((option) => {
	if (option.category) {
		category.value = option.category
		getSystemCategory()
	}
})
const categoryIds = ref([])
const categoryData = ref([])
// 获取分类
const getSystemCategory = async () => {
	const res = await systemCategory({});
	let tempList = [
		{
			value: '',
			text: "全部"
		}
	]
	res.result && res.result.length > 0 && res.result.map((item) => {
		tempList.push({
			value: item.id,
			text: item.name
		})
	});
	categoryList.value = tempList;
}
// 门店品类改变
const changeCategory = (e) => {
	let value = e.detail.value
	let a = []
	a.push(e.detail.data)
	categoryData.value = a
	oneCateId.value = value
	// if (value.length > 1) {
	// 	let id = value.filter(i => i && i != '')
	// 	oneCateId.value = id
	// 	categoryIds.value = id
	// }
	// if (value.length === 0) {
	// 	oneCateId.value = ['']
	// 	categoryIds.value = ['']
	// }
}

const submitConetent = async () => {

	let params = {
		category: category.value, // 
		oneCateId: oneCateId.value,// 1、答疑文章
		content: textareaContent.value,
		// isSign: isAnonymous.value ? 1 : 0,
	}
	if (imgUrlList.value && imgUrlList.value.length > 0) {
		params.newsCoverImgVOList = [
			{
				coverImg: imgUrlList.value.toString()
			}
		]
	}
	if (textareaContent.value || imgUrlList.value && imgUrlList.value.length > 0) {
		const res = await pushNews({ ...params });
		if (res.code == 200) {
			textareaContent.value = ''
			imgUrlList.value = []
			uni.navigateTo({
				url: `/community/success`
			})
		}
	} else {
		uni.showToast({
			title: '请填写内容或上传图片！',
			duration: 2000
		});
	}

}
const uploadImage = async (file) => {
	// const formData = new FormData()
	// formData.append('file', file[0].file)
	// console.log(file[0],2222222222);
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

.qingxun {
	font-size: 28rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #303133;
	margin-bottom: 30rpx;
	display: flex;
	justify-content: flex-start;

	.sja {
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 12rpx 12rpx 0 12rpx;
		border-color: #909399 transparent transparent transparent;
		margin-left: 10rpx;
		margin-top: 18rpx;
	}

	>view {
		margin-right: 20rpx;
	}

	.tas {
		display: flex;
		flex-wrap: wrap;
		margin-right: 0;
		width: 84%;

		>view {
			margin-left: 16rpx;
			margin-bottom: 20rpx;
		}
	}
}

.tank {
	width: 100%;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	z-index: 99;
	height: 100vh;
	overflow: hidden;

	.mask {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		z-index: 22;
		left: 0;
		right: 0;
		top: 282rpx;
		background: rgba($color: #000000, $alpha: .6);
	}

	.closr {
		width: 28rpx;
		height: 28rpx;
		padding-left: 6rpx;
		padding-bottom: 16rpx;
		color: #fff;
		background: rgba($color: #000000, $alpha: .7);
		position: absolute;
		right: 0;
		top: 12rpx;
		text-align: center;
		border-bottom-left-radius: 100%;

		>text {
			position: absolute;
			right: 5rpx;
			font-size: 20rpx;
			top: -6rpx;
		}
	}

	.cont {
		position: absolute;
		left: 0;
		right: 0;
		top: 274rpx;
		background: #fff;
		z-index: 33;
		padding: 40rpx;
		border-radius: 0px 0px 12rpx 12rpx;
	}

	.sure {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 72rpx;
		background: #395AE1;
		border-radius: 8rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		margin-top: 20rpx;
	}

	::v-deep .uni-data-checklist .checklist-group .checklist-box {
		min-width: 80rpx !important;
		height: 62upx !important;
		background: #f4f4f4;
		border-radius: 8rpx !important;
		border: none !important;
		font-size: 26rpx;
		box-sizing: border-box;
	}

	::v-deep .uni-data-checklist .checklist-group .checklist-box .checklist-content {
		justify-content: center;
		font-weight: 500;
	}

	::v-deep .uni-data-checklist .checklist-group .checklist-box .checklist-content .checklist-text {
		// font-weight: 600;
		color: #000000 !important;
	}

	::v-deep .uni-stat__select {
		padding: 0 !important;
	}

	::v-deep .uni-data-checklist .checklist-group .is-checked .checklist-content .checklist-text {
		font-weight: 500;
		color: #fff !important;
	}
}
</style>