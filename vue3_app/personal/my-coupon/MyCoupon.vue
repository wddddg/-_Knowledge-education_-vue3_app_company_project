<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view class="">
			<u-navbar title="我的优惠券">
				<template #right>
					<view class="search-btn" @click="getSeachFocus">
						<u-image src="@/static/search.png" mode="" :width="40" :height="40"></u-image>
					</view>
				</template>
			</u-navbar>
		</view>
		<u-sticky bgColor="#fff" class="tabs-list-box">
			<u-tabs :list="tabsList" :is-scroll="false" :current="currentTabs" @change="changeTabs"
				:active-color="themeColor"></u-tabs>
		</u-sticky>
		<view class="search-box">
			<u-search placeholder="请输入兑换码" style="width: 100%;" v-model="keyword" :show-action="false" shape="square"
				ref="uSearchs" :focus="focus" :height="72" @blur="blurFun">
			</u-search>
			<view class="search-box-btn" @click="isEffective" :style="{ background:buttonColor }">
				兑换
			</view>
		</view>
		<view class="coupon-box-list" v-if="couponList.length">
			<view class="coupon-box-item-bg-color" v-for="(item,index) in couponList" :key="item.id"
				:class="item.status?'':'lose-efficacy-bg'" @click="goCouponDetailde(item.id)">
				<view class="coupon-box-item-bg-image">
					<view class="coupon-box-item-money" :class="item.status?'':'lose-efficacy-color'"><label
							class="coupon-box-item-money-symbol"
							v-if="!item.discount">¥</label>{{ item.discount?item.discount:item.fullAmount }}<label
							class="coupon-box-item-money-symbol" v-if="item.discount">折</label>
					</view>
					<view>
						<u-image src="@/static/user/coupon-divider.png" :width="4" :height="156"></u-image>
					</view>
					<view class="coupon-box-item-right">
						<view class="coupon-box-item-content-title" :class="item.status?'':'lose-efficacy-color'">
							{{ item.title }}
						</view>
						<view class="coupon-box-item-content-money">满{{ item.useLimitAmount }}可用</view>
						<view class="coupon-box-item-content-time">
							<label>有效期至 {{ formatTime(item.endTime) }}</label>
						</view>
						<view class="coupon-box-item-right-btn" @click.stop="goCoursePages"
							:style="{ color:item.status ? buttonColor : '',border:item.status ? `2rpx solid ${buttonColor}` : '' }"
							:class="item.status?'':'lose-efficacy-color lose-efficacy-border'">
							{{item.status?'去使用':'不可用'}}
						</view>
					</view>
				</view>
			</view>
			<u-loadmore class="loadmore" :status="loadStatus" icon-type="flower" :load-text="loadText" />
		</view>
		<view v-else>
			<NoState :isPage="true" type="box">
				<template #text>
					<view>暂无优惠券！</view>
				</template>
			</NoState>
		</view>
		<view class="go-get-coupons-center">
			<view class="go-get-coupons-center-btn" @click="goGetCouponsCenter" :style="{ background:buttonColor}">
				去领券中心
			</view>
		</view>
		<ThemeModal :showModal="showExchangeLoseModal" content="兑换码不正确" :showCancelBtn="false"
			@closeModal="closeExchangeLoseModal" @confirmModal="confirmExchangeLoseModal" />

		<ThemeModal :showModal="showExchangeSuccessModal" content="兑换成功不可撤销，确认要兑换吗？"
			@closeModal="closeExchangeSuccessModal" @confirmModal="confirmExchangeSuccessModal" />
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
	import ThemeModal from '@/components/ThemeModal.vue'
	import NoState from '@/components/NoState.vue'
	import {
		myCouponListForPage,
		couponExchange
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
	const uSearchs = ref(null)
	const loadStatus = ref('nomore')
	const tabsList = [{
		name: '全部'
	}, {
		name: '待使用'
	}, {
		name: '已过期',
	}]
	let params = {
		pageNo: 1,
		pageSize: 10,
		useStatus: null
	}
	const keyword = ref('')
	const focus = ref(false)
	const currentTabs = ref(0)
	const showExchangeLoseModal = ref(false)
	const showExchangeSuccessModal = ref(false)
	const couponList = ref([])
	const changeTabs = async (e) => {
		currentTabs.value = e
		if (e == 1) {
			params.useStatus = 2
		} else if (e == 2) {
			params.useStatus = 3
		} else {
			params.useStatus = null
		}
		let res = await getList()
		couponList.value = res
	}
	const goGetCouponsCenter = () => {
		uni.navigateTo({
			url: '/personal/my-coupon/CouponCenter'
		})
	}
	const isEffective = () => {
		if (!keyword.value) {
			return uni.showToast({
				icon: 'none',
				title: '请输入兑换码'
			})
		}
		showExchangeSuccessModal.value = true
	}
	const closeExchangeLoseModal = () => {
		showExchangeLoseModal.value = false
	}
	const confirmExchangeLoseModal = () => {
		closeExchangeLoseModal()
	}
	const closeExchangeSuccessModal = () => {
		showExchangeSuccessModal.value = false
	}
	const confirmExchangeSuccessModal = async () => {
		await couponExchange({
			secretKey: keyword.value
		}).then(res => {
			if (!res.success) {
				showExchangeLoseModal.value = true
			}
		})
		closeExchangeSuccessModal()
	}
	const getList = async () => {
		let data = await myCouponListForPage(params)
		return data.result.records
	}
	const goCouponDetailde = (e) => {
		uni.navigateTo({
			url: '/personal/my-coupon/CouponDetailed?id=' + e
		})
	}
	const goCoursePages = () => {
		uni.switchTab({
			url: '/pages/course/index'
		})
	}
	const getSeachFocus = () => {
		focus.value = true
	}
	const blurFun = () =>{
		focus.value = false
	}
	const formatTime = (time) => {
		return uni.$u.timeFormat(time, 'yyyy-mm-dd')
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
<style scoped lang="scss">
	.search-btn {
		margin-right: 40rpx;
	}

	.tabs-list-box {
		background: #FFFFFF;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
	}

	.search-box {
		margin: 48rpx 40rpx 0rpx;
		display: flex;

		.search-box-btn {
			width: 120rpx;
			height: 72rpx;
			background: $u-global-color;
			border-radius: 8rpx;
			margin-left: 16rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 72rpx;
			text-align: center;
		}
	}

	.coupon-box-list {
		padding: 0rpx 40rpx 152rpx;

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

						label {
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

	.go-get-coupons-center {
		height: 162rpx;
		padding: 0rpx 40rpx;
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		background-color: #FFFFFF;

		.go-get-coupons-center-btn {
			border-radius: 8rpx;
			height: 88rpx;
			width: 100%;
			text-align: center;
			margin-top: 10rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
		}
	}

	.lose-efficacy-bg {
		background: #C0C7D1 !important;
	}

	.lose-efficacy-color {
		color: #909399 !important;
	}

	.lose-efficacy-border {
		border: 2rpx solid #909399 !important;
	}
</style>
