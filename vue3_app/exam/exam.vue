<template>
	<view class="container">
		<u-navbar title="题目"></u-navbar>
		<view>
			<view class="qu-count-body">
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
									<!-- <view v-if="item.type===1" class="qu-typ dan">单选题</view>
									<view v-if="item.type===2" class="qu-typ duo">多选题</view>
									<view v-if="item.type===3" class="qu-typ wen">问答题</view>
									<view v-if="item.type===4" class="qu-typ ding">不定项题</view>
									<view v-if="item.type===5" class="qu-typ tian">填空题</view>
									<view v-if="item.type===6" class="qu-typ pan">判断题</view> -->
									<label>{{ indexP + 1 }}.{{ item.name }}</label>
								</view>
							</view>
						</view>
						<view class="qu-item-answer">
							<!-- 单选题干 -->
							<label :id="item.id" class="answer-item" v-for="(citem, index) in item.quList"
								v-if="item.type==1"
								@click="citem.disabled? '' : radioChange(index,indexP,item.type,item)" :key="index">
								<label class="answer-item-label"
									:class="item.selectIndex==index?'answer-select answer-select-ok':''">{{ getTag(index) }}
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
								<view class="u-font-24 da-ts wd-ts"></view>
								<view v-if="tagType==0&& item.isClick==false" @click="btnWenDa" :data-inde="indexP"
									data-items="item" class="btn-quren">确定</view>
							</view>
							<!-- 填空题题干 -->
							<view class="itm-tkt-list" v-if="item.type==5">
								<view class="item-tkt" v-for="(tkitem,index) in item.answerValue.split(',').length"
									:key="index">
									<u-input type="text" v-model="item.inputModal[index]" placeholder="请输入答案"></u-input>
								</view>
								<view v-if="item.isClick==false" data-items="item" :data-inde="indexP"
									@click="btnTiankong" class="btn-quren">确定</view>
							</view>

							<!-- 判断题题干 -->
							<label class="answer-item" v-for="(citem, index) in item.quList" :key="index"
								v-if="item.type==6"
								@click="citem.disabled? '' : radioChange(index,indexP,item.type,item)">
								<label class="answer-item-label"
									:class="item.selectIndex==index?'answer-select answer-select-ok':''">
									{{ getTag(index) }}
								</label>
								<view v-html="citem.name">
								</view>
							</label>
						</view>
						<view class="answer-value">
							<view class="value-info" v-if='item.showDa==true'>答案:<label
									class="value-info value-info-da">{{item.answerValue}}</label></view>
							<view class="answer-js" v-if="item.showJx==true">
								<view class="answer-js-title">解析:</view>
								<view class="answer-js-info"></view>
							</view>
						</view>


					</scroll-view>
				</swiper-item>

			</swiper>
		</view>
		<view class="sc-btn-list" v-if="tagType==1">
			<view class="btn-list-item">
				<view class="btn-item-img">
					<image class="item-image-a" src="@/static/images/img-jc.png"></image>
				</view>
				<view class="btn-item-title">纠错</view>
			</view>
			<view class="btn-list-item">
				<view class="btn-item-img">
					<image class="item-image-b" src="@/static/images/img-xbj.png"></image>
				</view>
				<view class="btn-item-title">写笔记</view>
			</view>
			<view class="btn-list-item" @click="kandaan()">
				<view class="btn-item-img">
					<image class="item-image-c" src="@/static/images/img-kda.png"></image>
				</view>
				<view class="btn-item-title">看答案</view>
			</view>
		</view>

		<view class="sc-btn-list" v-if="tagType==0">
			<view class="btn-list-ks-item">
				<label class="time-one">{{one}}:</label>
				<label class="time-two">{{two}}:</label>
				<label class="time-three">{{three}}</label>
				<label class="examstyle" v-if="examTime">（时长:{{examTime}}分钟）</label>
			</view>

			<view class="btn-list-ks-item">
				<view class="btn-submit-ks" @click="btnSubmitKs()">交卷</view>
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
						<view v-for="(item,index) in list" :key="index">
							<view @click="checkSWiper(index+1)" :class="index==(swiperCurrent)?'dtk-select':''"
								class="dtk-item">
								{{index+1}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<u-modal v-model="submitKsShow" cancel-text="再检查下" :show-cancel-button="true" :content="submitKscontent"
			@confirm="submitKsInfo" @cancel="cancelKsSubmit"></u-modal>
	</view>
</template>

<script>
	import NoState from '@/components/NoState.vue'
	import {
		getExamList,
		getQuestionListCount,
		sumbitExam,
		addExamLogItem
	} from "@/common/questionApi.js"
	export default {
		data() {
			return {
				userId: "",
				cateId: "",
				chapterId: "",
				sectionId: "",
				recordType: "", //分类 全部  错误 已做 未作
				questonType: '',
				pageSize: 0,
				pageNum: 1,
				ksType: '',
				showDtkDiv: false,
				current: 0,
				swiperCurrent: 0,
				activeClass: -1,
				tagType: 0,
				ttype: 'textarea',
				tborder: true,
				theight: 150,
				tautoHeight: true,
				selectId: "",
				examTime: '',
				submitKscontent: '确认交卷吗?',
				submitKsShow: false,
				flag: null,
				one: '00', // 时
				two: '00', // 分
				three: '00', // 秒
				abc: 0, // 秒的计数
				cde: 0, // 分的计数
				efg: 0, // 时的计数
				list: [],
				value: '',
				showAfterPages: false
			}

		},
		onLoad(option) {
			this.ksType = option.ksType;
			this.startHandler();
			this.nxType = option.nxType;
			this.userId = option.userId;
			this.cateId = option.cateId;
			this.chapterId = option.chapterId;
			this.sectionId = option.sectionId;
			this.pageSize = option.pageSize;
			this.recordType = option.recordType;
			this.questonType = option.questonType;
			this.selectId = option.selectId;
			this.examTime = option.examTime;
			this.getQuList();

			uni.setNavigationBarTitle({
				title: option.ksType == 1 ? '练习' : '考试'
			})
		},
		onUnload() {
			this.flag = clearInterval(this.flag)
		},
		components: {
			NoState
		},
		methods: {
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
				console.log(124)
				this.swiperCurrent = current;
				this.current = current;
			},
			getQuList: function() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				if (this.ksType == 2) {
					let param = {
						cateId: this.cateId,
						userId: uni.getStorageSync("user").userId,
						// pageSize: 1000,
						// pageNum: this.pageNum,
						examId: this.selectId
					}
					getExamList(param).then(ret => {
						if (ret.result != null && ret.result.length > 0) {
							this.list = ret.result;
							//this.selectConnect();
							this.showAfterPages = true
						}
						uni.hideLoading()
					});

				} else if (this.ksType == 3) {} else if (this.ksType == 4) {

				} else {
					let param = {
						cateId: this.cateId,
						chapterId: this.chapterId,
						sectionId: this.sectionId,
						userId: uni.getStorageSync("user").userId,
						recordType: this.recordType,
						pageSize: this.pageSize,
						pageNum: this.pageNum,
						questonType: this.questonType
					}

					getQuestionListCount(param).then(ret => {
						if (ret.result != null && ret.result.length > 0) {
							this.list = ret.result;
							//this.selectConnect();
							this.showAfterPages = true
						}
						uni.hideLoading()
					});
				}
				console.log("加载", this.list)
			},
			//添加学习计划记录
			sumbitExam(type, id, name, isOk, answerValue, selectValue) {
				let user = uni.getStorageSync("user");
				let param = {
					userId: uni.getStorageSync("user").userId,
					examId: this.selectId,
					memberId: user.userId,
					useDate: this.abc + this.cde * 60 + this.efg * 60 * 60,
					examLogId: this.list[0].examLogId
				}
				sumbitExam(param).then(ret => {
					uni.redirectTo({
						url: `/exam/report?ksType=${this.ksType}&examId=${this.selectId}&examLogId=${this.list[0].examLogId}`
					});
				});
			},
			//添加学习计划记录
			addExamLogItem(type, id, name, isOk, answerValue, selectValue, data) {
				let user = uni.getStorageSync("user");
				let param = {
					answer: answerValue,
					inputAnswer: selectValue,
					is_ok: isOk,
					examId: this.selectId,
					memberId: user.userId,
					questionId: id,
					examLogId: data.examLogId,
					userId: uni.getStorageSync("user").userId,
					question_type: type,
					question_title: name
				}
				addExamLogItem(param).then(ret => {});
			},
			// 选中某个单选框时，由radio时触发
			radioChange(...even) {
				// var indexP=even.currentTarget.dataset.inde
				// var index=Number(even.detail.value)
				// var type=even.currentTarget.dataset.items.type
				let index = even[0]
				let indexP = even[1]
				let type = even[2]
				var id = even[3].id
				var name = even[3].name

				let selectValue = "";
				if (type == 1 || type == 2) {
					selectValue = this.getDa(index);
				}
				if (type == 6) {
					selectValue = this.getPdtda(index);
				}
				let daan = this.list[indexP].answerValue;
				this.list[indexP].isClick = true;
				if (daan == selectValue) {
					this.list[indexP].isOk = true;
				} else {
					this.list[indexP].isOk = false;
				}
				this.list[indexP].isClick = true;
				this.list[indexP].selectIndex = index;
				if (this.ksType == 2) {
					this.addExamLogItem(type, id, name, this.list[indexP].isOk, this.list[indexP].answerValue, selectValue,
						this.list[indexP]);
				}
				//模拟答题-答对自动切换下一题
				if (this.tagType == 0) {
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
			selectDx(even) {
				var indexP = even.currentTarget.dataset.inde
				var type = even.currentTarget.dataset.items.type
				var id = even.currentTarget.dataset.items.id
				var name = even.currentTarget.dataset.items.name
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
				if (this.ksType == 2) {
					this.addExamLogItem(type, id, name, this.list[indexP].isOk, this.list[indexP].daan, selectValue, this
						.list[indexP]);
				}
				//自动切换系下一页
				this.getNext();



			},
			//问答题点击确认
			btnWenDa(even) {
				var indexP = even.currentTarget.dataset.inde
				var type = even.currentTarget.dataset.items.type
				var id = even.currentTarget.dataset.items.id
				var name = even.currentTarget.dataset.items.name
				let item = this.list[this.swiperCurrent];
				item.isClick = true;
				if (this.ksType == 2) {
					this.addExamLogItem(type, id, name, item.isOk, item.answerValue, item.inputValue, item);
				}
				//自动切换系下一页
				this.getNext();


			},
			//填空题点击
			btnTiankong(even) {
				var indexP = even.currentTarget.dataset.inde
				var type = even.currentTarget.dataset.items.type
				var id = even.currentTarget.dataset.items.id
				var name = even.currentTarget.dataset.items.name
				let item = this.list[this.swiperCurrent];
				item.isClick = true;
				if (item.inputModal == item.answerValue) {
					item.isOk = true;

				} else {
					item.isOk = false;
				}
				if (this.ksType == 2) {
					this.addExamLogItem(type, id, name, item.isOk, item.answerValue, item.inputModal, item);
				}
				//自动切换系下一页
				this.getNext();

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
			//提交考试确认
			btnSubmitKs() {
				this.submitKsShow = true;
				this.endHandler();

			},
			//取消考试提交
			cancelKsSubmit() {
				this.startHandler();
			},
			//提交考试
			submitKsInfo() {
				var repData = {};


				repData.count = this.list.length;

				let dxCount = 0;
				let duoxuanCount = 0;
				let wdCount = 0;
				let pdCount = 0;
				let tkCount = 0;
				let bdxCount = 0;

				let dxCounta = 0;
				let duoxuanCounta = 0;
				let wdCounta = 0;
				let pdCounta = 0;
				let tkCounta = 0;
				let bdxCounta = 0;

				let dxCountb = 0;
				let duoxuanCountb = 0;
				let wdCountb = 0;
				let pdCountb = 0;
				let tkCountb = 0;
				let bdxCountb = 0;

				let dxCountc = 0;
				let duoxuanCountc = 0;
				let wdCountc = 0;
				let pdCountc = 0;
				let tkCountc = 0;
				let bdxCountc = 0;

				this.list.forEach(citem => {
					if (citem.type == 1) {
						dxCount++;
						if (citem.isOk == true || citem.isOk == "true") {
							dxCounta++;
						} else if (citem.isOk === false) {
							dxCountb++;
						}
						if (citem.isClick == "" || citem.isClick == false) {
							dxCountc++;
						}
					}
					if (citem.type == 2) {
						duoxuanCount++;
						if (citem.isOk == true || citem.isOk == "true") {
							duoxuanCounta++;
						} else if (citem.isOk === false) {
							duoxuanCountb++;
						}
						if (citem.isClick == "" || citem.isClick == false) {
							duoxuanCountc++;
						}
					}
					if (citem.type == 3) {
						wdCount++;
						if (citem.isOk == true || citem.isOk == "true") {
							wdCounta++;
						} else if (citem.isOk === false) {
							wdCountb++;
						}

						if (citem.isClick == "" || citem.isClick == false) {
							wdCountc++;
						}
					}
					if (citem.type == 4) {
						bdxCount++;
						if (citem.isOk == true || citem.isOk == "true") {
							bdxCounta++;
						} else if (citem.isOk === false) {
							bdxCountb++;
						}
						if (citem.isClick == "" || citem.isClick == false) {
							bdxCountc++;
						}
					}
					if (citem.type == 5) {
						tkCount++;
						if (citem.isOk == true || citem.isOk == "true") {
							tkCounta++;
						} else if (citem.isOk === false) {
							tkCountb++;
						}
						if (citem.isClick == "" || citem.isClick == false) {
							tkCountc++;
						}
					}
					if (citem.type == 6) {
						pdCount++;
						if (citem.isOk == true || citem.isOk == "true") {
							pdCounta++;
						} else if (citem.isOk === false) {
							pdCountb++;
						}
						if (citem.isClick == "" || citem.isClick == false) {
							pdCountc++;
						}
					}
				})
				repData.dxCount = dxCount;
				repData.dxCounta = dxCounta;
				repData.dxCountb = dxCountb;
				repData.dxCountc = dxCountc;

				repData.duoxuanCount = duoxuanCount;
				repData.duoxuanCounta = duoxuanCounta;
				repData.duoxuanCountb = duoxuanCountb;
				repData.duoxuanCountc = duoxuanCountc;

				repData.wdCount = wdCount;
				repData.wdCounta = wdCounta;
				repData.wdCountb = wdCountb;
				repData.wdCountc = wdCountc;

				repData.pdCount = pdCount;
				repData.pdCounta = pdCounta;
				repData.pdCountb = pdCountb;
				repData.pdCountc = pdCountc;

				repData.tkCount = tkCount;
				repData.tkCounta = tkCounta;
				repData.tkCountb = tkCountb;
				repData.tkCountc = tkCountc;

				repData.bdxCount = bdxCount;
				repData.bdxCounta = bdxCounta;
				repData.bdxCountb = bdxCountb;
				repData.bdxCountc = bdxCountc;

				repData.xs = this.efg;
				repData.fz = this.cde;
				repData.ms = this.abc;


				uni.setStorageSync("kslist", this.list);
				uni.setStorageSync("repData", repData);
				if (this.ksType == 2) {
					this.sumbitExam()
				} else {
					uni.redirectTo({
						url: `/exam/report?ksType=${this.ksType}`
					});
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
						this.swiperCurrent++;
					}
				}, 500);
			},
			// 开始计时
			startHandler() {
				this.flag = setInterval(() => {
					if (this.cde == 0 && this.abc == 60) {
						this.submitKsInfo()
						clearInterval(this.flag)
					}
					if (this.three === 60 || this.three === '60') {
						this.three = '00';
						this.abc = 0;
						if (this.two === 60 || this.two === '60') {
							this.two = '00';
							this.cde = 0;
							if (this.efg + 1 <= 9) {
								this.efg++;
								this.one = '0' + this.efg;
							} else {
								this.efg++;
								this.one = this.efg;
							}
						} else {
							if (this.cde + 1 <= 9) {
								this.cde++;
								this.two = '0' + this.cde;
							} else {
								this.cde++;
								this.two = this.cde;
							}
						}
					} else {
						if (this.abc + 1 <= 9) {
							this.abc++;
							this.three = '0' + this.abc;
						} else {
							this.abc++;
							this.three = this.abc;
						}
					}

				}, 1000)
			},
			// 暂停计时
			endHandler() {
				this.flag = clearInterval(this.flag)
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
	// 	display: flex;
	// 	align-items: center;
	// 	padding:30upx 5% 20upx;

	// 	.img-dta {
	// 		width: 30upx;
	// 		margin-right: 8upx;
	// 	}
	// }

	// .qu-count .qu-count-itembig {
	// 	font-size: 34upx;
	// 	font-weight: 900;
	// }
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
			font-size: 28upx;
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
		display: flex;
		justify-content: space-between;

		.btn-list-item {
			width: 33%;
			height: 100%;
			text-align: center;
			color: #898F9D;

		}

		.examstyle {
			color: #ff0000 !important;
			font-size: 24upx !important;
		}

		.btn-list-ks-item {
			width: 50%;
			height: 100%;
			text-align: center;
		}

		.btn-list-ks-item label {
			color: #00B7FD;
			font-size: 32upx;
		}

		.da-ts {
			color: #898F9D;
		}

		.btn-item-img {
			width: 100%;
			height: 30%;

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
		border: 1upx solid #ccc;
		margin-bottom: 30upx;
		border-radius: 10upx;
		padding: 10upx 20upx;
	}

	.btn-submit-ks {
		width: 80%;
		margin: 0 auto;
		height: 80upx;
		background-color: #00B7FD;
		color: #FFFFFF;
		border-radius: 50upx;
		line-height: 80upx;
		margin-top: 10upx;

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
