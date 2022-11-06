<template>
	<view class="container" v-if="showAfterPages">
		<u-navbar title="考试报告"></u-navbar>
		<view>
			<view class="qu-count-body" v-show="id==0">
				<view class="qu-item-name">
					<view v-if="list[swiperCurrent]?.type===1" class="qu-typ dan">单选题</view>
					<view v-if="list[swiperCurrent]?.type===2" class="qu-typ duo">多选题</view>
					<view v-if="list[swiperCurrent]?.type===3" class="qu-typ wen">问答题</view>
					<view v-if="list[swiperCurrent]?.type===4" class="qu-typ ding">不定项题</view>
					<view v-if="list[swiperCurrent]?.type===5" class="qu-typ tian">填空题</view>
					<view v-if="list[swiperCurrent]?.type===6" class="qu-typ pan">判断题</view>
				</view>
				<view class="qu-count">
					<image @click="showDtk()" class="img-dta" mode="widthFix" src="@/static/images/dta.png"></image>
					<view class="qu-count-item qu-count-itembig"><label>{{swiperCurrent+1}}</label></view>
					<view class="qu-count-item">/</view>
					<view class="qu-count-item">
						<label>{{list.length}}</label>
					</view>
				</view>
			</view>
			<view class="qu-jindu">
				<u-line-progress :height='12' active-color="#00B7FD" inactive-color='#D6F3FF'
					:percent="((swiperCurrent+1)/list.length)*100" :show-percent="false"></u-line-progress>
			</view>
		</view>
		<view class="qu-list-content">
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
			<swiper v-else class="swiper-box" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">

				<swiper-item :id="indexP" class="swiper-item" v-for="(item,indexP) in list" :key="indexP">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="qu-item-list">
							<view>
								<view class="qu-item-name">
									<label>{{ indexP + 1 }}.{{ item.name }}</label>
								</view>
							</view>
						</view>
						<view class="qu-item-answer">
							<!-- 单选题干 -->
							<label :id="item.id" class="answer-item" v-for="(citem, index) in item.quList"
								v-if="item.type==1" :key="index">
								<!-- @click="citem.disabled? '' : radioChange(index,indexP,item.type,item)" -->
								<label class="answer-item-label"
									:class="item.selectIndex==index?'answer-select answer-select-ok':''">{{ getTag(index) }}
								</label>
								<view v-html="citem.name">
								</view>
							</label>
							<!-- 多选、不定项题干 -->
							<view v-if="(item.type==2||item.type==4)">
								<label class="answer-item" v-for="(citem, index) in item.quList" :key="index">
									<!-- @click="checkboxChange(index)" -->
									<label class="answer-item-label" :class="[
											citem.checked==true&&item.isOk=='-1'?'answer-select answer-select-ok':'',
											citem.checked==true&&item.isOk==true?'answer-select answer-select-ok':'',
										citem.checked==true&&item.isOk==false&&item.answerValue.indexOf(getDa(index))!=-1?'answer-select answer-select-ok':'',
										item.isOk==false&&citem.checked&&item.answerValue.indexOf(getDa(index))===-1&&tagType ==0?'answer-select-error answer-select-ok':'',
										 !(item.answerValue.indexOf(getTag(index)) == -1) && item.showDa?'answer-select answer-select-ok':'' 
										]">
										{{ getTag(index) }}
									</label>
									<view v-html="citem.name">
									</view>
								</label>
								<view @click="selectDx" :data-items="item" :data-inde="indexP" class="btn-quren"
									v-if="tagType==0&& item.isClick==false">确定
								</view>
							</view>
							<!-- 问答题题干 -->
							<view v-if="item.type==3">
								<view class="u-m-t-72">
									<u-input v-model="item.inputValue" placeholder="请输入答案" :type="ttype"
										:border="tborder" :height="theight" :auto-height="tautoHeight" />
								</view>
								<view class="u-font-24 da-ts wd-ts">此类型的题目暂不支持判断对错,你可以点击右下角看答案查看答案解析</view>
								<view>

								</view>
							</view>
							<!-- 填空题题干 -->
							<view class="itm-tkt-list" v-if="item.type==5">
								<view class="item-tkt" v-for="(tkitem,indexx) in item.answerValue.split(',').length"
									:key="indexx">
									<u-input type="text" v-model="item.inputModal[indexx]" placeholder="请输入答案">
									</u-input>
								</view>
							</view>
							<!-- 判断题题干 -->
							<label class="answer-item" v-for="(citem, index) in item.quList" :key="index"
								v-if="item.type==6">
								<!-- @click="citem.disabled? '' : radioChange(index,indexP,item.type,item)" -->
								<label class="answer-item-label"
									:class="item.selectIndex==index?'answer-select answer-select-ok':''">
									{{ getTag(index) }}
								</label>
								<view v-html="citem.name">
								</view>
							</label>
						</view>
						<view class="answer-value">
							<view class="value-info">答案:<label
									class="value-info value-info-da">{{item.answerValue}}</label></view>
							<view class="answer-js" v-if="item.showJx==true">
								<view class="answer-js-title">解析:</view>
								<view class="answer-js-info">{{item.answerAnalysis}}
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>

			</swiper>
		</view>
		<view class="sc-btn-list">
			<view class="btn-list-item-two" @click="addErroer">
				<view class="btn-item-img">
					<image class="item-image-a" src="@/static/images/img-jc.png"></image>
				</view>
				<view class="btn-item-title">纠错</view>
			</view>
			<view class="btn-list-item-two" @click="addNote">
				<view class="btn-item-img">
					<image class="item-image-b" src="@/static/images/img-xbj.png"></image>

				</view>
				<view class="btn-item-title">写笔记</view>
			</view>
		</view>
		<u-popup v-model="showDtkDiv" mode="bottom" width="100%" height="60%" border-radius="14">
			<view class="content">
				<view class="dtk-title">
					<view class="dtk-title-name">选项卡</view>
					<view class="dtk-close" @click="closeDtk()">
						<u-icon name="close"></u-icon>
					</view>
				</view>
				<!-- <view class="dtk_jieshao">单项选择(本类题共100题，每小题1.0分，共100分)</view> -->
				<scroll-view class="dtk-scroll" scroll-y="true">
					<view>
						<view v-for="(item,itesm) in list" :key="itesm">
							<view @click="checkSWiper(itesm+1)" :class="itesm==(swiperCurrent)?'dtk-select':''"
								class="dtk-item">
								{{itesm+1}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>

</template>

<script>
	import {
		findExamQuestionRecord
	} from '@/common/questionApi.js'
	import NoState from '@/components/NoState.vue'
	export default {
		data() {
			return {
				id: '0',
				nxType: '',
				userId: "",
				cateId: "",
				chapterId: "",
				sectionId: "",
				recordType: "", //分类 全部  错误 已做 未作
				questonType: '',
				pageSize: 0,
				pageNum: 1,
				showDtkDiv: false,
				current: 0,
				swiperCurrent: 0,
				showAfterPages: false,
				activeClass: -1,
				tagType: 0,
				ttype: 'textarea',
				tborder: true,
				theight: 150,
				tautoHeight: true,
				isCollect: true, //是否收藏
				list: [],
				value: '',
				selectId: '',
				dtk: '',
				examLogId: ""
			}

		},
		onLoad(option) {
			this.ksType = option.ksType;
			this.jxType = option.jxType;
			this.examLogId = option.examLogId;
			this.dtk = option.dtk || '';
			let user = uni.getStorageSync("user");
			this.userId = user.userId
			this.cateId = user.cId;
			if (this.examLogId) {
				this.getlists();
			} else {
				this.getQuList();
				this.changeTag(1);
			}
		},
		components: {
			NoState
		},
		methods: {
			getlists() {
				let user = uni.getStorageSync("user");
				var param = {
					userId: user.userId,
					examLogId: this.examLogId,
				}
				findExamQuestionRecord(param).then(ret => {
					if (ret.result.length > 0) {
						let kslist = ret.result;
						this.showAfterPages = true
						if (this.jxType == 2) {
							var arrs = []
							kslist.forEach(item => {
								if (!item.isOk && item.isClick) {
									arrs.push(item)
								}
							})
							kslist = arrs
						}
						this.list = kslist
						this.changeTag(1);
					}
				})
			},
			showDtk() {
				this.showDtkDiv = true;
			},
			closeDtk() {
				this.showDtkDiv = false;
			},
			checkSWiper(index) {
				this.swiperCurrent = index - 1;
				this.showDtkDiv = false;
			},
			reachBottom() {

			},
			getQuList: function() {
				let kslist = uni.getStorageSync("kslist");
				this.showAfterPages = true,
					console.log(kslist)
				if (this.jxType == 2) {
					var arrs = []
					kslist.forEach(item => {
						if (!item.isOk && item.isClick) {
							arrs.push(item)
						}
					})
					kslist = arrs
				}
				this.list = kslist
			},
			//切换答题模式
			changeTag(tag) {
				this.tagType = tag;
				this.list.forEach(item => {
					if (tag == 1) {
						//默认没有点击选择
						if (item.isClick !== true) {

							item.showDa = true;
							item.showJx = true;
							item.isOk = true;
							//单选
							if (item.type == 1) {

								//设置默认选中
								let selectI = this.getIndex(item.answerValue);
								item.selectIndex = selectI;
								item.default = item.quList[selectI].name;
								//设置其他不能选中
								//选中后禁用
								item.quList.forEach(itemc => {
									if (itemc.name != item.default) {
										itemc.disabled = true;
									}
								});
							}
							//多选题设置默认选中
							else if (item.type == 2 || item.type == 4) {
								let da = item.answerValue;
								if (da !== null) {
									let das = da.split(",");
									das.forEach(citem => {
										let childIndex = this.getIndex(citem);
										item.quList[childIndex].checked = true;

									})
								}
								//设置禁用
								item.quList.forEach(itemc => {
									if (itemc.checked == false) {
										itemc.disabled = true;
									}
								});

							} else if (item.type == 5) {

							} else if (item.type == 6) {
								//设置默认选中
								let selectI = 0;
								if (item.answerValue == "正确") {
									selectI = 0;
								}
								if (item.answerValue == "错误") {
									selectI = 1;
								}
								item.selectIndex = selectI;
								item.default = item.quList[selectI].name;
								//设置其他不能选中
								//选中后禁用
								item.quList.forEach(itemc => {
									if (itemc.name != item.default) {
										itemc.disabled = true;
									}
								});
							}
						}
					} else {
						if (item.isClick !== true) {
							item.default = "";
							item.showJx = false;
							item.showDa = false;
							item.isOk = "";
							item.selectIndex = '';
							if (item.quList != null) {
								item.quList.forEach(itemc => {
									itemc.disabled = false;
									if (item.type == 2 || item.type == 4) {
										itemc.checked = false;
									}
								});
							}

						}

					}
				});
				if (this.dtk != null && this.dtk != '') {
					this.swiperCurrent = parseInt(this.dtk - 1);
				}
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				this.getOrderList(index);
			},
			transition({
				detail: {
					dx
				}
			}) {
				//this.$refs.tabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {

				this.swiperCurrent = current;
				this.current = current;
			},
			//添加纠错
			addErroer() {
				uni.navigateTo({
					url: '/exam/question/add-error?cateId=' + this.cateId + "&chapterId=" + this.chapterId +
						"&sectionId=" + this.sectionId + "&userId=" + this.userId + "&questionsId=" + this.list[
							this.swiperCurrent].id
				})
			},
			//写笔记
			addNote() {
				uni.navigateTo({
					url: '/exam/question/add-note?cateId=' + this.cateId + "&chapterId=" + this.chapterId +
						"&sectionId=" + this.sectionId + "&userId=" + this.userId + "&questionsId=" + this.list[
							this.swiperCurrent].id
				})
			},
			getDa(index) {
				if (index == 0) {
					return "A";
				}
				if (index == 1) {
					return "B";
				}
				if (index == 2) {
					return "C";
				}
				if (index == 3) {
					return "D";
				}
				if (index == 4) {
					return "E";
				}
				if (index == 5) {
					return "F";
				}
				if (index == 6) {
					return "G";
				}
				if (index == 7) {
					return "H";
				}

			},
			getPdtda(index) {
				if (index == 0) {
					return "正确";
				}
				if (index == 1) {
					return "错误";
				}
			},
			getIndex(da) {
				if (da == "A") {
					return 0;
				}
				if (da == "B") {
					return 1;
				}
				if (da == "C") {
					return 2;
				}
				if (da == "D") {
					return 3;
				}
				if (da == "E") {
					return 4;
				}
				if (da == "F") {
					return 5;
				}
				if (da == "G") {
					return 6;
				}
				if (da == "H") {
					return 7;
				}
			},
			getNext() {
				setTimeout(() => {

					if (this.swiperCurrent < this.list.length - 1) {
						if (this.list[this.swiperCurrent].isOk == true) {
							this.swiperCurrent++;
						}

					}

				}, 500);
			},
			getTag(index) {
				let tag = "";
				if (index == 0) {
					tag = "A";
				}
				if (index == 1) {
					tag = "B";
				}
				if (index == 2) {
					tag = "C";
				}
				if (index == 3) {
					tag = "D";
				}
				if (index == 4) {
					tag = "E";
				}
				if (index == 5) {
					tag = "F";
				}
				return tag;
			}


		}
	}
</script>

<style lang="scss">
	.container {
		position: absolute;
		height: 100%;
		width: 100%;
		padding: 0upx;
		margin: 0upx;
	}

	.tab-type {
		width: 25%;
		font-size: 32upx;
		font-weight: 600;
		color: #898F9D;
		height: 100%;
		text-align: center;
	}

	.tab-type-mn {
		margin-left: 15%;
	}

	.is-select {
		color: #232529;
	}

	.sc-title {
		width: 50%;
		float: left;
		text-align: center;
		text-align: right;
	}

	.tab-img {
		width: 20%;
		color: #898F9D;
		margin-left: 12%;
		height: 40upx;
		line-height: 40upx;
	}

	.tab-img image {
		width: 40upx;
		height: 40upx;


	}

	.qu-list-content {
		width: 100%;
		height: 74%;
		margin-top: 40upx;
	}

	.tab-type-bt {
		width: 36px;
		background-color: #00B7FD;
		bottom: 0;
		height: 10upx;
		height: 4px;
		border-radius: 50px;
		margin: 0 auto;
	}

	// .qu-count {
	// 	width: 90%;
	// 	margin-left: 5%;
	// 	margin-top: 30upx;
	// 	padding-bottom: 20upx;

	// 	.img-dta {
	// 		width: 30upx;
	// 		height: 30upx;
	// 		float: left;
	// 		margin-top: 5upx;
	// 		margin-right: 10upx;
	// 	}
	// }

	// .qu-count .qu-count-item {
	// 	float: left;
	// }

	.qu-jindu {
		width: 90%;
		margin-left: 5%;
		// margin-top: 30upx;
	}

	.swiper-box {
		height: 100%;
	}

	.qu-item-list {
		width: 90%;
		margin-left: 5%;

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

	.qu-item-name {
		font-size: 32upx;
		font-weight: 600;
	}

	.qu-item-answer {
		width: 90%;
		margin-left: 5%;

		.group-list {
			width: 100%;
		}
	}

	.qu-item-answer .answer-item {
		position: relative;
		height: auto;
		min-height: 80upx;
		border-radius: 6upx;
		// background-color: #F3F5F9;
		margin-top: 30upx;
		line-height: 80upx;
		display: flex;
		align-items: center;
		padding: 0 20upx 0 0upx;
		box-shadow: 1rpx 1rpx 10rpx rgb(215, 227, 247);
		overflow: hidden;

		.answer-item-label {
			margin: 0px 10px 0px 0px;
			width: 80rpx;
			text-align: center;
			border-right: 1rpx solid #ccc;
		}
	}



	.answer-value {
		width: 90%;
		margin-left: 5%;

		.answer-isok {
			margin-top: 20upx;
			height: 80upx;
			line-height: 80upx;
			font-weight: 600;
			font-size: 32upx;
		}

		.answerr-isok-error {
			color: red;
		}

		.value-info {
			height: 80upx;
			line-height: 80upx;
			font-weight: 600;
			color: #898F9D;
		}

		.value-info-da {
			color: #00B7FD;
			margin-left: 20upx;
		}

		.answer-js-title {
			color: #898F9D;
			width: 13%;
			float: left;
		}

		.answer-js-info {
			width: 86%;
			float: left;
		}

		.btn-quren {
			width: 100%;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			font-size: 16upx;
			border-radius: 50upx;
			color: #FFFFFF;
			background-color: #00B7FD;
			float: left;
			margin-top: 50upx;
		}
	}

	.answer-js {
		bottom: 200upx;
	}

	.sc-btn-list {
		width: 100%;
		line-height: 100upx;
		height: 100upx;
		z-index: 10;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0upx;
		border-top: 1upx solid #E3E5E9;

		.btn-list-item {
			width: 33%;
			height: 100%;
			text-align: center;
			float: left;
			color: #898F9D;

		}

		.btn-list-item-two {
			width: 50%;
			height: 100%;
			text-align: center;
			float: left;
			color: #898F9D;

		}

		.da-ts {
			color: #898F9D;
		}

		.btn-item-img {
			width: 100%;
			height: 30%;
			float: left;

			.item-image-a {
				width: 50upx;
				height: 50upx;
			}

			.item-image-b {
				width: 45upx;
				height: 45upx;
			}

			.item-image-c {
				width: 45upx;
				height: 45upx;
			}
		}

	}

	.dtk-title {
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		font-size: 32upx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.dtk-title-name {
		font-size: 32upx;
		font-weight: 600;
	}

	.dtk_jieshao {
		margin: 0 20upx;
	}

	.dtk-close {
		position: absolute;
		right: 10upx;
	}

	.dtk-scroll {
		height: 80%;
		margin-bottom: 30upx;
		margin-top: 120upx;
		position: absolute;

		.dtk-item {
			width: 60upx;
			height: 60upx;
			text-align: center;
			float: left;
			margin-left: 13%;
			border-radius: 15upx;
			text-align: center;
			line-height: 60upx;
			background-color: #EEF1F5;
			color: #232529;
			margin-bottom: 20upx;

		}

		.dtk-select {
			background-color: #00B7FD;
			color: #FFFFFF;
		}


	}

	.wd-ts {
		color: #898F9D;
	}

	.itm-tkt-list {
		margin-top: 60upx;
	}

	.item-tkt {
		border: 1upx solid #8A8B8D;
		margin-bottom: 30upx;
		border-radius: 10upx;
		padding: 10upx 20upx;
	}

	.centre {
		text-align: center;
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

	.qu-count-body {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx 5% 0upx;

		.qu-item-name {
			font-size: 32upx;
			font-weight: 600;
		}

		.qu-typ {
			width: auto;
			height: 36upx;
			line-height: 36upx;
			text-align: center;
			font-size: 24upx;
			padding: 0 10upx;
			color: #FFFFFF;
			border-radius: 50upx 50upx 50upx 0;
			float: left;
			margin: 2upx 5upx 0 0;
			background-color: #FF761B;
		}

		.qu-count {
			display: flex;
			align-items: center;

			.img-dta {
				width: 25upx;
				margin-right: 8upx;
			}
		}
	}
</style>
