<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">

		<view>
			<u-navbar title="领券中心"></u-navbar>
		</view>
		<view class="coupon-box-list" v-if="couponList.length">
			<view class="coupon-box-item-bg-color" v-for="(item,index) in couponList" :key="item.id">
				<view class="coupon-box-item-bg-image">
					<view class="coupon-box-item-money"><label class="coupon-box-item-money-symbol"
							v-if="!item.discount">¥</label>{{ item.discount?item.discount:item.fullAmount }}<label
							class="coupon-box-item-money-symbol" v-if="item.discount">折</label>
					</view>
					<view>
						<u-image src="@/static/user/coupon-divider.png" :width="4" :height="156"></u-image>
					</view>
					<view class="coupon-box-item-right">
						<view class="coupon-box-item-content-title">{{ item.title }}</view>
						<view class="coupon-box-item-content-money">满{{ item.useLimitAmount }}可用</view>
						<view class="coupon-box-item-content-time">
							<view>有效期至 {{ formatTime(item.endTime) }}</view>
						</view>
						<view class="coupon-box-item-right-btn" :style="{ color:item.status ? buttonColor : '',border:item.status ? `2rpx solid ${buttonColor}` : '' }" @click="getCoupons(item.id)">立即领取</view>
					</view>
				</view>
			</view>
			<u-loadmore class="loadmore" :status="loadStatus" icon-type="flower" :load-text="loadText" />
		</view>
		<view class="" v-else>
			<NoState type="box" :isPage="true">
				<template #text>
					<view>暂无优惠券！</view>
				</template>
			</NoState>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad,
		onShow,
		onReachBottom,
		onPullDownRefresh
	} from "@dcloudio/uni-app";
	import NoState from '@/components/NoState.vue'
	import {
		couponListForPage,
		addUserCoupon
	} from '../Personal.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const loadText = ref({
		loading: '正在加载',
		nomore: '没有更多了'
	})
	const loadStatus = ref('nomore')
	const couponList = ref([])
	let params = {
		pageNo: 1,
		pageSize: 10
	}
	const getList = async () => {
		let data = await couponListForPage(params)
		return data.result.records
	}
	const getCoupons = async (e) => {
		await addUserCoupon({
			id: e
		}).then(async (res) => {
			if (res.code != 200) {
				uni.showToast({
					title: res.message,
					icon: 'none',
					duration: 2000
				});
			} else {
				uni.showToast({
					title: '领取成功',
					icon: 'none',
					duration: 2000
				});
				location.reload()
			}
		})
	}
	const formatTime = (time) =>{
		return uni.$u.timeFormat(time,'yyyy-mm-dd')
	}
	onLoad(async () => {
		let res = await getList()
		couponList.value = res
	})
	onReachBottom(async () => {
		loadStatus.value = 'loading'
		params.pageNo++
		let res = await getList()
		couponList.value.push(...res)
		if (!res.length) {
			loadStatus.value = 'nomore'
		} else {
			loadStatus.value = 'loadmore'
		}
	})
	onPullDownRefresh(async () => {
		params.pageNo = 1
		let res = await getList()
		couponList.value = res
		uni.stopPullDownRefresh()
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
	.coupon-box-list {
		padding: 0rpx 40rpx;

		.coupon-box-item-bg-color {
			margin-top: 32rpx;
			padding: 16rpx;
			border-radius: 8rpx;
			height: 220rpx;
			background: linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%);

			.coupon-box-item-bg-image {
				background: url(@/static/user/coupon-bg-image.png);
				background-size: 100%;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;

				.coupon-box-item-money {
					width: 160rpx;
					text-align: center;

					font-size: 64rpx;
					font-family: DINCond-Black, DINCond;
					font-weight: 900;
					color: #EE5142;

					.coupon-box-item-money-symbol {
						font-size: 32rpx;
					}
				}

				.coupon-box-item-right {
					margin-left: 30rpx;
					position: relative;
					flex: 1;

					.coupon-box-item-right-btn {
						position: absolute;
						right: 24rpx;
						bottom: -0.2rem;
						padding: 12rpx 16rpx;
						background: #FFFFFF;
						border-radius: 8rpx;

						font-size: 24rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						line-height: 24rpx;
					}

					.coupon-box-item-content-title {
						font-size: 30rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #303133;
						line-height: 44rpx;
					}

					.coupon-box-item-content-money {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
						line-height: 32rpx;
						margin: 16rpx 0rpx 8rpx;
					}

					.coupon-box-item-content-time {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
						line-height: 32rpx;
						display: flex;
						justify-content: space-between;

						view {
							width: 60%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
					}
				}
			}
		}
	}
</style>
