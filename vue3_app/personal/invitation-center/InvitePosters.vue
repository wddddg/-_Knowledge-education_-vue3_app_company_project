<template>
	<view class="invitation-posters-bg-color" :style="`background: url(${backgroundUrl});`">
		<u-navbar title="邀请海报" back-icon-color="#fff" title-color="#fff" :border-bottom="false"
			:background="{ background: 'Clear' }">
		</u-navbar>
		<swiper class="swiper-box-list" :indicator-dots="false" :autoplay="false" :circular="true" :current="current"
			previous-margin="100rpx" next-margin="100rpx" @change="changeCurrentSwiper">
			<swiper-item class="swiper-box-item" v-for="(item,index) in swiperList" :key="index"
				:class="current === index? 'current-swiper-height' : 'other-swiper-height'">
				<view class="QR-code-item" :style="{bottom: current === index?'100rpx':'142rpx'}">
					<u-qrcode :ref="qrCode" :canvas-id="('qr' + (index + 1))" :value="item.inviteUrl || item.imgUrl"
						:size="55"></u-qrcode>
				</view>
				<view class="swiper-box-item-image" :style="{marginTop:current === index?'':'94rpx'}">
					<u-image :src="item.imgUrl" mode="" :width="520" :height="current === index? 636 : 448"></u-image>
				</view>
			</swiper-item>
		</swiper>
	</view>
	<view class="invitation-posters-content">
		用户扫码注册后即可完成绑定
	</view>
	<view class="invitation-posters-link-box"></view>
	<view class="invitation-posters-link">
		<button open-type="share">
			<view class="invitation-posters-link-item" @click="shareInfo(WXSceneSession)">
				<u-image src="@/static/wechat-logo.png" :width="88" :height="88"></u-image>
				<label>微信好友</label>
			</view>
		</button>
		<view class="invitation-posters-link-item" @click="shareInfo(WXSceneTimeline)">
			<u-image src="@/static/friends-logo.png" :width="88" :height="88"></u-image>
			<label>朋友圈</label>
		</view>
		<view class="invitation-posters-link-item" @click="downCurrentImage">
			<u-image src="@/static/download-logo.png" :width="88" :height="88"></u-image>
			<label>保存到相册</label>
		</view>
		<view class="invitation-posters-link-item" @click="getInvitePostersLink">
			<u-image src="@/static/link-logo.png" :width="88" :height="88"></u-image>
			<label>复制链接</label>
		</view>
	</view>
	<view class="" style="visibility: hidden; position: absolute; top: 0;">
		<canvas canvas-id="myCanvas" class="my-canvas"></canvas>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShareAppMessage,
		onShareTimeline
	} from "@dcloudio/uni-app";
	import {
		nextTick,
		ref
	} from 'vue'
	import {
		getUserRetailRuleDetails,
		listForRetailPosterImg
	} from '../Personal.api.ts'
	const phoneType = uni.getSystemInfoSync().uniPlatform
	const backgroundUrl = ref('')
	const swiperList = ref([])
	const swiperRef = ref(null)
	const current = ref(0)
	const canvasShow = ref(true)
	const currentQrCode = ref({})
	const buttonLink = ref(null)
	const changeCurrentSwiper = (e) => {
		current.value = e.detail.current
	}
	const getInvitePostersLink = () => {
		uni.setClipboardData({
			data: swiperList?.value[current.value]?.inviteUrl || swiperList?.value[current.value]?.imgUrl,
			success: function() {
				uni.showToast({
					title: '复制成功',
					icon: "success"
				})
			}
		})
	}

	const qrCode = (e) => {
		if (e) {
			currentQrCode.value = e
		}
	}
	const shareInfo = (shareType) => {
		if (phoneType === 'app') {
			let cxt = uni.createCanvasContext('myCanvas')
			currentQrCode.value.toTempFilePath({
				success: (res) => {
					cxt.drawImage(swiperList?.value[current.value]?.posterBaseUrl || 0, 0, 0, 260, 318)
					cxt.drawImage(res.tempFilePath, 162, 214, 55, 55)
				}
			})
			cxt.draw(true, () => {
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					success: (res) => {
						uni.downloadFile({
							url: res
								.tempFilePath,
							success: (rets) => {
								if (rets.statusCode === 200) {
									uni.share({
										provider: 'weixin',
										type: 2,
										imageUrl: rets.tempFilePath,
										scene: shareType,
										success: function(res) {
											uni.showToast({
												title: '分享成功',
												icon: 'success'
											})
										},
										fail: function(err) {
											uni.showToast({
												title: '分享失败',
												icon: 'error'
											})
										}
									})
								}
							}
						})
					}
				})
			})
		}
	}
	const downCurrentImage = async () => {
		let cxt = uni.createCanvasContext('myCanvas')
		currentQrCode.value.toTempFilePath({
			success: (res) => {
				cxt.drawImage(swiperList?.value[current.value]?.posterBaseUrl || 0, 0, 0,
					260, 318)
				cxt.drawImage(res.tempFilePath, 162, 214, 55, 55)
			}
		})
		cxt.draw(true, () => {
			uni.canvasToTempFilePath({
				canvasId: 'myCanvas',
				success: (res) => {
					uni.downloadFile({
						url: res
							.tempFilePath, //图片地址
						success: (rets) => {
							if (rets.statusCode === 200) {
								if (phoneType === 'web') {
									let oA = document.createElement(
										"a");
									oA.download = rets.tempFilePath.replace(
										/(.*\/)*([^.]+.*)/ig, "$2").split("?")[
										0];; // 设置下载的文件名，默认是'下载'
									oA.href = rets.tempFilePath;
									document.body.appendChild(oA);
									oA.click();
									oA.remove();
								} else {
									uni.saveImageToPhotosAlbum({
										filePath: rets.tempFilePath,
										success: function(res) {
											uni.showToast({
												title: "保存成功",
												icon: "none"
											});
										},
										fail: function(error) {
											console.log(error);
											uni.showToast({
												title: "保存失败",
												icon: "none"
											});
										}
									});
								}
							}
						}
					})
				}
			})
		})
	}
	onLoad(async () => {
		await getUserRetailRuleDetails().then(res => {
			backgroundUrl.value = res.result.backgroundUrl
		})
		await listForRetailPosterImg({
			posterType: 2
		}).then(res => {
			swiperList.value = res.result.map(item => {
				return {
					imgUrl: item.posterUrl,
					inviteUrl: item.inviteUserUrl,
					posterBaseUrl: item.posterBaseUrl
				}
			})
		})
	})
	onShareAppMessage((res) => {
		if (res.from === 'button') { // 来自页面内分享按钮
			console.log(res.target)
		}
		return {
			title: '邀请有礼',
			path: swiperList?.value[current.value]?.inviteUrl
		}
	})
	onShareTimeline((res) => {
		if (res.from === 'button') { // 来自页面内分享按钮
			console.log(res.target)
		}
		return {
			title: '邀请有礼',
			path: swiperList?.value[current.value]?.inviteUrl
		}
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.current-swiper-height {
		height: 636rpx;
	}

	.other-swiper-height {
		height: 448rpx;
	}

	.my-canvas {
		width: 520rpx;
		height: 636rpx;
		// visibility: hidden;
	}

	.invitation-posters-bg-color {
		width: 750rpx;
		height: 720rpx;
		background-size: 100% !important;

		.invitation-posters-title-text {
			color: #FFFFFF;
			text-align: center;
			margin: 82rpx 0rpx 112rpx;
			font-size: 68rpx;
		}

		.swiper-box-list {
			margin-top: 376rpx;
			height: 636rpx;

			.swiper-box-item {
				height: 636rpx;
				// position: relative;
				width: 520rpx !important;
				padding: 0rpx 16rpx;
				border-top: 1rpx solid rgba(#fff, 0);
				margin: auto;

				.QR-code-item {
					position: absolute;
					z-index: 2;
					right: 100rpx;
					bottom: 100rpx;
				}

				.swiper-box-item-image {
					display: flex;
					justify-content: center;

					image {
						border-radius: 12rpx;
					}
				}
			}
		}
	}

	.invitation-posters-content {
		font-size: 28rpx;
		font-family: PingFang-SC-Heavy, PingFang-SC;
		font-weight: 800;
		color: #303133;
		line-height: 28rpx;
		text-align: center;
		margin-top: 504rpx;
		margin-bottom: 50rpx;
	}

	.invitation-posters-link-box {
		height: 140rpx;
		width: 750rpx;
	}

	.invitation-posters-link {
		position: relative;
		bottom: 100rpx;
		padding: 0rpx 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;

		.invitation-posters-link-item {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			label {
				margin-top: 24rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 28rpx;
			}
		}
	}

	::v-deep .u-swiper-item {
		width: 520rpx !important;
	}

	::v-deep .u-swiper-wrap {
		overflow: visible !important;
	}

	::v-deep .uni-swiper-slide-frame {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	::v-deep .u-swiper-indicator {
		// margin-top: 64rpx;
		margin-bottom: -64rpx;
	}

	::v-deep .u-indicator-item-round-active {
		background-color: #395AE1 !important;
	}

	::v-deep .u-indicator-item-round {
		background-color: rgba(#395AE1, 0.6);
	}

	uni-button {
		position: relative;
		display: block;
		margin-left: 0rpx;
		margin-right: 0rpx;
		padding-left: 0rpx;
		padding-right: 0rpx;
		box-sizing: border-box;
		font-size: 0rpx;
		text-align: center;
		text-decoration: none;
		line-height: 0rpx;
		border-radius: 0rpx;
		-webkit-tap-highlight-color: transparent;
		overflow: hidden;
		background-color: #fff;
		cursor: pointer;
	}

	uni-button:after {
		border: 0rpx;
	}

	button {
		position: relative;
		display: block;
		margin-left: 0rpx;
		margin-right: 0rpx;
		padding-left: 0rpx;
		padding-right: 0rpx;
		box-sizing: border-box;
		font-size: 0rpx;
		text-align: center;
		text-decoration: none;
		line-height: 0rpx;
		border-radius: 0rpx;
		-webkit-tap-highlight-color: transparent;
		overflow: hidden;
		background-color: #fff;
		cursor: pointer;
	}

	button:after {
		border: 0rpx;
	}
</style>
