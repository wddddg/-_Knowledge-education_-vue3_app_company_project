<template>
	<view class="container" :style="{ '--theme-color': themeColor }">
		<u-navbar :is-back="false" title="社区">
			<view class="navbar" slot="right">
				<view class="rit">
					<image src="@/static/community/search@2x.png" mode="aspectFit"
						@click.stop="commonHandleTo('/community/search')" />
					<image src="@/static/community/my@2x.png" mode="aspectFit" @click="showMenu = !showMenu" />
					<view class="yuand" v-if="userInfo.isReplyReadStatus == 1 || userInfo.isGoodReadStatus == 1"></view>
				</view>
			</view>
		</u-navbar>
		<!-- #ifndef H5 -->
		<view class="h5-navbar">
			<view class="btn">
				<!-- <image src="@/static/community/back.png" mode="aspectFit" /> -->
			</view>
			<view class="tit">社区</view>
			<view class="rit">
				<image src="@/static/community/search@2x.png" mode="aspectFit" @click="commonHandleTo('/community/search')" />
				<image src="@/static/community/my@2x.png" mode="aspectFit" @click="showMenu = !showMenu" />
				<view class="yuand" v-if="userInfo.isReplyReadStatus == 1 && userInfo.isGoodReadStatus == 1"></view>
			</view>
		</view>
		<!-- #endif -->
		<view class="mask2" v-if="showMenu">
			<view class="sanjx"></view>
			<view class="user">
				<image src="@/static/user/user-avatar.png" v-if="!userInfo.authorImg" />
				<image :src="userInfo.authorImg" v-else />
				<view>{{ userInfo.authorName ? userInfo.authorName : '未登录' }}</view>
			</view>
			<view class="list-menu" @click.stop="commonHandleTo('/community/myReply')">
				<image class="img32" src="@/static/community/pl@2x.png" mode="aspectFit" />
				<view>
					我的回复
					<view class="yuand" v-if="userInfo.isReplyReadStatus == 1"></view>
				</view>
			</view>
			<view class="list-menu" @click.stop="commonHandleTo('/community/collect')">
				<image class="img32" src="@/static/community/sc@2x.png" mode="aspectFit" />
				<view>
					我的收藏
				</view>
			</view>
			<view class="list-menu" @click.stop="commonHandleTo('/community/myLike')">
				<image class="img32" src="@/static/community/dz@2x.png" mode="aspectFit" />
				<view>
					收到的赞
					<view class="yuand" v-if="userInfo.isGoodReadStatus == 1"></view>
				</view>
			</view>
			<view class="list-menu" @click.stop="commonHandleTo('/community/myPost')">
				<image class="img32" src="@/static/community/edit@2x.png" mode="aspectFit" />
				<view>
					我的发帖
				</view>
			</view>
		</view>
		<view class="community" @click="showMenu = false">
			<view class="uni-padding-wrap f-tops">
				<uni-segmented-control :current="current" :values="items" :style-type="'button'" :active-color="activeColor"
					@clickItem="onClickItem" />
			</view>
			<view class="uni-padding-wrap content">
				<view v-if="current === 0">
					<Public :refresher="hackReset" v-if="hackReset" />
				</view>
				<view v-if="current === 1">
					<Question :showNav="true" :refresher="hackReset" v-if="hackReset" />
				</view>
				<view v-if="current === 2">
					<New :showNav="true" :refresher="hackReset" v-if="hackReset" />
				</view>
			</view>
		</view>
		<Release :current="current" />
		<BottomTabbar :pagePath="'pages/community/index'" />
	</view>
</template>

<script setup>
import { onLoad, onShow, onHide } from "@dcloudio/uni-app";
import { ref, getCurrentInstance } from "vue"
import { setTab } from "@/common/app-utils.js"
import Release from './components/Release.vue'
import Public from './components/Public.vue' // 广场
import Question from './components/Question.vue' //答疑
import New from './components/New.vue' // 资讯
import BottomTabbar from "@/components/BottomTabbar.vue"
import { getNewsUserDetails } from './community.api'
const themeColor = ref(uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe')
onLoad(async () => {
	// setTab()
	uni.hideTabBar()
})
const current = ref(0)
const items = ref(['广场', '答疑', '资讯'])
const activeColor = ref('#395AE1')
const showMenu = ref(false)
const hackReset = ref(false)
const userInfo = ref({})
uni.stopPullDownRefresh()
onShow(() => {
	getUser()
	hackReset.value = true
})
onHide(() => {
	hackReset.value = false
})

// 页面跳转
const commonHandleTo = (url) => {
	showMenu.value = false
	uni.navigateTo({
		url
	})
}
const onClickItem = (e) => {
	if (current.value != e.currentIndex) {
		current.value = e.currentIndex;
	}
}
const getUser = async () => {
	await getNewsUserDetails().then(res => {
		userInfo.value = res.result
	})
}

</script>

<style lang="scss" scoped>
.yuand {
	width: 12rpx;
	height: 12rpx;
	background: #EE5142;
	position: absolute;
	border-radius: 100%;
	right: 2rpx;
	top: 4rpx;
}

.mask2 {
	position: fixed;
	right: 30rpx;
	background-color: rgba($color: #000000, $alpha: .9);
	padding-left: 32rpx;
	z-index: 999;
	color: #fff;
	border-radius: 8rpx;

	.sanjx {
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 20rpx 20rpx 20rpx;
		border-color: transparent transparent rgba($color: #000000, $alpha: .9) transparent;
		position: absolute;
		right: 16rpx;
		top: -16rpx;
	}

	.list-menu {
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		font-size: 26rpx;

		>view {
			padding: 0 80rpx 26rpx 40rpx;
			margin-bottom: 26rpx;
			border-bottom: 2rpx solid rgba($color: #fff, $alpha: .1);
			position: relative;

			.yuand {
				right: 64rpx;
				top: 6rpx;
			}
		}

		&:last-child {
			>view {
				border: none
			}
		}
	}

	.img32 {
		width: 32rpx;
		height: 32rpx;
	}

	.user {
		padding: 40rpx 0;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-weight: bold;

		image {
			width: 56rpx;
			height: 56rpx;
			// border: 2rpx solid $u-form-item-border-color;
			border-radius: $uni-border-radius-circle;
			margin-right: 20rpx;
		}
	}
}

::v-deep uni-page-body {
	background: $uni-bg-color !important;
}

::v-deep uni-page {
	overflow: hidden;
}

.navbar {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	width: 100%;
	.rit {
		display: flex;
		align-items: center;
		position: relative;
		/* #ifdef H5 */
		margin-right: 40rpx;
		/* #endif */

		image {
			width: 40rpx;
			height: 40rpx;
			margin-left: 40rpx;

			&:first-child {
				margin: 0;
			}
		}
	}
}

.container {
	background: #fff;
	width: 100%;
	height: 90vh;
	overflow: hidden;
}

.fab {
	width: 174rpx;
	height: 88rpx;
	background: rgba($color: #C4CEF6, $alpha: .9);
	border-radius: 100px 0px 0px 100px;
	position: fixed;
	right: 0;
	bottom: 9vh;
	display: flex;
	align-items: center;

	.btn {
		width: 72rpx;
		height: 72rpx;
		border-radius: $uni-border-radius-circle;
		background: #395AE1;
		margin-left: 10rpx;
	}

	.fan {
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 600;
		color: #395AE1;
		margin-left: 14rpx;
	}
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
	padding-bottom: 26rpx;

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
		padding-top: 140rpx;
		// overflow-y: scroll;
		min-height: 70vh;
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

.h5-navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: $uni-bg-color;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	z-index: 12;
	padding: 20rpx 30rpx;
	font-size: 36rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 600;
	color: #1B1E27;
	border-bottom: 2rpx solid $u-form-item-border-color;

	image {
		height: 36rpx;
		width: 24rpx;
	}

	.tit {
		margin-left: 40rpx;
	}

	.rit {
		display: flex;
		align-items: center;
		position: relative;

		image {
			width: 40rpx;
			height: 40rpx;
			margin-left: 40rpx;

			&:first-child {
				margin: 0;
			}
		}
	}
}
</style>
