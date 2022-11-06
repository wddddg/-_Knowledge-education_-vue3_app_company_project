<template>
	<view class="">
		<u-navbar title="地址管理"></u-navbar>
		<view class="shipping-address-list" v-if="addressList.length">
			<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in addressList" :key="item.id"
				@click="clickOptions(item.id)" @open="openDelete" :options="options">
				<view class="shipping-address-item" @click="selectCurrentAddress(item.id)">
					<view class="shipping-address-item-top">
						<view class="shipping-address-item-top-name">{{ item.receivedName }}</view>
						<view class="shipping-address-item-top-phone">{{ item.receivedPhone }}</view>
						<view class="shipping-address-item-top-box" v-if="item.isDefault">默认</view>
					</view>
					<view class="shipping-address-item-center">{{ item.provinceName }} {{ item.cityName }}
						{{ item.countyName }}
					</view>
					<view class="shipping-address-item-bottom">
						<view class="shipping-address-item-bottom-text">{{ item.addressDetails }}</view>
						<view class="shipping-address-item-bottom-image" @click="goEditAddress(item.id)">
							<u-image src="@/static/mall/address-edit.png" :width="32" :height="32"></u-image>
						</view>
					</view>
				</view>
			</u-swipe-action>
		</view>
		<view class="" v-else>
			<NoState :isPage="true" type="position">
				<template #text>
					<view>暂无收货地址！</view>
				</template>
			</NoState>
		</view>
		<view class="add-address-btn-box">
			<view class="add-address-btn" @click="addAddressBtn" :style="{background: buttonColor}">
				<u-icon name="plus" color="#fff" :size="24"></u-icon>
				<label>新建收货地址</label>
			</view>
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
		addressListForPage,
		addressDeleteById
	} from '../Mall.api.ts'
	import NoState from '@/components/NoState.vue'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	let params = {
		pageNo: 1,
		pageSize: 10
	}
	const addressList = ref([])
	const options = [{
		text: '删除',
		style: {
			backgroundColor: '#dd524d'
		}
	}]
	const selectCurrentSwitch = ref(false)
	const clickOptions = async (e) => {
		await addressDeleteById({
			id: e
		}).then(res => {
			uni.showToast({
				title: res.result,
				icon: "success"
			})
		})
		await addressListForPage(params).then(res => {
			addressList.value = res.result.records
		})
	}
	const openDelete = (index) => {
		addressList.value[index].show = true;
		addressList.value.map((val, idx) => {
			if (index != idx) addressList.value[idx].show = false;
		})
	}
	const addAddressBtn = () =>{
		uni.navigateTo({
			url:'/mall/shipping-address/AddAddress?id=' + 0
		})
	}
	const goEditAddress = (id) =>{
		uni.navigateTo({
			url:'/mall/shipping-address/AddAddress?id=' + id
		})
	}
	const selectCurrentAddress = (e) =>{
		if(selectCurrentSwitch.value){
			uni.$emit('currentDetailsAddress',e)
			uni.navigateBack()
		}else{
			return
		}
	}
	onLoad(async (type) => {
		if(type?.type === 'select'){
			selectCurrentSwitch.value = true
		}
	})
	onShow(async() =>{
		await addressListForPage(params).then(res => {
			addressList.value = res.result.records
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	::v-deep .u-swipe-del{
		position: relative;
		left: 2rpx;
	}
	.shipping-address-list {
		padding: 0rpx 40rpx;

		.shipping-address-item {
			padding: 24rpx 0rpx;
			border-bottom: 2rpx solid #DCDFE6;
			overflow: hidden;
			border-right: 2rpx solid #fff;
			.shipping-address-item-top {
				display: flex;
				align-items: center;
				line-height: 32rpx;

				.shipping-address-item-top-box {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #EE5142;
					padding: 0rpx 8rpx;
					border: 2rpx solid #EE5142;
				}

				.shipping-address-item-top-phone {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					margin: 0rpx 16rpx;
				}

				.shipping-address-item-top-name {
					font-size: 30rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #303133;
				}
			}

			.shipping-address-item-center {
				font-size: 24rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #909399;
				line-height: 24rpx;
				margin: 16rpx 0rpx 12rpx;
			}

			.shipping-address-item-bottom {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				line-height: 40rpx;

				.shipping-address-item-bottom-text {
					margin-right: 48rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;

					white-space: pre-line;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.shipping-address-item-bottom-image {}
			}
		}
	}
	.add-address-btn-box{
		width: 100%;
		position: absolute;
		bottom: 76rpx;
		padding: 0rpx 40rpx;
		.add-address-btn{
			width: 100%;
			height: 88rpx;
			border-radius: 8rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
			text-align: center;
			label{
				margin-left: 16rpx;
			}
		}
	}
</style>
