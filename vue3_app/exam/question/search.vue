<template>
	<view class="container">
		<u-navbar title="搜一搜题"></u-navbar>
		<view class="search-top">
			<image class="searchimage" src="../../static/images/search-1.png" mode='widthFix'></image>
			<view class="searchres" :style="{'padding-top': menuButtonInfo}">
				<view class="seach-title u-p-t-24">
					搜一搜题
				</view>
				<view class="search-content">
					<u-icon class=" se-icon" size="35" name="search"></u-icon>
					<u-input v-model="inputValue" @mouseover="showClean" v-on:input="ckInput" confirm-type="search"
						@confirm="confirm" type="text" class="u-m-l-20 se-input " placeholder="搜索学习类型"></u-input>
					<image v-if="showDelete" @click="cleanSearchValue" class="img-delete"
						src="../../static/images/delete.png"></image>
				</view>
			</view>
		</view>
		<view class="search-history u-m-t-20" v-show="showSearch">
			历史记录
		</view>
		<view class="search-history-list u-m-t-10" v-show="showSearch">
			<view v-if="hItem!=null&&hItem!=''&& index<6" v-for="(hItem,index) in history" :key="index"
				@click="search(hItem)" class="history-list-item">
				<label>{{hItem.length>7?hItem.slice(1,6)+'...':hItem}}</label>
			</view>
		</view>
		<view class="search-history u-m-t-20" v-show="showSearch">
			热门搜索
		</view>
		<view class="search-hot-list u-m-t-10" v-show="showSearch">
			<view class="hot-list-item" v-for="(item,index) in hotList" :key="index" @click="search(item.name)">
				<image v-if="index<3" src="../../static/images/hot1.png"></image>
				<label>{{item.name}}</label>
			</view>
		</view>
		<block v-if="!showSearch">
			<view class="page-box" v-if="searchList.length<=0">
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
			<view class="im-item" v-else>
				<view class="im-item-info" @click="goInfo(item.id)" v-for="(item, index) in searchList" :key="item.id">
					<view class="qu-item-list">
						<view>

							<view class="qu-item-name">
								<view v-if="item.questonType===1" class="qu-typ">单选题</view>
								<view v-if="item.questonType===2" class="qu-typ">多选题</view>
								<view v-if="item.questonType===3" class="qu-typ">问答题</view>
								<view v-if="item.questonType===4" class="qu-typ">不定项题</view>
								<view v-if="item.questonType===5" class="qu-typ">填空题</view>
								<view v-if="item.questonType===6" class="qu-typ">判断题</view>
							</view>
						</view>
					</view>
					<view class="im-item-name" v-html="item.title"></view>
					<view class="im-item-time u-m-t-18">
						<view class="im-item-time-left">
							来源:<label>{{ getZName(item.chapterId)+' '+ item.sectionName}}</label></view>

					</view>
					<view class="im-item-time u-m-b-24">
						<view class="im-item-time-right">{{item.createTime}}</view>
					</view>

				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		getHotList,
		searchQuestion
	} from "@/common/questionApi.js"
	import NoState from '@/components/NoState.vue'
	export default {
		data() {
			return {
				showNodata: false,
				showDelete: false,
				inputValue: '',
				history: [],
				hotList: [],
				showSearch: true,
				showAfterPages: false,
				searchList: [],
				menuButtonInfo: 0,
			}
		},
		components: {
			NoState
		},
		onLoad() {
			this.getHistory();
			this.getHotList();
			// #ifdef MP-WEIXIN
			var jiao = uni.getMenuButtonBoundingClientRect()
			this.menuButtonInfo = (jiao.height) * 2 + "rpx"
			// #endif
		},
		methods: {
			async goInfo(id) {
				uni.navigateTo({
					url: '/exam/practice?id=' + id
				})
			},
			confirm() {
				if (this.inputValue != null && this.inputValue != '') {
					this.history.unshift(this.inputValue);
					uni.setStorageSync("historyValue", this.history);
					this.getHistory();
					this.showSearch = false;
					this.getSearchList();
				}
				uni.hideKeyboard();
			},
			ckInput() {
				this.showDelete = true
			},
			showClean() {
				this.showDelete = true
			},
			cleanSearchValue() {
				this.showDelete = false
				this.showSearch = true;
				this.inputValue = "";
				this.searchList = [];
				uni.hideKeyboard();
			},
			getHistory() {
				const hiValue = uni.getStorageSync('historyValue');
				if (hiValue != null) {
					this.showAfterPages = true;
					this.history = hiValue.toString().split(",");
					if (this.history.length > 10) {
						let newHistory = [];
						this.history.forEach((item, index) => {
							if (index < 10) {
								newHistory.push(item);
							}
						})
						this.history = newHistory;
						uni.setStorageSync("historyValue", this.history);
					}
				}
			},
			getHotList() {
				getHotList({category: 1}).then(ret => {
					if (ret != null) {
						this.hotList = ret.result;
					}
				});
			},
			search(name) {
				this.inputValue = name;
				this.showSearch = false;
				this.showAfterPages = false;
				this.showDelete = true
				this.getSearchList();
			},
			getSearchList() {
				this.searchList = [];
				let user = uni.getStorageSync("user");
				if (this.inputValue == '') {
					this.showSearch = true
					return
				}
				this.showSearch = false
				let param = {
					searchKey: this.inputValue,
					pageNo: 1,
					pageSize: 100,
				};
				if (user != null && user != undefined) {
					param.cateId = user.cId;
				}
				searchQuestion(param).then(ret => {
					if (ret != null) {
						this.showAfterPages = true;
						console.log(ret.result.records);
						this.searchList = ret.result.records;
						if (this.searchList.length <= 0) {
							this.showNodata = true
						} else {
							this.showNodata = false
						}
					}
				});
			},
			getZName(id) {
				if (id == 1) {
					return '第一章';
				}
				if (id == 2) {
					return '第二章';
				}
				if (id == 3) {
					return '第三章';
				}
				if (id == 4) {
					return '第四章';
				}
				if (id == 5) {
					return '第五章';
				}
				if (id == 6) {
					return '第六章';
				}
				if (id == 7) {
					return '第七章';
				}
				if (id == 8) {
					return '第八章';
				}
				if (id == 9) {
					return '第九章';
				}
				if (id == 10) {
					return '第十章';
				}
				if (id == 11) {
					return '第十一章';
				}
				if (id == 12) {
					return '第十二章';
				}
				if (id == 13) {
					return '第十三章';
				}
				if (id == 14) {
					return '第十四章';
				}
				if (id == 15) {
					return '第十五章';
				}

			},
			getZJName(id) {
				if (id == 1) {
					return '第一节';
				}
				if (id == 2) {
					return '第二节';
				}
				if (id == 3) {
					return '第三节';
				}
				if (id == 4) {
					return '第四节';
				}
				if (id == 5) {
					return '第五节';
				}
				if (id == 6) {
					return '第六节';
				}
				if (id == 7) {
					return '第七节';
				}
				if (id == 8) {
					return '第八节';
				}
				if (id == 9) {
					return '第九节';
				}
				if (id == 10) {
					return '第十节';
				}
				if (id == 11) {
					return '第十一节';
				}
				if (id == 12) {
					return '第十二节';
				}
				if (id == 13) {
					return '第十三节';
				}
				if (id == 14) {
					return '第十四节';
				}
				if (id == 15) {
					return '第十五节';
				}
			}

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F3F5F9 !important;
	}

	.search-top {
		width: 100%;
		padding: var(--status-bar-height) 0 0;
		position: relative;
	}

	.searchimage {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
	}

	.searchres {
		position: relative;
		height: 400upx;
	}

	.search-top image {
		height: 100%;
		width: 100%;
	}

	.se-input {
		width: 100%;
	}

	.seach-title {
		height: 80upx;
		width: 100%;
		text-align: center;
		line-height: 80upx;
		font-size: 44rpx;
		color: #FFFFFF;
	}

	.search-content {
		width: 90%;
		margin: 0 auto;
		height: 80upx;
		margin-top: 80upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
		margin-top: 120upx;
		padding: 0 20upx 0 20upx;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.search-content .img-delete {
		position: absolute;
		z-index: 95;
		right: 20upx;
		width: 40upx;
		height: 40upx;
	}

	.search-history {
		width: 90%;
		margin: 0 auto;
		height: 80upx;
		line-height: 80upx;
		font-weight: 700;
		font-size: 32upx;
	}

	.search-history-list {
		width: 90%;
		margin: 0 auto;
		height: 150upx;
	}

	.search-hot-list {
		width: 90%;
		margin: 0 auto;
		height: 150upx;
	}

	.history-list-item {
		width: auto;
		height: 55upx;
		line-height: 55upx;
		background-color: #F3F5F9;
		border-radius: 50upx;
		float: left;
		padding-left: 20upx;
		padding-right: 20upx;
		margin-right: 20upx;
		margin-bottom: 20upx;
	}

	.hot-list-item {
		width: auto;
		height: 55upx;
		line-height: 55upx;
		background-color: #F3F5F9;
		border-radius: 50upx;
		float: left;
		padding-left: 20upx;
		padding-right: 20upx;
		margin-right: 120upx;
		margin-bottom: 20upx;
	}

	.hot-list-item image {
		width: 35upx;
		height: 35upx;
		padding-top: 15upx;
		float: left;
	}

	.hot-list-item label {
		padding-top: 5upx;
		float: left;
	}


	.im-item {
		width: 94%;
		height: auto;
		margin-top: 30upx;
		margin-bottom: 30upx;
		margin: 0 auto;
		margin-left: 3%;
		background-color: #FFFFFF !important;
		margin-bottom: 20upx;
		border-radius: 20upx;

	}

	.im-item .im-item-img {
		float: left;
		width: 10%;
	}

	.im-item .im-item-img .img-info {
		width: 90%;
		margin-left: 10%;
		height: 200upx;
		border-radius: 20upx;
		margin-top: 20upx;

	}

	.im-item .im-item-info {
		float: left;
		width: 100%;
		margin-top: 20upx;
		background-color: #FFFFFF !important;
	}


	.im-item .im-item-info .im-item-name {
		font-size: 28upx;
		font-weight: 700;
		height: auto;
		width: 94%;
		margin-left: 4%;
		margin-top: 20upx;
	}

	.im-item-time {
		float: left;
		width: 100%;
	}

	.im-item-time .im-item-time-left {
		float: left;
		margin-left: 5%;
	}

	.im-item-time .im-item-time-right {

		font-size: 28upx;
		float: right;
		text-align: center;
		margin-right: 5%;
	}

	.qu-item-list {
		margin-left: 4%;
		margin-top: 20upx;

		.qu-typ {
			width: auto;
			height: 36upx;
			text-align: center;
			font-size: 24upx;
			padding-left: 15upx;
			padding-right: 15upx;
			line-height: 36upx;
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
		margin: 30upx 20upx;
		width: 80%;
		display: flex;
		justify-content: space-between;
	}

	.context-one {
		line-height: 50upx;
		text-align: center;
	}

	.item-btn {
		float: left;
		height: 60upx;
		width: 140upx;
		line-height: 60upx;
		color: #FFFFFF;
		background-color: #00B7FD;
		text-align: center;
		border-radius: 50upx;
	}

	.item-btn-two {
		float: left;
		height: 60upx;
		width: 140upx;
		line-height: 60upx;
		color: #FFFFFF;
		border: 1upx solid #00B7FD;
		color: #00B7FD;
		text-align: center;
		border-radius: 50upx;
	}
</style>
