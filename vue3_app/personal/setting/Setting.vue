<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<u-navbar title="设置"></u-navbar>
		<view class="setting-box">
			<view class="setting-item" v-for="(item,index) in settingList" :key="index"
				@click="goSettingItem(item.title)" v-show="item.show">
				<view class="setting-title">{{ item.title }}</view>
				<view class="rigt">
					<!-- <label v-if="item.twoTitle" class="setting-two-title" @click.stop="bindingWeChat"></label> -->
					<button v-if="item.twoTitle" class="setting-two-title" :style="{color:buttonColor}"
						@click.stop="getUserInfo">{{ item.twoTitle }}</button>
					<label v-if="item.threeTitle" class="setting-three-title">{{ item.threeTitle }}</label>
					<u-icon v-if="item.arrowRight != false" name="arrow-right" color="#909399" size="28"></u-icon>
					<u-switch v-if="item.switch" v-model="userInfo.pushStatus" @change="changeStatus" :size="33"
						:active-color="buttonColor">
					</u-switch>
				</view>
			</view>
		</view>
		<view class="setting-bottom-btn-box">
			<view class="setting-bottom-btn" @click="exitAccount" :style="{
			border: `2rpx solid ${buttonColor}`, color:buttonColor }">
				退出账号
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue'
	import {
		onLoad,
		onReady
	} from '@dcloudio/uni-app'
	import {
		editUserMessage,
		addWechatOpenId,
		wechatLoginGetOpenId,
		getUserCenter
	} from '../Personal.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const fileSizeString = ref('0B')
	const settingList = ref([{
			title: '绑定微信',
			twoTitle: '去绑定',
			show: true
		},
		{
			title: '更换手机',
			show: true
		},
		{
			title: '修改密码',
			show: true
		},
		{
			title: '推送提醒',
			arrowRight: false,
			switch: true,
			show: true
		},
		{
			title: '用户隐私政策',
			show: true
		},
		{
			title: '用户服务政策',
			show: true
		},
		{
			title: '关于我们',
			show: true
		},
		{
			title: '清除缓存',
			threeTitle: fileSizeString.value,
			show: true
		},
		{
			title: '版本升级',
			show: true
		},
	])
	const checked = ref(false)
	const userInfo = ref({})
	const exitAccount = () => {
		uni.removeStorage({
			key: 'user',
			success: () => {
				uni.showToast({
					title: '退出成功',
					duration: 2000
				});
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}, 1000)
			}
		})
	}
	const goSettingItem = (e) => {
		if (e === '更换手机') {
			uni.navigateTo({
				url: '/personal/setting/ChangePhone'
			})
		}
		if (e === '修改密码') {
			uni.navigateTo({
				url: '/personal/setting/ChangePassword'
			})
		}
		if (e === '用户隐私政策') {
			uni.navigateTo({
				url: '/personal/DocInfo?type=' + 2
			})
		}
		if (e === '用户服务政策') {
			uni.navigateTo({
				url: '/personal/DocInfo?type=' + 1
			})
		}
		if (e === '关于我们') {
			uni.navigateTo({
				url: '/personal/DocInfo?type=' + 3
			})
		}
		if (e === '清除缓存') {
			clearCache()
		}
	}
	const bindingWeChat = (res) => {
		uni.login({
			"provider": "weixin",
			"onlyAuthorize": true, // 微信登录仅请求授权认证
			success: function(event) {
				const {
					code
				} = event
				console.log('微信登录仅请求授权认证', res);
				wechatLoginGetOpenId({
					code: code
				}).then(resp => {
					let type = uni.getStorageSync('useDevice')
					if (type.uniPlatform == 'web') {
						type = 3
					} else if (type.uniPlatform == 'mp-weixin') {
						type = 2
					} else if (type.uniPlatform == 'app') {
						type = 1
					} else {
						type = 2
					}
					const parasm = {
						"inviteCode": "",
						"userId": uni.getStorageSync('user').userId,
						"wxAuthDevice": type,
						"wxName": res.userInfo.nickName || '',
						"wxOpenid": resp.result.openid || '',
						"wxUnionid": resp.result.wxUnionid || '',
					}
					addWechatOpenId({
						...parasm
					}).then((rep) => {
						console.log(rep);
					})
				})
			},
			fail: function(err) {
				// 登录授权失败  
				// err.code是错误码
			}
		})
	}
	const getUserInfo = async (e) => {
		uni.getUserProfile({
			desc: "授权信息登录",
			lang: "zh-CN",
			success: async (res) => {
				bindingWeChat(res)
			},
		});
	}
	const changeStatus = async (value) => {
		if (value) {
			let params = {
				pushStatus: 1,
			}
			await editUserMessage(params).then(res => {
				if (res.code === 200) {
					uni.showToast({
						icon: 'success',
						title: '已开启推送提醒'
					})
				}
			})
		} else {
			let params = {
				status: 0,
			}
			await editUserMessage(params).then(res => {
				if (res.code === 200) {
					uni.showToast({
						icon: 'success',
						title: '已关闭推送提醒'
					})
				}
			})
		}
	}

	const clearCache = () => {
		// #ifdef APP
		let os = plus.os.name;
		if (os == 'Android') {
			let main = plus.android.runtimeMainActivity();
			let sdRoot = main.getCacheDir();
			let files = plus.android.invoke(sdRoot, "listFiles");
			let len = files.length;
			for (let i = 0; i < len; i++) {
				let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
				plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
					if (entry.isDirectory) {
						entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
							uni.showToast({
								title: '缓存清理完成',
								duration: 2000
							});
							formatSize(); // 重新计算缓存  
						}, function(e) {
							console.log(e.message)
						});
					} else {
						entry.remove();
					}
				}, function(e) {
					console.log('文件路径读取失败')
				});
			}
		} else { // ios  
			plus.cache.clear(function() {
				uni.showToast({
					title: '缓存清理完成',
					duration: 2000
				});
				formatSize();
			});
		}
		// #endif
		uni.showToast({
			title: '缓存清理完成',
			duration: 2000
		});
	}

	const formatSize = () => {
		plus.cache.calculate(function(size) {
			let sizeCache = parseInt(size);
			if (sizeCache == 0) {
				fileSizeString.value = "0B";
			} else if (sizeCache < 1024) {
				fileSizeString.value = sizeCache + "B";
			} else if (sizeCache < 1048576) {
				fileSizeString.value = (sizeCache / 1024).toFixed(2) + "KB";
			} else if (sizeCache < 1073741824) {
				fileSizeString.value = (sizeCache / 1048576).toFixed(2) + "MB";
			} else {
				fileSizeString.value = (sizeCache / 1073741824).toFixed(2) + "GB";
			}
		});
	}

	onLoad(async () => {
		await getUserCenter().then(res => {
			userInfo.value = res.result
		})
		if (userInfo.value.wxName) {
			settingList.value[0].twoTitle = userInfo.value.wxStatus ? (userInfo.value.wxName || '去绑定') : '去绑定'
		}
		// #ifdef APP
		formatSize()
		// #endif
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.rigt {
		display: flex;
		align-items: center;
	}

	.setting-box {
		padding: 0rpx 40rpx;

		.setting-item {
			padding: 34rpx 0rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #DCDFE6;

			.setting-title {
				font-size: 30rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				line-height: 40rpx;
			}

			.setting-two-title {
				display: inline-block;
				background-color: none;
				background: none;
				border: none;
				outline: none;
				font-size: 30rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: $u-global-color;
				margin-right: 24rpx;
				line-height: 40rpx;
				padding: 0;

				&::after {
					display: none !important;
				}
			}

			.setting-three-title {
				margin-right: 24rpx;
				color: #303133;
			}
		}
	}

	.setting-bottom-btn-box {
		padding: 0rpx 40rpx;
		position: absolute;
		width: 100%;
		bottom: 76rpx;

		.setting-bottom-btn {
			border-radius: 8rpx;
			text-align: center;
			padding: 24rpx 0rpx;

			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			line-height: 40rpx;
		}
	}
</style>
