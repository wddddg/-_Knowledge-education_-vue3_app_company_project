<template>
	<page>
	<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	<view class="container u-skeleton" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<u-navbar :z-index="'9999'" title="班级详情"></u-navbar>
		<view v-if="isVideo">
			<video id="myVideo" class="video" :src="videoUrl"
				@error="videoErrorCallback" :danmu-list="danmuList" enable-danmu :danmu-btn="false" controls direction @play="playStatus" @pause="pauseStatus"></video>
		</view>
		<view v-if="isAudio">
<!-- 			<audio id="myVideo" class="video" :src="pageData?.sectionParentList[selectSectionIndex]?.courseSectionVOList[selectChapterIndex]?.videoUrl"
				@error="videoErrorCallback"   direction></audio> -->
			<wxy-audio ref="wxy" :src="audioUrl.videoUrl" :name="audioUrl.name" v-model:play="audioPlay" ></wxy-audio>
		</view>
		<view class="top" v-if="!changeView">
			<view class="top-image">
				<!-- <view :style="`background:url(${pageData.imgUrl});height:422rpx`" ></view> -->
				<image class="images"  :src="pageData?.imgUrl" mode="scaleToFill" style="width: 100%;height:422rpx;position: absolute;"></image>
			</view>
			<view class="top-box">
				<text class="top-box-title">{{pageData?.name}}</text>
				<view class="top-box-count">
					<text>{{`共${pageData?.courseSectionCount?pageData?.courseSectionCount:''}个课时`}}</text>
					<view :style="{color:pageData?.isComplete==1?'#606266':'#395AE1'}">{{pageData?.isComplete==1?'已完结':'未完结'}}</view>
				</view>
				<view class="course-service">
					<view class="course-service-content" @click="onService">
						<view class="course-service-content-tag">
							<image class="images"  src="@/static/course/ju-x2x.png" mode="scaleToFill" style="width: 112rpx;height:56rpx;position: absolute;"></image>
							<text :style="{position: 'absolute',top:'50%',left: '40%',transform: 'translate(-50%,-50%)',color:themeFontColor}">服务</text>
						</view>
						<view class="course-service-content-itme" v-for="(itme,index) in pageData?.courseServerVOList">
							{{pageData?.courseServerVOList.length==index+1?itme.codeName:itme.codeName+' | '}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-tabs :list="list"  @change="changeTabs" :is-scroll="false" :current="currentTabs" :active-color="themeColor" class="tab"></u-tabs>
		<view class="detail" v-show="currentTabs==0">
				<view class="title">
					<view class="title_letf">
						<view class="title_icon"></view>
						<text style="margin: 0 0 0 16rpx ;">讲师</text>
					</view>
				</view>
			<scroll-view class="scroll-view_H" style="height: 150rpx;border: 1rpx solid transparent;" scroll-x="true"  >
				<view class="teacher-list">
					<view class="teacher-list-itme" v-for="(itme,index) in pageData?.courseTeacherVOList" @click="goTeacherDetail(itme)">
						<image class="images"  :src="itme.headImg" mode="scaleToFill" ></image>
						<view class="teacher-message">
							<view class="teacher-teacherName">{{itme.teacherName}}</view>
							<view class="teacher-subjectName">{{itme.subjectName}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="title">
				<view class="title_letf">
					<view class="title_icon"></view>
					<text style="margin: 0 0 0 16rpx ;">介绍</text>
				</view>
			</view>
			<u-parse :html="pageData?.content"></u-parse>
		</view>
		<view class="course-list" v-show="currentTabs==1||currentTabs==2||currentTabs==3||currentTabs==4">
			<scroll-view class="scroll-view_H" scroll-x="true"  >
				<template v-for="(item,index) in pageData?.classRelationVOList">
					<view class="scroll-view-item_H" :class="{'select-box':selectCourseindex == index}" @click="switchCourse(item,index)">
						<image class="images" :src="item.imgUrl" mode="scaleToFill" style="width: 204rpx;height:156rpx;border-radius: 12rpx;"></image>
					</view>
				</template>
			</scroll-view>
			<view class="title" style="margin-left: 40rpx;">
				<view class="title_letf">
					<view class="title_icon"></view>
					<text style="margin: 0 0 0 16rpx ;">{{pageData?.name}}</text>
				</view>
			</view>
		</view>
		<view class="course-table" v-if="currentTabs==1">
			<scroll-view  scroll-y="true" class="node" >
				<u-collapse accordion="false" :head-style="{'color': '#1B1E27','font-size': '32rpx','font-weight': '800'}" >
					<u-collapse-item :title="item.name" v-for="(item, index) in pageData?.sectionParentList" :key="index" :open="item.open" :disabled="item.disabled">
						<template v-for="(j,i) in item?.courseSectionVOList" >
							<view class="node-itme" @click="onWatch(j,index,i)">
								<view class="node-itme-letf">
									<view style="display: flex;align-items: center;">
										<view class="node-itme-img" :style="{'background-color':j.isStutyStatus==1?'linear-gradient(90deg, #303133 0%, #606266 100%)':'linear-gradient(270deg, #C0C4CC 0%, #909399 100%)'}" v-if="j.sectionType==1">
											<image class="images" src="@/static/course/po-f2x.png" mode="scaleToFill" style="width: 28rpx;height:28rpx;margin-right: 5rpx;"></image>
											<view class="" :style="{color:themeFontColor}">视频</view>
										</view>
										<view class="node-itme-img" :style="{'background-color':j.isStutyStatus==1?'linear-gradient(90deg, #303133 0%, #606266 100%)':'linear-gradient(270deg, #C0C4CC 0%, #909399 100%)'}" v-if="j.sectionType==2">
											<image class="images" src="@/static/course/shan-po@2x.png" mode="scaleToFill" style="width: 28rpx;height:28rpx;margin-right: 5rpx;"></image>
											<view class="" :style="{color:themeFontColor}">图文</view>
										</view>
										<view class="node-itme-img" :style="{'background-color':j.isStutyStatus==1?'linear-gradient(90deg, #303133 0%, #606266 100%)':'linear-gradient(270deg, #C0C4CC 0%, #909399 100%)'}" v-if="j.sectionType==3">
											<image class="images" src="@/static/course/po-f2x.png" mode="scaleToFill" style="width: 28rpx;height:28rpx;margin-right: 5rpx;"></image>
											<view class="" :style="{color:themeFontColor}">直播</view>
										</view>
										<view class="node-itme-img" :style="{'background-color':j.isStutyStatus==1?'linear-gradient(90deg, #303133 0%, #606266 100%)':'linear-gradient(270deg, #C0C4CC 0%, #909399 100%)'}" v-if="j.sectionType==5">
											<image class="images" src="@/static/course/zan-t@2x.png" mode="scaleToFill" style="width: 28rpx;height:28rpx;margin-right: 5rpx;"></image>
											<view class="" :style="{color:themeFontColor}">音频</view>
										</view>
										<view style="color: #303133;font-size: 28rpx;font-weight: 400;margin-left:12rpx;">{{j.name}}</view>
									</view>
									<view class="" v-if="j.sectionType!=3">{{`${j.durationCh }| 已学${j.rate?j.rate:0}%`}}</view>
									<view class="" v-if="j.sectionType==3">{{`${j.durationCh} | ${j.startTime?j.startTime:''}`}}<text style="color: #395AE1;margin-left: 10rpx;" v-if="j.isPlayBack == 1&&PlayBack(j.endTime)">{{'回放>>'}}</text></view>
								</view>
								<view class="node-itme-right">
									<view class="static" :style="{color:j?.isTryLook==1?'#395AE1':'#EE5142','border-color':j?.isTryLook==1?'#395AE1':'#EE5142'}">
										{{j?.isTryLook==1?'试看':'付费'}}
									</view>
								</view>
							</view>
							<view class="exercise" v-if="j?.isExercise==1">
								<view class="exercise-left">
									<view class="exercise-tag" >习题练习</view>
									<view class="exercise-itme">
										<view>{{j?.name}}</view>
										<text>{{`已做${j?.useQuestionCount}题 | 错误${j?.errorQuestionCount}题`}}</text>
									</view>
								</view>
								<view class="exercise-right" @click="goPractice(j)">练习>></view>
							</view>
						</template>
					</u-collapse-item>
				</u-collapse>
			</scroll-view>
		</view>
		<view class="courseware" v-show="currentTabs==2">
			<view class="courseware-count">{{`共${pageData?.coursewareVOList?.length}个文件`}}</view>
			
			<template v-for="(itme,index) in pageData?.coursewareVOList">
				<view class="courseware-itme">
					<image v-if="itme.coursewareType=='png'||itme.coursewareType=='jpg'" class="images" src="@/static/course/png2x.png" mode="scaleToFill" style="width: 36rpx;height:40rpx;"></image>
					<image v-if="itme.coursewareType=='pdf'" class="images" src="@/static/course/pdf2x.png" mode="scaleToFill" style="width: 36rpx;height:40rpx;"></image>
					<image v-if="itme.coursewareType=='doc'" class="images" src="@/static/course/doc2x.png" mode="scaleToFill" style="width: 36rpx;height:40rpx;"></image>
					<view class="courseware-itme-name" @click="onDownload(itme.fileUrl)">{{itme.fileName+'.'+itme.coursewareType}}</view>
					<!-- #ifdef  H5 -->
					<a :href="itme.fileUrl" class="btn">下载</a>
					<!-- #endif -->
				</view>
			</template>
		</view>
		<view class="contact" v-if="currentTabs==3">
			<view style="width: 50%;">
				<u-subsection :list="contactlist" :current="current" mode="subsection" active-color="#395AE1" ref="subsection"
					@change="changeCurrentSubsection"></u-subsection>
			</view>
			<view class="score-list" v-show="current==0">
				<view class="total-score">
					<text style="font-size: 30rpx;font-weight: bold;color: #303133;">
						综合评分
						<text style="color: #E85535;">{{pageData?.score}}</text>
					</text>
					<uni-rate  activeColor="#E85535" disabledColor="#E85535" disabled="true" v-model="pageData.score" />
				</view>
				<view class="score-item" v-for="(itme,index) in scoreList">
					<image class="images" :src="itme.headImg" mode="scaleToFill" style="width: 56rpx;height:56rpx;border-radius: 56rpx;"></image>
					<view class="score-item-right">
						<view class="score-item-right-top">
							<view class="score-item-right-name">{{itme.nickName}}</view>
							<view class="score-item-right-date">{{itme.replyTime}}</view>
						</view>
						<uni-rate style="margin:12rpx 0;" size="18" activeColor="#E85535" disabledColor="#E85535" disabled="true" v-model="itme.complexScore" />
						<view class="score-item-right-content">{{itme.content}}</view>
					</view>
				</view>
			</view>
			<view class="answer-list" v-show="current==1">
				<view class="score-item" v-for="(itme,index) in answerList">
					<image class="images" :src="itme.headImg" mode="scaleToFill" style="width: 56rpx;height:56rpx;border-radius: 56rpx;"></image>
					<view class="score-item-right">
						<view class="score-item-right-top">
							<view class="score-item-right-name">{{itme.nickName}}</view>
							<view class="score-item-right-date">{{itme.replyTime}}</view>
						</view>
						<view class="score-item-right-content">{{itme.content}}</view>
						<view class="score-item-right-answer">
							<image class="images" :src="itme.teacherHeadImg" mode="scaleToFill" style="width: 40rpx;height:40rpx;border-radius: 40rpx;"></image>
							<view class="answer-right">
								<view class="answer-right-name">{{itme.teacherName}}</view>
								<view class="answer-right-content">{{itme.replyContent}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="fab" @click="goContact">
				<view class="btn">
					<image class="images" src="@/static/course/fa-b2x.png" mode="scaleToFill" style="width: 40rpx;height:40rpx;"></image>
				</view>
				<view class="fan">发表</view>
			</view>
		</view>
		<view class="course-exam" v-show="currentTabs==4">
			<template v-for="(itme,index) in pageData?.courseExamVOList">
				<view class="course-exam-itme">
					<image class="images" :src="item?.imgUrl" mode="scaleToFill" style="width: 156rpx;height:120rpx;"></image>
					<view class="course-exam-message">
						<view class="course-exam-title">{{itme.name}}</view>
						<view class="course-exam-option">
							<text class="course-exam-count">{{`${itme.examTime}分钟 | ${itme.examCount}道题目`}}</text>
							<view class="course-exam-start" @click="goExam(itme)" :style="{background:buttonColor,color:themeFontColor}">开始考试</view>
						</view>
					</view>
				</view>
			</template>
		</view>
		<NoState type="book" class="no-state" :isPage="false" 
		v-show="(currentTabs==1&&pageData?.sectionParentList.length==0)||
		(currentTabs==2&&pageData?.coursewareVOList.length==0)||
		(currentTabs==3&&((current==0&&scoreList.length==0)||(current==1&&answerList.length==0)))||
		(currentTabs==4&&pageData?.courseExamVOList.length==0)"
		>
			<template #text>
				<view>暂无更多内容！</view>
			</template>
		</NoState>
		<view class="bottom" v-if="!changeView">
			<view class="course-activity" v-if="pageData?.isActivity==1" v-show="isShowbutton">
				<text class="course-activity-tag" :style="{color:themeFontColor}">限时活动</text>
				<text class="course-activity-time">
					{{`据结束`}}
					<text class="time-style">{{day}}</text>天
					<text class="time-style">{{hours}}</text>:
					<text class="time-style">{{Minutes}}</text>:
					<text class="time-style">{{Seconds}}</text>
				</text>
			</view>
			<view class="bottom-box" v-if="isShowbutton">
				<view style="display: flex;align-items: center;">
					<image class="images" src="@/static/course/ke-h2x.png" mode="scaleToFill" style="width: 44rpx;height:44rpx;margin-right: 16rpx;" @click="goCustomService(pageData)"></image>
					<image class="images" v-show="payRule.learnPayStatus==1&&payRule.isClosePay==0" src="@/static/index/qian2x.png" mode="scaleToFill" style="width: 32rpx;height:34rpx;"></image>
					<text style="color: #EE5142;" v-show="(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1)&&payRule.isClosePay==0">￥</text>
					<text class="current_price" style="color: #EE5142;" v-show="(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1||payRule.learnPayStatus==1)&&payRule.isClosePay==0">
						{{pageData?.isActivity==1?pageData?.presentPrice:pageData?.originalPrice}}
							<text class="original_cost" v-if="pageData?.isActivity==1">
								{{'￥'+pageData?.originalPrice}}
							</text>
					</text>
				</view>
				<view class="button" v-if="pageData?.isStutyStatus==0" :style="{background:buttonColor,color:themeFontColor}" @click="onPay">{{payRule?.isClosePay==0?'立即购买':payRule?.buttonName}}</view>
				<view class="button" v-if="pageData?.isStutyStatus==1" :style="{background:'#C0C7D1',color:'#fff'}">{{'已报名'}}</view>
			</view>
			<view class="pay-button" v-if="!isShowbutton">
				<view class="button" :style="{background:'#C0C7D1',color:'#fff'}" @click="onClose" >{{'取消'}}</view>
				<view class="button"  :style="{background:buttonColor,color:themeFontColor}" @click="goOrder">{{'立即购买'}}</view>
			</view>
		</view>
	</view>
	<ThemeModal content="成为会员免费解锁" confirmText="了解会员详情" :showCancelBtn="false" :showModal="showMember" @confirmModal="goMember"/>
	<ThemePopup :showModal="showOther" :title="payRule?.alertTitle" :showCancelBtn="false" confirmText="保存图片"  @confirmModal="onDownload(payRule?.alertUrl,true)" @close = "close">
		<template #content>
			<view style="display: flex;justify-content: center;margin-bottom: 30rpx;" v-if="showOther"> 
				<image class="images" :src="payRule?.alertUrl" mode="scaleToFill" style="width: 160rpx;height:160rpx;"></image>
			</view>
		</template>
	</ThemePopup>
	<u-popup v-model="showService" mode="bottom" border-radius="12" >
		<view class="popup-service" :style="{height:350+150*pageData?.courseServerVOList?.length +'rpx'}">
			<view class="popup-title">
				特色服务
				<u-icon name="close" @click="onClose" style="float: right;" size="28"></u-icon>
			</view>
			<view class="popup-itme" v-for="(itme,index) in pageData?.courseServerVOList">
				<view style="font-size: 28rpx;font-weight: 400;color: #303133;">{{itme.codeName}}</view>
				<view style="font-size: 24rpx; font-weight: 400;color: #909399;margin: 16rpx 0 32rpx 0;">{{itme.codeDesc}}</view>
			</view>
		</view>
	</u-popup>
	<u-popup v-model="showPay" mode="bottom" border-radius="12" closeable @close="switchButton">
		<view class="popup-pay">
			<view class="popup-title">
				{{pageData?.name}}
				<u-icon name="close" @click="onClose" style="float: right;" size="28"></u-icon>
			</view>
			<view style="display: flex;justify-content: center;">
				<image class="images" v-show="payRule.learnPayStatus==1&&payRule.isClosePay==0" src="@/static/index/qian2x.png" mode="scaleToFill" style="width: 32rpx;height:34rpx;"></image>
				<text style="color: #EE5142;" v-show="(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1)&&payRule.isClosePay==0">￥</text>
				<view class="popup-price" >{{` ${pageData.coursePriceVOList?pageData.coursePriceVOList[selectCurrentBoxItem]?.presentPrice:''}`}}</view>
			</view>
			<view class="top-up-amount-list">
				<view class="top-up-amount-item" v-for="(item,index) in pageData?.coursePriceVOList" :key="index"
					@click="onSelectCurrentBox(index)"
					:class="selectCurrentBoxItem == index? 'active-top-up-amount-item' : ''">
					<view class="top-up-amount-title" v-if="item.specsCount != 0">{{ item.specsCount }} 月</view>
					<view class="top-up-amount-title" v-if="item.specsCount == 0">永久有效</view>
				</view>
			</view>
		</view>
	</u-popup>
	</page>
</template>

<script setup>
	import {onLoad,onShow,onPullDownRefresh,onReachBottom,onReady,onUnload,onHide} from "@dcloudio/uni-app";
	import {ref,getCurrentInstance,nextTick,watch } from "vue"
	import {getClassCourseDetails,listForCourseCommentPage,getCourseSectionDetails,addCourseUserStudyRecord} from "../Course.api.ts"
	import ThemeModal from "@/components/ThemeModal.vue"
	import ThemePopup from "@/components/ThemePopup.vue"
	import NoState from "@/components/NoState.vue"
	import appUtils from '@/common/app-utils.js';
	onLoad(async(e)=>{
		id = e.id
		await setDetailsById()
		interval()
	})
	onPullDownRefresh(async()=>{
		await setDetailsById()
		uni.stopPullDownRefresh()
	})
	onReady(() => {
	})
	onHide(() => {
		audioPlay.value = false
		clearInterval(clock)
	})
	onUnload(() => {
		if(isAudio.value){
			audioPlay.value = false
			wxy.value.handleDastroy()
		}
		isAudio.value = false
		clearInterval(clock)
		pauseStatus()
		if(watchTime != 0)(
			courseNodeRecord(selectSectionIndex.value,selectChapterIndex.value)
		)
	})
	
	let loading = ref(true)
	let wxy = ref()
	let id = ''
	let pageData = ref({})
	let contactList = ref([])
	let showService = ref(false)
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor?'#'+uni.getStorageSync('otherThemeColor').themeColor:'#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor?'#'+uni.getStorageSync('otherThemeColor').buttonColor:'#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor?'#'+uni.getStorageSync('otherThemeColor').themeFontColor:'#fff')
	let toggleColor = ref(uni.getStorageSync('otherThemeColor').toggleColor?'#'+uni.getStorageSync('otherThemeColor').toggleColor:'linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%)')
	let activityEndTime = ref()
	let list = ref([{
					name: '详情',
				},{
					name: '课表',
				}, {
					name: '课件',
				},  {
					name: '互动',
				}, {
					name: '考试',
				},])
	let contactlist = [{
						name: '评价'
					},{
						name: '答疑'
					}]
	let currentTabs = ref(0)
	let current = ref(0)
	let subsection = ref()
	let scoreList = ref([])
	let answerList = ref([])
	const changeCurrentSubsection = (e) => {
		current.value = e
	}
	
	function changeTabs(index) {
		currentTabs.value = index;
		if(index == 3){
			nextTick(()=>{
				setTimeout(()=>{
					subsection.value.itemBgStyle.background = toggleColor.value
				},100)
			})
		}
	}
	async function setDetailsById(){
		await getClassCourseDetails({courseId:id}).then(res=>{
			pageData.value = res.result
			activityEndTime.value = res.result?.activityEndTime
		})
		await listForCourseCommentPage({courseId:pageData.value.classRelationVOList[selectCourseindex.value]?.courseId,commentType:1}).then(res=>{
			
			scoreList.value = res.result.records
		})
		await listForCourseCommentPage({courseId:pageData.value.classRelationVOList[selectCourseindex.value]?.courseId,commentType:2}).then(res=>{
			
			answerList.value = res.result.records
		})
		loading.value = false
	}
	
	let selectCourseindex = ref(0)
	async function switchCourse(e,index){
		selectCourseindex.value = index
		await getClassCourseDetails({courseId:id,classRelationId:e.courseId}).then(res=>{
			pageData.value = res.result
			activityEndTime.value = res.result?.activityEndTime
		})
	}
	
	let day = ref()
	let hours= ref()
	let Minutes= ref()
	let Seconds= ref()
	function showtime(){
	    let nowtime = new Date(),  //获取当前时间
	        // endtime = new Date(new Date().getTime()+topicData.endDate*60*1000);  //定义结束时间
	        endtime = new Date(activityEndTime.value?.replace(/-/g, "/"));  //定义结束时间
	    let lefttime = endtime.getTime() - nowtime.getTime(),  //距离结束时间的毫秒数
	        leftd = Math.floor(lefttime/(1000*60*60*24)),  //计算天数
	        lefth = Math.floor(lefttime/(1000*60*60)%24),  //计算小时数
	        leftm = Math.floor(lefttime/(1000*60)%60),  //计算分钟数
	        lefts = Math.floor(lefttime/1000%60);  //计算秒数
			if(leftd==0&&lefth==0&&leftm==0&&lefts==0){
				setDetailsById()
			}
			day.value = leftd
			hours.value = lefth
			Minutes.value = leftm
			Seconds.value = lefts
	    return leftd + "天 " + lefth + ":" + leftm + ":" + lefts;  //返回倒计时的字符串
	}
	let clock = ''
	function interval(){
		clock = setInterval (function () {
			showtime();
		}, 1000)
	}
	
	let selectCurrentBoxItem = ref(0)
	function onSelectCurrentBox(e){
		selectCurrentBoxItem.value = e
	}
	let payRule = ref(uni.getStorageSync('payRule'))
	let isShowbutton = ref(true)
	let showMember = ref(false)
	let showPay = ref(false)
	let showOther = ref(false)
	function onPay(){
		showPay.value = false
		showMember.value = false
		showOther.value = false
		if(pageData.value.costType=='3'&&(payRule.value.aliPayStatus==1||payRule.value.iosPayStatus==1||payRule.value.learnPayStatus==1||payRule.value.wechatPayStatus==1)&&payRule.value.isClosePay==0){
			nextTick(()=>{
				showMember.value = true
			})
		}
		if(pageData.value.costType=='4'&&(payRule.value.aliPayStatus==1||payRule.value.iosPayStatus==1||payRule.value.learnPayStatus==1||payRule.value.wechatPayStatus==1)&&payRule.value.isClosePay==0){
			nextTick(()=>{
				showPay.value = true
				isShowbutton.value = false
			})
		}else{
			nextTick(()=>{
				showOther.value = true
			})
		}
		
	}
	function switchButton() {
		isShowbutton.value = true
	}
	function close (){
		showOther.value = false
	}
	
	let isVideo = ref(false)
	let isAudio = ref(false)
	let changeView = ref(false)
	let audioPlay  = ref(false)
	let videoUrl = ref('https://cdn.qiusuokt.com/QQ%E8%A7%86%E9%A2%91%E4%BA%8C958-20220313182219.mp3?e=1647170543&token=<Please')
	let audioUrl = ref('')
	let selectSectionIndex = ref()
	let selectChapterIndex = ref()
	async function onWatch(e,i,j){
		if(e.isStutyStatus==0){
			uni.showToast({
				title:'请解锁课程'
			})
			return
		}
		selectSectionIndex.value = i
		selectChapterIndex.value = j
		if(e.sectionType == 1){
			await getCourseSectionDetails({sectionId:e.id}).then(res=>{
				if(res.result.videoUrl.indexOf('?',0)!=-1){
					videoUrl.value = res.result.videoUrl.substr(0,res.result.videoUrl.indexOf('?',0))
				}else{
					videoUrl.value = res.result.videoUrl
				}
				console.log(videoUrl.value,'videoUrl.value');
			})
			isVideo.value = true
			isAudio.value = false
			changeView.value = true
		}
		if(e.sectionType==2){
			uni.navigateTo({
				url:'/course/watch-content/ImageTextContent'+'?id='+e.id
			})
			playStatus()
			uni.$on('stopRecord',()=>{
				pauseStatus()
			})

		}
		if(e.sectionType==3){
			let isPlayBack = 0
			if(PlayBack(e.endTime)){
				isPlayBack = 1
			}else {
				isPlayBack = 0
			}
			uni.navigateTo({
				url:'/course/watch-content/WebView'+'?id='+e.id+'&isPlayBack='+isPlayBack
			})
		}
		if(e.sectionType == 5){
			await getCourseSectionDetails({sectionId:e.id}).then(res=>{
				audioUrl.value = res.result
				console.log(audioUrl.value,'videoUrl.value');
			})
			if(audioUrl.value.videoUrl){
				isAudio.value = true
				isVideo.value = false
				changeView.value = true
			}else{
				uni.showToast({
					title:'暂无内容',
					icon:"none"
				})
			}
		}
	}
	function videoErrorCallback(e) {
		uni.showModal({
			content: e.target.errMsg,
			showCancel: false
		})
	}
	let timeout = ''
	let watchTime = 0
	function playStatus(){
				console.log('redyRecord');
		timeout = setInterval(()=>{
			watchTime++
			console.log(watchTime);
		},1000)
	}
	function pauseStatus(){
				console.log('stopRecord');
		clearInterval(timeout)
	}
	watch(()=>audioPlay.value,()=>{
			if(audioPlay.value){
				playStatus()
			}else{
				pauseStatus()
			}
		}
	)
	function courseNodeRecord(SectionIndex,ChapterIndex ){
		let param = {
			courseId: pageData.value.sectionParentList[SectionIndex].courseId,
			sectionId: pageData.value.sectionParentList[SectionIndex].id,
			chapterId: pageData.value.sectionParentList[SectionIndex].courseSectionVOList[ChapterIndex].id,
			lookType: pageData.value.sectionParentList[SectionIndex].courseSectionVOList[ChapterIndex].isTryLook==1?2:1,
			studyDuration:watchTime
		}
		addCourseUserStudyRecord(param).then(res=>{})
	}
	watch([selectSectionIndex,selectChapterIndex],([curAge, preAge], [newVal, oldVal])=>{
		if(watchTime != 0){
			courseNodeRecord(preAge,oldVal)
		}
		watchTime = 0
	})
	
	
	function PlayBack(time){
		let nowTime = new Date().getTime()
		let oldTime = new Date(time.replace(/-/g, "/")).getTime()
		console.log(nowTime,oldTime,'times');
		return nowTime>oldTime?true:false
	}
	
	function onService(){
		showService.value = false
		nextTick(()=>{
			showService.value = true
		})
	}
	function onClose (){
		showService.value = false
		showPay.value = false
	}
	function onDownload(e,pay){
		if(pageData.value.isStutyStatus==0&&!pay){
			uni.showToast({
				title:'请解锁课程'
			})
			return
		}
		appUtils.Download(e)
	}
	
	function goTeacherDetail(e){
		uni.navigateTo({
			url:'/course/teacher/TeacherDetail'+'?id='+e.teacherId
		})
	}
	function goMember(){
		showMember.value = false
		uni.navigateTo({
			url:'/personal/VipOpenRenewalFee'
		})
	}
	function goCustomService(e){
		uni.navigateTo({
			url:'/course/custom-service/CustomService'+'?id='+e.id
		})
	}
	function goContact(){
		console.log(current.value);
		if(pageData.value.isStutyStatus==0){
			uni.showToast({
				title:'请解锁课程'
			})
			return
		}
		uni.$on('courseDataUpdate',async ()=>{
			await setDetailsById()
		})
		if(current.value==0){
			uni.navigateTo({
				url:'/course/contact/CourseScore'+'?id='+pageData.value.classRelationVOList[selectCourseindex.value]?.courseId
			})
		}else if(current.value==1){
			uni.navigateTo({
				url:'/course/contact/CourseAnswer'+'?id='+pageData.value.classRelationVOList[selectCourseindex.value]?.courseId+'&courseName='+pageData.value.classRelationVOList[selectCourseindex.value]?.courseName
			})
		}
	}
	function goPractice(e){
		uni.navigateTo({
			url:'/exam/practice'+'?chapterId='+e.id+'&sectionId='+e.parentId+'&courseId='+e.courseId
		})
	}
	function goExam(e){
		if(pageData.value.isStutyStatus==0){
			uni.showToast({
				title:'请解锁课程'
			})
			return
		}
		uni.navigateTo({
			url:'/exam/exam'+'?selectId='+e.examId+'&ksType='+2
		})
	}
	function goOrder(){
		uni.navigateTo({
			url:'/personal/order/OrderDetails?isOrder=0'+'&id='+pageData.value?.id+'&buyMonth='+pageData.value.coursePriceVOList[selectCurrentBoxItem.value]?.specsCount+'&category='+4
		})
	}
</script>


<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
.container{
	.video{
		width: 100%;
	}
	.top{
		position: relative;
		width: 100%;
		height: 678rpx;
		.top-image {
			margin-bottom: -48rpx;
			width: 100%;
			position: absolute;
			z-index:1;
		}
		.top-box{
			width: 100%;
			height: 280rpx;
			background: #fff;
			border-radius: 24rpx 24rpx 0rpx 0rpx;
			z-index:2;
			top: 400rpx;
			padding: 56rpx 40rpx;
			position: absolute;
			.top-box-title {
				height: 44rpx;
				font-size: 32rpx;
				font-weight: 800;
				color: #303133;
				line-height: 44rpx;
			}
			.top-box-count {
				margin-top: 24rpx;
				display: flex;
				justify-content: space-between;
			}
			.course-service {
				margin-top: 24rpx;
				height: 80rpx;
				background: linear-gradient(270deg, #FFFFFF 0%, #CBDEFF 100%);
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
				border-radius: 12rpx;
				line-height:80rpx;
				padding: 0 8rpx;
				.course-service-content{
					display: flex;
					align-items: center;
					.course-service-content-tag{
						width: 112rpx;
						height: 56rpx;
						position: relative;
						margin-right: 12rpx;
					}
					.course-service-content-itme {
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #303133;
						overflow:hidden;
						word-wrap: break-word;
						word-break: break-all;
						white-space: pre-line;
						text-overflow:ellipsis;
						display:-webkit-box;
						-webkit-box-orient:vertical;
						-webkit-line-clamp:1;//显示的行
						margin-right: 4rpx;
					}
				}
			}
		}
	}
	.tab{
		margin-top: 50rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
		z-index: 99999;
	}
	.title{
		margin: 48rpx 0 24rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.title_letf{
			// width: 108rpx;
			font-size: 32rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #1B1E27;
			display: flex;
			align-items: center;
		}
		.title_icon{
			width: 8rpx;
			height: 32rpx;
			background: $u-global-color;
			border-radius: 4rpx;
		}
	}
	.detail {
		padding: 0 40rpx;
		.teacher-list{
			width: 100%;
			display: flex;
			align-items: center;
			white-space: nowrap;
			margin: 30rpx 40rpx 30rpx 10rpx;
			.teacher-list-itme {
				height: 96rpx;
				display: flex;
				align-items: center;
				.images {
					width: 96rpx;
					height:96rpx;
					border-radius: 96rpx;
					box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(47,69,162,0.3);
					border: 4rpx solid #FFFFFF;
				}
				.teacher-message {
					height:100%;
					margin:0 16rpx;
					.teacher-teacherName {
						font-size: 28rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #303133;
					}
					.teacher-subjectName {
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
					}
				}
			}
		}
		&::after {
			display: block;
			content: '';
			height: 200rpx;
		}
	}
	.course-list {
		.scroll-view_H{
			white-space: nowrap;
			width: 100%;
		}
		.scroll-view-item_H {
			display: inline-block;
			width: 204rpx;
			height: 156rpx;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
			border-radius: 12rpx;
			margin: 32rpx 0 32rpx 40rpx;
			vertical-align: top;
			border: 1 solid transparent;
			position: relative;
			&:last-child{
				margin-right:40rpx;
			}
		}
		.select-box {
			position: relative;
			width: 210rpx;
			height: 165rpx;
			border: 4rpx solid $u-global-color;
			&::after{
				display: block;
				content: '';
				width: 0;
				height: 0;
				border: 15rpx solid transparent;
				border-top-color: $u-global-color;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: -40rpx;
			}
		}
	}
	.course-table {
		padding: 48rpx 40rpx;
		.node-itme{
			display: flex;
			justify-content: space-between;
			margin: 24rpx 0;
			.node-itme-letf {
				color: #909399;
				.node-itme-img {
					width: 104rpx;
					height: 40rpx;
					background: linear-gradient(270deg, #C0C4CC 0%, #909399 100%);
					border-radius: 4rpx;
					display: flex;
					align-items: center;
					padding-left: 5rpx;
				}
			}
			.node-itme-right {
				.static {
					width: 80rpx;
					height: 40rpx;
					border-radius: 4rpx;
					padding: 0rpx 10rpx;
					border: 2rpx solid #EE5142;
				}
			}
		}
		.exercise {
			height: 104rpx;
			background: #F6F6F6;
			border-radius: 12rpx;
			padding: 8rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.exercise-left {
				display: flex;
				align-items: center;
				.exercise-tag {
					width: 80rpx;
					height: 88rpx;
					background: #FFFFFF linear-gradient(270deg, #7BC8E8 0%, #3F6EE1 100%);
					border-radius: 8rpx;
					opacity: 0.8;
					color: $u-theme-font-color;
					padding: 10rpx 8rpx;
					margin-right: 24rpx;
				}
			}
			.exercise-right {
				color: #3F6EE1;
			}
		}
		&::after {
			display: block;
			content: '';
			height: 200rpx;
		}
	}
	.courseware {
		padding: 40rpx;
		.courseware-count {
			font-size: 30rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #303133;
		}
		.courseware-itme {
			display: flex;
			align-items: center;
			margin: 32rpx 0;
			.courseware-itme-name {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #303133;
				margin-left: 24rpx;
			}
		}
		&::after {
			display: block;
			content: '';
			height: 200rpx;
		}
	}
	.contact {
		padding: 40rpx;
		.score-list{
			.total-score {
				margin-top: 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.score-item {
				margin-top: 40rpx;
				display: flex;
				.score-item-right {
					width: 100%;
					margin-left: 16rpx;
					margin-top: 1%;
					.score-item-right-top{
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 28rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #303133;
						.score-item-right-date{
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #909399;
						}
					}
					.score-item-right-content {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #303133;
					}
				}
			}
		}
		.answer-list{
			.score-item {
				margin-top: 40rpx;
				display: flex;
				.score-item-right {
					width: 100%;
					margin-left: 16rpx;
					margin-top: 1%;
					.score-item-right-top{
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 28rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #303133;
						.score-item-right-date{
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #909399;
						}
					}
					.score-item-right-content {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #303133;
						margin: 12rpx 0;
					}
					.score-item-right-answer {
						background: #F6F6F6;
						border-radius: 12rpx;
						padding: 24rpx;
						display: flex;
						.answer-right {
							width: 100%;
							margin-left: 16rpx;
							margin-top: 1%;
							.answer-right-name {
								font-size: 26rpx;
								font-family: PingFang-SC-Heavy, PingFang-SC;
								font-weight: 800;
								color: #303133;
							}
							.answer-right-content {
								font-size: 24rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #606266;
							}
						}
					}
				}
			}
		}
		.fab {
			width: 174rpx;
			height: 88rpx;
			background: rgba($color: #C4CEF6, $alpha: .9);
			border-radius: 100rpx 0rpx 0rpx 100rpx;
			position: fixed;
			right: 0;
			bottom: 250rpx;
			display: flex;
			align-items: center;
			z-index: 999;
			.btn {
				width: 72rpx;
				height: 72rpx;
				border-radius: $uni-border-radius-circle;
				background: #395AE1;
				margin-left: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		
			.fan {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 600;
				color: #395AE1;
				margin-left: 14rpx;
			}
		}
		&::after {
			display: block;
			content: '';
			height: 200rpx;
		}
	}
	.course-exam {
		padding: 0 40rpx;
		.course-exam-itme {
			display: flex;
			.course-exam-message {
				width: 494rpx;
				margin-left: 24rpx;
				.course-exam-title {
					font-size: 30rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #303133;
				}
				.course-exam-option {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.course-exam-count {
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #909399;
					}
					.course-exam-start {
						width: 160rpx;
						height: 60rpx;
						background: #395AE1;
						border-radius: 8rpx;
						border: 2rpx solid #395AE1;
						line-height: 60rpx;
						text-align: center;
					}
				}
			}
		}
		&::after {
			display: block;
			content: '';
			height: 200rpx;
		}
	}
	.no-state{
		transform: translateY(-40%);
		&::after {
			display: block;
			content: '';
			height: 200rpx;
		}
	}
	.bottom{
		position: fixed;
		bottom:0rpx;
		z-index: 99999;
		width: 100%;
		.course-activity{
			height: 72rpx;
			background: linear-gradient(270deg, #FEF0DE 0%, #FFE2BF 100%);
			display: flex;
			justify-content: space-between;
			padding: 0 20rpx;
			position: relative;
			z-index: 999;
			color: #52301A;
			.course-activity-tag{
				// width: 128rpx;
				height: 48rpx;
				background: linear-gradient(270deg, #F1B466 0%, #E85535 100%);
				border-radius: 4rpx;
				line-height: 48rpx;
				padding: 0 16rpx;
				margin: 12rpx;
				font-weight: 800;
			}
			.course-activity-time {
				height: 48rpx;
				border-radius: 4rpx;
				line-height: 48rpx;
				padding: 0 16rpx;
				margin: 12rpx;
				.time-style {
					width: 48rpx;
					height: 48rpx;
					padding: 8rpx 5rpx;
					background: #F29E3F;
					border-radius: 4rpx;
					opacity: 0.8;
					font-family: PingFang-SC-Heavy, PingFang-SC;
					font-weight: 800;
					color: #FFFFFF;
				}
			}
		}
		.bottom-box {
			background: #FFFFFF;
			box-shadow: 0rpx -4rpx 16rpx 0rpx rgba(0,0,0,0.1);
			padding: 28rpx 40rpx 76rpx 40rpx ;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 172rpx;
			.original_cost{
				text-decoration:line-through;
				font-size: 24rpx;
				font-weight: 400;
				color: #909399;
				margin-left: 16rpx;
			}
			.button {
				width: 180rpx;
				height: 72rpx;
				// background: #395AE1;
				border-radius: 8rpx;
				text-align: center;
				line-height: 72rpx;	
			}
		}
		.pay-button {
			background: #FFFFFF;
			box-shadow: 0px -4px 16px 0px rgba(0,0,0,0.1);
			padding: 28rpx 40rpx 76rpx 40rpx ;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 172rpx;
			.button {
				width: 304rpx;
				height: 88rpx;
				font-size: 28rpx;
				font-weight: 500;
				border-radius: 8rpx;
				text-align: center;
				line-height: 88rpx;	
			}
		}
	}
}
.popup-service{
	padding: 40rpx 40rpx 192rpx 40rpx ;
	height: 450rpx;
	border-radius: 12rpx 12rpx 0rpx 0rpx;
	background: #FFFFFF;
	position: relative;
	z-index: 9999;
	.popup-title{
		text-align:center;
		font-size: 32rpx;
		font-family: PingFang-SC-Heavy, PingFang-SC;
		font-weight: 800;
		color: #1B1E27;
		margin-bottom: 56rpx;
	}
	.popup-itme{
		border-bottom: 2rpx solid #DCDFE6;
		margin-bottom: 32rpx;
		.node{
			height: 400rpx;
		}
	}
	&::after {
		display: block;
		content: '';
		height: 200rpx;
	}
}
.popup-pay {
	padding: 40rpx 40rpx 192rpx 40rpx ;
	height: 770rpx;
	border-radius: 12rpx 12rpx 0rpx 0rpx;
	background: #FFFFFF;
	position: relative;
	z-index: 9999;
	.popup-title{
		text-align:center;
		font-size: 32rpx;
		font-family: PingFang-SC-Heavy, PingFang-SC;
		font-weight: 800;
		color: #1B1E27;
		margin-bottom: 56rpx;
	}
	.popup-price{
		text-align:center;
		font-size: 32rpx;
		font-family: PingFang-SC-Heavy, PingFang-SC;
		font-weight: 800;
		color: #EE5142;
	}
	.top-up-amount-list {
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;

		.top-up-amount-item {
			background: #fff;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 12rpx;
			// width: 33%;
			width: 210rpx;
			height: 148rpx;
			border: 2rpx solid #fff;
			position: relative;
			margin-top: 40rpx;
			.top-up-amount-title {
				font-size: 36rpx;
				font-family: DINCond-Black, DINCond;
				font-weight: 900;
				color: #303133;
				line-height: 44rpx;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				white-space: nowrap;
			}
		}

		.active-top-up-amount-item {
			border: 2rpx solid #395AE1;
		}
	}
	&::after {
		display: block;
		content: '';
		height: 300rpx;
	}
}
</style>
