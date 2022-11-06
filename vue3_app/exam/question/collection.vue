<template>
	<view class="container" v-if="showAfterPages">
		<u-navbar :title="title"></u-navbar>
		<view class="collection-head">
			<view class="">
				<label class="c-h-title">全部</label>
				<label class="c-h-count">{{total}}</label>
			</view>
			<label v-if="isshowtatal" class="c-h-title2" @click="navError">全部练习</label>
		</view>
		<view class="im-list">
			<view class="page-box" v-show="list.length<=0">
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
			<uni-swipe-action-item class="im-item" :auto-close="true" :index="index" v-for="(item, index) in list"
				:key="item.id" @click="delse(index)" @change="open(index)" :right-options="options">
				<view class="im-item-info" @click="goInfo(item.questionsId)">
					<view class="qu-item-list">
						<view>
							<view class="qu-item-name">
								<view v-if="item.questionsType===1" class="qu-typ">单选题</view>
								<view v-if="item.questionsType===2" class="qu-typ">多选题</view>
								<view v-if="item.questionsType===3" class="qu-typ">问答题</view>
								<view v-if="item.questionsType===4" class="qu-typ">不定项题</view>
								<view v-if="item.questionsType===5" class="qu-typ">填空题</view>
								<view v-if="item.questionsType===6" class="qu-typ">判断题</view>
							</view>
						</view>
					</view>
					<view class="im-item-name">
						<rich-text :nodes="item.questionsName"></rich-text>
					</view>
					<view class="im-item-time u-m-t-18">
						<view class="im-item-time-left">
							来源:<label>{{ getZName(item.chapterId==null?"":item.chapterId)+' '+ item.sectionName==null?"":item.sectionName}}</label>
						</view>

					</view>
					<view class="im-item-time u-m-b-24">
						<view class="im-item-time-right">{{item.createTime}}</view>
					</view>
				</view>
			</uni-swipe-action-item>
		</view>
		<u-loadmore class="loadmore" v-show="list.length>=10" :status="loadStatus[0]" bgColor="#F3F5F9"></u-loadmore>

	</view>
</template>

<script>
	import NoState from '@/components/NoState.vue'
	import {
		getCollectList,
		getErrorList,
		getStudyList,
		deleteCollectById,
		deleteRecord
	} from "@/common/questionApi.js"
	export default {
		data() {
			return {
				page: "",
				title: '收藏',
				total: 0,
				cateId: '',
				userId: '',
				showUpdate: false,
				isUpdate: 0,
				disabled: true,
				btnWidth: 180,
				show: false,
				showAfterPages: false,
				pageSize: 10,
				pageNo: 1,
				loadStatus: ['loadmore'],
				current: 0,
				isshowtatal: false,
				loadText: {
					loadmore: '正在加载',
					loading: '努力加载中',
					nomore: '没有更多了'
				},
				list: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d',
						height: "80upx",
						marginTop: '100upx'
					}
				}]
			}

		},
		onLoad(option) {
			this.page = option.page;
			this.userId = option.userId;
			this.cateId = option.cateId;
			this.type = option.type;
			uni.setNavigationBarTitle({
				title: option.type == "error" ? "错题" : option.type == "study" ? "已做" : option.type == "collect" ?
					"收藏" : "全部"
			})
			this.title = option.type == "error" ? "错题" : option.type == "study" ? "已做" : option.type == "collect" ? "收藏" :
				"全部"
			this.isshowtatal = false
			this.getList();
		},
		onReachBottom() {
			// 此tab为空数据
			this.reachBottom()
		},
		methods: {
			navError() {
				uni.navigateTo({
					url: '/pages/index/practice?allErrorId=99&errorType=error'
				})
			},
			getList() {
				var param = {
					userId: this.userId,
					pageSize: this.pageSize,
					pageNo: this.pageNo,
					cateId: this.cateId
				}
				if (this.type == "collect") {
					getCollectList(param).then(ret => {
						this.showAfterPages = true;
						this.total = ret.result.total;
						if (ret.result.records != null && ret.result.records.length > 0) {

							ret.result.records.forEach((item, index) => {
								this.list.push(item);
							})
						} else {
							this.loadStatus.splice(this.current, 1, "nomore")
						}
					})
				}
				if (this.type == "error") {
					getErrorList(param).then(ret => {
						this.showAfterPages = true;
						this.total = ret.result.total;
						if (ret.result.records != null && ret.result.records.length > 0) {
							this.isshowtatal = true
							ret.result.records.forEach((item, index) => {
								this.list.push(item);
							})
						} else {
							this.loadStatus.splice(this.current, 1, "nomore")
						}
					})
				}
				if (this.type == "study") {
					getStudyList(param).then(ret => {
						this.showAfterPages = true;
						this.result.total = ret.total;
						if (ret.result.records != null && ret.result.records.length > 0) {

							ret.result.records.forEach((item, index) => {
								this.list.push(item);
							})
						} else {
							this.loadStatus.splice(this.current, 1, "nomore")
						}
					})
				}

			},
			reachBottom() {
				// 此tab为空数据
				this.loadStatus.splice(this.current, 1, "loading")
				setTimeout(() => {
					this.pageNo++;
					this.getList();
				}, 1000);
			},
			goInfo(id) {
				uni.navigateTo({
					url: '/exam/practice?id=' + id + "&errorType=" + this.type
				})
			},
			getZName(value) {
				if (value != null && value != undefined && value != "undefined") {
					return "第" + value.toUpperCase() + "章";
				} else {
					return "";
				}
			},
			delse(index) {
				let param = {
					id: this.list[index].id
				}
				if (this.type == "collect") {
					//删除收藏
					deleteCollectById(param).then(ret => {
						if (ret == true) {
							this.list.splice(index, 1);
							this.result.total = this.result.total - 1
							uni.showToast({
								title: '删除成功',
								duration: 2000,
								icon: "none"
							});
						}
					});
				}
				if (this.type == "error") {
					//删除错误
					deleteRecord(param).then(ret => {
						if (ret == true) {
							this.list.splice(index, 1);
							this.result.total = this.result.total - 1
							uni.showToast({
								title: '删除成功',
								duration: 2000,
								icon: "none"
							});
						}
					});
				}
				if (this.type == "study") {
					//删除已学
					deleteRecord(param).then(ret => {
						if (ret == true) {
							this.list.splice(index, 1);
							this.result.total = this.result.total - 1
							uni.showToast({
								title: '删除成功',
								duration: 2000,
								icon: "none"
							});
						} else {

						}
					});
				}

			},
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			}

		},
		components: {
			NoState
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #F3F5F9 !important;
	}

	.collection-head {
		border-top: 1upx solid #F3F5F9;
		border-bottom: 1upx solid #F3F5F9;
		height: 80upx;
		width: 100%;
		background-color: #fff;
		position: fixed;
		top: 0;
		/* #ifdef H5 */
		top: 80upx;
		/* #endif */
		z-index: 99;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}


	.im-list {
		margin-top: 100upx;
	}

	.im-item {
		width: 100%;
		margin: 0 0 20upx;
		background-color: #FFFFFF;
	}


	.im-item .im-item-info {
		padding: 20upx 3%;
	}


	.im-item .im-item-info .im-item-name {
		font-size: 28upx;
		font-weight: 700;
		height: auto;
	}

	.im-item-time {
		float: left;
		width: 100%;
	}

	.im-item-time .im-item-time-left {
		float: left;
	}

	.im-item-time .im-item-time-right {

		font-size: 28upx;
		float: right;
		text-align: center;
		margin-right: 5%;
	}

	.c-h-title {
		margin-left: 20upx;
	}

	.c-h-title2 {
		position: fixed;
		right: 10upx;
		color: #1890FF;
		z-index: 99;
	}

	.c-h-count {}

	.qu-item-list {

		.qu-typ {
			width: auto;
			height: 30upx;
			text-align: center;
			font-size: 24upx;
			padding-left: 15upx;
			padding-right: 15upx;
			line-height: 30upx;
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
