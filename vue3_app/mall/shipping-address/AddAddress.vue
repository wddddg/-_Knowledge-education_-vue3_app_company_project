<template>
	<view class="">
		<u-navbar :title="title"></u-navbar>
		<view class="add-or-edit-address-list">
			<view class="pd34">
				<view>联系人</view>
				<view>
					<u-input v-model="addressContent.receivedName" placeholder="请输入联系人" input-align="right"></u-input>
				</view>
			</view>
			<view class="pd34">
				<view>
					手机号码
				</view>
				<view>
					<u-input v-model="addressContent.receivedPhone" placeholder="请输入收货人手机号" input-align="right">
					</u-input>
				</view>
			</view>
			<view class="pd34">
				<view>
					地区
				</view>
				<view class="address-position">
					<!-- #ifdef MP-WEIXIN -->
					<u-input placeholder="点击选择地区" input-align="right" v-model="addressContent.area"
						@focus="selectPosition"></u-input>
					<!-- #endif -->
					<uni-data-picker ref="pickerData" placeholder="点击选择地区" popup-title="" @change="nodeclick"
						:localdata="localdata" :preload="true" :step-searh="true">
						<template #default>
							<u-input placeholder="点击选择地区" input-align="right" v-model="addressContent.area"
								@focus="selectPosition"></u-input>
						</template>
					</uni-data-picker>
					<u-icon name="map" color="#C0C4CC" :size="32" style="margin-left: 16rpx;" @click="selectPosition">
					</u-icon>
				</view>
			</view>
			<view class="address-details">
				<view>
					详细地址
				</view>
				<view>
					<u-input placeholder="请输入详细地址" input-align="right" type="textarea" :autoHeight="false"
						v-model="addressContent.addressDetails" :maxlength="140"
						:custom-style="{width:'400rpx',height:'152rpx',padding:'0rpx'}"></u-input>
				</view>
			</view>
			<view class="pd34">
				<view>
					默认地址
				</view>
				<view>
					<u-switch v-model="addressContent.isDefault" :size="40" active-color="#395AE1"></u-switch>
				</view>
			</view>
		</view>
		<view class="add-address-btn-box">
			<view class="add-address-btn" @click="addOrEditAddressBtn" :style="{background: buttonColor}">
				<label>保存</label>
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
		addressGetDetailsById,
		addUserAddress,
		editUserAddress,
		findAreaList
	} from '../Mall.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const title = ref('')
	const addressContent = ref({})
	const looking = ref(true)
	const pickerData = ref(null)
	const localdata = ref([])
	const addOrEditAddressBtn = async () => {
		if (!looking.value) return
		looking.value = false
		addressContent.value.isDefault = addressContent.value.isDefault ? 1 : 0
		addressContent.value.provinceName = addressContent.value.area.split(' ')[0]
		addressContent.value.province = addressContent.value.code.split(' ')[0]
		addressContent.value.cityName = addressContent.value.area.split(' ')[1]
		addressContent.value.city = addressContent.value.code.split(' ')[1]
		addressContent.value.countyName = addressContent.value.area.split(' ')[2]
		addressContent.value.county = addressContent.value.code.split(' ')[2]
		if (!(uni.$u.test.mobile(addressContent.value.receivedPhone))) {
			return uni.showToast({
				icon: 'none',
				title: '手机格式不正确'
			})
		}
		if (title.value === '修改收货地址') {
			await editUserAddress(addressContent.value).then(res => {
				uni.showToast({
					title: res.result,
					icon: 'success'
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1000)
			})
		}
		if (title.value === '新增收货地址') {
			await addUserAddress(addressContent.value).then(res => {
				uni.showToast({
					title: res.result,
					icon: 'success'
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1000)
			})
		}
		looking.value = true
	}
	const selectPosition = () => {
		pickerData.value.show()
	}
	const nodeclick = async (e) => {
		pickerData.value.show()
		if (e) {
			let data = ''
			let code = ''
			e.detail.value.forEach((item, index) => {
				if (index === e.detail.value.length - 1) {
					data += item.text
					code += item.value
				} else {
					data += item.text + ' '
					code += item.value + ' '
				}
			})
			addressContent.value.area = data
			addressContent.value.code = code
			pickerData.value.hide()
		}
	}
	onLoad(async (value) => {
		title.value = value.id != 0 ? '修改收货地址' : '新增收货地址'
		if (value.id != 0) {
			await addressGetDetailsById({
				id: value.id
			}).then(res => {
				addressContent.value = res.result
				addressContent.value.area = res.result.provinceName + ' ' + res.result.cityName + ' ' +
					res.result.countyName || ''
				addressContent.value.code = res.result.province + ' ' + res.result.city + ' ' +
					res.result.county || ''
			})
		} else {
			addressContent.value = {}
		}
		await findAreaList().then(res => {
			localdata.value = res.result.map((item) => {
				return {
					text: item.areaName,
					value: item.areaNo,
					children: [
						...item.systemCityList.map((itemfirst) => {
							return {
								text: itemfirst.areaName,
								value: itemfirst.areaNo,
								children: [
									...itemfirst.systemCityList.map((
										itemsecord) => {
										return {
											text: itemsecord.areaName,
											value: itemsecord.areaNo,
										}
									})
								]
							}
						})
					],
				}
			})
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	::v-deep .dialog-close {
		top: 50rpx;
	}

	.add-or-edit-address-list {
		padding: 0rpx 40rpx;

		.pd34 {
			padding: 34rpx 0rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #DCDFE6;

			.address-position {
				display: flex;
				align-items: center;
			}
		}

		.address-details {
			padding: 34rpx 0rpx;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			border-bottom: 2rpx solid #DCDFE6;
		}
	}

	.add-address-btn-box {
		width: 100%;
		position: absolute;
		bottom: 76rpx;
		padding: 0rpx 40rpx;

		.add-address-btn {
			width: 100%;
			height: 88rpx;
			border-radius: 8rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
			text-align: center;
		}
	}

	.hideen {
		display: none;
	}
</style>
