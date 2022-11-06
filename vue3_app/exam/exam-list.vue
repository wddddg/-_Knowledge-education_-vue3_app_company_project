<template>
	<view class="container" v-if="showAfterPages">
		<u-navbar :title="title"></u-navbar>

		<view class="exam-list">
			<view class="page-box" v-if="list2.length<=0&&list3.length<=0&&list4.length<=0">
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
			<view class="" v-else>
				<view v-if="ksType==2" class="exam-list-item" v-for="(item,index) in list2" :key="index">
					<view class="item-info">
						<view>
							<u-image :showLoading="true"
								src="https://alipic.lanhuapp.com/pstkuoop0y7ami4ez352lpnnuvffo6bz0j5823d253-3c90-478c-9aae-ed163dee68a6"
								width="100px" height="100px" @click="click"></u-image>
						</view>
						<view class="item-info-leftContent">
							<view class="item-title u-font-16">
								{{item.name}}
							</view>
							<view class="item-tj">
								<view>
									<label>总共:{{item.examCount}}题</label>
									<label class="u-m-l-30">时长:{{item.examTime}}分钟</label>
								</view>
								<view>
									<label>{{item.lxCount}}人做过</label>
								</view>
							</view>
						</view>
					</view>
					<view @click="handleShowExam(item)" class="item-btn">
						<image src="@/static/images/bi.png"></image>考试
					</view>
				</view>
				<view v-if="ksType==3" class="exam-list-item" v-for="(item,index) in list3" :key="index">
					<view class="item-info">
						<view>
							<u-image :showLoading="true"
								src="https://alipic.lanhuapp.com/pstkuoop0y7ami4ez352lpnnuvffo6bz0j5823d253-3c90-478c-9aae-ed163dee68a6"
								width="100px" height="100px" @click="click"></u-image>
						</view>
						<view class="item-info-leftContent">
							<view class="item-title u-font-16">
								{{item.name}}
							</view>
							<view class="item-tj">
								<view>
									<label>总共:{{item.examCount}}题</label>
									<label class="u-m-l-30">时长:{{item.examTime}}分钟</label>
								</view>
							</view>
						</view>
					</view>
					<view @click="goPractice(item.id)" class="item-btn">
						<image src="@/static/images/bi.png"></image>练习
					</view>
				</view>
				<view v-if="ksType==4" class="exam-list-item" v-for="(item,index) in list4" :key="index">
					<view class="item-info">
						<view>
							<u-image :showLoading="true"
								src="https://alipic.lanhuapp.com/pstkuoop0y7ami4ez352lpnnuvffo6bz0j5823d253-3c90-478c-9aae-ed163dee68a6"
								width="100px" height="100px" @click="click"></u-image>
						</view>
						<view class="item-info-leftContent">
							<view class="item-title u-font-16">
								{{item.name}}
							</view>
							<view class="item-tj">
								<view>
									<label>总共:{{item.examCount}}题</label>
								</view>
							</view>
						</view>
					</view>
					<view @click="goPractice(item.id)" class="item-btn">
						<image src="@/static/images/bi.png"></image>练习
					</view>
				</view>
				<u-loadmore class="loadmore" v-show="list2.length>=10" :status="loadStatus[0]" bgColor="#F3F4F8">
				</u-loadmore>
				<u-loadmore class="loadmore" v-show="list3.length>=10" :status="loadStatus[0]" bgColor="#F3F4F8">
				</u-loadmore>
				<u-loadmore class="loadmore" v-show="list4.length>=10" :status="loadStatus[0]" bgColor="#F3F4F8">
				</u-loadmore>

			</view>
		</view>

		<u-popup :closeable="true" v-model="showExam" mode="center" width="65%" border-radius="14">
			<view class="pop-container">
				<view class="pop-title">{{list2Item.name}}</view>
				<view class="pop-context">
					<view class="context-one">考试时长：{{list2Item.examTime}}</view>
					<!-- <view class="context-one">考试类型：{{item.examTime}}</view> -->
					<view class="context-one">考试数量：{{list2Item.examCount}}</view>
					<view class="context-one">满分分值：{{list2Item.fractionCount}}</view>
					<view class="context-one">及格分数：{{list2Item.jgCount}}</view>
					<view class="context-one">考试简要：{{list2Item.examSummary}}</view>
				</view>
				<view class="pop-btn">
					<view @click="goExam(list2Item.id,list2Item.examTime)" class="item-btn">
						<image src="@/static/images/bi.png"></image>开始
					</view>
				</view>
			</view>
		</u-popup>
		<u-modal v-model="ispayment" :show-cancel-button="true" content="需要开通会员" @confirm="submitispayment"
			@cancel="ispayment=false"></u-modal>
	</view>
</template>

<script>
	import {
		getExam,
		getHistoryExam,
		getTodayList
	} from "@/common/questionApi.js"
	import NoState from '@/components/NoState.vue'
	export default {
		data() {
			return {
				title: "",
				cateId: '',
				pageNo: 1,
				pageSize: 10,
				list2: [],
				list2Item: [],
				list3: [],
				list4: [],
				ksType: '',
				loadStatus: ['loadmore'],
				current: 0,
				showAfterPages: false,
				showExam: false,
				ispayment: false,
				loadText: {
					loadmore: '正在加载',
					loading: '努力加载中',
					nomore: '没有更多了'
				},

			}
		},
		onLoad(option) {
			this.showExam = false
			this.ksType = option.ksType;
			this.cateId = option.cateId;
			uni.setNavigationBarTitle({
				title: option.ksType == 1 ? "模拟试卷" : option.ksType == 2 ? "考试列表" : option.ksType == 3 ? "历年真题" :
					"每日一练"
			})
			this.title = option.ksType == 1 ? "模拟试卷" : option.ksType == 2 ? "考试列表" : option.ksType == 3 ? "历年真题" :
				"每日一练"
			this.getList();
		},
		onShow() {
			this.showExam = false
		},
		components: {
			NoState
		},
		onReachBottom() {
			// 此tab为空数据
			this.reachBottom()
		},
		methods: {
			goExam(id, examTime) {
				uni.navigateTo({
					url: '/exam/exam?ksType=' + this.ksType + "&cateId=" + this.cateId + "&selectId=" +
						id + "&examTime=" + examTime
				})
			},
			submitispayment() {
				this.ispayment = false
				uni.navigateTo({
					url: "/exam/center/open-vip"
				})
			},
			handleShowExam(itme) {
				if (this.$appUtils.ispay()) {
					this.ispayment = true
					return
				} else {
					this.ispayment = false
				}

				this.list2Item = itme;
				this.showExam = !this.showExam
			},
			goPractice(id) {
				if (this.$appUtils.ispay()) {
					this.ispayment = true
					return
				} else {
					this.ispayment = false
				}
				uni.navigateTo({
					url: '/exam/practice?nxType=' + this.ksType + "&cateId=" + this.cateId +
						"&selectId=" + id
				})
			},
			reachBottom() {
				// 此tab为空数据
				this.loadStatus.splice(this.current, 1, "loading")
				setTimeout(() => {
					this.getList();
				}, 1000);
			},
			getList() {
				var param = {
					pageSize: this.pageSize,
					pageNo: this.pageNo,
					cateId: this.cateId
				}
				if (this.ksType == 2) {
					getExam(param).then(ret => {
						if (ret.result != null) {
							this.showAfterPages = true;
							if (ret.result.records != null && ret.result.records.length > 0) {
								ret.result.records.forEach((item, index) => {
									this.list2.push(item);
								})
							} else {
								this.loadStatus.splice(this.current, 1, "nomore")
							}
						}
					})
				}
				if (this.ksType == 3) {
					getHistoryExam(param).then(ret => {
						if (ret.result != null) {
							this.showAfterPages = true;
							if (ret.result != null && ret.result.length > 0) {

								ret.result.forEach((item, index) => {
									this.list3.push(item);
								})
							} else {
								this.loadStatus.splice(this.current, 1, "nomore")
							}
						}
					})
				}
				if (this.ksType == 4) {
					getTodayList(param).then(ret => {
						if (ret.result != null) {
							this.showAfterPages = true;
							if (ret.result != null && ret.result.length > 0) {

								ret.result.forEach((item, index) => {
									this.list4.push(item);
								})
							} else {
								this.loadStatus.splice(this.current, 1, "nomore")
							}
						}
					})
				}
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F3F4F8 !important;
	}

	.exam-list {
		margin-top: 30upx;
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

	.exam-list-item {
		background-color: #FFFFFF;
		border-radius: 20upx;
		margin: 0 4% 30upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30upx;
		position: relative;
	}

	.item-title {
		font-weight: 600;
		margin-bottom: 15upx;
		flex: 0.9;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-info {
		display: flex;
		width: 100%;

		.item-info-leftContent {
			padding: 0upx 20upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex: 1;
		}

		.item-tj {
			flex: 1;
			width: 70%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 50%;
		}
	}

	.item-info .item-tj {
		font-size: 24upx;
		color: #aaa;
	}

	.item-btn {
		height: 60upx;
		width: 140upx;
		line-height: 60upx;
		color: #FFFFFF;
		background-color: #00B7FD;
		text-align: center;
		border-radius: 50upx;
		box-shadow: 0 0 20upx 0 #39affd;
		position: absolute;
		right: 3%;
		bottom: 8%;
	}

	.item-btn image {
		width: 28upx;
		height: 28upx;
	}

	.pop-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 50upx;
	}

	.pop-title {
		font-weight: 700;
		font-size: 30upx;
	}

	.pop-context {
		margin-top: 30upx;
		font-weight: 500;
		font-size: 28upx;
		width: 60%;
	}

	.pop-btn {
		margin: 30upx 0;
	}

	.context-one {
		line-height: 50upx;
	}
</style>
