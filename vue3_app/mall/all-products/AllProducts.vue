<template>
	<view class="container" :style="{'--theme-color':themeColor}">
		<u-navbar title="全部商品"></u-navbar>
		<view class="top_box">
			<view class="search-box" style="width: 100%;">
				<view class="search-ipt">
					<u-icon name="search" :size="32" color="#909399"></u-icon>
					<u-input @confirm="doSearch" placeholder="请输入搜索内容" v-model="searchIptValue"
						:customStyle="{marginLeft: '16rpx',width: '400rpx'}" :height="40"></u-input>
				</view>
				<view class="search-right">
					<view class="search-right-box"></view>
					<label @click="clearIptValue">取消</label>
				</view>
			</view>
			<u-image class="images" src="@/static/course/feng-l2x.png" mode="scaleToFill" @click="goCategory"
				:width="48" :height="48"></u-image>
		</view>
		<view class="filter-box">
			<view class="filter-box-left">
				<u-dropdown ref="uDropdowns" menu-icon="arrow-down-fill" :active-color="buttonColor">
					<u-dropdown-item title="筛选">
						<view class="slot-content">
							<view>
								<view class="close-box" @click="closeDropdownItem">
									<u-icon name="close" :size="5" color="#FFFFFF"
										:customStyle="{transform: 'scale(0.5)', position: 'relative',top: '-10rpx',left: '3rpx'}">
									</u-icon>
								</view>
								<view class="slot-content-title">商品性质</view>
								<view class="slot-content-list">
									<view class="slot-content-item" v-for="(item,index) in productsList" :key="index"
										:class="currentProductisItem === index? 'actvieItem' : ''"
										:style="{color:currentProductisItem === index? buttonColor : '', border: currentProductisItem === index? `2rpx solid ${buttonColor}`: ''}"
										@click="changeCurrentPorductisItem(index)">{{ item.name }}</view>
								</view>
								<view class="slot-content-title">商品性质</view>
								<view class="slot-content-list">
									<view class="slot-content-item" v-for="(item,index) in payStateList" :key="index"
										:class="currentPayStateItem === index? 'actvieItem' : ''"
										:style="{color:currentPayStateItem === index? buttonColor : '', border: currentPayStateItem === index? `2rpx solid ${buttonColor}`: ''}"
										@click="changepayStateItem(index)">{{ item.name }}</view>
								</view>
								<view class="slot-content-lbottom-btn">
									<view class="reset-btn" @click="resetCurrentItem"
										:style="{color: buttonColor , border: `2rpx solid ${buttonColor}`}">
										重置
									</view>
									<view class="sure-btn" @click="sureCurrentItem"
										:style="{background: buttonColor,border: `2rpx solid ${buttonColor}`}">
										确定
									</view>
								</view>
							</view>
						</view>
					</u-dropdown-item>
				</u-dropdown>
			</view>
			<view class="filter-box-right" @click="changeProductsSort">
				<u-image src="@/static/mall/horizontal-row.png" :width="32" :height="32" v-if="currentRow"></u-image>
				<u-image src="@/static/mall/vertical-row.png" :width="32" :height="32" v-else></u-image>
			</view>
		</view>
		<view v-if="productList.length">
			<view class="products-list">
				<view class="products-horizontal-item" v-for="item in productList" v-if="currentRow">
					<view class="products-horizontal-item-image">
						<u-image :src="item.imgUrl" :width="288" :height="220"></u-image>
					</view>
					<view class="products-horizontal-item-title">{{ item.name || '&nbsp;' }}</view>
					<view class="products-horizontal-item-price">
						{{ item.payRule === 1 ? (item.integralAmount || 0) + '积分' : item.payRule === 2 ? '¥' + (item.price || 0) : (item.integralAmount || 0) + '积分' + '+' + '¥' + (item.price || 0) }}
					</view>
					<view class="products-horizontal-item-btn" :style="{background: item.status? buttonColor : ''}"
						@click="goDetails(item.goodsType,item.id)">
						{{ item.goodsType === 2 ? '立即兑换' : '立即购买'}}
					</view>
				</view>
				<view class="products-vertical-item" v-for="item in productList" v-else>
					<view>
						<u-image :src="item.imgUrl" :width="204" :height="172"></u-image>
					</view>
					<view class="products-vertical-item-right">
						<view class="products-vertical-item-title">{{ item.name || '&nbsp;' }}</view>
						<view class="products-vertical-item-price">
							{{ item.payRule === 1 ? (item.integralAmount || 0) + '积分' : item.payRule === 2 ? '¥' + (item.price || 0) : (item.integralAmount || 0) + '积分' + '+' + '¥' + (item.price || 0) }}
						</view>
						<view class="products-vertical-item-btn" :style="{background: item.status? buttonColor : ''}"
							@click="goDetails(item.goodsType,item.id)">
							{{ item.goodsType === 2 ? '立即兑换' : '立即购买'}}
						</view>
					</view>
				</view>
			</view>
			<u-loadmore class="loadmore" :status="loadStatus" icon-type="flower" :load-text="loadText" />
		</view>
		<view v-else>
			<NoState type="celestial" :isPage="true">
				<template #text>
					<view>暂无商品！</view>
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
		listForGoodsPage
	} from '../Mall.api.ts'
	import {
		onLoad,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app";
	import NoState from '@/components/NoState.vue'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	let params = {
		pageNo: 1,
		pageSize: 10,
		goodsCategory: 0,
		payRule: 0
	}
	const searchIptValue = ref('')
	const uDropdowns = ref(null)
	const currentProductisItem = ref(0)
	const currentPayStateItem = ref(0)
	const currentRow = ref(true)
	const productList = ref([])
	const loadText = ref({
		loading: '正在加载',
		nomore: '没有更多了'
	})
	const loadStatus = ref('nomore')
	const productsList = [{
		name: '全部'
	}, {
		name: '实物'
	}, {
		name: '虚拟'
	}]
	const payStateList = [{
		name: '全部'
	}, {
		name: '积分'
	}, {
		name: '现金'
	}, {
		name: '积分+现金'
	}]
	const changepayStateItem = (e) => {
		currentPayStateItem.value = e
	}
	const changeCurrentPorductisItem = (e) => {
		currentProductisItem.value = e
	}
	const clearIptValue = async() => {
		searchIptValue.value = ''
		await resetCurrentItem();
	}
	const closeDropdownItem = () => {
		uDropdowns.value.close()
	}
	const resetCurrentItem = async () => {
		currentProductisItem.value = 0
		currentPayStateItem.value = 0
		params.goodsCategory = currentProductisItem.value
		params.payRule = currentPayStateItem.value
		params.pageNo = 1
		await listForGoodsPage(params).then((res) => {
			productList.value = res.result.records
		})
		uDropdowns.value.close()
	}
	const sureCurrentItem = async () => {
		params.goodsCategory = currentProductisItem.value
		params.payRule = currentPayStateItem.value
		params.pageNo = 1
		await listForGoodsPage(params).then((res) => {
			productList.value = res.result.records
		})
		uDropdowns.value.close()
	}
	const changeProductsSort = () => {
		currentRow.value = !currentRow.value
	}

	const goCategory = () => {
		uni.navigateTo({
			url: '/exam/category/category-list?page=product'
		})
		uni.$on('productCate', async function(data) {
			params.twoClassifyId = data
			params.pageNo = 1
			await listForGoodsPage(params).then((res) => {
				productList.value = res.result.records
			})
		})
	}
	const goDetails = (e, id) => {
		if (e === 2) {
			uni.navigateTo({
				url: '/mall/all-products/VirtualProductDetails?id=' + id
			})
		} else {
			uni.navigateTo({
				url: '/mall/all-products/PhysicalGoodsDetails?id=' + id
			})
		}
	}
	const doSearch = async (e) => {
		params.name = e
		await resetCurrentItem()
	}
	onLoad(async () => {
		await listForGoodsPage(params).then(res => {
			productList.value = res.result.records
			console.log(res.result);
		})
	})
	onReachBottom(async () => {
		loadStatus.value = 'loading'
		params.pageNo++
		await listForGoodsPage(params).then((res) => {
			productList.value.push(...res.result.records)
			if (!res.result.records.length) {
				loadStatus.value = 'nomore'
			} else {
				loadStatus.value = 'loadmore'
			}
		})
	})
	onPullDownRefresh(async () => {
		params.pageNo = 1
		await listForGoodsPage(params).then((res) => {
			productList.value = res.result.records
		})
		uni.stopPullDownRefresh()
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.products-list {
		padding: 0rpx 40rpx;
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;

		.products-horizontal-item {
			width: 320rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			padding: 16rpx 16rpx 24rpx;

			.products-horizontal-item-title {
				margin: 24rpx 0rpx 16rpx;
				font-size: 30rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #303133;
				line-height: 44rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.products-horizontal-item-price {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #EE5142;
				line-height: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-bottom: 24rpx;
			}

			.products-horizontal-item-btn {
				width: 288rpx;
				height: 60rpx;
				background: #C0C7D1;
				border-radius: 8rpx;
				text-align: center;
				line-height: 60rpx;

				font-size: 24rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
			}
		}

		.products-vertical-item {
			width: 670rpx;
			height: 220rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			margin-bottom: 32rpx;
			padding: 24rpx;
			display: flex;

			.products-vertical-item-right {
				margin-left: 24rpx;

				.products-vertical-item-title {
					font-size: 30rpx;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #303133;
					line-height: 44rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 390rpx;
				}

				.products-vertical-item-price {
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #EE5142;
					line-height: 28rpx;
					margin: 16rpx 0rpx 24rpx;
				}

				.products-vertical-item-btn {
					width: 160rpx;
					height: 60rpx;
					background: #C0C7D1;
					border-radius: 8rpx;
					text-align: center;
					line-height: 60rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
		}
	}

	.slot-content {
		width: 750rpx;
		height: 548rpx;
		background: #FFFFFF;
		border-radius: 0rpx 0rpx 12rpx 12rpx;
		padding: 40rpx 40rpx;
		position: relative;

		.close-box {
			position: absolute;
			right: 0;
			top: 0;
			width: 28rpx;
			height: 28rpx;
			background: #000000;
			opacity: 0.7;
			border-bottom-left-radius: 100%;
			text-align: center;
		}

		.slot-content-title {
			font-size: 24rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #303133;
			line-height: 24rpx;
			margin-bottom: 24rpx;
		}

		.slot-content-list {
			margin-bottom: 24rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;

			.slot-content-item {
				width: 208rpx;
				height: 60rpx;
				background: #F6F6F6;
				border-radius: 8rpx;
				text-align: center;

				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 60rpx;
				border: 2rpx solid #F6F6F6;
				margin-bottom: 24rpx;
			}

			.actvieItem {
				background: rgba(57, 90, 225, 0.1);
			}
		}

		.slot-content-lbottom-btn {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.sure-btn {
				width: 304rpx;
				height: 72rpx;
				border-radius: 8rpx;
				text-align: center;
				line-height: 72rpx;
				color: #FFFFFF;
			}

			.reset-btn {
				width: 304rpx;
				height: 72rpx;
				border-radius: 8rpx;
				text-align: center;
				line-height: 72rpx;
			}
		}
	}

	.container {
		// padding: 0rpx 40rpx;
	}

	.top_box {
		padding: 0rpx 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.search-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-right: 30rpx;
		padding: 16rpx 32rpx;
		border-radius: 8rpx;
		border: 2rpx solid #DCDFE6;

		.search-ipt {
			display: flex;
			align-items: center;
		}

		.search-right {
			display: flex;
			align-items: center;

			.search-right-box {
				width: 2rpx;
				height: 32rpx;
				border: 2rpx solid #E0E2E4;
				margin-right: 20rpx;
			}

			label {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #969696;
				line-height: 32rpx;
			}
		}
	}

	.filter-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 40rpx;
		position: relative;

		.filter-box-left {
			width: 100%;
			text-align: left;
		}

		.filter-box-right {
			margin-right: 40rpx;
			// position: absolute;
			// right: 0;
			// top: 15rpx;
		}
	}

	::v-deep .u-dropdown__menu {
		height: 64rpx !important;
	}

	::v-deep .u-dropdown__menu__item {
		justify-content: left;
		margin-left: 40rpx;
		flex: 0 0 100rpx;
	}

	::v-deep .u-dropdown__content {
		width: auto;
	}
</style>
