<template>
	<view class="container" v-if="showAfterPages">
		<u-navbar title="领取资料"></u-navbar>
		<view class="im-list">
			<view class="im-item" v-for="(item,index) in list" :key="index">
				<view class="im-item-img">
					<image class="img-info" mode="widthFix" :src="staticUrl+item.img"></image>
				</view>
				<view class="im-item-info">
					<view class="im-item-name">{{item.title}}</view>
					<view class="im-item-descript">{{item.descript}}</view>
					<view class="im-item-time">
						<view class="im-item-time-left">云盘地址:<label>*****</label></view>
						<!-- <view @click="coppy(item.dataUrl)" class="im-item-time-right">购买</view> -->
						<view @click="coppy(item.dataUrl)" class="im-item-time-right"
							:style="{backgroundColor: buttonColor}">获取</view>
					</view>
				</view>
				<u-popup :closeable="true" v-model="showExam" mode="center" width="65%" border-radius="14">
					<view class="pop-container">
						<view class="pop-context">
							<view class="context-one">{{dataUrl}}</view>
						</view>
						<view class="pop-btn">
							<view class="item-btn" @click="handleCoppy" :style="{background: buttonColor}">复制</view>
							<view class="item-btn-two" @click="handleCancle"
								:style="{color: buttonColor,border: `1rpx solid ${buttonColor}` }">取消</view>
						</view>
					</view>
				</u-popup>
			</view>
			<u-loadmore class="loadmore" :status="loadStatus[0]"></u-loadmore>
		</view>
	</view>
</template>

<script>
	import {
		getSystemMeans
	} from "@/common/questionApi.js"
	export default {
		filters: {
			ellipsis(value) {
				if (!value) return ''
				if (value.length > 10) {
					return value.slice(0, 10) + '...'
				}
				return value
			}
		},
		data() {
			return {
				themeColor: uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
					.themeColor : '#395AE1',
				buttonColor: uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync(
						'otherThemeColor')
					.buttonColor : '#395AE1',
				themeFontColor: uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
					'otherThemeColor').themeFontColor : '#fff',
				isPay: 0,
				list: [],
				staticUrl: getApp().globalData.staticUrl,
				pageNo: 1,
				pageSize: 10,
				dataUrl: '',
				loadStatus: ['nomore'],
				current: 0,
				showExam: false,
				loadText: {
					loadmore: '正在加载',
					loading: '努力加载中',
					nomore: '没有更多了'
				},
				showAfterPages: false
			}

		},
		onLoad() {
			this.getList();
			let user = uni.getStorageSync("user");
			if (user != null && user != undefined) {
				if (user.cId != null) {
					this.isPay = 1;
				} else {
					this.isPay = 0;
				}
			}
		},
		onReachBottom() {
			// 此tab为空数据
			this.loadStatus.splice(this.current, 1, "loading")
			setTimeout(() => {
				this.pageNo++;
				this.getList(1);
			}, 500);
		},
		onPullDownRefresh() {
			this.pageNo = 1;
			this.getList(2);
		},
		methods: {
			getList(ns) {
				let param = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					cateId: uni.getStorageSync("user").cId,
				}
				getSystemMeans(param).then(ret => {
					if (ns == 2) {
						this.list = []
						uni.stopPullDownRefresh()
						uni.showToast({
							title: '已是最新数据',
							duration: 2000,
							icon: "none"
						});
					}
					if (ret.result != null && ret.result.length > 0) {
						ret.result.forEach((item, index) => {
							this.list.push(item);
						})
						this.showAfterPages = true
					} else {
						this.loadStatus.splice(this.current, 1, "nomore")
					}
				});
			},
			handleCoppy(val) {
				uni.setClipboardData({
					data: this.dataUrl, //要被复制的内容
					success: () => { //复制成功的回调函数
						this.showExam = false;
					}
				});
			},
			handleCancle() {
				this.showExam = !this.showExam
			},
			coppy(val) {
				this.showExam = !this.showExam;
				this.dataUrl = val
			}

		}
	}
</script>

<style lang="scss">
	page {
		background: #F3F5F9;
	}

	.im-item {
		margin: 30rpx 3%;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
	}

	.im-item .im-item-img {
		width: 28%;
		height: 200rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.im-item .im-item-img .img-info {
		width: 100%;
	}

	.im-item .im-item-info {
		width: 68%;
	}

	.im-item .im-item-info .im-item-name {
		font-size: 32rpx;
		font-weight: 600;
	}

	.im-item-descript {
		color: #9499A6;
		font-size: 28rpx;
		margin: 10rpx 0 20rpx;
	}

	.im-item-time {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.im-item-time .im-item-time-left {
		color: #9499A6;
		font-size: 24rpx;
	}

	.im-item-time .im-item-time-right {
		height: 54rpx;
		width: 120rpx;
		font-size: 28rpx;
		text-align: center;
		line-height: 54rpx;
		border-radius: 50rpx;
		color: #FFFFFF;
	}

	.pop-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 50rpx;
	}

	.pop-title {
		font-weight: 700;
		font-size: 30rpx;
	}

	.pop-context {
		margin-top: 30rpx;
		font-weight: 500;
		font-size: 28rpx;
		width: 60%;
	}

	.pop-btn {
		margin: 30rpx 0;
		width: 80%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.context-one {
		line-height: 50rpx;
		text-align: center;
	}

	.item-btn {
		color: #FFFFFF;
		// background-color: #00B7FD;
		border-radius: 50rpx;
		padding: 10rpx 40rpx;
	}

	.item-btn-two {
		color: #FFFFFF;
		// border: 1rpx solid #00B7FD;
		// color: #00B7FD;
		border-radius: 50rpx;
		padding: 10rpx 40rpx;
	}
</style>
