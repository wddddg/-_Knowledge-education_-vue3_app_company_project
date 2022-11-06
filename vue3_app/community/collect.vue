<template>
	<view class="container" :style="{'--theme-color':themeColor}">
		<u-navbar :is-back="true" title="我的收藏"></u-navbar>
		<view class="community">
			<view class="uni-padding-wrap f-tops">
				<uni-segmented-control :current="current" :values="items" :style-type="'button'" :active-color="activeColor"
					@clickItem="onClickItem" />
			</view>
			<view class="uni-padding-wrap content">
				<view v-if="current === 0">
					<Public :myCollect="true"/>
				</view>
				<view v-if="current === 1">
					<Question :myCollect="true"/>
				</view>
				<view v-if="current === 2">
					<New :myCollect="true"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, getCurrentInstance } from "vue"
import { setTab } from "@/common/app-utils.js"
import Public from '@/community/components/Public.vue' // 广场
import Question from '@/community/components/Question.vue' //答疑
import New from '@/community/components/New.vue' // 资讯
const themeColor = ref(uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe')
onLoad(() => {
	setTab()
})
// onShow(() => {
// 	getSearch()
// })
const current = ref(0)
const items = ref(['广场', '答疑', '资讯'])
const activeColor = ref('#395AE1')
const communityList = ref([])
const triggered = ref(false)
const noMore = ref(true)
const showMenu  = ref(false)
const page = ref(1)
const loadingText = ref('— 没有更多了 —')
const params = ref({})


// 页面跳转
const commonHandleTo = (url) => {
	uni.navigateTo({
		url
	})
}

const onClickItem = (e) => {
	if (current.value != e.currentIndex) {
		current.value = e.currentIndex;
	}
}

</script>

<style lang="scss" scoped>

::v-deep uni-page-body {
	background: $uni-bg-color !important;
}

::v-deep uni-page {
	overflow: hidden;
}

.container {
	background: #fff;
	width: 100%;
	height: 100vh;
	overflow: hidden;
}
.loadingText {
	padding: 20rpx 0 40rpx 0;
	text-align: center;
	color: #969799;
	font-size: 26rpx;
}

.no-data {
	padding: 80px 40rpx 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26upx;
	color: #969799;
	flex-direction: column;

	image {
		width: 320rpx;
		height: 320rpx;
	}

	view {
		margin-top: 30rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: $u-content-color;
	}
}

.community {
	.f-tops {
		position: fixed;
		z-index: 99;
		left: 0;
		right: 0;
		background: #fff;
		padding: 30rpx;
		margin-top: 0;
	}

	.content {
		padding-top: 150rpx;
	}
}

::v-deep .segmented-control--button {
	border-color: #395AE1;
}

::v-deep .segmented-control__text {
	color: $u-content-color !important;
}

::v-deep .segmented-control__item--button--active .segmented-control__text {
	color: $uni-text-color-inverse !important;
}

::v-deep .segmented-control__item--button--active {
	background: linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%) !important;
}
</style>
