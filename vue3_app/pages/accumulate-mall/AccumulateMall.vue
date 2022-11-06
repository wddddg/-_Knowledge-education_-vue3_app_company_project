<template>
	<view class="container" :style="{'--theme-color':themeColor}">
		<u-navbar>
			<view class="slot-wrap">
				<u-search placeholder="请输入搜索内容" shape="shape" v-model="searchContent" @search="searchCommodity"
					:showAction="false"></u-search>
			</view>
		</u-navbar>
		<view class="bgImage">
			<!-- <u-image src="" width="100%" height="100%" mode=""></u-image> -->
			<!-- 我的积分 -->
			<view class="mall-user-info">
				<view class="mall-user-info-top">
					<view>
						<label class="my-accumulate-text">我的积分</label>
						<label class="my-accumulate-number">{{ userTotalIntegral }}</label>
					</view>
					<label class="go-detail" @click="goPointsDetails">查看明细</label>
				</view>
				<view class="divider" />
				<view class="mall-user-info-bottom">
					<view class="mall-user-info-item" v-for="(item,index) in mallUserInfoItemList" @click="openCorrelationView(item.name)">
						<u-image src="@/static/mall/all-products.png" :width="44" :height="48" v-if="item.name === '全部商品'"></u-image>
						<u-image src="@/static/mall/my-order.png" :width="40" :height="48" v-if="item.name === '我的订单'"></u-image>
						<u-image src="@/static/mall/mission-center.png" :width="48" :height="48" v-if="item.name === '任务中心'"></u-image>
						<u-image src="@/static/mall/shipping-address.png" :width="48" :height="48" v-if="item.name === '收货地址'"></u-image>
						<view class="mall-user-info-item-name">
							{{ item.name }}
						</view>
					</view>
				</view>
			</view>
			<!-- 轮播图 -->
			<swiper autoplay :interval="5000" class="swiper_content">
				<template v-for="(item,index) in bannerList" :key="item.id">
					<swiper-item>
						<view :style="`background:url(${item.imgUrl})`" class="swiperItem"></view>
						<!-- <view :style="`background:url(../../static/60x60.png)`" class="swiperItem"></view> -->
					</swiper-item>
				</template>
			</swiper>
		</view>
		<view class="exchange">
			<view class="exchange-title">热门兑换</view>
			<view class="exchange-list">
				<view class="exchange-item" v-for="(item,index) in forHostGoodsPageList" :key="item.id" @click="goProductDetails(item.id,item.goodsType)">
					<u-image :src="item.imgUrl" :height="220" width="100%" >
						<view slot="error" style="font-size: 24rpx;">加载失败</view>
					</u-image>
					<view class="exchange-item-title">{{ item.name || '&nbsp;' }}</view>
					<view class="exchange-item-preferential-strength">{{ item.integralAmount || 0 }}积分 + ¥{{ item.price || 0 }}</view>
					<view :type="item.status?'primary':'info'" :style="`background: ${ item.status?'#395AE1':'#C0C7D1' };`" class="exchange-item-btn">立即兑换</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad,
	} from "@dcloudio/uni-app";
	import {
		ref,
		getCurrentInstance
	} from "vue"
	import {
		setTab
	} from "@/common/app-utils.js"
	import {
		findBannerList,
		listForHostGoodsPage,
		getUserTotalIntegral
	} from './accumulateMall.api'
	const bannerList = ref([])
	const searchContent = ref('')
	const mallUserInfoItemList = ref([])
	const forHostGoodsPageList = ref([])
	let themeColor = ref(uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe')
	let params = {
		pageNo: 1,
		pageSize: 10
	}
	const userTotalIntegral = ref('')
	const searchCommodity = () => {
		console.log(searchContent.value);
	}
	mallUserInfoItemList.value = [{
			name: '全部商品'
		},
		{
			name: '我的订单'
		},
		{
			name: '任务中心'
		},
		{
			name: '收货地址'
		}
	]
	const openCorrelationView = (value) =>{
		if(value === '我的订单'){
			uni.navigateTo({
				url:'/mall/order/Order'
			})
		}
		if(value === '任务中心'){
			uni.navigateTo({
				url:'/mall/task/GetAccumulatePoints'
			})
		}
		if(value === '收货地址'){
			uni.navigateTo({
				url:'/mall/shipping-address/ShippingAddress'
			})
		}
		if(value === '全部商品'){
			uni.navigateTo({
				url:'/mall/all-products/AllProducts'
			})
		}
	}
	const goPointsDetails = () =>{
		uni.navigateTo({
			url:'/mall/task/PointsDetails'
		})
	}
	const goProductDetails = (e,type) =>{
		if(type === 2){
			uni.navigateTo({
				url:'/mall/all-products/VirtualProductDetails?id=' + e
			})
		}else{
			uni.navigateTo({
				url:'/mall/all-products/PhysicalGoodsDetails?id=' + e
			})
		}
	}
	onLoad(async () => {
		setTab()
		await findBannerList().then(res => {
			bannerList.value = [...res.result]
		})
		await listForHostGoodsPage(params).then(res => {
			console.log(res.result);
			forHostGoodsPageList.value = [...res.result.records]
		})
		await getUserTotalIntegral().then(res =>{
			userTotalIntegral.value = res.result
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>

<style scoped lang="scss">
	.slot-wrap {
		flex: 1;
		padding-right: 40rpx;
	}

	.bgImage {
		width: 100%;
		height: 566rpx;
		// 283
		position: relative;

		.swiper_content {
			width: 100%;
			height: 280rpx;
			position: absolute;

			.swiperItem {
				width: 100%;
				height: 100%;
				background-size: 100% 100% !important;
				background-repeat: no-repeat !important;
			}

			z-index: 1;
		}

		.mall-user-info {
			z-index: 2;
			position: absolute;
			top: 240rpx;
			width: 670rpx;
			height: 326rpx;
			background: #fff;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			margin: 0rpx 40rpx 0rpx;
			padding: 48rpx 24rpx;

			.mall-user-info-top {
				display: flex;
				align-items: flex-end;
				justify-content: space-between;

				.my-accumulate-text {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 28rpx;
				}

				.my-accumulate-number {
					font-size: 48rpx;
					font-family: DINCond-Black, DINCond;
					font-weight: 900;
					color: #303133;
					line-height: 48rpx;
					margin-left: 12rpx;
				}

				.go-detail {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #395AE1;
					line-height: 28rpx;
				}
			}

			.divider {
				width: 100%;
				height: 2rpx;
				background: #DCDFE6;
				margin: 32rpx 0rpx 48rpx;
			}

			.mall-user-info-bottom {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.mall-user-info-item {
					flex: 1;
					text-align: center;
					display: flex;
					align-items: center;
					flex-direction: column;
					.mall-user-info-item-name{
						margin-top: 12rpx;
					}
				}
			}
		}
	}

	.exchange {
		margin: 64rpx 40rpx 0rpx;

		.exchange-title {
			font-size: 36rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #1B1E27;
			line-height: 50rpx;
		}

		.exchange-list {
			margin-top: 32rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.exchange-item {
				width: 320rpx;
				// height: 456rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
				border-radius: 12rpx;
				margin-bottom: 32rpx;
				padding: 16rpx 16rpx 24rpx 16rpx;

				image {
					width: 100%;
					height: 220rpx;
				}

				.exchange-item-title {
					margin-top: 10rpx;
					font-size: 30rpx;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #303133;
					line-height: 44rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.exchange-item-preferential-strength{
					margin: 16rpx 0rpx 24rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #EE5142;
					line-height: 28rpx;
				}
				.exchange-item-btn{
					height: 60rpx;
					border-radius: 8rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 60rpx;
					text-align: center;
				}
			}
		}
	}
</style>
