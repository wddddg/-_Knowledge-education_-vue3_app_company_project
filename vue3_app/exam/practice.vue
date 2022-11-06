<template>
	<view class="container">
		<u-navbar title="考试"></u-navbar>

		<!-- #ifndef MP-WEIXIN -->
		<view class="kongse"></view>
		<!-- #endif -->
		<view class="navbarse">
			<!-- #ifndef MP-WEIXIN -->
			<u-icon @click="backse" name="arrow-left" class="arrows" size="40"></u-icon>
			<!-- #endif -->
			<view v-show="errorType=='error'" class="tab-type tab-type-mn " :class="tagType ==0?'is-select':''"
				@click="changeTag(0)">
				模拟答题
				<view :class="tagType ==0?'tab-type-bt':''"></view>
			</view>
			<view v-show="errorType=='error'" class="tab-type" @click="changeTag(1)"
				:class="tagType ==1?'is-select':''">
				背题模式
				<view :class="tagType ==1?'tab-type-bt':''"></view>
			</view>
			<view v-show="errorType!='error'" class="tab-type tab-type-mn">
				试题详情
			</view>
		</view>
		<view>
			<view v-show="errorType=='error'" class="qu-count-body">
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
			<view v-show="errorType=='error'" class="qu-jindu">
				<u-line-progress :height='12' active-color="#00B7FD" inactive-color='#D6F3FF'
					:percent="((swiperCurrent+1)/list.length)*100" :show-percent="false"></u-line-progress>
			</view>
		</view>
		<view class="qu-list-content" v-if="showAfterPages">
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
							<!-- 单选题干 (indexP,index,item.type)-->
							<label :id="'seect_'+item.id" class="answer-item" v-for="(citem, index) in item.quList"
								v-if="item.type==1" @click="citem.disabled? '' : radioChange(index,indexP,item.type)"
								:key="index">
								<label class="answer-item-label"
									:class="[item.selectIndex ===index&&item.isOk==true?'answer-select answer-select-ok':'',
											 item.selectIndex===index&&item.isOk==false&&tagType ==0?'answer-select-error answer-select-ok':'',
											 getTag(index) === item.answerValue && item.showDa?'answer-select answer-select-ok':'' ]">{{ getTag(index) }}
								</label>
								<view v-html="citem.name">
								</view>
							</label>
							<!-- 多选、不定项题干 -->
							<view v-if="(item.type==2||item.type==4)">
								<label class="answer-item" v-for="(citem, index) in item.quList" :key="index"
									@click="checkboxChange(index)">
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
								<view @click="selectDx" class="btn-quren" v-if="tagType==0&& item.isClick==false">确定
								</view>
							</view>
							<!-- 问答题题干 -->
							<view v-if="item.type==3&&tagType==0">
								<view class="u-m-t-72">
									<u-input v-model="item.inputValue" placeholder="请输入答案" :type="ttype"
										:border="tborder" :height="theight" :auto-height="tautoHeight" />
								</view>
								<view class="u-font-24 da-ts wd-ts">此类型的题目暂不支持判断对错,你可以点击右下角看答案查看答案解析</view>
								<view v-if="tagType==0&& item.isClick==false" @click="btnWenDa" class="btn-quren">确定
								</view>
							</view>
							<!-- 填空题题干 -->
							<view class="itm-tkt-list" v-if="item.type==5&&tagType==0">
								<view class="item-tkt" v-for="(tkitem,index) in item.answerValue.split(',').length"
									:key="index">
									<u-input type="text" v-model="item.inputModal[index]" placeholder="请输入答案"
										:disabled="item.disabled"></u-input>
								</view>
								<view v-if="item.isClick==false" @click="btnTiankong" class="btn-quren">确定</view>
							</view>
							<!-- 判断题题干 -->
							<label class="answer-item" v-for="(citem, index) in item.quList" :key="index"
								v-if="item.type==6" @click="citem.disabled? '' : radioChange(index,indexP,item.type)">
								<label class="answer-item-label"
									:class="[item.selectIndex ===index&&item.isOk==true?'answer-select answer-select-ok':'',
											 item.selectIndex===index&&item.isOk==false&&tagType ==0?'answer-select-error answer-select-ok':'',
											 getTag(index) === (item.answerValue === '正确'? 'A':'B') && item.showDa?'answer-select answer-select-ok':'' ]">
									{{ getTag(index) }}
								</label>
								<view v-html="citem.name">
								</view>
							</label>
						</view>
						<view class="answer-value">
							<view class="answer-isok-body">
								<view class="answer-isok answerr-isok-success" v-if='item.isOk===true&&tagType==0'>回答正确
								</view>
								<view class="answer-isok answerr-isok-error" v-if='item.isOk===false&&tagType==0'>回答错误
								</view>
								<view class="tab-img" @click="addCollect" v-if="item.showDa==true&&tagType==0">
									<view class="sc-title">收藏</view>
									<view>
										<u-icon :name="isCollect==false?'star':'star-fill'" size="36"
											:color="isCollect==true?'rgb(255,210,0)':''"></u-icon>
									</view>
								</view>
							</view>
							<view class="">
								<view class="value-info"
									v-if='item.showDa==true&&tagType==0&&item.type!=5&&item.type!=3'>我的答案:
									<label class="value-info value-info-wd"
										v-if="item.type != 2 || item.type!=4">{{ getDa(item.selectIndex) }}</label>
									<label v-else>{{ getChakeboxIndex(this.list[this.swiperCurrent].quList) }}</label>
									<label v-if="item.type === 5">
										{{ item.inputModal[0] }}
									</label>
								</view>
								<view class="value-info" v-if='item.showDa==true&&item.type!=3'>正确答案:
									<label v-if="item.type == 6"
										class="value-info value-info-da">{{ item.answerValue === '正确'? 'A':'B' }}</label>
									<label v-else class="value-info value-info-da">{{item.answerValue}}</label>
								</view>
								<view class="value-info" v-if='item.showDa==true&&item.type==3'>答案:
									{{item.answerValue}}
								</view>
								<view class="answer-js" v-if="item.showJx==true">
									<view class="answer-js-title">解析:</view>
									<view class="answer-js-info">{{item.answerAnalysis}}
									</view>
								</view>
							</view>
						</view>


					</scroll-view>
				</swiper-item>

			</swiper>
		</view>
		<view class="sc-btn-list">
			<view class="btn-list-item" @click="addErroer">
				<view class="btn-item-img">
					<image class="item-image" mode="heightFix" src="@/static/images/img-jc.png"></image>
				</view>
				<view class="btn-item-title">纠错</view>
			</view>
			<view class="btn-list-item" @click="addNote">
				<view class="btn-item-img">
					<image class="item-image" mode="heightFix" src="@/static/images/img-xbj.png"></image>
				</view>
				<view class="btn-item-title">写笔记</view>
			</view>
			<view v-show="errorType=='error'" class="btn-list-item" @click="kandaan()">
				<view class="btn-item-img">
					<image class="item-image" mode="heightFix" src="@/static/images/img-kda.png"></image>
				</view>
				<view class="btn-item-title">看答案</view>
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
				<view class="dtk_jieshao">单项选择(本类题共100题，每小题1.0分，共100分)</view>
				<scroll-view class="dtk-scroll" scroll-y="true">
					<view class="dtk-item-box">
						<view v-for="(item,index) in list" :key="index" class="dtk-item-margin-box">
							<view @click="checkSWiper(index+1)" :class="index==(swiperCurrent)?'dtk-select':''"
								class="dtk-item">
								{{index+1}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>

</template>

<script>
	import NoState from '@/components/NoState.vue'
	import {
		getHistoryQuestion,
		getTodayList,
		newPlantCountList,
		allErrorList,
		questionInfo,
		getQuestionListCount,
		getIsCollect,
		addCollect,
		deleteCollect,
		addRecord,
		addPlantLog,
		courseSectionPractice,
		addCourseSectionPracticeRecord
	} from "@/common/questionApi.js"
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
				showAfterPages: false,
				current: 0,
				swiperCurrent: 0,
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
				errorType: 'error',
				plantId: '',
				allErrorId: '',
				courseId: '',
			}

		},
		onLoad(option) {
			let user = uni.getStorageSync("user");
			this.plantId = option.plantId;
			this.allErrorId = option.allErrorId;
			this.errorType = option.errorType;
			this.id = option.id;
			this.nxType = option.nxType;
			this.userId = option.userId || user.userId;
			this.cateId = option.cateId || user.cId;
			this.chapterId = option.chapterId;
			this.sectionId = option.sectionId;
			this.pageSize = option.pageSize;
			this.recordType = option.recordType;
			this.questonType = option.questonType;
			this.selectId = option.selectId;
			this.courseId = option.courseId;
			this.getQuList();
		},
		components: {
			NoState
		},
		methods: {
			backse() {
				uni.navigateBack({
					delta: 1
				});
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
				if (this.nxType == 3) {
					var param = {
						pageSize: 1000,
						pageNum: this.pageNum,
						userId: uni.getStorageSync("user").userId,
						questionTagId: this.selectId
					}
					getHistoryQuestion(param).then(ret => {
						if (ret.result != null && ret.result.length > 0) {
							console.log("getHistoryQuestion load", ret)
							this.list = ret.result;
							this.selectConnect();
							this.showAfterPages = true;
						}

					});

				} else if (this.nxType == 4) {
					var param = {
						pageSize: 1000,
						pageNum: this.pageNum,
						userId: uni.getStorageSync("user").userId,
						todayId: this.selectId
					}
					getTodayList(param).then(ret => {
						if (ret.result != null && ret.result.length > 0) {
							this.showAfterPages = true;
							console.log("getTodayList load", ret)
							this.list = ret.result;
							this.selectConnect();
						}

					});

				} else if (this.plantId) {
					var param = {
						userId: uni.getStorageSync("user").userId,
						plantId: this.plantId
					}
					newPlantCountList(param).then(ret => {
						if (ret.result != null && ret.result.length > 0) {
							this.showAfterPages = true;
							console.log("plantId load", ret)
							this.list = ret.result;
							this.selectConnect();
						}

					});

				} else if (this.allErrorId) {
					var param = {
						userId: uni.getStorageSync("user").userId,
						cateId: this.cateId,
						memberId: this.userId,
						pageSize: 1000,
						pageNum: this.pageNum,
					}
					allErrorList(param).then(ret => {
						if (ret.result != null && ret.result.length > 0) {
							this.showAfterPages = true;
							console.log("allErrorId load", ret)
							this.list = ret.result;
							this.selectConnect();
						}

					});

				} else {
					var param = {
						cateId: this.cateId,
						chapterId: this.chapterId,
						sectionId: this.sectionId,
						userId: uni.getStorageSync("user").userId,
						recordType: this.recordType,
						pageSize: this.pageSize,
						pageNum: this.pageNum,
						questonType: this.questonType
					}
					if (this.id) {
						questionInfo({
							userId: uni.getStorageSync("user").userId,
							questionsId: this.id
						}).then(ret => {
							if (ret.result != null && ret.result.length > 0) {
								this.showAfterPages = true;
								this.list = ret.result;
								this.selectConnect();
								this.changeTag(1);
							}

						});
					} else if (this.courseId) {
						var data = {
							chapterId: this.chapterId,
							sectionId: this.sectionId,
							courseId: this.courseId,
						}
						courseSectionPractice(data).then(ret => {
							if (ret.result != null && ret.result.length > 0) {
								console.log(123241)
								this.showAfterPages = true;
								this.list = ret.result;
								this.selectConnect();
							}
						});
					} else {
						getQuestionListCount(param).then(ret => {
							if (ret.result != null && ret.result.length > 0) {
								console.log(123241)
								this.showAfterPages = true;
								this.list = ret.result;
								this.selectConnect();
							}
						});
					}
				}
			}, //查询是否收藏
			selectConnect() {
				let questionsId = this.list[this.swiperCurrent].id;
				let param = {
					cateId: this.cateId,
					chapterId: this.chapterId,
					sectionId: this.sectionId,
					userId: uni.getStorageSync("user").userId,
					questionsId: questionsId
				};
				getIsCollect(param).then(ret => {
					console.log(ret);
					if (ret.result == false) {
						this.isCollect = false;
					} else {
						this.isCollect = true;
					}
				}).catch(ret => {
					if (ret.result == false) {
						this.isCollect = false;
					} else {
						this.isCollect = true;
					}

				});
			},
			//添加、删除收藏
			addCollect() {
				let questionsId = this.list[this.swiperCurrent].id;
				let param = {
					cateId: this.cateId,
					chapterId: this.chapterId,
					sectionId: this.sectionId,
					userId: uni.getStorageSync("user").userId,
					questionsId: questionsId
				};
				if (this.isCollect == false) {
					//添加收藏
					addCollect(param).then(ret => {
						this.isCollect = true;
						uni.showToast({
							title: '收藏成功',
							duration: 2000,
							icon: "none"
						});
					});
				}
				if (this.isCollect == true) {
					//取消收藏
					deleteCollect(param).then(ret => {
						this.isCollect = false;
						uni.showToast({
							title: '取消收藏成功',
							duration: 2000,
							icon: "none"
						});
					});
				}

			},
			//切换答题模式
			changeTag(tag) {
				console.log(2123)
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
				this.selectConnect();
			},
			// 选中某个单选框时，由radio时触发indexP, index, type
			radioChange(...even) {
				// var indexP = even.currentTarget.dataset.inde
				// var index = Number(even.detail.value)
				// var type = even.currentTarget.dataset.type
				// console.log(indexP,index,type);
				let index = even[0]
				let indexP = even[1]
				let type = even[2]
				// console.log("选中了", indexP, index, type)

				let selectValue = "";
				if (type == 1 || type == 2) {
					selectValue = this.getDa(index);
				}
				if (type == 6) {
					selectValue = this.getPdtda(index);
				}
				let daan = this.list[indexP].answerValue;
				this.list[indexP].isClick = true;
				this.list[indexP].showJx = true;
				this.list[indexP].showDa = true;
				if (daan == selectValue) {
					this.list[indexP].isOk = true;
				} else {
					this.list[indexP].isOk = false;
				}
				//选中后禁用
				this.list[indexP].quList.forEach(item => {
					item.disabled = true;
				});
				this.list[indexP].selectIndex = index;
				if (this.plantId) {
					this.addPlantLog();
				} else {
					this.addRecord();
				}
				//模拟答题-答对自动切换下一题
				if (this.tagType == 0 && this.list[indexP].isOk == true) {
					//自动切换系下一页
					this.getNext();
				}

			},
			checkboxChange(e) {
				this.list[this.swiperCurrent].quList.forEach((item, index) => {
					item.checked = false
				});
				this.list[this.swiperCurrent].quList[e].select = true
				this.list[this.swiperCurrent].quList.forEach(item => {
					item.select ? item.checked = true : item.checked = false
				})
			},
			//多选点击确认
			selectDx() {
				let selectCount = 0;
				let selectValue = "";
				this.list[this.swiperCurrent].quList.forEach((item, index) => {
					if (item.checked == true) {
						selectCount++;
						selectValue += index + ',';
					}

				});
				//未选择点击提示选择
				if (selectCount < 1) {
					alert("请选择");
				} else {
					this.list[this.swiperCurrent].isClick = true;
					this.list[this.swiperCurrent].showJx = true;
					this.list[this.swiperCurrent].showDa = true;
					//已选择判断是否正确

					let daan = "";
					let da = this.list[this.swiperCurrent].answerValue;
					if (da !== null) {
						let das = da.split(",");

						das.forEach(item => {
							let childIndex = this.getIndex(item);
							daan += childIndex + ",";
						})
					}
					if (daan == selectValue) {
						this.list[this.swiperCurrent].isOk = true;
					} else {
						this.list[this.swiperCurrent].isOk = false;
					}

				}

				//选中后禁用
				this.list[this.swiperCurrent].quList.forEach(item => {
					item.disabled = true;
				});
				if (this.plantId) {
					this.addPlantLog();
				} else {
					this.addRecord();
				}
				//自动切换系下一页
				this.getNext();



			},
			//问答题点击确认
			btnWenDa() {
				let item = this.list[this.swiperCurrent];
				item.isClick = true;
				item.showJx = true;
				item.isOk = true;
				item.showDa = true;
				if (this.plantId) {
					this.addPlantLog();
				} else {
					this.addRecord();
				}
				//自动切换系下一页
				//this.getNext();


			},
			//填空题点击
			btnTiankong() {
				let item = this.list[this.swiperCurrent];
				item.showJx = true;
				item.showDa = true;
				item.isClick = true;
				if (item.inputModal == item.answerValue) {
					item.isOk = true;

				} else {
					item.isOk = false;
				}
				if (this.plantId) {
					this.addPlantLog();
				} else {
					this.addRecord();
				}
				this.list[this.swiperCurrent].disabled = true
				//判断是否正确

				//自动切换系下一页
				this.getNext();

			},
			//添加纠错
			addErroer() {
				uni.navigateTo({
					url: '/exam/question/add-error?cateId=' + this.cateId + "&chapterId=" + this.chapterId +
						"&userId=" + this.userId + "&sectionId=" + this.sectionId + "&questionsId=" + this.list[
							this.swiperCurrent].id
				})
			},
			//写笔记
			addNote() {
				uni.navigateTo({
					url: '/exam/question/add-note?cateId=' + this.cateId + "&chapterId=" + this.chapterId +
						"&userId=" + this.userId + "&sectionId=" + this.sectionId + "&questionsId=" + this.list[
							this.swiperCurrent].id
				})
			},
			//添加练习记录
			addRecord() {
				let that = this
				var param = {
					cateId: this.cateId,
					chapterId: this.chapterId,
					sectionId: this.sectionId,
					userId: uni.getStorageSync("user").userId,
					questionsId: this.list[this.swiperCurrent].id,
					isOk: this.list[this.swiperCurrent].isOk
				}
				if (this.courseId) {
					// this.list[this.swiperCurrent].selectIndex  单选
					// this.list[this.swiperCurrent].quList[].select  多选/不定项
					// this.list[this.swiperCurrent].inputValue  问答
					// this.list[this.swiperCurrent].inputModal[] 填空
					// this.list[this.swiperCurrent].selectIndex 判断
					let data = {
						practiceProgressId: this.list[this.swiperCurrent].practiceProgressId,
						isCorrect: this.list[this.swiperCurrent].isOk ? 1 : 2
					}
					debugger
					if (this.list[this.swiperCurrent].type == 1) {
						data.userAnswer = this.getDa(this.list[this.swiperCurrent].selectIndex)
					} else if (this.list[this.swiperCurrent].type == 2 || this.list[this.swiperCurrent].type == 4) {
						let select = []
						this.list[this.swiperCurrent].quList.forEach((item, index) => {
							if (item.select) {
								select.push(that.getDa(index))
							}
						})
						data.userAnswer = select.join(',')
					} else if (this.list[this.swiperCurrent].type == 3) {
						data.userAnswer = this.list[this.swiperCurrent].inputValue
					} else if (this.list[this.swiperCurrent].type == 5) {
						data.answerArray = this.list[this.swiperCurrent].inputModal
					} else if (this.list[this.swiperCurrent].type == 6) {
						data.userAnswer = this.getPdtda(this.list[this.swiperCurrent].selectIndex)
					}
					addCourseSectionPracticeRecord(data).then(ret => {});
					return
				}
				console.log(this.list[this.swiperCurrent]);
				addRecord(param).then(ret => {});
			},
			//添加学习计划记录
			addPlantLog() {
				let user = uni.getStorageSync("user");
				var param = {
					cateId: user.cId,
					memberId: user.userId,
					plantId: this.plantId,
					userId: uni.getStorageSync("user").userId,
					questionId: this.list[this.swiperCurrent].id,
				}
				addPlantLog(param).then(ret => {});
			},
			//看答案
			kandaan() {
				let item = this.list[this.swiperCurrent];
				if (item.isClick == false) {
					item.showDa = true;
					item.showJx = true;
					item.isOk = true;
					item.isClick = true;

					if (item.type == 1) {
						let selectIndex = this.getIndex(item.answerValue);
						item.selectIndex = selectIndex;
						item.default = item.quList[selectIndex].name;

					} else if (item.type == 2 || item.type == 4) {
						let da = item.answerValue;
						if (da !== null) {
							let das = da.split(",");
							das.forEach(citem => {
								let childIndex = this.getIndex(citem);
								item.quList[childIndex].checked = true;

							})
						}

					} else if (item.type == 3) {
						item.showDa = true;

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
					}
				}


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
			},
			getChakeboxIndex(index) {
				let tag = [];
				this.list[this.swiperCurrent].quList.forEach((item, index) => {
					if (item.select) {
						if (index == 0) {
							tag += "A,";
						}
						if (index == 1) {
							tag += "B,";
						}
						if (index == 2) {
							tag += "C,";
						}
						if (index == 3) {
							tag += "D,";
						}
						if (index == 4) {
							tag += "E,";
						}
						if (index == 5) {
							tag += "F,";
						}
					} else {
						return
					}
				})
				return tag.slice(0, tag.length - 1)
			}
		}
	}
</script>

<style lang="scss">
	.kongse {
		height: var(--status-bar-height);
	}

	.navbarse {
		height: 90upx !important;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.arrows {
		position: absolute;
		left: 3%;
	}

	.tab-type {
		padding: 0 20upx;
		font-size: 32upx;
		font-weight: 600;
		color: #898F9D;
		position: relative;
	}

	.is-select {
		color: #232529;
	}


	.tab-img {
		color: #898F9D;
		position: absolute;
		right: 2%;
		display: flex;
		align-items: center;

		.sc-title {
			margin: 0upx 16upx;
		}
	}

	.qu-list-content {
		width: 100%;
		height: 74%;
		margin-top: 40upx;
	}

	.tab-type-bt {
		position: absolute;
		background-color: #00B7FD;
		bottom: -10upx;
		left: 22%;
		right: 22%;
		height: 8upx;
		border-radius: 50px;
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

	.qu-count .qu-count-itembig {
		// font-size: 34upx;
		// font-weight: 900;
	}

	.qu-count .qu-count-itembig label {
		color: #00B7FD;
	}

	.qu-jindu {
		width: 90%;
		margin-left: 5%;
		// margin-top: 30upx;
	}

	.swiper-box {
		height: 100%;
		height: 65vh;
	}

	.qu-item-list {
		width: 90%;
		margin-left: 5%;

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

		.answer-isok-body {
			display: flex;
			align-items: center;
			margin-top: 20upx;

			.answer-isok {
				height: 80upx;
				line-height: 80upx;
				font-weight: 600;
				font-size: 32upx;
			}
		}

		.answerr-isok-error {
			color: red;
		}

		.answerr-isok-success {
			color: #68B947;
		}

		.value-info {
			height: 80upx;
			line-height: 80upx;
			font-weight: 600;
			color: #898F9D;
		}

		.value-info-wd {
			color: #898F9D;
			margin-left: 20upx;
		}

		.value-info-da {
			color: #00B7FD;
			margin-left: 20upx;
		}

		.answer-js-title {
			color: #898F9D;
			width: 13%;
			// line-height: 80upx;
			float: left;
		}

		.answer-js-info {
			width: 86%;
			float: left;
			// line-height: 80upx;
		}

	}

	.answer-js {
		margin-top: 20upx;
		bottom: 200upx;
	}

	.sc-btn-list {
		z-index: 10;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0upx;
		left: 0;
		right: 0;
		border-top: 1upx solid #E3E5E9;
		display: flex;

		.btn-list-item {
			width: 100%;
			text-align: center;
			color: #898F9D;
			padding: 15upx 0 10upx;
		}


		.da-ts {
			color: #898F9D;
		}

		.btn-item-img {
			width: 100%;

			.item-image {
				height: 50upx;
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
		margin: 40upx 40upx;
		font-size: 24upx;
		color: #939599;
	}

	.dtk-close {
		position: absolute;
		right: 10upx;
	}

	.dtk-scroll {
		height: 80%;
		margin-bottom: 30upx;
		// margin-top: 40upx;
		position: absolute;


		.dtk-item-box {
			// width: 40px;
			display: flex;
			flex-wrap: wrap;
			padding: 0upx 40upx;
			justify-content: space-between;
		}

		.dtk-item-margin-box {
			width: 20%;
		}

		.dtk-item {
			width: 60upx;
			height: 60upx;
			margin: 20upx auto;
			// text-align: center;
			// float: left;
			// margin-left: 13%;
			border-radius: 15upx;
			text-align: center;
			line-height: 60upx;
			background-color: #EEF1F5;
			color: #232529;
			// margin-bottom: 20upx;
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
		border: 1upx solid #ccc;
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
</style>
