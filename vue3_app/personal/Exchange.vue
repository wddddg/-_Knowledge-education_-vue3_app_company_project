<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view>
			<u-navbar title="兑换"></u-navbar>
		</view>
		<view class="exchange-tabs">
			<u-subsection :list="list" :current="current" mode="subsection" active-color="#395AE1" ref="subsection"
				@change="changeCurrentSubsection"></u-subsection>
		</view>
		<view class="search-box">
			<u-search placeholder="请输入兑换码" v-model="keyword" style="width: 100%;" :show-action="false" shape="square"
				:height="72"></u-search>
			<view class="search-box-btn" @click="chakExchange" :style="{ background:buttonColor }">
				查询
			</view>
		</view>
		<view class="exchange-data-list" v-if="exchangeList.length">
			<view class="exchange-data-item" v-for="(item,index) in exchangeList" :key="index">
				<view class="exchange-data-item-vip" v-if="item.category === 8 || item.category === 9">
					<view class="exchange-data-item-icon-title">
						<u-image src="../static/user/user-vip-image-block.png" :width="40" :height="40"></u-image>
						<label>{{ item.businessName }}</label>
					</view>
					<view class="exchange-data-item-icon-content" v-if="current">
						<label class="redeem-code-text">兑换码：{{ item.accountPassword }}</label>
						<label class="redeem-code-box"></label>
						<label class="redeem-code-type">会员类型：{{ item.category === 8? '畅会员' : '超级会员' }}</label>
					</view>
					<view class="exchange-data-item-icon-content" v-else>
						<label class="redeem-code-type">会员类型：{{ item.category === 8? '畅会员' : '超级会员' }}</label>
					</view>
				</view>
				<view class="exchange-data-item-box" v-else-if="item.category === 6">
					<view class="exchange-data-item-icon-title">
						<view class="exchange-data-item-title-box">
							资料
						</view>
						<label>{{ item.businessName }}</label>
					</view>
					<view class="exchange-data-item-icon-content" v-if="current">
						<label class="redeem-code-text">兑换码：{{ item.accountPassword }}</label>
						<label class="redeem-code-box"></label>
						<label class="redeem-code-type">兑换时间：{{ item.useTime }}</label>
					</view>
					<view class="exchange-data-item-icon-content" v-else>
						<label class="redeem-code-text">分类名称</label>
						<label class="redeem-code-box"></label>
						<label class="redeem-code-type">发布时间：{{ item.createTime }}</label>
					</view>
				</view>

				<view class="exchange-data-item-type-box" v-else>
					<view class="redeem-code-top-text" v-if="current">
						<label class="">兑换码：{{ item.accountPassword }}</label>
					</view>
					<view class="exchange-data-item-content">
						<view class="exchange-data-item-image">
							<image :src="item.businessImg"></image>
							<view class="exchange-data-item-image-type"></view>
							<view class="exchange-data-item-image-type-text">
								{{ item.category === '3'?'直播':item.category === '5'?'电子书':'视频' }}
							</view>
						</view>
						<view class="exchange-data-item-icon-content" v-if="current">
							<label class="exchange-data-item-icon-content-title">{{ item.businessName }}</label>
							<label class="redeem-code-type">兑换时间：{{ item.useTime }}</label>
						</view>
						<view class="exchange-data-item-icon-content" v-else>
							<label class="exchange-data-item-icon-content-title">{{ item.businessName }}</label>
							<view class="exchange-data-item-icon-content-flex">
								<label class="redeem-code-text">分类名称{{ item.oneCateName }}</label>
								<label class="redeem-code-box"></label>
								<label class="redeem-code-name">{{ item.teacherName }}</label>
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore class="loadmore" :status="loadStatus" icon-type="flower" :load-text="loadText" />
		</view>
		<view class="" v-else>
			<NoState type="box" :isPage="true">
				<template #text>
					<view>暂无更多数据！</view>
				</template>
			</NoState>
		</view>
		<view class="bottom-box" v-if="!current && exchangeList.length">
			<view class="bottom-box-btn" @click="exchangeImmediately">
				立即兑换
			</view>
		</view>
	</view>
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
		camePayInfo,
		getCamePayByKey,
		camePayExchange
	} from './Personal.api.ts'
	import NoState from '@/components/NoState.vue'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	let toggleColor = ref(uni.getStorageSync('otherThemeColor').toggleColor ? '#' + uni.getStorageSync('otherThemeColor')
		.toggleColor : 'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)')
	const list = [{
			name: '兑换'
		},
		{
			name: '兑换记录'
		},
	]
	const current = ref(0)
	let params = {
		pageNo: 1,
		pageSize: 10
	}
	const subsection = ref(null)
	const exchangeList = ref([])
	const keyword = ref('')
	const loadText = ref({
		loading: '正在加载',
		nomore: '没有更多了'
	})
	const loadStatus = ref('nomore')
	const changeCurrentSubsection = async (e) => {
		current.value = e
		if (e) {
			await camePayInfo(params).then((res) => {
				exchangeList.value = res.result.records
			})
		} else {
			exchangeList.value = []
		}
	}
	const chakExchange = async () => {
		await getCamePayByKey({
			accountPassword: keyword.value
		}).then(res => {
			if (res.result) {
				exchangeList.value = res.result.records
			} else {
				exchangeList.value = []
			}
		})
	}
	const exchangeImmediately = async () => {
		await camePayExchange({
			accountPassword: keyword.value
		}).then(res => {
			if (res.code === 200) {
				uni.showToast({
					title: '兑换成功',
					icon: 'success',
					duration: 2000
				})
				exchangeList.value = []
			}
		})
	}
	onReady(async () => {
		subsection.value.itemBgStyle.background = toggleColor
		await getCamePayByKey().then(res => {
			if (res.result) {
				exchangeList.value = res.result.records
			} else {
				exchangeList.value = []
			}
		})
	})
	onPullDownRefresh(async () => {
		params.pageNo = 1
		await camePayInfo(params).then((res) => {
			exchangeList.value = res.result.records
		})
		uni.stopPullDownRefresh()
	})
	onReachBottom(async () => {
		loadStatus.value = 'loading'
		params.pageNo++
		await camePayInfo(params).then((res) => {
			exchangeList.value.push(...res.result.records)
			if (!res.result.records.length) {
				loadStatus.value = 'nomore'
			} else {
				loadStatus.value = 'loadmore'
			}
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.bottom-box {
		position: absolute;
		bottom: 76rpx;
		padding: 0rpx 40rpx;
		width: 100%;

		.bottom-box-btn {
			height: 88rpx;
			background: $u-global-color;
			border-radius: 8rpx;

			text-align: center;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
			text-align: center;
		}
	}

	.exchange-tabs {
		margin: 32rpx 40rpx 0rpx;
		height: 64rpx;
		border-radius: 8rpx;
	}

	.search-box {
		padding: 48rpx 40rpx 0rpx;
		display: flex;
		width: 100%;

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

	.exchange-data-list {
		padding: 16rpx 40rpx 0rpx;

		.exchange-data-item {
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			padding: 24rpx;
			margin-top: 32rpx;

			.exchange-data-item-vip {
				.exchange-data-item-icon-title {
					display: flex;
					align-items: center;

					label {
						margin-left: 16rpx;

						font-size: 30rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #303133;
						line-height: 48rpx;
					}
				}

				.exchange-data-item-icon-content {
					margin-top: 16rpx;
					display: flex;
					align-items: center;

					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 32rpx;

					.redeem-code-box {
						margin: 0rpx 16rpx;
						width: 2rpx;
						height: 24rpx;
						background: #DCDFE6;
					}
				}
			}

			.exchange-data-item-box {
				.exchange-data-item-icon-title {
					display: flex;
					align-items: center;

					.exchange-data-item-title-box {
						border-radius: 0rpx 12rpx 0rpx 12rpx;
						border: 2rpx solid #F1B466;
						text-align: center;

						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #E85535;
						line-height: 34rpx;
						padding: 4rpx 16rpx;
					}

					label {
						margin-left: 16rpx;
						font-size: 30rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #303133;
						line-height: 48rpx;

						width: 80%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}

				.exchange-data-item-icon-content {
					margin-top: 16rpx;
					display: flex;
					align-items: center;

					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 32rpx;

					.redeem-code-box {
						margin: 0rpx 16rpx;
						width: 2rpx;
						height: 24rpx;
						background: #DCDFE6;
					}
				}
			}

			.exchange-data-item-type-box {
				.redeem-code-top-text {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 32rpx;
					margin-bottom: 16rpx;
				}

				.exchange-data-item-content {
					display: flex;
					align-items: center;

					.exchange-data-item-image {
						// border-radius: 12rpx 12rpx 12rpx 12rpx;
						position: relative;

						image {
							border-radius: 12rpx 12rpx 12rpx 12rpx;
							width: 204rpx;
							height: 156rpx;
						}

						.exchange-data-item-image-type {
							position: absolute;
							bottom: 0rpx;
							width: 100%;
							text-align: center;

							height: 40rpx;
							background: #000000;
							border-radius: 0rpx 0rpx 12rpx 12rpx;
							opacity: 0.6;
						}

						.exchange-data-item-image-type-text {
							position: absolute;
							bottom: 2rpx;
							width: 100%;
							text-align: center;
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #FFFFFF;
							line-height: 34rpx;
						}
					}

					.exchange-data-item-icon-content {
						margin-left: 24rpx;
						display: flex;
						// height: 100%;
						justify-content: space-between;
						flex-direction: column;
						height: 156rpx;

						.exchange-data-item-icon-content-title {
							font-size: 30rpx;
							font-family: PingFang-SC-Heavy, PingFang-SC;
							font-weight: 800;
							color: #303133;
							line-height: 48rpx;

							overflow: hidden;
							white-space: pre-line;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						}

						.redeem-code-type {
							font-size: 24Rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #909399;
							line-height: 34Rpx;

							width: 90%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}

						.exchange-data-item-icon-content-flex {
							margin-top: 16rpx;
							display: flex;
							align-items: center;

							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #909399;
							line-height: 32rpx;

							.redeem-code-box {
								margin: 0rpx 16rpx;
								width: 2rpx;
								height: 24rpx;
								background: #DCDFE6;
							}
						}
					}
				}
			}
		}
	}
</style>
