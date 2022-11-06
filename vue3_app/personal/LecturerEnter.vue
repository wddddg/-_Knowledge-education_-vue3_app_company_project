<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view>
			<u-navbar title="讲师入驻"></u-navbar>
		</view>
		<view class="lecturer-enter-box">
			<view class="lecturer-enter-item">
				<view class="item-left">姓名</view>
				<view>
					<u-input v-model="form.nickName" placeholder="请输入姓名" input-align="right" />
				</view>
			</view>
			<view class="lecturer-enter-item">
				<view class="item-left">手机号</view>
				<view>
					<u-input v-model="form.phone" placeholder="请输入联系方式" input-align="right" />
				</view>
			</view>
			<view class="lecturer-enter-item">
				<view class="item-left">证件号</view>
				<view>
					<u-input v-model="form.idNumber" placeholder="请输入证件号" input-align="right" />
				</view>
			</view>
			<view class="lecturer-enter-item">
				<view class="item-left">擅长专业</view>
				<view>
					<u-input v-model="form.specialty" placeholder="请输入专业" input-align="right" />
				</view>
			</view>
			<view class="lecturer-enter-item">
				<view class="item-left">自我推荐</view>
				<view class="item-right">
					<u-input v-model="form.recommend"  :customStyle="{height: '100rpx'}" :maxlength="999999" placeholder="说一下你的闪光点吧" input-align="right" type="textarea" :autoHeight="false" />
				</view>
			</view>
		</view>
		<view class="lecturer-enter-bottom-box-position"></view>
		<view class="lecturer-enter-bottom-box">
			<view class="lecturer-enter-bottom-title">
				<u-image src="@/static/total-left.png" :width="24" :height="24"></u-image>
				<label>讲师说明</label>
				<u-image src="@/static/total-right.png" :width="26" :height="26"></u-image>
			</view>
			<view class="lecturer-enter-list">
				<view class="lecturer-enter-item" v-for="(item,index) in list" :key="index">
					<view class="lecturer-enter-item-title-number">
						{{ index+1 }}
					</view>
					<u-image src="@/static/teacher-explain-item.png" :width="56" :height="60"></u-image>
					<label>{{ item.title }}</label>
				</view>
			</view>
		</view>
		<view class="lecturer-enter-btn-box">
			<view class="lecturer-enter-btn" @click="applyImmediately" :style="{background: buttonColor}">
				立即申请
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
		onReady
	} from '@dcloudio/uni-app'
	import {
		applyTeacher
	} from './Personal.api.ts'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const list = [{
		title: '独立讲师端'
	}, {
		title: '自由提现'
	}, {
		title: '可与线下课结合'
	}, {
		title: '课程营销'
	}, {
		title: '独立班级'
	}, {
		title: '丰厚客源'
	}]
	const locking = ref(true)
	const form = ref({
		nickName: '',
		phone: '',
		idNumber: '',
		recommend: '',
		specialty: ''
	})
	const applyImmediately = async () => {
		let teacherInfoDTO = {
			name: form.value.nickName,
			cellphone: form.value.phone,
			idCard: form.value.idNumber,
			operateStatus: 1,
			summary: form.value.recommend,
			subjectName: form.value.specialty
		}
		if (teacherInfoDTO.name.length === 0) {
			uni.showToast({
				title: '请输入用户名',
				icon: "none"
			})
			return;
		}
		if (!(/^1[34578]\d{9}$/.test(teacherInfoDTO.cellphone))) {
			uni.showToast({
				title: '手机号码格式错误',
				icon: "none"
			})
			// 
			return
		}
		if (!(/^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[\d|X|x]$/.test(
				teacherInfoDTO.idCard))) {
			uni.showToast({
				title: '证件号格式错误',
				icon: "none"
			})
			return
		}
		if (locking.value) {
			await applyTeacher(teacherInfoDTO).then(res => {
				if (res.code === 200) {
					uni.showToast({
						title: '申请已提交',
						duration: 2000
					});
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}
			})
		}
		locking.value = false
	}
	onReady(() => {})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	.lecturer-enter-box {
		padding: 0rpx 40rpx;
		margin-bottom: 600rpx;
		.lecturer-enter-item {
			padding: 34rpx 0rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #DCDFE6;

			.item-left {
				font-size: 30rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #606266;
				line-height: 40rpx;
			}

			.item-right {
				width: 70%;
				height: 100rpx;
				overflow: auto;
			}
		}
	}
	.lecturer-enter-bottom-box {
		padding: 0rpx 40rpx;
		position: fixed;
		bottom: 244rpx;
		width: 100%;
		background-color: #fff;
		.lecturer-enter-bottom-title {
			display: flex;
			align-items: flex-start;
			justify-content: center;
			margin-top: 20rpx;
			label {
				font-size: 28rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #1B1E27;
				line-height: 40rpx;
				margin: 0rpx 16rpx;
			}

			margin-bottom: 24rpx;
		}

		.lecturer-enter-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;

			.lecturer-enter-item {
				margin-top: 32rpx;
				width: 48%;
				background-color: #ECF1FE;
				display: flex;
				align-items: center;
				position: relative;

				.lecturer-enter-item-title-number {
					position: absolute;
					z-index: 2;
					left: 16rpx;
					top: 10rpx;
					font-size: 28rpx;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #FFFFFF;
					line-height: 40rpx;
				}

				label {
					margin-left: 16rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #606266;
				}
			}
		}
	}

	.lecturer-enter-btn-box {
		position: fixed;
		bottom: 78rpx;
		width: 100%;
		padding: 0rpx 40rpx;

		.lecturer-enter-btn {
			text-align: center;
			height: 88rpx;
			border-radius: 8rpx;
			line-height: 88rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
</style>
