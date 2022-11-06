<template>
	<view class="container" :style="{'--theme-color':themeColor}">
		<u-navbar :is-back="true" title="我的发帖"></u-navbar>
		<view class="myPost1">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" :style-type="'text'"/>
		</view>
		<MyPersonal :status="current"/>
	</view>
</template>

<script setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, getCurrentInstance } from "vue"
import { setTab } from "@/common/app-utils.js"
import MyPersonal from '@/community/components/MyPersonal.vue'
const themeColor = ref(uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe')
onLoad(() => {
	// setTab()
})
// onShow(() => {
// 	getSearch()
// })
const current = ref(0)
const items = ref(['已上线', '审核中', '未通过'])
const activeColor = ref('#395AE1')
const communityList = ref([])
const triggered = ref(false)
const noMore = ref(true)
const page = ref(1)
const loadingText = ref('— 没有更多了 —')
const params = ref({})


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
::v-deep uni-page{
	overflow: hidden;
}
.myPost1 {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: $uni-bg-color;
	position: fixed;
	left: 0;
	right: 0;
	z-index: 12;
	padding: 10rpx 30rpx 0;
	height: 88rpx;
	box-sizing: border-box;
	font-size: 24rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	color: $u-tips-color;
	box-shadow: 0px 10px 20px 0px rgba(0,0,0,0.1);
	border-bottom: 2rpx solid $u-form-item-border-color;
	::v-deep .segmented-control--text{
		display: flex!important;
		align-items: center!important;
		justify-content: space-between!important;
		width: 92vw!important;
		margin: 0 auto;
	}
	::v-deep .segmented-control__item{
		width: 33%!important;
		display: flex!important;
    align-items: center!important;
    justify-content: center!important;
    flex-shrink: 0!important;
    flex: none!important;
	}
	::v-deep .segmented-control__text{
		font-weight: normal!important;
		color: $u-tips-color!important;
		font-size: 24rpx!important;
	}
	::v-deep .segmented-control__item--text{
		// color: $u-main-color!important;
		color: $u-type-primary!important;
		font-size: 28rpx!important;
	}
}

.popup-conten {
	display: flex;
	align-items: center;
	justify-content: space-around;
	background: $uni-bg-color;
	padding: 100rpx 60rpx 140rpx;

	.list-rigt {
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		text-align: center;
		color: $u-main-color;
		display: flex;
		flex-direction: column;

		image {
			width: 88rpx;
			height: 88rpx;
			margin: 0 auto 20rpx;
		}
	}

	.popup-close {
		position: absolute;
		right: 40rpx;
		top: 40rpx;
	}
}

.container {
	background: #fff;
	width: 100%;
	height: 100vh;
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
	padding-top: 90rpx;
	padding-bottom: 26rpx;
	.f-tops{
		position: fixed;
		z-index: 99;
		left: 0;
		right: 0;
		background: #fff;
		padding: 30rpx;
		margin-top: 0;
	}
	.content {
		margin-top: 40rpx;
		padding-top: 110rpx;
	}

	.list-item {
		margin-bottom: 26rpx;

		.list-top {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-bottom: 26rpx;

			.ima {
				font-size: 28rpx;
				font-weight: 800;
				color: $u-main-color;
				display: flex;
				position: relative;

				.date {
					font-size: 24rpx;
					font-weight: 400;
					color: $u-tips-color;
					margin-top: 8rpx;
				}
				.img-ct{
					display: flex;
					position: relative;
				}
				image {
					width: 56rpx;
					height: 56rpx;
					border: 2rpx solid $u-form-item-border-color;
					border-radius: $uni-border-radius-circle;
					margin-right: 20rpx;
				}
				.vip1{
					border: 2rpx solid #F9C58D;
				}
				.vip{
					position: absolute;
					bottom: 22rpx;
					right: 2rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}

			.zhiding {
				color: #EE5142;
				border-radius: 4rpx;
				border: 2rpx solid #EE5142;
				font-size: 24rpx;
				padding: 1rpx 6rpx 2rpx;
				display: flex;
				align-items: center;
			}

			.aut {
				display: flex;
				align-items: center;

				.zhiding {
					color: $u-type-primary;
					border-radius: 4rpx;
					border: 2rpx solid $u-type-primary;
					font-size: 24rpx;
					padding: 1rpx 6rpx 2rpx;
					display: flex;
					align-items: center;
					margin-left: 16rpx;
				}
			}
		}

		.list-cot {
			max-height: 240rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: $u-main-color;
			line-height: 48rpx;
			margin-bottom: 20rpx;
			overflow: hidden;
		}

		.list-bom {
			border-bottom: 2rpx solid $u-form-item-border-color;
			padding-bottom: 26rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24rpx;
			font-weight: 400;
			color: $u-tips-color;

			.list-lft {
				display: flex;
				align-items: center;

				image {
					width: 24rpx;
					height: 24rpx;
					margin-right: 10rpx;
				}
			}

			.list-rigt {
				display: flex;
				align-items: center;
				margin-left: 30rpx;

				image {
					width: 32rpx;
					height: 32rpx;
					margin-right: 10rpx;
				}
			}
		}

		.list-cot-image {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			overflow: hidden;

			image {
				width: 204rpx;
				height: 156rpx;
				border-radius: 8rpx;
				margin-left: 30rpx;

				&:first-child {
					margin: 0;
				}
			}
		}

		.pingl {
			padding: 24rpx;
			background: #F6F6F6;
			border-radius: 12rpx;

			.p-list {
				.list-top {
					margin-bottom: 20rpx;

					.p-cot {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: $u-content-color;
						line-height: 40rpx;
					}
				}
			}

			.more {
				color: $u-type-primary;
				font-size: 24rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
		}
		&:last-child{
			.list-bom {
				border-bottom: none;
			}
		}
	}
}
</style>
