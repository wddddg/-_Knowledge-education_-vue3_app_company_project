<template>
	<view class="container" :style="{'--theme-color':themeColor, '--toggle-color': toggleColor}">
		<u-navbar :title="cName" :is-back="false">
			<template #right>
				<u-icon :size="40" name="list" style="margin-right: 40rpx;" @click="goCategory"></u-icon>
			</template>
		</u-navbar>
		<!-- <view class="box">
			<view class="box-top">
				<label class="cate-name u-font-44 u-m-l-30">{{cName}}</label>
				<image @click="goCateList()" class="select-cate" mode="widthFix"
					src="../../static/images/select-left-rght.png"></image> -->
		<!-- #ifndef MP-WEIXIN -->
		<!-- <view @click="uniShare" class="right-top">
					<u-icon name="share-fill" color="#ffffff" size="40"></u-icon>
				</view> -->
		<!-- #endif -->
		<!-- 报告 -->
		<view class="personal-report">
			<view class="accuracy-rate">
				<view class="accuracy-rate-text" :style="{background:toggleColor}">
					正确率
				</view>
				<label
					class="accuracy-rate-percentage">{{ (((indexCount.count - indexCount.cwCount) / indexCount.count) * 0.01) === (-Infinity || Infinity) ? 0 : (((indexCount.count - indexCount.cwCount) / indexCount.count) * 0.01) || 0 }}</label>%
			</view>

			<view class="personal-report-content">
				<view class="" style="text-align: center;">
					<u-icon :name="'star-fill'" size="36" :color="yzBili === 20?'#F1B466':'#EBEFF6'"
						style="margin: 0rpx 10rpx;" />
					<u-icon :name="'star-fill'" size="36" :color="yzBili === 40?'#F1B466':'#EBEFF6'"
						style="margin: 0rpx 10rpx;" />
					<u-icon :name="'star-fill'" size="36" :color="yzBili === 60?'#F1B466':'#EBEFF6'"
						style="margin: 0rpx 10rpx;" />
					<u-icon :name="'star-fill'" size="36" :color="yzBili === 80?'#F1B466':'#EBEFF6'"
						style="margin: 0rpx 10rpx;" />
					<u-icon :name="'star-fill'" size="36" :color="yzBili === 100?'#F1B466':'#EBEFF6'"
						style="margin: 0rpx 10rpx;" />
				</view>
				<view class="personal-report-canvas">
					<qiun-data-charts type="arcbar" :opts="arcbarOpts" :chartData="arcbarChartData" />
				</view>
				<view class="error-problems">
					<view class="error-problems-item">
						<label class="error-problems-number">{{ indexCount.cwCount || 0 }}</label>
						<view class="error-problems-title">
							错题
						</view>
					</view>
					<view class="error-problems-item">
						<label class="error-problems-number">{{ indexCount.count || 0 }}</label>
						<view class="error-problems-title">
							已做
						</view>
					</view>
					<view class="error-problems-item">
						<label class="error-problems-number">{{ indexCount.scCount || 0 }}</label>
						<view class="error-problems-title">
							收藏
						</view>
					</view>
				</view>
				<view class="footer-button">
					<u-button type="primary" @click="goDataReport">查看数据报告</u-button>
				</view>
			</view>
		</view>
		<!-- 标签 -->
		<u-sticky bgColor="#fff" class="tabs-box">
			<u-tabs :list="tabsList" @change="changeTabs" :is-scroll="false" :current="currentTabs">
			</u-tabs>
		</u-sticky>
		<!-- 内容 -->
		<view class="tag-item-list-body" v-if="currentTabs === 0">
			<view class="item-img">
				<u-swiper :list="bannerList" :height="144" mode="none" change="item-image" :interval="5000"
					:border-radius="12" img-mode="scaleToFill"></u-swiper>
			</view>
			<view class="item-list-items-box">
				<view class="item-list-items" v-for="(item,index) in itemsList" :key="index"
					@click="goExamList(item.type)">
					<view class="items-title">
						<view class="item-title-box" :style="`background: linear-gradient(${ item.boxStyleColor })`">
						</view>
						<view class="items-title-rotate"
							:style="`background: linear-gradient(${ item.boxStyleColor })`">
							<view class="items-title-text">{{ item.title }}</view>
						</view>
					</view>
					<view class="items-name">
						{{ item.name }}
					</view>
				</view>
			</view>
		</view>
		<view v-if="currentTabs === 1">
			<view class="page-box" v-if="questionList.length<=0">
				<NoState type="article" :isPage="false">
					<template #text>暂无数据！</template>
				</NoState>
			</view>
			<view class="question-list-item" v-for="(item,indexe) in questionList" :key="indexe" v-else>
				<view style="display: flex;">
					<view class="question-info" @click="getIsShowQuestio(indexe)">
						<view class="question-info-title">
							<label
								class="u-font-14 u-m-t-50 u-font-30">{{getZName(item.chapterId)+" "+item.name}}</label>
						</view>
						<view class="flexse">
							<view class="question-info-jindu">
								<u-line-progress :show-percent="false" :height="16" inactive-color='#EBEFF6'
									style="width:240rpx" active-color="#3F6EE1"
									:percent="(item.contactCount/item.questionCount)*100">
								</u-line-progress>
							</view>
							<view class="question-info-number u-m-l-16">
								{{item.contactCount}}/{{item.questionCount}}题
							</view>
						</view>
					</view>
					<view class="question-btn">
						<u-button type="primary" class="queston-btn-info" @click="btnScreening(item.id,0)"
							v-if="questionList.length<=0">练习</u-button>
						<u-icon :size="24" color="#909399" :name="item.showInfo?'arrow-down':'arrow-right'"
							@click="getIsShowQuestio(indexe)" v-else></u-icon>
					</view>
				</view>
				<u-line color="#DCDFE6" :hair-line="false" v-if="item.showInfo" style="margin: 32rpx 0rpx; 0rpx" />
				<view v-if="item.showInfo" class="question-info-list" v-for="(infoitem,index) in item.childList"
					:key="index">
					<div class="question-info">
						<view class="info-info-title">
							<label
								class="u-font-14 u-font-30">{{ getZJName(infoitem.sectionrId)+" "+ infoitem.name}}</label>
							<view class="u-m-t-4 info-info-state">
								{{ infoitem.state? '已完成': (infoitem.contactCount + '/' + infoitem.questionCount) }}
							</view>
						</view>

					</div>
					<view class="question-btn">
						<u-button type="primary" class="queston-btn-info" @click="btnScreening(item.id,0)">练习</u-button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="currentTabs === 2">
			<view class="practise-box" v-for="(item,index) in toDay" :key="index" @click="goExamList(4,item.id)"
				v-if="toDay.length">
				<label>今日完成XXX道题目</label>
				<u-icon :size="24" color="#909399" name="arrow-right"></u-icon>
			</view>
			<view v-else>
				<NoState type="article" :isPage="false">
					<template #text>暂无数据！</template>
				</NoState>
			</view>
		</view>
		<view v-if="currentTabs === 3">
			<view class="page-box" v-if="!plant.length">
				<NoState type="book" :isPage="false">
					<template #text>暂无计划！</template>
				</NoState>
				<u-button class="go-create-btn" @click="goMyPlant">去创建</u-button>
			</view>
			<view v-else>
				<view class="plan-time">
					<view style="width: 24rpx;">
						<u-icon :size="24" color="#909399" name="arrow-left" v-if="currentPlantIndex"
							@click="currentPlantIndex--"></u-icon>
					</view>
					<label style="color: #303133; font-weight: 900;">{{ currentPlantInfo.queryDate }}
						至 {{ currentPlantInfo.endDate }}</label>
					<view style="width: 24rpx;">
						<u-icon :size="24" color="#909399" name="arrow-right" @click="currentPlantIndex++"
							v-if="currentPlantIndex + 1 < plant.length"></u-icon>
					</view>
				</view>
				<view class="cumulative">
					<view class="cumulative-title">
						<view class="current-box"></view>
						<label>累计天数</label>
					</view>
					<view class="cumulative-day">
						<view class="cumulative-day-box">
							<view class="cumulative-day-number">
								<image src="@/static/total-left.png" mode="">
								</image>
								{{ currentPlantInfo.practiseDayCount }}
								<image src="@/static/total-right.png" mode="">
								</image>
							</view>
							<view class="cumulative-day-text">已练天数</view>
						</view>
						<view class="cumulative-day-box">
							<view class="cumulative-day-number">
								<image src="@/static/total-left.png" mode="">
								</image>
								{{ currentPlantInfo.totalDay }}
								<image src="@/static/total-right.png" mode="">
								</image>
							</view>
							<view class="cumulative-day-text">总天数</view>
						</view>
					</view>
					<u-line color="#DCDFE6" :hair-line="false" style="margin: 32rpx 0rpx;" />
				</view>
				<view class="cumulative">
					<view class="cumulative-title">
						<view class="current-box"></view>
						<label>累计题数</label>
					</view>
					<view class="cumulative-day">
						<view class="cumulative-day-box">
							<view class="cumulative-day-number">
								<image src="@/static/total-left.png" mode="">
								</image>
								{{ currentPlantInfo.totalComCount }}
								<image src="@/static/total-right.png" mode="">
								</image>
							</view>
							<view class="cumulative-day-text">已练题目</view>
						</view>
						<view class="cumulative-day-box">
							<view class="cumulative-day-number">
								<image src="@/static/total-left.png" mode="">
								</image>
								{{ currentPlantInfo.totalQuestionCount }}
								<image src="@/static/total-right.png" mode="">
								</image>
							</view>
							<view class="cumulative-day-text">总题数</view>
						</view>
					</view>
					<u-line color="#DCDFE6" :hair-line="false" style="margin: 32rpx 0rpx;" />
				</view>
				<view class="cumulative">
					<view class="cumulative-title">
						<view class="current-box"></view>
						<label>练习统计</label>
					</view>
					<view class="echart-content">
						<qiun-data-charts type="ring" :opts="opts" :chartData="chartData" class="echart-canvas"
							tooltipShow="false" />
						<view class="echart-text">
							<view class="echart-text-color"
								v-for="(item,index) in currentPlantInfo.questionTypeComList">
								<view class="echart-text-color-box" :style="{backgroundColor: item.bgColor}"></view>
								<view class="echart-text-color-item">
									<label>{{ item.questionTypeName }}</label>
									<label :style="{color: item.bgColor||'' }">{{ (item.deg || 0) + '%' }}</label>
								</view>
							</view>
						</view>
					</view>
					<view class="rate-of-progress">
						<view class="rate-of-progress-item">
							<view class="rate-of-progress-title">
								今日练习进度
							</view>
							<u-line-progress :show-percent="false" :height="16" inactive-color='#D6F3FF'
								style="flex: 1; margin: 0rpx 16rpx ;" active-color="#3F6EE1"
								:percent="currentPlantInfo.todayComDeg">
							</u-line-progress>
							<view style="width: 80rpx;">
								{{ currentPlantInfo.todayComDeg + '%' }}
							</view>
						</view>
						<view class="rate-of-progress-item">
							<view class="rate-of-progress-title">
								总练习进度
							</view>
							<u-line-progress :show-percent="false" :height="16" inactive-color='#D6F3FF'
								style="flex: 1; margin: 0rpx 16rpx ;" active-color="#3F6EE1"
								:percent="currentPlantInfo.totalComRate">
							</u-line-progress>
							<view style="width: 80rpx;">
								{{ currentPlantInfo.totalComRate + '%' }}
							</view>
						</view>
					</view>
				</view>
				<view class="add-my-plant" @click="goMyPlant">
					<view class="img-right">
						<u-icon size="72" name="plus-circle-fill" class="add-box"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
	
	<BottomTabbar :pagePath="'pages/question/index'" />
</template>

<script>
	import {
		getImgByType,
		getUser,
		getIndexCount,
		getChapterList,
		getToday,
		statistics,
		catePlantList
	} from "@/common/questionApi.js"
	import NoState from '@/components/NoState.vue'
	import BottomTabbar from "@/components/BottomTabbar.vue"
	import {
		goLogin
	} from "@/common/app-utils.js"
	// import httpPost from '@/common/questionApi.js'
	export default {
		filters: {
			ellipsis(value) {
				if (!value) return ''
				if (value.length > 35) {
					return value.slice(0, 35) + '...'
				}
				return value
			},
			ellipsis2(value) {
				if (!value) return ''
				if (value.length > 5) {
					return value.slice(0, 5) + '...'
				}
				return value
			}
		},
		data() {
			return {
				toDay: [],
				plant: [],
				currentPlantIndex: 0,
				currentPlantInfo: {},
				themeColor: uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe',
				toggleColor: uni.getStorageSync('otherThemeColor').toggleColor ? '#' + uni.getStorageSync(
						'otherThemeColor')
					.toggleColor : 'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)',
				userId: "",
				cId: "",
				cName: "",
				endDate: "",
				imgList: [],
				title: '',
				showAfterPages: false,
				staticUrl: getApp().globalData.staticUrl,
				sendStyle: {
					backgroundColor: '#315883',
					height: '60upx',
					width: '160upx',
					color: '#fff',
					borderRadius: '30upx',
					textAlign: 'center'
				},
				indexCount: {
					count: 0,
					cwCount: 0,
					scCount: 0,
					yzCount: 0,
				},
				yzBili: 0,
				girdStyle: {
					padding: '30upx 0 0 0upx'
				},
				bannerList: [],
				questionList: [],
				tabsList: [{
					name: '首页',
				}, {
					name: '章节练习',
				}, {
					name: '每日一练'
				}, {
					name: '我的计划'
				}],
				currentTabs: 0,
				itemsList: [{
						name: '模拟试卷',
						title: '模拟',
						boxStyleColor: '225deg, #F19DAF 0%, #E54E6F 100%',
						type: 2
					},
					{
						name: '历年真题',
						title: '真题',
						boxStyleColor: '225deg, #99AFFC 0%, #486FFA 100%',
						type: 3
					},
					{
						name: '错题练习',
						title: '错题',
						boxStyleColor: '225deg, #F8C994 0%, #F29E3F 100%',
						type: '错题'
					},
					{
						name: '我的笔记',
						title: '笔记',
						boxStyleColor: '225deg, #D7ABFD 0%, #B767FC 100%',
						type: '笔记'
					},
					{
						name: '考试记录',
						title: '记录',
						boxStyleColor: '225deg, #99AFFC 0%, #486FFA 100%',
						type: '记录'
					},
					{
						name: '搜一搜题',
						title: '搜题',
						boxStyleColor: '225deg, #F8C994 0%, #F29E3F 100%',
						type: '搜题'
					},
					{
						name: '领取资料',
						title: '资料',
						boxStyleColor: '225deg, #D7ABFD 0%, #B767FC 100%',
						type: '资料'
					}
				],
				chartData: {},
				opts: {
					rotate: false,
					rotateLock: false,
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [5, 5, 5, 5],
					dataLabel: false,
					legend: {
						show: false,
						position: "right",
						lineHeight: 25,
					},
					title: {
						name: "练习统计",
						fontSize: 15,
						color: "#666666"
					},
					subtitle: {
						name: "（%）",
						fontSize: 15,
						color: "#666666"
					},
					extra: {
						ring: {
							ringWidth: 30,
							labelWidth: 1,
							border: true,
							borderWidth: 1,
							borderColor: "#FFFFFF",
							linearType: "custom"
						}
					}
				},
				arcbarChartData: {},
				arcbarOpts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: undefined,
					title: {
						name: '0%',
						fontSize: 20,
						color: "#3F6EE1"
					},
					subtitle: {
						name: "完成率",
						fontSize: 10,
						color: "#666666",
					},
					extra: {
						arcbar: {
							type: "default",
							width: 10,
							backgroundColor: "#E9E9E9",
							startAngle: 0.99,
							endAngle: 0.0,
							gap: 2,
						}
					}
				}
			}
		},
		components: {
			NoState,
			BottomTabbar
		},
		async onLoad(e) {
			// this.setTab()
			uni.hideTabBar()
			uni.getStorage({
				key: 'user',
				success(e) {
					if (!e.data.cId) {
						uni.navigateTo({
							url: '/exam/category/category-list'
						})
					}
				},
				fail(e) {
					uni.navigateTo({
						url: '/exam/category/category-list'
					})
				}
			})
			this.getImg();
		},
		onShow() {
			if (!uni.getStorageSync("user").token) {
				goLogin()
				return
			}
			let user = uni.getStorageSync("user");
			if (typeof parseInt(user?.cId) == 'number' && user?.cId) {
				this.userId = user.userId;
				this.cName = this.ellipsis2(user.cName);
				this.cId = user.cId;
				this.getIndexCount();
				this.selectUser();
				this.getList();
			} else {
				uni.navigateTo({
					url: '/exam/category/category-list'
				});
			}
		},
		onHide() {},
		onPullDownRefresh() {
			let user = uni.getStorageSync("user");
			if (typeof parseInt(user.cId) == 'number' && user.cId) {
				this.userId = user.userId;
				this.cName = this.ellipsis2(user.cName);
				this.cId = user.cId;
				this.getIndexCount();
				this.selectUser();
				this.getList();
			} else {
				uni.navigateTo({
					url: '/exam/category/category-list'
				});
			}
			uni.stopPullDownRefresh()
		},
		methods: {
			goMyPlant() {
				uni.navigateTo({
					url: '/exam/question/my-plant-update?userId=' + this.userId
				})
			},
			goDataReport() {
				uni.navigateTo({
					url: '/exam/question/report'
				})
			},
			changeTabs(index) {
				this.currentTabs = index;
			},
			setTab() {
				let bottomIcon = uni.getStorageSync('bottomIcon')
				bottomIcon.forEach((itme, index) => {
					uni.setTabBarItem({
						"index": index,
						"pagePath": itme.onclickUrl,
						"iconPath": itme.onclickAgo,
						"selectedIconPath": itme.onclickAfter,
						"text": itme.title,
						"visible": true
					})
				})
				uni.setTabBarStyle({
					selectedColor: uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe'
				})
			},
			async getImg() {
				await getImgByType({
					type: 2
				}).then(ret => {
					if (ret.result != null) {
						this.imgList = ret.result;
						ret.result.forEach((item, index) => {
							// item.url = this.staticUrl + item.url
							this.bannerList.push(item.url);
						})
					}
				})
			},
			ellipsis2(value) {
				if (!value) return ''
				if (value.length > 5) {
					return value.slice(0, 5) + '...'
				}
				return value
			},
			selectUser() {
				getUser({
					id: uni.getStorageSync("user").userId,
					cateId: this.cId
				}).then(ret => {
					let preUser = uni.getStorageSync("user");
					uni.setStorageSync("user", Object.assign(preUser, ret.result));
				})
			},
			goCategory() {
				uni.navigateTo({
					url: '/exam/category/category-list',
				})
			},
			goCollect() {
				uni.navigateTo({
					url: '/pages/center/collection?type=collect&cateId=' + this.cId + "&userId=" + this.userId +
						"&page=index",
				})
			},
			goError() {
				uni.navigateTo({
					url: '/pages/center/collection?type=error&cateId=' + this.cId + "&userId=" + this
						.userId + "&page=index"
				})
			},
			goStudy() {
				uni.navigateTo({
					url: '/pages/center/collection?type=study&cateId=' + this.cId + "&userId=" + this
						.userId + "&page=index"
				})
			},
			getIndexCount() {
				getIndexCount({
					cateId: this.cId,
					userId: this.userId
				}).then(ret => {
					if (ret.result != null) {
						this.indexCount = ret.result;
						if (this.indexCount.yzCount == null || this.indexCount.yzCount == undefined || this
							.indexCount.yzCount == "undefined") {
							this.indexCount.yzCount = 0;
						}
						if (this.indexCount.count == null || this.indexCount.count == undefined || this.indexCount
							.count == "undefined") {
							this.indexCount.count = 0;
						}
						if (this.indexCount.count == 0 && this.indexCount.yzCount == 0) {
							this.yzBili = 0;
						} else {
							let yzValue = parseFloat(this.indexCount.yzCount / this.indexCount.count).toFixed(2) *
								100;
							yzValue = yzValue === (Infinity || -Infinity) ? 0 : yzValue
							this.yzBili = parseFloat(yzValue).toFixed();
						}
						let arcbarCartDataSync = {
							series: [{
								name: "正确率",
								color: "#3F6EE1",
								data: this.yzBili
							}]
						}
						this.arcbarChartData = JSON.parse(JSON.stringify(arcbarCartDataSync))
						this.arcbarOpts.title.name = (this.yzBili || 0) + '%'
					}
				})
			},
			//获取章节列表
			getList() {
				getChapterList({
					cateId: this.cId,
					userId: this.userId
				}).then(ret => {
					this.showAfterPages = true;
					this.questionList = ret.result;
				})


			},
			getIsShowQuestio(index, img) {
				if (this.questionList[index].showInfo == true) {
					this.questionList[index].showInfo = false;
				} else {
					this.questionList[index].showInfo = true;
				}

			},

			goCateList() {
				uni.navigateTo({
					url: '/exam/category/category-list'
				});
			},
			btnAllQuestion(chapterId, sectionId) {
				uni.navigateTo({
					url: '/exam/screening?cId=' + this.cId + "&userId=" + this.userId + "&chapterId=" +
						chapterId + "&sectionId=" + sectionId
				})
			},
			btnScreening(chapterId, sectionId) {
				uni.navigateTo({
					url: '/exam/screening?cId=' + this.cId + "&userId=" + this.userId + "&chapterId=" +
						chapterId + "&sectionId=" + sectionId
				})
			},

			goExamList(type, id) {
				if (type === '错题') {
					uni.navigateTo({
						url: '/exam/question/collection?type=error&cateId=' + this.cId + "&userId=" + this
							.userId + "&page=index"
					})
				}
				if (type === '笔记') {
					uni.navigateTo({
						url: '/exam/question/note?cateId=' + this.cId + "&userId=" + this.userId
					})
				}
				if (type === '记录') {
					uni.navigateTo({
						url: '/exam/question/exam-history-list?cateId=' + this.cId + "&userId=" + this.userId
					})
				}
				if (type === '搜题') {
					uni.navigateTo({
						url: '/exam/question/search'
					})
				}
				if (type === '资料') {
					uni.navigateTo({
						url: '/exam/question/means'
					})
				}
				if (type === 2 || type === 3 || type === 4) {
					uni.navigateTo({
						url: '/exam/exam-list?ksType=' + type + "&cateId=" + this.cId + "&todayId=" + id
					})
				}
			},
			goPlant() {
				uni.navigateTo({
					url: '/exam/question/my-plant?userId=' + this.userId
				})
			},
			tourls(item) {
				uni.navigateTo({
					url: '/exam/question/openH5?url=' + item.href
				})
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
			},
			uniShare() {
				this.$appUtils.uniShares()
			}
		},
		watch: {
			async currentTabs(nV, oV) {
				if (nV === 2) {
					// ,pageNo:1,pageSize:10
					getToday({
						cateId: this.cId
					}).then(res => {
						this.toDay = res.result
					})
				}
				if (nV === 3) {
					await catePlantList().then(res => {
						this.plant = res.result
					})
				}
			},
			plant: {
				async handler(newValue, oldValue) {
					if (newValue.length) {
						await statistics({
							date: newValue[this.currentPlantIndex].createTime,
							memberId: newValue[this.currentPlantIndex].member,
							plantId: newValue[this.currentPlantIndex].id,
						}).then(res => {
							this.currentPlantInfo = res.result
						})
						let currentcharData = []
						if (this.currentPlantInfo.questionTypeComList.length) {
							currentcharData = this.currentPlantInfo.questionTypeComList.map((item, index) => {
								item.bgColor = this.opts.color[index]
								return {
									"name": item.questionTypeName || '',
									"value": item.deg || 0
								}
							})
						}
						let charDataSync = {
							series: [{
								data: [...currentcharData],
							}]
						}
						this.chartData = charDataSync
					}
				},
				deep: true
			},
			currentPlantIndex: {
				async handler(newValue, oldValue) {
					if (this.plant.length) {
						await statistics({
							date: this.plant[newValue].createTime,
							memberId: this.plant[newValue].member,
							plantId: this.plant[newValue].id,
						}).then(res => {
							this.currentPlantInfo = res.result
						})
						let currentcharData = this.currentPlantInfo.questionTypeComList.map((item, index) => {
							item.bgColor = this.opts.color[index]
							return {
								"name": item.questionTypeName,
								"value": item.deg
							}
						})
						let charDataSync = {
							series: [{
								data: [...currentcharData],
							}]
						}
						this.chartData = charDataSync
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	// @import '@/uni.scss';
	.add-my-plant {
		position: fixed;
		right: 0;
		bottom: 240rpx;
		width: 116rpx;
		height: 88rpx;
		background: #C4CEF6;
		border-radius: 200rpx 0rpx 0rpx 200rpx;
		opacity: 0.9;

		.img-right {
			margin: 8rpx;
			height: 72rpx;
			width: 72rpx;
			border-radius: 50%;

			.add-box {
				height: 100%;
				width: 100%;
				color: #395AE1;
				transform: scale(1.2);
			}
		}
	}

	.personal-report {
		height: 512rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		margin: 20rpx 20rpx;
		position: relative;

		.accuracy-rate {
			position: absolute;
			right: 0rpx;
			width: 128rpx;
			height: 136rpx;
			border-radius: 8rpx;
			border: 2rpx solid #395AE1;
			text-align: center;

			.accuracy-rate-text {
				border-radius: 2rpx;
				margin: 8rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 24rpx;
				padding: 16rpx 16rpx;
			}

			.accuracy-rate-percentage {
				font-size: 48rpx;
				font-family: DINCond-Black, DINCond;
				font-weight: 900;
				color: #395AE1;
				line-height: 56rpx;
			}
		}

		.personal-report-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			// align-items: center;
			.error-problems {
				display: flex;
				align-items: center;
				justify-content: space-between;
				text-align: center;
				margin: 32rpx 0;

				.error-problems-item {
					flex: 1;

					.error-problems-title {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
						line-height: 32rpx;
						margin-top: 8rpx;
					}

					.error-problems-number {
						font-size: 36rpx;
						font-family: DINCond-Black, DINCond;
						font-weight: 900;
						color: #303133;
						margin: 8rpx 0;
						line-height: 44rpx;
					}
				}
			}

			.personal-report-canvas {
				height: 220rpx;
				margin-top: 30rpx;
			}
		}
	}

	.tag-item-list-body {
		margin-top: 32rpx;
		background-color: #fff;
		padding: 0 40rpx;

		.item-img {
			margin: 0 auto;
			width: 670rpx;
			height: 144rpx;
		}

		.item-list-items-box {
			display: flex;
			flex-wrap: wrap;
			align-items: center;

			.item-list-items {
				margin-top: 40rpx;
				width: 25%;
				text-align: center;

				.items-title {
					position: relative;

					.items-title-rotate {
						position: absolute;
						width: 72rpx;
						height: 72rpx;
						transform: translate(-50%, 0) rotate(45deg);
						border-radius: 20rpx;
						left: 50%;
						top: 0;

						.items-title-text {
							transform: rotate(-45deg);
							font-size: 26rpx;
							color: #FFFFFF;
							line-height: 72rpx;
							font-family: PangMenZhengDao;
						}
					}

					.item-title-box {
						width: 72rpx;
						height: 72rpx;
						border-radius: 20rpx;
						opacity: 0.4;
						margin: auto;
					}
				}

				.items-name {
					margin-top: 14rpx;
				}
			}
		}
	}

	.tabs-box {
		box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
	}

	.practise-box {
		width: 670rpx;
		height: 124rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 12rpx;
		margin: 20rpx auto;
		padding: 38rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.go-create-btn {
		width: 148rpx;
		height: 72rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
		border: 2rpx solid #395AE1;
		color: #395AE1;
		margin-top: 40rpx;
	}

	.plan-time {
		margin: 64rpx auto 48rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 72rpx;
	}

	.cumulative {
		margin: 0rpx 40rpx;

		.cumulative-title {
			display: flex;
			align-items: center;
			margin-bottom: 32rpx;

			.current-box {
				width: 8rpx;
				height: 32rpx;
				background: $u-global-color;
				border-radius: 4rpx;
			}

			label {
				font-size: 32rpx;
				font-family: PingFang-SC-Heavy, PingFang-SC;
				font-weight: 800;
				color: #303133;
				line-height: 48rpx;
				margin-left: 16rpx;
			}
		}

		.cumulative-day {
			display: flex;
			align-items: center;
			text-align: center;

			.cumulative-day-box {
				width: 50%;
				height: 92rpx;
				background: #FFFFFF;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.cumulative-day-number {
					font-size: 36rpx;
					font-family: DINCond-Black, DINCond;
					font-weight: 900;
					color: #303133;
					line-height: 44rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;

					image {
						width: 24rpx;
						height: 24rpx;
					}
				}

				.cumulative-day-text {
					font-size: 26rpx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: #909399;
					line-height: 32rpx;
				}
			}
		}

		.echart-content {
			display: flex;
			align-items: center;
			margin-left: 40rpx;

			.echart-canvas {
				width: 50%;
			}

			.echart-text {
				flex: 0 0 45%;
				display: flex;
				flex-direction: column;
				align-items: center;

				.echart-text-color {
					display: flex;
					align-items: center;
					margin: 20rpx 0rpx;
					justify-content: space-between;
					width: 100%;
					padding-left: 20rpx;

					.echart-text-color-box {
						margin: 0rpx 20rpx;
						width: 16rpx;
						height: 16rpx;
					}

					.echart-text-color-item {
						text-align: left;
						width: 100%;

						label {
							margin: 0rpx 10rpx;
						}
					}
				}
			}
		}

		.rate-of-progress {
			font-size: 26rpx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: #909399;
			line-height: 36rpx;

			.rate-of-progress-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 32rpx 0rpx;

				.rate-of-progress-title {
					text-align: right;
					width: 25%;
				}
			}
		}
	}

	page {
		background-color: #fff !important;
		margin: 0upx;
	}

	.posurights {
		position: absolute;
		bottom: 0;
		right: 100upx;
	}

	.right-top {
		position: absolute;
		top: 20upx;
		right: 20upx;
	}

	.box {
		padding: 0 0 150upx;
		background: linear-gradient(rgb(57, 200, 254), rgb(4, 184, 253));
		border-radius: 0 0 50upx 50upx;
	}

	.cate-name {
		color: #FFFFFF;
	}

	.select-cate {
		width: 35upx;
		height: 35upx;
		margin-left: 20upx;
	}

	.index-label {
		color: #FFFFFF;
		font-size: 36upx;
	}

	.box-top {
		width: 100%;
		position: relative;
		height: 100upx;
		display: flex;
		align-items: center;
	}

	.box-title {
		position: relative;
		width: 100%;
		text-align: left;
		margin: 0upx 0 50upx;
	}


	.statistics-list {
		width: 100%;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		text-align: center;
		margin: 0 0 30upx;
	}

	.statistics-list-item {
		width: 25%;
		height: 100%;
		font-size: 28upx;
		color: #FFFFFF;
	}

	.swper-content {
		margin: -150upx 3% 0;
	}

	.swper-list {
		border-radius: 20upx;
		height: 300upx;
		overflow: hidden;
	}

	.swper-list-items image {
		width: 100%;
		height: 100%;
	}


	.tag-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin: 20upx 10upx 20upx;
	}

	.tag-item-list {
		width: 50%;
		height: 120upx;
		margin-bottom: 25upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tag-item-list image {
		width: 94%;
		border-radius: 20upx;
	}

	.question-list {
		/* width: 100%;
		height: auto; */
		padding-bottom: 20upx;
		display: flex;
		flex-direction: column;
		margin-bottom: 100upx;
	}

	.question-list-item {
		// width: 92%;
		// margin-left: 4%;
		border-radius: 20upx;
		background-color: #FFFFFF;
		// margin-bottom: 20upx;
		margin: 20rpx 40rpx;
		// display: flex;
		padding: 32rpx 24rpx;
		box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
	}

	.question-list-item .question-item-open {
		width: 10%;
		// float: left;
		height: 200upx;
		text-align: center;
	}

	.question-info-list {
		display: flex;
		// height: 80rpx;
		margin: 20rpx 0rpx;

		.question-btn {
			width: 112rpx;
		}
	}

	.question-info-list .info-open {
		width: 10%;
		// float: left;
		height: 200upx;
		text-align: center;
	}

	.question-list-item .question-item-open image {
		width: 35upx;
		height: 35upx;
	}

	.question-info-list .info-open image {
		width: 30upx;
		height: 30upx;
	}

	.question-info {
		// width: 58%;
		// margin-left: 3%;
		flex: 1;
		width: 80%;
		// float: left;
		// height: 200upx;
	}

	.info-info {
		width: 58%;
		margin-left: 3%;
		// float: left;
		height: 200upx;
	}

	.question-info-title {
		width: 100%;
		// float: left;
		font-size: 15px;
		font-family: PingFang-SC-Heavy, PingFang-SC;
		font-weight: 800;
		color: #303133;
	}

	.info-info-title {
		font-weight: 550;
		// overflow: hidden;
		// text-overflow: ellipsis;
		// white-space: nowrap;
		// flex: 1;
		width: 90%;

		.info-info-state {
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #909399;
		}
	}

	.flexse {
		margin-top: 16rpx;
		// width: 100%;
		display: flex;
		align-items: center;
		// justify-content: space-between;
	}

	.question-info-jindu {
		// width: 60%;
	}

	.info-jindu {
		width: 60%;
	}

	.question-info-number {
		// width: 30%;
		color: #9499A6;
	}

	.info-number {
		width: 30%;
		color: #9499A6;
	}

	.question-info-jindu .jidutao-a {
		width: 100%;
		height: 10upx;
		border-radius: 20upx;
		background-color: #D6F3FF;
	}

	.info-jindu .info-jidutao-a {
		width: 100%;
		height: 10upx;
		border-radius: 20upx;
		background-color: #D6F3FF;
	}

	.question-info-jindu .jidutao-b {
		width: 20%;
		height: 10upx;
		border-radius: 20upx;
		background-color: #00B7FD;
		margin-top: -10upx;
	}

	.info-jindu .info-jidutao-b {
		width: 20%;
		height: 10upx;
		border-radius: 20upx;
		background-color: #00B7FD;
		margin-top: -10upx;
	}


	.question-btn {
		// width: 25%;
		// height: 200upx;
		// float: left;
		border-radius: 8rpx;

		.queston-btn-info {
			width: 112rpx;
			height: 60rpx;
			// border-radius: 50upx;
			// width: 90%;
			// height: 60upx;
			// line-height: 60upx;
			color: #FFFFFF;
			background-color: #395AE1;
			text-align: center;
			font-size: 24upx;
		}
	}

	.info-btn {
		width: 25%;
		height: 200upx;
		// float: left;
	}

	.info-btn-info {
		border-radius: 50upx;
		width: 90%;
		height: 60upx;
		line-height: 60upx;
		color: #FFFFFF;
		background-color: #00B7FD;
		text-align: center;
	}

	.info-open-line {
		width: 1upx;
		height: 90upx;
		background-color: #E3E5E9;
		margin-top: -50upx;
		margin-left: 60%;

	}

	.centre {
		text-align: center;
		font-size: 32upx;

		image {
			width: 164upx;
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
		// float: left;
		height: 60upx;
		width: 140upx;
		line-height: 60upx;
		color: #FFFFFF;
		background-color: #00B7FD;
		text-align: center;
		border-radius: 50upx;
	}

	.item-btn-two {
		// float: left;
		height: 60upx;
		width: 140upx;
		line-height: 60upx;
		color: #FFFFFF;
		border: 1upx solid #00B7FD;
		color: #00B7FD;
		text-align: center;
		border-radius: 50upx;
	}

	/* .box:after {
	  position: absolute;
	  left: 0;
	  right: 0;
	  bottom: -50px;
	  z-index: -1;
	  content: ' ';
	  height: 300upx;
	  width: 100%;
	  border-radius: 0 0 25% 25%;
	    background: linear-gradient(rgb(15,187,254), rgb(4,184,253));
	} */
	::v-deep .u-active {
		background: $u-toggle-color;
		transform: rotate(180deg);
	}

	::v-deep .chartsview {
		// transform: scale(1.2);
		margin-top: 60rpx;
	}
</style>
