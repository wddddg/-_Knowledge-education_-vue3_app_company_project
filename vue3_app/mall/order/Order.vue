<template>
	<view class="">
		<u-navbar title="我的订单"></u-navbar>
		<u-sticky bgColor="#fff" class="tabs-list">
			<u-tabs ref="tabs" :list="list" :is-scroll="false" :current="current" @change="change"
				:activeColor="themeColor">
			</u-tabs>
		</u-sticky>
		<!-- <swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
				<scroll-view scroll-y style="height: 800rpx;width: 100%;" @scrolltolower="onreachBottom">
					
				</scroll-view>
			</swiper-item>
		</swiper> -->
		<view class="list" v-if="orderList.length">
			<view class="list-item" v-for="(item,index) in orderList" :key="item.index">
				<view class="list-item-top" @click="goOrderDetails(item.id)">
					<view class="list-item-state"
						:style="{color:item.status === 1 ? '#67C23A':item.status === 0 ?'#EE5142' : '#909399'}">
						{{ item.status === 1 ? '已完成' : item.status === 0 ? '待发货' : '已发货' }}
					</view>
					<view class="list-item-time"><label>{{ item.createTime }}</label>
						<u-image src="@/static/garbage.png" width="28rpx" height="32rpx"></u-image>
					</view>
				</view>
				<view class="list-item-info" @click="goOrderDetails(item.id)">
					<view>
						<u-image :src="item.imgUrl" width="204rpx" height="156rpx"></u-image>
						<!-- <u-image src="@/static/60x60.png" width="204rpx" height="156rpx"></u-image> -->
					</view>
					<view class="list-item-info-text">
						<view class="list-item-info-title">
							{{ item.spuName }}
						</view>
						<view class="list-item-info-day">
							<view>规格：{{ item.normsName }}</view>
							<view>¥{{ item.unitPrice }}</view>
						</view>
					</view>
				</view>
				<view class="list-item-money">应付总额 &nbsp;<label class="list-item-money-number"><label
							class="list-item-money-symbol">¥</label>{{ item.totalPrice }}</label></view>
				<view class="list-item-btn-box">
					<view class="list-item-btn">
						<view class="list-item-btn">
							<view class="chak-order" @click.stop="goOrderDetails(item.id,1)"
								:style="{color: buttonColor,border: `2rpx solid ${buttonColor}`}">查看订单</view>
							<view class="pay-order" v-if="item.status === 0" @click.stop="goOrderDetails(item.id,0)"
								:style="{background: buttonColor}">立即支付
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<NoState type="article" :isPage="true">
				<template #text>
					暂无订单！
				</template>
			</NoState>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import {
		getOrderList
	} from '@/common/questionApi.js';
	import NoState from '@/components/NoState.vue'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const list = ref([])
	const current = ref(0)
	const swiperCurrent = ref(0)
	const orderList = ref([])
	const tabs = ref(null)
	let params = {
		orderType: 2
	}
	const transition = (e) => {
		let dx = e.detail.dx;
		tabs.value.setDx(dx);
	}
	const animationfinish = (e) => {
		let current = e.detail.current;
		tabs.value.setFinishCurrent(current);
		swiperCurrent.value = current;
		current.value = current;
	}
	list.value = [{
		name: '全部'
	}, {
		name: '待发货'
	}, {
		name: '已发货'
	}, {
		name: '已完成'
	}]
	const change = async (value) => {
		current.value = value
		if (value === 0) {
			params.isSend = ''
		} else if (value === 1) {
			params.isSend = 0
		} else if (value === 2) {
			params.isSend = 2
		} else if (value === 3) {
			params.isSend = 1
		}
		await getOrderList(params).then(res => {
			orderList.value = [...res.result.records]
		})
	}
	const goOrderDetails = (id, type) => {
		if (type) {
			uni.navigateTo({
				url: '/mall/order/OrderDetails?id=' + id
			})
		} else {
			uni.navigateTo({
				url: '/mall/order/OrderPay?id=' + id
			})
		}
	}
	onShow(async (value) => {
		// params.orderType = value.orderType
		await getOrderList(params).then(res => {
			orderList.value = [...res.result.records]
			// console.log(orderList.value)
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.tabs-list {
		background: #FFFFFF;
		box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
	}

	.swiper-item {
		height: 100%;
	}

	.list {
		padding: 0rpx 40rpx;

		.list-item {
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			padding: 32rpx 24rpx;
			margin: 32rpx 0rpx;

			.list-item-top {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.list-item-state {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					line-height: 32rpx;
				}

				.list-item-time {
					display: flex;
					align-items: center;

					label {
						padding-right: 24rpx;
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
						line-height: 32rpx;
					}
				}
			}

			.list-item-info {
				margin-top: 24rpx;
				display: flex;
				align-items: flex-start;

				.list-item-info-text {
					margin-left: 24rpx;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 156rpx;

					.list-item-info-title {
						font-size: 30rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #303133;
						line-height: 44rpx;
						height: auto;
						overflow: hidden;
						white-space: pre-line;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}

					.list-item-info-day {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
						line-height: 32rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: 16rpx;
					}
				}
			}

			.list-item-money {
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 40rpx;
				text-align: right;

				.list-item-money-number {
					color: #EE5142;

					.list-item-money-symbol {
						font-size: 24rpx;
					}
				}
			}
			
			.list-item-btn-box {
				height: 60rpx;
				margin-top: 24rpx;
			}
			.list-item-btn {
				position: absolute;
				display: flex;
				text-align: center;
				right: 24rpx;
			
				.chak-order {
					width: 144rpx;
					height: 60rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
			
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					line-height: 60rpx;
				}
			
				.pay-order {
					margin-left: 24rpx;
					width: 144rpx;
					height: 60rpx;
					border-radius: 8rpx;
			
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 60rpx;
				}
			}
		}
	}
</style>
