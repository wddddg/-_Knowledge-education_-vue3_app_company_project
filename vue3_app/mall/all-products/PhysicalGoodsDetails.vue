<template>
	<view class="">
		<u-navbar title="商品详情"></u-navbar>
	</view>
	<view class="details-navbar" :style="{background: `url(${ productItem.imgUrl }) no-repeat`}">
		<view class="details-navbar-content">
			<view class="details-navbar-content-title">
				{{ productItem.name }}
			</view>
			<view class="details-navbar-content-price">
				{{ productItem.payRule === 1 ? (productItem.integralAmount || 0) + '积分' : productItem.payRule === 2 ? '¥' + (productItem.price || 0) : (productItem.integralAmount || 0) + '积分' + '+' + '¥' + (productItem.price || 0) }}
			</view>
			<view class="details-navbar-content-specification">
				<view class="details-navbar-content-specification-top" @click="showPopupFun">
					<view class="details-navbar-content-specification-top-ipt">
						<label>规格</label>
						<u-input v-model="viewSpecification" placeholder="请选择规格" :customStyle="{marginLeft: '32rpx'}"
							@focus="showPopupFun">
						</u-input>
					</view>
					<view>
						<u-icon name="arrow-right" :size="24" color="#909399"></u-icon>
					</view>
				</view>
				<view class="details-navbar-content-specification-center"></view>
				<view class="details-navbar-content-specification-bottom">
					<label>快递</label>
					<view>
						{{ productItem.expressType === 3 ?  productItem.expressAmount == 0 ? '包邮' : ((productItem.expressAmount || 0) + '￥') : ((productItem.expressAmount || 0) + '￥')  }}
					</view>
				</view>
			</view>
			<view class="details-navbar-content-title-introduce">
				<view class="details-navbar-content-title-introduce-left-box"></view>
				<label>商品介绍</label>
			</view>
			<view class="details-navbar-content-introduce-text" v-html="productItem.content" v-if="productItem.content">
			</view>
		</view>
		<u-popup v-model="showPopup" mode="bottom" border-radius="12rpx" :closeable="true">
			<view class="popup-box">
				<view class="popup-info-box">
					<view class="popup-info-image">
						<u-image :src="productItem.imgUrl" :width="204" :height="156"></u-image>
						<view class="popup-info-image-content">
							<view class="popup-info-image-title">{{ productItem.name }}</view>
							<view class="popup-info-image-price">
								{{ productItem.payRule === 1 ? (productItem.integralAmount || 0) + '积分' : productItem.payRule === 2 ? '¥' + (productItem.price || 0) : (productItem.integralAmount || 0) + '积分' + '+' + '¥' + (productItem.price || 0) }}
							</view>
							<view class="popup-info-image-select-type">已选
								{{ productItem.mallGoodsNormsVOList[currentSpecification]?.norms }}
							</view>
						</view>
					</view>
					<view class="popup-info-stock">
						库存 {{ productItem.stockAmount || 0 }}
					</view>
				</view>
				<view class="popup-info-specification">
					<view class="popup-info-specification-title">规格</view>
					<view class="popup-info-specification-list">
						<view @click="changeCurrentSpecification(index)"
							:class="currentSpecification === index ? 'popup-info-specification-active-item' : ''"
							:style="{border: currentSpecification === index ?`2rpx solid ${buttonColor}` : '',color: currentSpecification === index ? buttonColor: ''}"
							class="popup-info-specification-item"
							v-for="(item,index) in productItem.mallGoodsNormsVOList" :key="index">
							{{ item.norms }}
						</view>
					</view>
				</view>
				<view class="popup-info-specification">
					<view class="popup-info-specification-title">购买数量</view>
					<view>
						<u-number-box v-model="valueNumberBox" :max="productItem.stockAmount || 999" :min="1">
						</u-number-box>
					</view>
				</view>
				<view class="popup-info-btn" @click="confirmPayRule" :style="{background:buttonColor}">
					确定
				</view>
			</view>
		</u-popup>
		<view class="details-navbar-content-btn-box">
			<view class="details-navbar-content-btn" @click="goPhysicalGoodsOrder" :style="{background:buttonColor}">
				立即购买
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		getGoodsDetails
	} from '../Mall.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const productItem = ref({})
	const showPopup = ref(false)
	const currentSpecification = ref(0)
	const valueNumberBox = ref(1)
	const viewSpecification = ref('')
	const currentOrderId = ref('')
	const specificationList = []
	const showPopupFun = () => {
		showPopup.value = true
	}
	const changeCurrentSpecification = (e) => {
		currentSpecification.value = e
	}
	const confirmPayRule = () => {
		viewSpecification.value = productItem.value.mallGoodsNormsVOList[currentSpecification.value]?.norms || ''
		showPopup.value = false
	}
	const goPhysicalGoodsOrder = () => {
		if (viewSpecification.value === '') {
			return uni.showToast({
				icon: 'error',
				title: '请选择规格'
			})
		}
		if (productItem.value.goodsType != 1) {
			uni.navigateTo({
				url: '/mall/all-products/ConfirmVirtualProductOrder?id=' + currentOrderId.value +
					'&payNumber=' + valueNumberBox.value + '&normsId=' + productItem.value
					.mallGoodsNormsVOList[currentSpecification.value].id
			})
		} else {
			uni.navigateTo({
				url: '/mall/all-products/ConfirmPhysicalGoodsOrder?id=' + currentOrderId.value + '&type=' +
					viewSpecification.value + '&payNumber=' + valueNumberBox.value + '&normsId=' + productItem
					.value.mallGoodsNormsVOList[currentSpecification.value].id
			})
		}
	}
	onLoad(async (value) => {
		currentOrderId.value = value.id
		await getGoodsDetails({
			id: value.id
		}).then(res => {
			productItem.value = res.result
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.details-navbar {
		background-size: 100% 100% !important;
		height: 422rpx;
		border-top: 1rpx solid #FFFFFF;

		.details-navbar-content {
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 0rpx 0rpx;
			padding: 56rpx 40rpx 0rpx;
			margin-top: 398rpx;

			.details-navbar-content-title {
				font-size: 32rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #303133;
				line-height: 44rpx;
			}

			.details-navbar-content-price {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #EE5142;
				line-height: 28rpx;
				margin: 24rpx 0rpx 16rpx;
			}

			.details-navbar-content-specification {
				width: 100%;
				// height: 184rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
				border-radius: 12rpx;
				padding: 32rpx;

				.details-navbar-content-specification-top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					color: #909399;

					.details-navbar-content-specification-top-ipt {
						display: flex;
						align-items: center;
					}
				}

				.details-navbar-content-specification-center {
					width: 100%;
					height: 2rpx;
					border: 2rpx solid #DCDFE6;
					margin: 24rpx 0rpx;
				}

				.details-navbar-content-specification-bottom {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 36rpx;
					display: flex;
					align-items: center;

					// justify-content: space-between;
					label {
						margin-right: 36rpx;
					}
				}
			}

			.details-navbar-content-title-introduce {
				height: 40rpx;
				font-size: 32rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #1B1E27;
				line-height: 36rpx;
				margin: 48rpx 0rpx 24rpx;
				display: flex;
				align-items: center;

				.details-navbar-content-title-introduce-left-box {
					width: 6rpx;
					height: 32rpx;
					background: linear-gradient(360deg, #7BC8E8 0%, #3F6EE1 100%);
				}

				label {
					margin-left: 8rpx;
				}
			}

			.details-navbar-content-introduce-text {
				width: 100%;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 48rpx;
				margin-bottom: 200rpx;
			}
		}

		.details-navbar-content-btn-box {
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			background-color: #FFFFFF;
			padding: 0rpx 40rpx;
			height: 190rpx;

			.details-navbar-content-btn {
				margin-top: 36rpx;
				width: 100%;
				text-align: center;
				line-height: 88rpx;
				height: 88rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				border-radius: 8rpx;
			}
		}
	}

	.popup-box {
		height: 768rpx;
		background: #FFFFFF;
		padding: 96rpx 40rpx 76rpx;

		.popup-info-box {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.popup-info-image {
				display: flex;

				.popup-info-image-content {
					height: 152rpx;
					display: flex;
					justify-content: space-between;
					flex-direction: column;
					width: 350rpx;

					.popup-info-image-title {
						font-size: 30rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #303133;
						line-height: 44rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap; // 默认不换行；

					}

					.popup-info-image-price {
						font-size: 28rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #EE5142;
						line-height: 28rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap; // 默认不换行；
					}

					.popup-info-image-select-type {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #606266;
						line-height: 24rpx;
					}
				}
			}

			.popup-info-stock {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #909399;
				line-height: 24rpx;
			}
		}

		.popup-info-specification {
			.popup-info-specification-title {
				font-size: 24rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #303133;
				line-height: 24rpx;
				margin-bottom: 24rpx;
			}

			margin: 48rpx 0rpx;

			.popup-info-specification-list {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.popup-info-specification-item {
					width: 208rpx;
					height: 60rpx;
					background: #F6F6F6;
					border-radius: 8rpx;
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
					line-height: 60rpx;
					text-align: center;
					border: 2rpx solid #F6F6F6;
				}

				.popup-info-specification-active-item {
					background: rgba(57, 90, 225, 0.1);
				}
			}
		}

		.popup-info-btn {
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			width: 100%;
			border-radius: 8rpx;

			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
		}
	}

	::v-deep .u-icon-plus {
		background-color: rgba(57, 90, 225, 0.1) !important;
		color: #395AE1 !important;
		width: 80rpx;
	}

	::v-deep .u-number-input {
		margin: 0rpx !important;
		background-color: #FFFFFF !important;
		width: 80rpx;
	}

	::v-deep .u-numberbox {
		width: 320rpx;
		height: 60rpx;
		border-radius: 8rpx;
		border: 2rpx solid #DCDFE6;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
