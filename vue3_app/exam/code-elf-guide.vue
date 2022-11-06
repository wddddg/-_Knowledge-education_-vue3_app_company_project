<template>
	<view class="page-section-spacing">
		<swiper class="swiper-box" :indicator-dots="true">
			<swiper-item v-for="(item,index) in bann" :key="index" class="swiper-item">
				<view style="height: 100%;width: 100%;">
					<image :src="staticUrl+item.url"></image>
					<view v-if="index<bann.length-1" class="jump-over" @click="launchFlag()">{{jumpover}}</view>
					<view v-if="index===bann.length-1" class="experience" @click="launchFlag()">{{experience}}</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				staticUrl: getApp().globalData.staticUrl,
				bann: [],
				jumpover: '跳过',
				experience: '立即体验'
			}
		},
		onLoad() {
			this.getImg();
			// setTimeout(function(){
			// 	plus.navigator.closeSplashscreen();
			// },3000)
		},
		methods: {
			getImg() {
				this.https('getImgByType',{data:{
					type: 1
				}}).then(ret => {
					console.log(ret)
					if (ret != null) {
						this.bann = ret;
					}
				})
			},
			launchFlag: function() {
				/**
				 * 向本地存储中设置launchFlag的值，即启动标识；
				 */
				uni.setStorage({
					key: 'launchFlag',
					data: true,
				});
				let user = uni.getStorageSync("user");
				if (user.userId != null && user.userId != undefined && user.userId != '') {
					uni.reLaunch({
						url: "/pages/index/index"
					});
				} else {
					uni.reLaunch({
						url: '/pages/login/login'
					});;
				}
			},
			animationfinish() {

			}
		}

	}
</script>

<style scoped>
	.swiper-box {
		width: 100%;
		height: 100vh;
	}


	swiper-item {
		width: 100%;
		height: 100%;
	}

	/* swiper-item 里面的图片高度 */
	swiper-item image {
		width: 100%;
		height: 100%;
	}

	.scroll-view {
		width: 100%;
		height: 100%;
	}

	.jump-over,
	.experience {
		position: absolute;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		color: #454343;
		border: 1px solid #454343;
		z-index: 999;
	}

	.jump-over {
		right: 45upx;
		top: 125upx;
	}

	.experience {
		right: 50%;
		margin-right: -105upx;
		bottom: 10%;
	}

	swiper {
		height: 100vh;
	}
</style>
