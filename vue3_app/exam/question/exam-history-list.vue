<template>
	<view class="container" v-if="showAfterPages">
		<u-navbar title="考试记录"></u-navbar>
		<view class="collection-head">
			<label class="c-h-title">全部</label>
			<label class="c-h-count">{{list.length}}</label>
		</view>
		<view class="im-list" v-if="showAfterPages">
			<view class="page-box" v-if="list.length<=0">
				<view>
					<NoState :isPage="true" type="article">
						<template #text>
							<view>暂无数据
								<view class="tips">可以去看看其他内容</view>
							</view>
						</template>
					</NoState>
				</view>
			</view>
			<view v-else class="im-item" @click="goPractice(item.id)" :index="index" v-for="(item, index) in list">
				<view class="bj-content">
					<label class="exam-title">模拟考试</label>
					<label style="">{{item.create_time}}</label>
				</view>
				<view class="im-item-info">
					<view class="im-item-name">{{item.exam_name}}</view>
					<view class="im-item-time u-m-t-18">
						<view class="im-item-time-left">
							<label>得分:<label></label>{{item.exam_fraction}}</label>
							<label class="u-m-l-15">总分:</label><label>{{item.fraction_count}}</label>
							<label class="u-m-l-15">时长:</label><label>{{item.use_date}}</label>
						</view>
						<view class="im-item-time-right"></view>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getExamLog
	} from "@/common/questionApi.js"
	import NoState from '@/components/NoState.vue'
	export default {
		filters: {
			ellipsis(value) {
				if (!value) return ''
				if (value.length > 80) {
					return value.slice(0, 80) + '...'
				}
				return value
			}
		},
		components: {
			NoState
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
				cateId: '',
				userId: '',
				showUpdate: false,
				isUpdate: 0,
				disabled: true,
				btnWidth: 180,
				show: false,
				showAfterPages: false,
				pageNo: 1,
				pageSize: 30,
				list: [

				],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d',
						height: "80upx",
						marginTop: '100upx'
					}
				}],
				showAfterPages: false
			}

		},
		onLoad(option) {
			this.cateId = option.cateId;
			this.userId = option.userId;
			this.getList();
		},
		onReachBottom() {
			// 此tab为空数据
			if (this.pageNo >= this.pages) {} else {
				this.pageNo++;
				this.getList();
			}

		},
		methods: {
			getList() {
				var param = {
					userId: this.userId,
					cateId: this.cateId,
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}
				getExamLog(param).then(ret => {
					this.showAfterPages = true;
					this.list.push(...ret.result);
					this.showAfterPages = true
				})
			},
			goPractice(id) {
				uni.navigateTo({
					url: '/exam/report-exam?examLogId=' + id
				})
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F3F5F9 !important;
	}

	.collection-head {
		height: 80upx;
		width: 100%;
		background-color: #fff;
		line-height: 80upx;
		position: fixed;
		top: 0;
		/* #ifdef H5 */
		top: 80upx;
		/* #endif */
		left: 0;
		right: 0;
	}

	.exam-title {
		color: #00B7FD;
	}

	.by-item-list {
		width: 100%;
		height: 80upx;
		float: left;
		margin-top: 20upx;

	}

	.by-item-list .by-item {
		float: left;
		width: 33.3%;
		text-align: center;
		line-height: 80upx;
		height: 100%;
	}

	.by-item-list .by-item-icon-a {
		width: 20upx;
		height: 20upx;
		margin-top: 30upx;
		position: absolute;
		margin-left: 10upx;
	}

	.by-item-list .by-item-icon {
		width: 30upx;
		height: 30upx;
		margin-top: 25upx;
		position: absolute;
	}

	.im-list {
		width: 94%;
		margin-top: 100upx;
		background-color: #F3F5F9 !important;
		height: auto;
		width: 100%;

	}

	.im-item {
		padding: 20upx 3%;
		margin: 0 auto 30upx;
		background: #FFFFFF;
		border-radius: 20upx;
		overflow: hidden;
	}

	// 1415178421546196993 1422498968369090561
	.im-item .bj-content {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20upx;
	}


	.im-item .im-item-info .im-item-name {
		font-size: 28upx;
		font-weight: 700;
		height: auto;
	}

	.im-item-time {
		width: 100%;
		display: flex;
	}

	.im-item-time .im-item-time-left {
		width: 70%;
		font-size: 24upx;

	}

	.im-item-time .im-item-time-right {
		font-size: 28upx;
		float: right;
		text-align: center;
		color: #00B7FD;
	}

	.c-h-title {
		margin-left: 20upx;

	}

	.c-h-count {}

	.qu-item-list {
		width: 90%;

		.qu-typ {
			width: auto;
			height: 40upx;
			text-align: center;
			font-size: 24upx;
			padding-left: 15upx;
			padding-right: 15upx;
			line-height: 40upx;
			color: #FFFFFF;
			border-top-left-radius: 50upx;
			float: left;
			border-top-right-radius: 50upx;
			border-bottom-right-radius: 50upx;
			background-color: #FF761B;
		}
	}

	.centre {
		text-align: center;
		margin: 200upx auto;
		font-size: 32upx;

		image {
			width: 164upx;
			height: 164upx;
			/* border-radius: 50%; */
			margin-bottom: 20upx;
		}

		.tips {
			font-size: 24upx;
			color: #999999;
			margin-top: 20upx;
		}

		.btn {
			margin: 80upx auto;
			width: 200upx;
			border-radius: 32upx;
			line-height: 64upx;
			color: #ffffff;
			font-size: 26upx;
			background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
		}
	}
</style>
