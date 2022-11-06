<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<u-navbar title="消息中心"></u-navbar>
		<view class="message-tabs">
			<u-subsection :list="list" :current="current" mode="subsection" ref="subsection" activeColor="#395AE1"
				@change="changeCurrentSubsection"></u-subsection>
		</view>
		<view class="message-tabs-list">
			<view class="" v-for="item in messageCardList" :key="item.id">
				<view class="message-tabs-item-time">{{ item.createTime }}</view>
				<view class="message-tabs-item-content">
					<view class="message-tabs-item-title">
						<view class="message-tabs-item-icon">
							<u-image src="@/static/user/message-center.png" mode="" :width="40" :height="40"
								v-if="item.type === 1"></u-image>
							<u-image src="@/static/user/activity-message.png" mode="" :width="40" :height="40"
								v-if="item.type === 3"></u-image>
							<u-image src="@/static/user/order-message.png" mode="" :width="40" :height="40"
								v-if="item.type === 2"></u-image>
						</view>
						<label>{{ item.type_dictText }}</label>
					</view>
					<view class="message-tabs-item-text" v-html="item.message">
					</view>
					<view class="divider" />
					<view class="details" @click="chakDetails(item.id,item.type)">
						<view class="chak-details">
							查看详情
						</view>
						<u-icon name="arrow-right" color="#909399"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore class="loadmore" :status="loadStatus" icon-type="flower" :load-text="loadText" />
	</view>
	<u-popup v-model="showPopup" mode="center" :closeable="true" :custom-style="{margin:'0rpx 80rpx'}">
		<view v-html="popupContent" class="popup-content"></view>
	</u-popup>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad,
		onReady,
		onReachBottom,
		onPullDownRefresh
	} from "@dcloudio/uni-app";
	import {
		messageList,
		messageQueryById
	} from './Personal.api.ts'
	let params = {
		pageNo: 1,
		pageSize: 10,
		type: 1
	}
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	let toggleColor = ref(uni.getStorageSync('otherThemeColor').toggleColor ? '#' + uni.getStorageSync('otherThemeColor')
		.toggleColor : 'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)')
	const list = [{
			name: '系统消息'
		},
		{
			name: '交易消息'
		},
		{
			name: '活动消息'
		}
	]
	const loadText = ref({
		loading: '正在加载',
		nomore: '没有更多了'
	})
	const popupContent = ref('')
	const showPopup = ref(false)
	const loadStatus = ref('nomore')
	const subsection = ref(null)
	const current = ref(0)
	const messageCardList = ref([])
	const changeCurrentSubsection = async (e) => {
		current.value = e
		params.pageNo = 1
		if (e === 1) {
			params.type = 2
		} else if (e === 2) {
			params.type = 3
		} else {
			params.type = 1
		}
		let data = await getList()
		messageCardList.value = data
	}
	const getList = async () => {
		let data = await messageList(params)
		return data.result.records
	}
	const chakDetails = async (e, type) => {
		if (type == 2) {
			uni.navigateTo({
				url: '/mall/order/Order?orderType=1'
			})
		} else {
			showPopup.value = true
			await messageQueryById({
				id: e
			}).then(res => {
				popupContent.value = res.result.message
			})
		}
	}
	onLoad(async () => {
		let data = await getList()
		messageCardList.value = data
	})
	onReady(() => {
		subsection.value.itemBgStyle.background = toggleColor
	})
	onReachBottom(async () => {
		loadStatus.value = 'loading'
		params.pageNo++
		let data = await getList()
		messageCardList.value.push(...data)
		if (!data.length) {
			loadStatus.value = 'nomore'
		} else {
			loadStatus.value = 'loadmore'
		}
	})
	onPullDownRefresh(async () => {
		params.pageNo = 1
		let data = await getList()
		messageCardList.value = data
		uni.stopPullDownRefresh()
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.popup-content{
		padding: 80rpx 60rpx 40rpx;
	}
	.message-tabs {
		margin: 32rpx 40rpx 0rpx;
		height: 64rpx;
		border-radius: 8rpx;
	}

	.message-tabs-list {
		padding: 0rpx 40rpx;

		.message-tabs-item-time {
			width: 286rpx;
			height: 40rpx;
			background: #F6F6F6;
			border-radius: 8rpx;
			margin: 48rpx auto 32rpx;
			text-align: center;

			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #909399;
			line-height: 40rpx;
		}

		.message-tabs-item-content {
			padding: 24rpx 32rpx;

			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;

			.message-tabs-item-title {
				display: flex;
				align-items: center;

				.message-tabs-item-icon {
					width: 64rpx;
					height: 64rpx;
					background: #ECF1FE;
					border-radius: 8rpx;
					padding: 12rpx;
				}

				label {
					font-size: 30rpx;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #303133;
					line-height: 48rpx;
					margin-left: 16rpx;
				}
			}

			.message-tabs-item-text {
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #606266;
				line-height: 40rpx;
				margin: 24rpx 0rpx 32rpx;
			}

			.divider {
				width: 100%;
				height: 2rpx;
				background: #DCDFE6;
				margin-bottom: 24rpx;
			}

			.details {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.chak-details {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 36rpx;
				}
			}
		}
	}
</style>
