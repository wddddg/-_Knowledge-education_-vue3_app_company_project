<template>
	<view class="content" :class="{on:isClass}">
			<swiper autoplay indicator-dots :indicator-color="'rgba(255,255,255,0.5)'" :indicator-active-color="'rgba(255,255,255)'" :interval="3000" class="swiper_content">
		<template v-for="(item,index) in bannerList">
			<swiper-item>
				<image class="images" :src="item.imgUrl" mode="scaleToFill" style="border-radius:20rpx;width: 100%;height:100%;"></image>
			</swiper-item>
		</template>
			</swiper >
	</view>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
const props = defineProps(['bannerList','isClass'])

</script>
<style lang="scss" scoped>
.on{
	box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
	border-radius: 12rpx;
	background: #fff;
	position: relative;
	z-index: 1;
}
.content{
		margin-bottom: 24rpx;
}
.swiper_content{
	display: flex;
	align-items: center;
	height: 320rpx;
}
</style>