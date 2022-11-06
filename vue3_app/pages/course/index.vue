<template>
	<view class="container" :style="{'--theme-color':themeColor}">
		<u-navbar :is-back="false"  title="课程"></u-navbar>
		<view class="top_box" >
			<view class="" @click="goSearch" style="width: 100%;">
				<!-- <uni-easyinput type="text" prefixIcon="search" class="logo_input" placeholder="搜索课程、书籍、考点、讲师" value="" /> -->
				<u-search maxlength="0" :clearabled="true" shape="square" :show-action="false" placeholder="搜索课程、书籍、考点、讲师"></u-search>
			</view>
			<image class="images" src="@/static/course/feng-l2x.png" mode="scaleToFill" @click="goCategory" style="width: 48rpx;height:48rpx;margin-left: 30rpx;"></image>
		</view>
		<view class="tabs_box">
			<u-tabs-swiper ref="uTabs" :list="list"  @change="changeTabs" :is-scroll="false" :current="currentTabs" :active-color="activeColor"></u-tabs-swiper>
		</view>
		<view class="filter">
			<view class="filter_box">
				<text v-show="currentTabs == 0" style="color:#969493;">{{`共${classList.length}个内容`}}</text>
				<text v-show="currentTabs == 1" style="color:#969493;">{{`共${courseList.length}个内容`}}</text>
				<text v-show="currentTabs == 2" style="color:#969493;">{{`共${bookList.length}个内容`}}</text>
				<text v-show="currentTabs == 3" style="color:#969493;">{{`共${knowledgeList.length}个内容`}}</text>
				<view class="filter_right" @click="setIsFIlter">
					<image class="images" src="@/static/course/shai-x2x.png" mode="scaleToFill" style="width: 20rpx;height:16rpx;margin-left: 30rpx;"></image>
					<text style="color:#6C83FF;margin-left: 8rpx;">筛选</text>
				</view>
			</view>
<!-- 			<view class="filter_option" v-show="isFilter">
				<image class="images" src="@/static/course/tuo-x2x.png" mode="scaleToFill" style="width:28rpx;height:28rpx;float: right;" @click="deleteFilter"></image>
				<view class="filter_option_list">
					<view class="filter_item" @click="setFilter(1)">综合排序</view>
					<view class="filter_item" @click="setFilter(2)">免费</view>
					<view class="filter_item" @click="setFilter(3)">会员</view>
					<view class="filter_item" @click="setFilter(4)">收费</view>
				</view>
			</view> -->
			<u-subsection :list="list1" v-if="isFilter" :current="curNow" @change="setFilter"></u-subsection>
		</view>
<!-- 		<scroll-view :style="'height: 1200rpx'"
		  @refresherrefresh="refresherrefresh" @scrolltolower="onReachBottoms" class="scroll-Y"
		  :refresher-triggered="triggered" :scroll-y="true" :refresher-threshold="45" :scroll-anchoring="true"
		  > -->
		<!-- <mescroll-uni ref="mescrollRef" height="1050rpx" @init="mescrollInit" @down="downCallback" @up="onReachBottoms" :down="downOption" :up="upOption" > -->
		<view class="list_content">

			<view class="list">
				<swiper style="height:1050rpx;" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item  class="swiper-item" key="0">
				<mescroll-uni ref="mescrollRef" height="1050rpx" @init="(mescrollRef)=>mescroll1=mescrollRef" @down="downCallback(1)" @up="onReachBottoms" :down="downOption" :up="upOption" >
				<view class="classList" >
					<template v-for="(itme,index) in classList">
						<view class="list" @click="goClassCourseDetail(itme)">
							<view class="list_itme">
								<image class="images" :src="itme?.imgUrl" mode="scaleToFill" style="width: 240rpx;height:180rpx;border-radius: 12rpx;margin: 24rpx;"></image>
								<view class="list_itme_right">
									<view class="list_itme_title">{{itme?.name}}</view>
									<view class="list_itme_tag">
										<!-- <view class="list_itme_tag_item" v-if="itme?.oneCateName">{{itme?.oneCateName}}</view> -->
										<!-- <view class="list_itme_tag_item" v-if="itme?.twoCateName">{{itme?.twoCateName}}</view> -->
										<view class="list_itme_tag_item" v-if="itme?.threeCateName">{{itme?.threeCateName}}</view>
									</view>
									<view class="list_itme_pay">
										<view class="list_itme_pay_letf">
											<image class="images" v-show="itme?.costType==4&&payRule.learnPayStatus==1&&payRule.isClosePay==0" src="@/static/index/qian2x.png" mode="scaleToFill" style="width: 32rpx;height:34rpx;"></image>
											<text style="color: #EE5142;" v-show="itme?.costType==4&&(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1)&&payRule.isClosePay==0">￥</text>
											<text class="current_price" v-if="itme?.costType==1" style="color: #67C23A;">{{'免费'}}</text>
											<text class="current_price" v-else-if="itme?.costType==2" style="color: #67C23A;">{{'限时免费'}}</text>
											<text class="current_price" v-else-if="itme?.costType==3" style="color: #395AE1;">{{'会员'}}</text>
											<text class="current_price" v-else-if="itme?.costType==4&&(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1||payRule.learnPayStatus==1)&&payRule.isClosePay==0" style="color: #EE5142;">
												{{itme?.presentPrice}}
												<text class="original_cost">￥{{itme?.originalPrice}}</text>
											</text>
											<text class="current_price" v-else style="color: #395AE1;">{{payRule.buttonName}}</text>
										</view>
										<view class="list_itme_pay_right">
											<text style="color: #909399;font-size: 24rpx;">{{itme?.studyCount+'人已学'}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</template>
					<NoState type="book" :isPage="true"
					v-show="(currentTabs==0&&classList.length==0)||(currentTabs==1&&courseList.length==0)||(currentTabs==2&&bookList.length==0)||(currentTabs==3&&knowledgeList.length==0)"
					>
						<template #text>
							<view>暂无更多内容！</view>
						</template>
					</NoState>
				</view>
				</mescroll-uni>
				</swiper-item>
				<swiper-item class="swiper-item" key="1">
				<mescroll-uni ref="mescrollRef" height="1050rpx" @init="(mescrollRef)=>mescroll2=mescrollRef" @down="downCallback(2)" @up="onReachBottoms" :down="downOption" :up="upOption" >
				<view class="courseList" >
					<template v-for="(itme,index) in courseList">
						<view class="list" @click="goCourseDetail(itme)">
							<view class="list_itme">
								<image class="images" :src="itme?.imgUrl" mode="scaleToFill" style="width: 240rpx;height:180rpx;border-radius: 12rpx;margin: 24rpx;"></image>
								<view class="list_itme_right">
									<view class="list_itme_title">{{itme?.name}}</view>
									<view class="list_itme_tag">
										<view class="list_itme_tag_item" v-if="itme?.courseType==1">{{'线上课'}}</view>
										<view class="list_itme_tag_item" v-if="itme?.courseType==2">{{'直播课'}}</view>
										<view class="list_itme_tag_item" v-if="itme?.courseType==3">{{'面授课'}}</view>
										<view class="list_itme_tag_item" v-if="itme?.courseType==4">{{'班级课'}}</view>
									</view>
									<view class="list_itme_pay">
										<view class="list_itme_pay_letf">
											<image class="images" v-show="itme?.costType==4&&payRule.learnPayStatus==1&&payRule.isClosePay==0" src="@/static/index/qian2x.png" mode="scaleToFill" style="width: 32rpx;height:34rpx;"></image>
											<text style="color: #EE5142;" v-show="itme?.costType==4&&(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1)&&payRule.isClosePay==0">￥</text>
											<text class="current_price" v-if="itme?.costType==1" style="color: #67C23A;">{{'免费'}}</text>
											<text class="current_price" v-else-if="itme?.costType==2" style="color: #67C23A;">{{'限时免费'}}</text>
											<text class="current_price" v-else-if="itme?.costType==3" style="color: #395AE1;">{{'会员'}}</text>
											<text class="current_price" v-else-if="itme?.costType==4&&(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1||payRule.learnPayStatus==1)&&payRule.isClosePay==0" style="color: #EE5142;">
												{{itme?.presentPrice}}
												<text class="original_cost">￥{{itme?.originalPrice}}</text>
											</text>
											<text class="current_price" v-else style="color: #395AE1;">{{payRule.buttonName}}</text>
										</view>
										<view class="list_itme_pay_right">
											<text style="color: #909399;font-size: 24rpx;">{{itme?.studyCount+'人已学'}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</template>
					<NoState type="book" :isPage="true"
					v-show="(currentTabs==0&&classList.length==0)||(currentTabs==1&&courseList.length==0)||(currentTabs==2&&bookList.length==0)||(currentTabs==3&&knowledgeList.length==0)"
					>
						<template #text>
							<view>暂无更多内容！</view>
						</template>
					</NoState>
				</view>
				</mescroll-uni>
				</swiper-item>
				<swiper-item class="swiper-item" key="2">
				<mescroll-uni ref="mescrollRef" height="1050rpx" @init="(mescrollRef)=>mescroll3=mescrollRef" @down="downCallback(3)" @up="onReachBottoms" :down="downOption" :up="upOption" >
				<view class="bookList" >
					<template v-for="(itme,index) in bookList">
						<view class="list" @click="goBookDetail(itme)">
							<view class="list_itme">
								<view class="list_itme_top">
									<image class="images" :src="itme?.imgUrl" mode="scaleToFill" style="width: 175rpx;height:196rpx;border-radius: 12rpx;"></image>
									<view class="list_itme_right">
										<view class="list_itme_title">{{itme?.name?itme?.name:''}}</view>
										<view class="list_itme_pay">
											<view class="list_itme_pay_right">
												<text style="color: #909399;">{{(itme?.threeCateName||itme?.twoCateName||itme?.oneCateName||'')+' | '}}</text><text style="color: #909399;">{{itme?.teacherName?itme?.teacherName:''}}</text>
											</view>
											<view class="list_itme_pay_letf">
												<image class="images" v-show="itme?.costType==4&&payRule.learnPayStatus==1&&payRule.isClosePay==0" src="@/static/index/qian2x.png" mode="scaleToFill" style="width: 32rpx;height:34rpx;"></image>
												<text style="color: #EE5142;" v-show="itme?.costType==4&&(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1)&&payRule.isClosePay==0">￥</text>
												<text class="current_price" v-if="itme?.costType==1" style="color: #67C23A;">{{'免费'}}</text>
												<text class="current_price" v-else-if="itme?.costType==2" style="color: #67C23A;">{{'限时免费'}}</text>
												<text class="current_price" v-else-if="itme?.costType==3" style="color: #395AE1;">{{'会员'}}</text>
												<text class="current_price" v-else-if="itme?.costType==4&&(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1||payRule.learnPayStatus==1)&&payRule.isClosePay==0" style="color: #EE5142;">
													{{itme?.presentPrice}}
													<text class="original_cost">￥{{itme?.originalPrice}}</text>
												</text>
												<text class="current_price" v-else style="color: #395AE1;">{{payRule.buttonName}}</text>
											</view>
										</view>
									</view>
								</view>
								<view class="list_itme_bottom">
									<text>{{itme?.remark}}</text>
								</view>
							</view>
						</view>
					</template>
					<NoState type="book" :isPage="true"
					v-show="(currentTabs==0&&classList.length==0)||(currentTabs==1&&courseList.length==0)||(currentTabs==2&&bookList.length==0)||(currentTabs==3&&knowledgeList.length==0)"
					>
						<template #text>
							<view>暂无更多内容！</view>
						</template>
					</NoState>
				</view>
				</mescroll-uni>
				</swiper-item>
				<swiper-item class="swiper-item" key="3">
				<mescroll-uni ref="mescrollRef" height="1050rpx" @init="(mescrollRef)=>mescroll4=mescrollRef" @down="downCallback(4)" @up="onReachBottoms" :down="downOption" :up="upOption" >
				<view class="knowledgeList" >
					<template v-for="(itme,index) in knowledgeList">
						<view class="list" @click="goKnowledgeDetail(itme)">
							<view class="list_itme">
								<view class="list_itme_top">
									<view v-if="itme?.isTop == 1" style="width: 64rpx;height: 32rpx;border: 1rpx solid #EE5142;line-height: 32rpx;text-align: center;color: #EE5142;margin-right: 12rpx;">置顶</view>
									<view v-if="itme?.isRecommend == 1" style="width: 64rpx;height: 32rpx;border: 1rpx solid #395AE1;line-height: 32rpx;text-align: center;color: #395AE1;margin-right: 12rpx;">推荐</view>
									<view class="list_itme_title">{{itme?.name?itme?.name:''}}</view>
								</view>
								<view class="list_itme_bottom">
									<text>{{'阅读：'+itme?.studyCount}}</text><text>{{' | 发布时间：'+itme?.createTime.substr(0,11)}}</text>
								</view>
							</view>
						</view>
					</template>
					<NoState type="book" :isPage="true"
					v-show="(currentTabs==0&&classList.length==0)||(currentTabs==1&&courseList.length==0)||(currentTabs==2&&bookList.length==0)||(currentTabs==3&&knowledgeList.length==0)"
					>
						<template #text>
							<view>暂无更多内容！</view>
						</template>
					</NoState>
				</view>
<!-- 				<u-loadmore class="loadmore"  :status="loadStatus" icon-type="flower" :load-text="loadText"
				v-show="(currentTabs==0&&classList.length!=0)||(currentTabs==1&&courseList.length!=0)||(currentTabs==2&&bookList.length!=0)||(currentTabs==3&&knowledgeList.length!=0)"
				>
				</u-loadmore> -->
				</mescroll-uni>
				</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- </scroll-view> -->
		<!-- </mescroll-uni> -->
	</view>
	<BottomTabbar :pagePath="'pages/course/index'" />
</template>

<script setup>
	import {onLoad,onShow,onPullDownRefresh,onReachBottom} from "@dcloudio/uni-app";
	import {ref,getCurrentInstance,nextTick } from "vue"
	import {setTab} from "@/common/app-utils.js"
	import {courseListForPage,bookListForPage,knowledgeListForPage} from "./CourseIndex.api.ts"
	import NoState from "@/components/NoState.vue"
	import BottomTabbar from "@/components/BottomTabbar.vue"
// import Page from '@/components/GlobalPage.vue'; 
	let themeColor = ref(uni.getStorageSync('themeColor')?uni.getStorageSync('themeColor'):'#395AE1')
	onLoad(async (e)=>{
		// setTab()
		uni.hideTabBar()
		if(e&&JSON.stringify(e)!='{}'){
			setTimeout(()=>{
				uni.switchTab({
					url:'/pages/course/index'
				})
			},50)
		}
		// let bottomIcon = uni.getStorageSync('bottomIcon')
		// bottomIcon.forEach((itme,index)=>{
		// 	console.log('已经设置了',itme);
		// 	uni.setTabBarItem({
		// 		"index":index,
		// 		"pagePath": itme.onclickUrl,
		// 		"iconPath": itme.onclickAgo,
		// 		"selectedIconPath": itme.onclickAfter,
		// 		"text": itme.title,
		// 		"visible":true,
		// 	})
		// })
		classList.value = await getClassList()
		courseList.value = await getCourseList()
		bookList.value = await getBookList()
		knowledgeList.value = await getKnowledgeList()
		if(classList.value.length <= 10){
			loadStatus.value = 'nomore'
		}
		if(e.index){
			changeTabs(e.index)
		}

	})
	onShow(()=>{

	})
	
	onPullDownRefresh(async()=>{

		classPage.pageNo = 1
		coursePage.pageNo = 1
		bookPage.pageNo = 1
		knowledgePage.pageNo = 1
		classList.value = await getClassList()
		courseList.value = await getCourseList()
		bookList.value = await getBookList()
		knowledgeList.value = await getKnowledgeList()
		uni.stopPullDownRefresh()
	})
	
	let downOption = ref({offset:40})
	let upOption = ref({
		offset:40,
		isBounce:true,
		auto:false,
		noMoreSize:1,
		textNoMore:'--没有更多了--',
		
		
		})
	const mescroll1 = ref()
	const mescroll2 = ref()
	const mescroll3 = ref()
	const mescroll4 = ref()
	// function mescrollInit(mescrollRef){
	// 	mescroll.value = mescrollRef
	// }
	async function downCallback(tabsIndex){
		// classPage.pageNo = 1
		// coursePage.pageNo = 1
		// bookPage.pageNo = 1
		// knowledgePage.pageNo = 1
		// classList.value = await getClassList(true)
		// courseList.value = await getCourseList(true)
		// bookList.value = await getBookList(true)
		knowledgeList.value = await getKnowledgeList(true)
		if(tabsIndex==1){
			classPage.pageNo = 1
			classList.value = await getClassList(true)
		mescroll1.value.endSuccess()
		}
		if(tabsIndex==2){
			coursePage.pageNo = 1
			courseList.value = await getCourseList(true)
		mescroll2.value.endSuccess()
		}
		if(tabsIndex==3){
			bookPage.pageNo = 1
			bookList.value = await getBookList(true)
		mescroll3.value.endSuccess()
		}
		if(tabsIndex==4){
			knowledgePage.pageNo = 1
			knowledgeList.value = await getKnowledgeList(true)
		mescroll4.value.endSuccess()
		}
	}
	
	const onReachBottoms = async ()=>{
		// if(loadStatus.value == 'nomore'){
		// 	uni.stopPullDownRefresh()
		// 	return
		// }
		// loadStatus.value = 'loading'
		let data = []
		if(currentTabs.value==0){
			classPage.pageNo++
			data = await getClassList(true)
			classList.value = [...classList.value,...data]
			if(data.length == 0){
				mescroll1.value.endSuccess(courseList.value.length,false)
			}
		}
		if(currentTabs.value==1){
			coursePage.pageNo++
			data = await getCourseList(true)
			courseList.value = [...courseList.value,...data]
			if(data.length == 0){
				mescroll2.value.endSuccess(courseList.value.length,false)
			}
		}
		if(currentTabs.value==2){
			bookPage.pageNo++
			data = await getBookList(true)
			bookList.value = [...bookList.value,...data]
			if(data.length == 0){
				mescroll3.value.endSuccess(bookList.value.length,false)
			}
		}
		if(currentTabs.value==3){
			knowledgePage.pageNo++
			data = await getKnowledgeList(true)
			knowledgeList.value = [...knowledgeList.value,...data]
			if(data.length == 0){
				mescroll4.value.endSuccess(knowledgeList.value.length,false)
			}
		}
		if(data.length == 0){
			loadStatus.value = 'nomore'
		}else{
			loadStatus.value = 'loadmore'
		}
	}
	let list = ref([{
					name: '班级',
				}, {
					name: '课程',
				}, {
					name: '电子书',
				}, {
					name: '资料库',
				}])
	let list1 = ref([{
					name: '综合排序',
				}, {
					name: '免费',
				}, {
					name: '会员',
				}, {
					name: '收费',
				}])
	let currentTabs = ref(0)
	let swiperCurrent = ref(0)
	let activeColor = ref(uni.getStorageSync('themeColor')?uni.getStorageSync('themeColor'):'#97fffe')
	let payRule = ref(uni.getStorageSync('payRule'))
	function changeTabs(index) {
		// currentTabs.value = index;
		swiperCurrent.value = index;
	}
	let loadStatus = ref('loadmore')
	let loadText = ref({
							loadmore: '轻轻上拉',
							loading: '正在加载',
							nomore: '没有更多了'
						})
	let isFilter = ref(false)
	function setIsFIlter(){
		isFilter.value?isFilter.value=false:isFilter.value=true
	}
	function deleteFilter(){
		isFilter.value = false
	}
	const uTabs = ref()
	function transition(e) {
		let dx = e.detail.dx;
		uTabs.value.setDx(dx);
	}
	function animationfinish(e) {
		let current = e.detail.current;
		uTabs.value.setFinishCurrent(current);
		swiperCurrent.value = current;
		currentTabs.value = current;
		if(current==0){
			curNow.value = classPage.searchType - 1
			if(classList.value.length <= 10){
				loadStatus.value = 'nomore'
			}
		}
		if(current==1){
			curNow.value = coursePage.searchType - 1
			if(courseList.value.length <= 10){
				loadStatus.value = 'nomore'
			}
		}
		if(current==2){
			curNow.value = bookPage.searchType - 1
			if(bookList.value.length <= 10){
				loadStatus.value = 'nomore'
			}
		}
		if(current==3){
			curNow.value = knowledgePage.searchType - 1
			if(knowledgeList.value.length <= 10){
				loadStatus.value = 'nomore'
			}
			
		}
	}
	
	let curNow = ref(0)
	async function setFilter(value){
		curNow.value = value
		if(currentTabs.value==0){
			classPage.pageNo = 1
			classPage.searchType = value +1
			classList.value = await getClassList()
				mescroll1.value.endSuccess(10,true)
		}
		if(currentTabs.value==1){
			coursePage.pageNo = 1
			coursePage.searchType = value +1
			courseList.value = await getCourseList()
				mescroll2.value.endSuccess(10,true)
		}
		if(currentTabs.value==2){
			bookPage.pageNo = 1
			bookPage.searchType = value +1
			bookList.value = await getBookList()
				mescroll3.value.endSuccess(10,true)
		}
		if(currentTabs.value==3){
			knowledgePage.pageNo = 1
			knowledgePage.searchType = value +1
			knowledgeList.value = await getKnowledgeList()
				mescroll4.value.endSuccess(10,true)
		}
	}
	
	let classList = ref([])
	let classPage = {pageNo:1,pages:10,termType:1,searchType:1}
	async function getClassList (noLoadImg=false){
		let data =  await courseListForPage(classPage,noLoadImg)
		return data.result.records
	}
	let courseList = ref([])
	let coursePage = {pageNo:1,pages:10,termType:2,searchType:1}
	async function getCourseList (noLoadImg=false){
		
		let data =  await courseListForPage(coursePage,noLoadImg)
		return data.result.records
	}
	let bookList = ref([])
	let bookPage = {pageNo:1,pages:10,searchType:1}
	async function getBookList (noLoadImg=false){
		let data =  await bookListForPage(bookPage,noLoadImg)
		return data.result.records
	}
	
	let knowledgeList = ref([])
	let knowledgePage = {pageNo:1,pages:10,searchType:1}
	async function getKnowledgeList (noLoadImg=false){
		let data =  await knowledgeListForPage(knowledgePage,noLoadImg)
		return data.result.records
	}
	
	function goKnowledgeDetail(e){
		uni.navigateTo({
			url:'/course/knowledge/KnowledgeDetail'+'?id='+e.id
		})
	}
	function goBookDetail(e){
		uni.navigateTo({
			url:'/course/book/BookDetail'+'?id='+e.id
		})
	}
	function goCourseDetail(e){
		if(e.courseType == 3){
			debugger
			uni.navigateTo({
				url:'/course/face-course/FaceCourse'+'?id='+e.id
			})
		}else if(e.courseType == 1||e.courseType == 2){
			uni.navigateTo({
				url:'/course/online-course/OnlineCourse'+'?id='+e.id+'&courseType='+e.courseType
			})
		}
	}
	function goClassCourseDetail(e){
		uni.navigateTo({
			url:'/course/class-course/ClassCourse'+'?id='+e.id
		})
	}
	function goSearch(){
		uni.navigateTo({
			url:'/course/search/Search'
		})
		uni.$on('courseParam',async function(data){
			if(currentTabs.value==0){
				classPage.pageNo = 1
				classPage.searchParam = data
				classList.value = await getClassList()
			}
			if(currentTabs.value==1){
				coursePage.pageNo = 1
				coursePage.searchParam = data
				courseList.value = await getCourseList()
			}
			if(currentTabs.value==2){
				bookPage.pageNo = 1
				bookPage.searchParam = data
				bookList.value = await getBookList()
			}
			if(currentTabs.value==3){
				knowledgePage.pageNo = 1
				knowledgePage.searchParam = data
				knowledgeList.value = await getKnowledgeList()
			}
		})
	}
	function goCategory() {
		uni.navigateTo({
			url: '/exam/category/category-list'+'?page=course'
		})
		uni.$on('courseCate',async function(data){
			if(currentTabs.value==0){
				classPage.pageNo = 1
				classPage.threeCateId = data
				classList.value = await getClassList()
			}
			if(currentTabs.value==1){
				coursePage.pageNo = 1
				coursePage.threeCateId = data
				courseList.value = await getCourseList()
			}
			if(currentTabs.value==2){
				bookPage.pageNo = 1
				bookPage.threeCateId = data
				bookList.value = await getBookList()
			}
			if(currentTabs.value==3){
				knowledgePage.pageNo = 1
				knowledgePage.threeCateId = data
				knowledgeList.value = await getKnowledgeList()
			}
		})
	}
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
.container {
	// background: $u-global-color;
	.top_box{
		padding: 0 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.tabs_box{
		box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
	}
	.list_content {
		margin:  20rpx 0rpx ;
	}
	.filter{
		margin:  20rpx 40rpx ;
		.filter_box {
				display: flex;
				justify-content: space-between;
				align-items: center;
			.filter_right {
				display: flex;
				align-items: center;
			}
		}
		.filter_option {
			height: 64rpx;
			border: 1rpx solid #DCDFE6;
			border-radius: 12rpx;
			position: relative;
			margin: 32rpx 0 ;
			.filter_option_list{
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				display: flex;
				align-items: center;
				justify-content: space-around;
				width: 100%;
				padding-right: 20rpx;
			}
			.filter_item {
				width: 136rpx;
				height: 48rpx;
				background: #F6F6F6;
				line-height: 48rpx;
				text-align: center;
				border-radius: 8rpx;
			}
		}
	}

	.list{
		.classList{
			.list_itme{
				height: 260rpx;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
				border-radius: 12rpx;
				margin: 32rpx 40rpx;
				display: flex;
			}
			.list_itme_right{
				width: 350rpx;
				padding: 24rpx 32rpx 24rpx 0;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				position: relative;
			}
			.list_itme_title {
				font-size: 30rpx;
				font-weight: 800;
				overflow:hidden;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;//显示的行数
			}
			.list_itme_tag {
				position: absolute;
				top:50%;
				transform: translateY(-25%);
				font-weight: 400;
				color: #606266;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				overflow:hidden;
				text-overflow:ellipsis;
				// display:-webkit-box;
				// -webkit-box-orient:vertical;
				// -webkit-line-clamp:2;//显示的行数
				display: flex;
				align-items: center;
				.list_itme_tag_item {
					height: 40rpx;
					line-height: 38rpx;
					padding: 0rpx 16rpx;
					color: #fff;
					background: linear-gradient(90deg, #29A28A 0%, #4CDC90 100%);
					border-radius: 0rpx 12rpx 0rpx 12rpx;
				}
			}
			.list_itme_pay {
				position: absolute;
				width: 350rpx;
				bottom:36rpx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				
				.list_itme_pay_letf{
					display: flex;
					align-items: center;
				}
				.current_price{
					font-size: 28rpx;
					font-weight:700;
				}
				.original_cost{
					text-decoration:line-through;
					font-size: 24rpx;
					font-weight: 400;
					color: #909399;
					margin-left: 16rpx;
				}
				.mini-btn{
					background-color: #3F6EE1;
				}
			}
		}
		.courseList{
			.list_itme{
				height: 260rpx;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
				border-radius: 12rpx;
				margin: 32rpx 40rpx;
				display: flex;
			}
			.list_itme_right{
				width: 350rpx;
				padding: 24rpx 32rpx 24rpx 0;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				position: relative;
			}
			.list_itme_title {
				font-size: 30rpx;
				font-weight: 800;
				overflow:hidden;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;//显示的行数
			}
			.list_itme_tag {
				position: absolute;
				top:50%;
				transform: translateY(-25%);
				font-weight: 400;
				color: #606266;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				overflow:hidden;
				text-overflow:ellipsis;
				// display:-webkit-box;
				// -webkit-box-orient:vertical;
				// -webkit-line-clamp:2;//显示的行数
				display: flex;
				align-items: center;
				.list_itme_tag_item {
					height: 40rpx;
					line-height: 37rpx;
					padding:0rpx 16rpx;
					color: #3F6EE1;
					border: 2rpx solid #7BC8E8;
					border-radius: 0rpx 12rpx 0rpx 12rpx;
				}
			}
			.list_itme_pay {
				position: absolute;
				width: 350rpx;
				bottom:36rpx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				
				.list_itme_pay_letf{
					display: flex;
					align-items: center;
				}
				.current_price{
					font-size: 28rpx;
					font-weight:700;
				}
				.original_cost{
					text-decoration:line-through;
					font-size: 24rpx;
					font-weight: 400;
					color: #909399;
					margin-left: 16rpx;
				}
				.mini-btn{
					background-color: #3F6EE1;
				}
			}
		}
		.bookList {
			.list_itme{
				height: 272rpx;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
				border-radius: 12rpx;
				margin: 32rpx 40rpx;
				position: relative;
			}
			.list_itme_top {
				display: flex;
			}
			.list_itme_bottom {
				color: #606266;
				height: 60rpx;
				background: #F6F6F6;
				border-radius: 12rpx;
				position: absolute;
				bottom: 0;
				width: 100%;
				line-height: 60rpx;
				padding: 0 24rpx;
				overflow:hidden;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:1;//显示的行数
			}
			.list_itme_right{
				width: 466rpx;
				height: 196rpx;
				padding: 24rpx 0 24rpx 32rpx;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				position: relative;
			}
			.list_itme_title {
				font-size: 30rpx;
				font-weight: 800;
				overflow:hidden;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;//显示的行数
			}
			.list_itme_pay {
				position: absolute;
				width: 430rpx;
				bottom:36rpx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				
				.list_itme_pay_letf{
					display: flex;
					align-items: center;
				}
				.current_price{
					font-size: 28rpx;
					font-weight:700;
				}
				.original_cost{
					text-decoration:line-through;
					font-size: 24rpx;
					font-weight: 400;
					color: #909399;
					margin-left: 16rpx;
				}
				.mini-btn{
					background-color: #3F6EE1;
				}
			}
		}
		.knowledgeList {
			.list_itme{
				height: 164rpx;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
				border-radius: 12rpx;
				margin: 32rpx 40rpx;
				position: relative;
				padding: 32rpx 24rpx;
			}
			.list_itme_top {
				display: flex;
				align-items: center;
				.list_itme_title {
					font-size: 30rpx;
					font-weight: 800;
					color: #303133;
					overflow:hidden;
					word-wrap: break-word;
					word-break: break-all;
					white-space: pre-line;
					text-overflow:ellipsis;
					display:-webkit-box;
					-webkit-box-orient:vertical;
					-webkit-line-clamp:1;//显示的行数
				}
			}
			.list_itme_bottom {
				margin-top: 16rpx;
				color: #909399;
			}
		}
	}
}

</style>
