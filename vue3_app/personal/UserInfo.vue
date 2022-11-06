<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<u-navbar title="个人信息"></u-navbar>
		<view class="user-info">
			<view class="user-avatar user-info-card">
				<view class="user-info-tile">头像</view>
				<view class="user-avatar-right" @click="showActionSheetClick('avatar')">
					<u-image src="@/static/user/user-avatar.png" :width="120" :height="120" borderRadius="50%"
						v-if="!userAvatar"></u-image>
					<u-avatar :src="userAvatar" :width="120" :height="120" borderRadius="50%" v-else></u-avatar>
					<u-icon name="arrow-right" color="#909399" class="avatar-icon-right"></u-icon>
				</view>
			</view>
			<view class="user-nickName user-info-card">
				<view class="user-info-tile">
					昵称
				</view>
				<view>
					<u-input v-model="nickName" :maxlength="10" placeholder="请输入用户名" input-align="right"></u-input>
				</view>
			</view>
			<view class="user-sex user-info-card">
				<view class="user-info-tile">
					性别
				</view>
				<view @click="showActionSheetClick('sex')">
					{{ currentSex }}
					<u-icon name="arrow-right" color="#909399" class="avatar-icon-right"></u-icon>
				</view>
			</view>
			<view class="user-idiograph">
				<view class="user-info-tile">
					个性签名
				</view>
				<view class="user-input">
					<u-input v-model="userIptValue" :maxlength="999" type="textarea" placeholder="请输入个性签名"
						:auto-height="false" />
				</view>
			</view>
		</view>
		<view class="save-user-btn">
			<view class="save-user-info" @click="saveUserInfo" :style="{background: buttonColor}">
				保存
			</view>
		</view>
		<u-action-sheet :list="listActionSheet" v-model="showActionSheet" @click="clickActionSheet"></u-action-sheet>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import {
		ref
	} from 'vue'
	import {
		getUserDetails,
		systemMemberEdit
	} from './Personal.api.ts'
	import baseURL from '@/common/baseURL.js'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const userIptValue = ref('')
	const nickName = ref('')
	const userSex = ref(0)
	const userAvatar = ref('')
	const listActionSheet = ref([])
	const showActionSheet = ref(false)
	const currentSelectActionSheet = ref('avatar')
	const currentSex = ref('男')
	const showActionSheetClick = (value) => {
		currentSelectActionSheet.value = value
		if (currentSelectActionSheet.value === 'avatar') {
			listActionSheet.value = [{
				text: "拍照"
			}, {
				text: "从相册中选择"
			}]
		}
		if (currentSelectActionSheet.value === 'sex') {
			listActionSheet.value = [{
				text: "男"
			}, {
				text: "女"
			}]
		}
		showActionSheet.value = true
	}
	const clickActionSheet = (e) => {
		if (currentSelectActionSheet.value === 'sex') {
			if (e) {
				currentSex.value = '女'
			} else {
				currentSex.value = '男'
			}
		} else {
			if (!e) {
				uni.chooseImage({
					sourceType: ['camera'],
					count: 1,
					success(res) {
						uni.uploadFile({
							url: baseURL + '/api/common/upload',
							// #ifdef MP-WEIXIN
							file: res.tempFilePaths[0],
							formData: {
								file: res.tempFilePaths[0]
							},
							// files: res.tempFilePaths,
							name: 'file',
							filePath: res.tempFilePaths[0],
							// #endif
							// #ifndef MP-WEIXIN
							file: res.tempFiles[0],
							formData: {
								file: res.tempFiles[0]
							},
							files: res.tempFiles,
							name: 'file',
							// #endif
							header: {
								token: uni.getStorageSync("user").token,
								"X-Access-Token": uni.getStorageSync("user").token
							},
							success: (res) => {
								let data = JSON.parse(res.data)
								userAvatar.value = data.message
							},
							fail: (res) => {
								console.log(res);
							},
						})
					}
				})
			} else {
				uni.chooseImage({
					sourceType: ['album'],
					count: 1,
					success(res) {
						uni.uploadFile({
							url: baseURL + '/api/common/upload',
							// #ifdef MP-WEIXIN
							file: res.tempFilePaths[0],
							formData: {
								file: res.tempFilePaths[0]
							},
							// files: res.tempFilePaths,
							name: 'file',
							filePath: res.tempFilePaths[0],
							// #endif
							// #ifndef MP-WEIXIN
							file: res.tempFiles[0],
							formData: {
								file: res.tempFiles[0]
							},
							files: res.tempFiles,
							name: 'file',
							// #endif
							header: {
								token: uni.getStorageSync("user").token,
								"X-Access-Token": uni.getStorageSync("user").token
							},
							success: (res) => {
								let data = JSON.parse(res.data)
								userAvatar.value = data.message
							},
							fail: (res) => {
								console.log(res);
							},
						})
					}
				})
			}
		}
	}
	const saveUserInfo = async () => {
		let params = {
			signDesc: userIptValue.value,
			nickName: nickName.value,
			sex: currentSex.value === '男' ? 0 : 1,
			headImg: userAvatar.value,
			// id: user
		}
		if (params.signDesc.length > 30) {
			uni.showToast({
				title: '个性签名不能超过30个字！',
				icon: 'none'
			})
			return
		}
		if (params.nickName.length > 10) {
			uni.showToast({
				title: '用户昵称不能超过10个字！',
				icon: 'none'
			})
			return
		}
		await systemMemberEdit(params).then(res => {
			if (res.code === 200) {
				uni.showToast({
					title: '修改成功',
					icon: 'none'
				})
			}
		})
		setTimeout(() => {
			uni.navigateBack()
		}, 1000)
	}
	onLoad(async () => {
		await getUserDetails().then(res => {
			userAvatar.value = res.result.headImg
			nickName.value = res.result.nickName
			userSex.value = res.result.sex
			if (userSex.value) {
				currentSex.value = '女'
			} else {
				currentSex.value = '男'
			}
			userIptValue.value = res.result.signDesc
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.save-user-btn {
		padding: 0 40rpx;
		position: absolute;
		width: 100%;
		bottom: 76rpx;

		.save-user-info {
			height: 88rpx;
			border-radius: 8rpx;

			text-align: center;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;
		}
	}

	.user-info {
		padding: 0rpx 40rpx;
	}

	.user-info-tile {
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #606266;
		line-height: 40rpx;
		// width: 40%;
	}

	.user-info-card {
		padding: 32rpx 0rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #DCDFE6;
	}

	.avatar-icon-right {
		margin-left: 32rpx;
	}

	.user-avatar {
		.user-avatar-right {
			display: flex;
			align-items: center;
		}
	}

	.user-idiograph {
		padding: 32rpx 0rpx;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		border-bottom: 1rpx solid #DCDFE6;

		.user-input {
			margin-left: 62rpx;
			flex: 1;
		}
	}

	::v-deep .u-input__textarea {
		padding: 0;
	}
</style>
