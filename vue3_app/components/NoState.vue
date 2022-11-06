<template>
	<view class="image-box" :style="{height:isPage?'50vh':'500rpx'}">
		<view class="image-box-item">
			<image v-if="type === '404'" :src="imglist.webPageLoseUrl" mode="aspectFit"></image>
			<image v-if="type === 'article'" :src="imglist.orderImgUrl" mode="aspectFit"></image>
			<image v-if="type === 'book'" :src="imglist.studyImgUrl" mode="aspectFit"></image>
			<image v-if="type === 'box'" :src="imglist.exchangeImgUrl" mode="aspectFit"></image>
			<image v-if="type === 'celestial'" src="@/static/no-state/celestial.png" mode="aspectFit"></image>
			<image v-if="type === 'position'" :src="imglist.goodsImgUrl" mode="aspectFit"></image>
			<image v-if="type === 'question'" :src="imglist.newsAnswerImgUrl" mode="aspectFit"></image>
			<image v-if="type === 'teacher'" :src="imglist.teacherImgUrl" mode="aspectFit"></image>
			<view class="slot-text">
				<slot name="text"></slot>
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps(['type', 'isPage'])
	
	let imglist = uni.getStorageSync('LoadingImg')
	
	// box:           exchangeImgUrl
	// question:   newsAnswerImgUrl
	// book:        studyImgUrl
	// article:      orderImgUrl
	// position:   goodsImgUrl
	// teacher:   teacherImgUrl
	//    404 :    webPageLoseUrl
</script>

<style scoped lang="scss">
	.image-box {
		position: relative;

		.image-box-item {
			width: 260rpx;
			height: 320rpx;
			margin: auto;

			image {
				width: 100%;
				height: 100%;
			}

			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.slot-text {
		text-align: center;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #606266;
		line-height: 60rpx;
	}
</style>
