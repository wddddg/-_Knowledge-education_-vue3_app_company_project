<template>
	<view class="container" v-if="showAfterPages">
		<u-navbar title="笔记"></u-navbar>
		<view class="collection-head">
			<label class="c-h-title">全部</label>
			<label class="">{{list.length}}</label>
		</view>
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
		<view class="im-list" v-else>
			<uni-swipe-action-item class="itemswiper" :index="index" v-for="(item, index) in list" :key="item.id"
				@click="click(index)" @change="open(index)" :right-options="options">
				<view class="im-item" @click="goInfo(item)">
					<view class="bj-content">{{item.noteConent}}</view>
					<view class="im-item-info">
						<view class="qu-item-list">
							<view class="qu-item-name">
								<view v-if="item.questionType===1" class="qu-typ">单选题</view>
								<view v-if="item.questionType===2" class="qu-typ">多选题</view>
								<view v-if="item.questionType===3" class="qu-typ">问答题</view>
								<view v-if="item.questionType===4" class="qu-typ">不定项题</view>
								<view v-if="item.questionType===5" class="qu-typ">填空题</view>
								<view v-if="item.questionType===6" class="qu-typ">判断题</view>
							</view>
							<view class="im-item-name" v-html="item.questionName"></view>
							<!-- {{item.questionName | ellipsis}} -->
						</view>

						<view class="im-item-time u-m-b-24">
							<view class="im-item-time-right">{{item.createBy}}</view>
						</view>
						<view class="im-item-image" v-if="item.noteImg">
							<image mode="widthFix"
								:src="baseUrl + '/' + (item.noteImg.substring(0,item.noteImg.length - 1))" />
						</view>
					</view>
				</view>
			</uni-swipe-action-item>
		</view>
	</view>
</template>

<script>
	import NoState from '@/components/NoState.vue'
	import {
		getNoteList,
		deleteNote
	} from "@/common/questionApi.js"
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
				cateId: '',
				userId: '',
				showUpdate: false,
				isUpdate: 0,
				disabled: true,
				btnWidth: 180,
				show: false,
				pageNo: 1,
				total: 0,
				pageSize: 500,
				staticUrl: getApp().globalData.staticUrl,
				baseUrl: getApp().globalData.baseUrl,
				list: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d',
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
		methods: {
			getList() {
				var param = {
					userId: this.userId,
					cateId: this.cateId,
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}
				getNoteList(param).then(ret => {
					this.showAfterPages = true
					this.list = ret.result;
				})
			},
			goInfo(item) {
				uni.navigateTo({
					url: '/exam/practice?id=' + item.questionsId + "&chapterId=" + item.chapterId + "&sectionId=" +
						item.sectionId
				})
			},
			click(index) {
				let param = {
					id: this.list[index].id
				}
				//删除收藏
				deleteNote(param).then(ret => {
					if (ret.result == true) {
						this.list.splice(index, 1);
						uni.showToast({
							title: '删除成功',
							duration: 3000,
							icon: "none"
						});
					}
				});
			},

			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			}

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F3F5F9 !important;
	}

	.itemswiper {
		border-bottom: 15upx solid #F3F5F9;
		background-color: #fff;
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
		padding: 25upx;
		background-color: #FFFFFF;
		margin-bottom: 20upx;
		border-radius: 20upx;
	}


	.im-item .bj-content {
		width: 100%;
		margin-bottom: 20upx;
	}


	.im-item .im-item-info .im-item-name {
		font-size: 28upx;
		font-weight: 700;
	}

	.im-item-time {
		font-size: 28upx;
		text-align: right;
	}

	.im-item-image {
		width: 100upx;
	}

	.im-item-image image {
		width: 100%;
	}

	.c-h-title {
		margin: 0 20upx;
	}


	.qu-item-list {
		.qu-typ {
			width: auto;
			height: 34upx;
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
</style>
