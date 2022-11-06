<template>
	<page>
	<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	<view class="container u-skeleton" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<u-navbar :z-index="'9999'" title="讲师详情">
			<template #right>
				<image class="images" v-if="pageData?.isCollection==0" @click="onCollection(pageData?.isCollection)" src="@/static/course/guang-w2x.png" mode="scaleToFill" style="width: 40rpx;height:40rpx;margin-right: 40rpx;"></image>
				<image class="images" v-if="pageData?.isCollection==1" @click="onCollection(pageData?.isCollection)" src="@/static/course/guang-z2x.png" mode="scaleToFill" style="width: 40rpx;height:40rpx;margin-right: 40rpx;"></image>
			</template>
		</u-navbar>
		<view class="top">
			<view class="top-image">
				<!-- <view :style="`background:url(${pageData.imgUrl});height:422rpx`" ></view> -->
				<image class="images"  :src="pageData?.publicImg" mode="scaleToFill" style="width: 100%;height:422rpx;position: absolute;"></image>
			</view>
			<view class="top-box">
				<view class="top-base">
					<view class="top-box-left">
						<image class="images"  :src="pageData?.headImg" mode="scaleToFill" style="width: 122rpx;height:122rpx;border-radius: 122rpx;"></image>
						<view class="top-box-name">{{pageData?.name}}</view>
						<view class="top-box-subjectName">{{`教学课程：${pageData?.subjectName?pageData?.subjectName:''}`}}</view>
					</view>
					<view class="top-box-right">
						<image class="images"  src="@/static/course/vip2x.png" mode="scaleToFill" style="width: 24rpx;height:24rpx;"></image>
						<view class="top-box-vip" :style="{color:themeFontColor}">认证讲师</view>
					</view>
				</view>
				<view class="detail">
					<view class="detail-content">{{pageData?.summary}}</view>
					<text class="detail-content view-detail" @click="onDetail">查看详情>></text>
				</view>
			</view>
		</view>
		<view class="tab">
			<u-tabs :list="list" count="count" @change="changeTabs" :is-scroll="false" :current="currentTabs" :active-color="themeColor" inactive-color="#909399" class=""></u-tabs>
		</view>
		<view class="class-course" v-if="currentTabs == 0">
			<view class="class-course-itme" :style="{'margin-right':index%2==0?'5%':'0rpx'}" v-for="(itme,index) in classCourseList" @click="goClassCourseDetail(itme)">
				<image class="images" :src="itme?.imgUrl" mode="scaleToFill" style="width: 288rpx;height:220rpx;border-radius: 12rpx;"></image>
				<view class="class-course-name">{{itme?.name}}</view>
			</view>
		</view>
		<view class="class-course" v-if="currentTabs == 1">
			<view class="class-course-itme" :style="{'margin-right':index%2==0?'5%':'0rpx'}" v-for="(itme,index) in courseList" @click="goCourseDetail(itme)">
				<view class="class-course-itme-images">
					<image class="images" :src="itme?.imgUrl" mode="scaleToFill" style="width: 288rpx;height:220rpx;border-radius: 12rpx;"></image>
					<view class="course-type" :style="{color:themeFontColor}">{{itme?.courseType==1?'线上课':itme?.courseType==1?'直播课':itme?.courseType==1?'面授课':'班级课'}}</view>
				</view>
				<view class="class-course-name">{{itme?.name}}</view>
			</view>
		</view>
		<view class="book" v-if="currentTabs == 2">
			<view class="book-itme" v-for="(itme,index) in bookList" @click="goBookDetail(itme)">
				<image class="images" :src="itme?.imgUrl" mode="scaleToFill" style="width: 104rpx;height:128rpx;border-radius: 12rpx;"></image>
				<view class="book-itme-name">{{itme?.name}}</view>
			</view>
		</view>
		<view class="knowledge" v-if="currentTabs == 3">
			<view class="knowledge-itme" v-for="(itme,index) in knowledgeList" @click="goKnowledgeDetail(itme)">
				<!-- <image class="images" :src="itme?.imgUrl" mode="scaleToFill" style="width: 104rpx;height:128rpx;border-radius: 12rpx;"></image> -->
				<view class="knowledge-itme-name">{{itme?.name}}</view>
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="store-list" v-if="currentTabs == 4">
          <view class="list-item" v-for="(item,index) in newsList" :key="index">
<!--            <view class="list-top">
              <view class="ima">
                <image mode="aspectFit" src="@/static/user/user-avatar.png" v-if="!item.authorImg" />
                <image mode="aspectFit" :src="item.authorImg" v-else />
                <view>
                  <view class="aut">
                    {{item.authorName}}
                    <view class="zhiding">{{item.oneCateName}}</view>
                    <view class="zhidingq" v-if="item.isRecommend==1">置顶</view>
                  </view>
                  <view class="date">
                    {{item.createTime}}
                  </view>
                </view>
              </view>
              <view class="guanzhu" v-if="item.isFocusOn==0" @click="teacherCollection(item,index)">
                <image src="@/static/community/jia@2x.png" />
                关注
              </view>
              <view class="yguanzhu" v-if="item.isFocusOn==1" @click="teacherCollection(item,index)">
                已关注
              </view>
            </view> -->
            <template v-if="item.newsType == 1">
              <template v-if="item.newsCoverImgVOList&&item.newsCoverImgVOList.length > 2">
                <view class="new-tit" @click="commonHandleTo(item)">
                  {{item.title && item.title.length > 18 ? item.title : item.title }}
                </view>
                <view class="list-cot" @click="commonHandleTo(item)">
                  <!-- <rich-text :nodes="item.content" v-if="item.content"></rich-text> -->
                  {{item.summary && item.summary.length > 18 ? item.summary : item.summary }}
                </view>
                <view class="list-cot-image" v-if="item.newsCoverImgVOList.length>0" @click="commonHandleTo(item)">
                  <image mode="scaleToFill" v-for="(it,i) in item.newsCoverImgVOList" :key="i" :src="it.coverImg" />
                </view>
              </template>
              <view v-else class="colog">
               <view class="lfet">
                <view class="new-tit" @click="commonHandleTo(item)">
                  {{item.title && item.title.length > 26 ? item.title.slice(0,26) + '...' : item.title }}
                </view>
                <view class="list-cot" @click="commonHandleTo(item)">
                  <!-- <rich-text :nodes="item.content" v-if="item.content"></rich-text> -->
                  {{item.summary && item.summary.length > 30 ? item.summary.slice(0,30) + '...' : item.summary }}
                </view>
               </view>
                <view class="list-cot-image" v-if="item.newsCoverImgVOList&&item.newsCoverImgVOList.length>0"
                  @click="commonHandleTo(item)">
                  <image mode="scaleToFill" v-for="(it,i) in item.newsCoverImgVOList" :key="i" :src="it.coverImg" />
                </view>
              </view>
            </template>
            <template v-if="item.newsType == 2">
              <view class="new-tit" @click="commonHandleTo(item)">
                {{item.title && item.title.length > 18 ? item.title : item.title }}
              </view>
              <view class="list-cot">
                {{item.summary}}
              </view>
              <view v-if="item.newsCoverImgVOList&&item.newsCoverImgVOList.length>0" class="list-cot-video">
                <video v-for="(it,i) in item.newsCoverImgVOList" id="myVideo" :src="it.coverImg" controls
                  :key="i"></video>
              </view>
            </template>
            <view class="list-bom">
              <view class="list-lft">
                <!-- <image src="@/static/community/share@2x.png" mode="aspectFit" /> -->
				<view class="date">
				  {{item.createTime}}
				</view>
              </view>
<!--              <view class="list-rigt">
                <view class="list-rigt">
                  <image src="@/static/community/pinglun@2x.png" mode="aspectFit" />
                  {{item.commentCount || 0}}
                </view>
                <view class="list-rigt" :class="{'couc':item.isCollection==1}" @click="collectionNewsGood(item,index)">
                  <image v-if="item.isCollection==1" src="@/static/community/shouc_on@2x.png" mode="aspectFit" />
                  <image v-else src="@/static/community/shouc@2x.png" mode="aspectFit" />
                  {{item.collectionCount || 0}}
                </view>
                <view :class="{'dianz':item.isGood==1}" class="list-rigt" @click="likeNewsGood(item,index)">
                  <image v-if="item.isGood==1" src="@/static/community/dianz_on@2x.png" mode="aspectFit" />
                  <image v-else src="@/static/community/dianz@2x.png" mode="aspectFit" />
                  {{item.likeCount || 0}}
                </view>
              </view> -->
            </view>
          </view>
		</view>
		<u-loadmore class="loadmore"  :status="loadStatus" icon-type="flower" :load-text="loadText"
		v-show="(currentTabs==0&&classCourseList.length!=0)||(currentTabs==1&&courseList.length!=0)||(currentTabs==2&&bookList.length!=0)||(currentTabs==3&&knowledgeList.length!=0)||(currentTabs==4&&newsList.length!=0)"
		>
		</u-loadmore>
		<NoState type="book" :isPage="true" 
		v-show="(currentTabs==0&&classCourseList.length==0)||(currentTabs==1&&courseList.length==0)||(currentTabs==2&&bookList.length==0)||(currentTabs==3&&knowledgeList.length==0)||(currentTabs==4&&newsList.length==0)"
		>
			<template #text>
				<view>暂无更多内容！</view>
			</template>
		</NoState>
	</view>
	<u-popup v-model="showDetail" mode="bottom" border-radius="12" closeable>
		<view class="popup-content">
			{{pageData?.summary}}
		</view>
	</u-popup>
	</page>
</template>

<script setup>
	import {onLoad,onShow,onPullDownRefresh,onReachBottom} from "@dcloudio/uni-app";
	import {ref,getCurrentInstance } from "vue"
	import NoState from "@/components/NoState.vue"
	import {getTeacherApiDetails,apiCourseListForPage,apiBookListForPage,apiKnowledgeListForPage,addTeacherCollection,apiNewsListForPage} from "../Course.api.ts"
	onLoad( async(e)=>{
		id = e.id
		setDetailsById()
		classCoursePage.teacherId = e.id
		classCourseList.value = await getApiClassCourseListForPage()
		coursePage.teacherId = e.id
		courseList.value = await getApiCourseListForPage()
		bookPage.teacherId = e.id
		bookList.value = await getApiBookListForPage()
		knowledgePage.teacherId = e.id
		knowledgeList.value = await getApiKnowledgeListForPage()
		newsPage.teacherId = e.id
		newsList.value = await getApiNewsListForPage()
		loading.value = false
	})
	onPullDownRefresh(async()=>{
		classCoursePage.pageNo = 1
		coursePage.pageNo = 1
		bookPage.pageNo = 1
		knowledgePage.pageNo = 1
		newsPage.pageNo = 1
		classCourseList.value = await getApiClassCourseListForPage()
		courseList.value = await getApiCourseListForPage()
		bookList.value = await getApiBookListForPage()
		knowledgeList.value = await getApiKnowledgeListForPage()
		newsList.value = await getApiNewsListForPage()
		await setDetailsById()
		uni.stopPullDownRefresh()
	})
	onReachBottom(async ()=>{
		if(loadStatus.value == 'nomore'){
			uni.stopPullDownRefresh()
			return
		}
		loadStatus.value = 'loading'
		let data = []
		if(currentTabs.value==0){
			classCoursePage.pageNo++
			data = await getApiClassCourseListForPage()
			classCourseList.value = [...classCourseList.value,...data]
		}
		if(currentTabs.value==1){
			coursePage.pageNo++
			data = await getApiCourseListForPage()
			courseList.value = [...courseList.value,...data]
		}
		if(currentTabs.value==2){
			bookPage.pageNo++
			data = await getApiBookListForPage()
			bookList.value = [...bookList.value,...data]
		}
		if(currentTabs.value==3){
			knowledgePage.pageNo++
			data = await getApiKnowledgeListForPage()
			knowledgeList.value = [...knowledgeList.value,...data]
		}
		if(currentTabs.value==4){
			newsPage.pageNo++
			data = await getApiNewsListForPage()
			newsList.value = [...newsList.value,...data]
		}
		if(data.length == 0){
			loadStatus.value = 'nomore'
		}else{
			loadStatus.value = 'loadmore'
		}
	})
	
	let loading = ref(true)
	let id = ''
	let pageData = ref({})
	let showDetail = ref(false)
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor?'#'+uni.getStorageSync('otherThemeColor').themeColor:'#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor?'#'+uni.getStorageSync('otherThemeColor').buttonColor:'#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor?'#'+uni.getStorageSync('otherThemeColor').themeFontColor:'#fff')
	let list = ref([{
					name: '精品课',
					count:0
				},{
					name: '线上课',
					count:0
				}, {
					name: '电子书',
					count:0
				},  {
					name: '考点集',
					count:0
				}, {
					name: '资讯',
					count:0
				},])
	let loadStatus = ref('loadmore')
	let loadText = ref({
							loadmore: '轻轻上拉',
							loading: '努力加载中',
							nomore: '实在没有了'
						})
	let currentTabs = ref(0)
	function changeTabs(index) {
		currentTabs.value = index;
	}
	
	function onDetail(){
		showDetail.value = true
	}
	function onCollection(e){
		let param = {
			operateStatus:e==1?0:1,
			teacherId:id
		}
		addTeacherCollection(param).then(res=>{
			if(res.code ==200 ){
				pageData.value.isCollection = pageData.value.isCollection==1?pageData.value.isCollection=0 :pageData.value.isCollection=1
			}
		})
	}
	
	function setDetailsById(){
		getTeacherApiDetails({teacherId:id}).then(res=>{
			pageData.value = res.result
			list.value[0].count = res.result.classCourseCount
			list.value[1].count = res.result.courseCount
			list.value[2].count = res.result.bookCount
			list.value[3].count = res.result.knowledgeCount
			list.value[4].count = res.result.newsCount
		})
	}
	
	let classCourseList = ref([])
	let classCoursePage = {pageNo:1,pageSize:10,termType:1}
	async function getApiClassCourseListForPage (){
		let data =  await apiCourseListForPage(classCoursePage)
		return data.result.records
	}
	
	let courseList = ref([])
	let coursePage = {pageNo:1,pageSize:10,termType:2}
	async function getApiCourseListForPage (){
		let data =  await apiCourseListForPage(coursePage)
		return data.result.records
	}
	
	let bookList = ref([])
	let bookPage = {pageNo:1,pageSize:10}
	async function getApiBookListForPage (){
		let data =  await apiBookListForPage(bookPage)
		return data.result.records
	}
	
	let knowledgeList = ref([])
	let knowledgePage = {pageNo:1,pageSize:10}
	async function getApiKnowledgeListForPage (){
		let data =  await apiKnowledgeListForPage(knowledgePage)
		return data.result.records
	}
	
	let newsList = ref([])
	let newsPage = {pageNo:1,pageSize:10}
	async function getApiNewsListForPage (){
		let data =  await apiNewsListForPage(newsPage)
		console.log(data);
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
	// 详情页面跳转
	const commonHandleTo = (item) => {
	  uni.navigateTo({
	    url: `/community/newDetails?id=${item.id}`
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
	.top{
		position: relative;
		width: 100%;
		height: 678rpx;
		border: 1rpx  solid transparent;
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
			// padding: 56rpx 40rpx;
			position: absolute;
			.top-base{
				position: absolute;
				top: -20%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				padding: 0rpx 40rpx;
				.top-box-left {
					.top-box-name {
						margin-top: 8rpx;
						font-size: 36rpx;
						font-family: PingFang-SC-Heavy, PingFang-SC;
						font-weight: 800;
						color: #303133;
					}
					.top-box-subjectName {
						margin-top: 8rpx;
						font-size: 26rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #606266;
					}
				}
				.top-box-right {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 172rpx;
					height: 40rpx;
					background: linear-gradient(90deg, #333642 0%, #5E606D 100%);
					border-radius: 0rpx 12rpx 0rpx 12rpx;
				}
			}
			.detail {
				margin-top: 200rpx;
				padding: 0 40rpx;					
				position: relative;
				.detail-content{
					overflow:hidden;
					word-wrap: break-word;
					word-break: break-all;
					white-space: pre-line;
					text-overflow:ellipsis;
					display:-webkit-box;
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2;//显示的行数
					// height: 88rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #606266;
					// line-height: 44rpx;
				}
				.view-detail {
					float: right;
					color: #395AE1;
				}
			}
		}
	}
	.tab{
		padding-top: 50rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
		z-index: 99999;
	}
	.class-course{
		padding: 32rpx 40rpx;
		display: flex;
		flex-wrap: wrap;
		.class-course-itme {
			padding: 16rpx;
			width: 47.25%;
			height: 372rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
			border-radius: 12rpx;
			margin-bottom: 32rpx;
			.class-course-itme-images {
				position: relative;
				.course-type {
					position: absolute;
					bottom: 8rpx;
					left: 0;
					width: 288rpx;
					height: 40rpx;
					background: rgba(0,0,0,0.6);
					// opacity: 0.6;
					border-radius: 0rpx 0rpx 12rpx 12rpx;
					line-height: 40rpx;
					text-align: center;
					font-weight: 400;
				}
			}
			.class-course-name {
				margin-top: 16rpx;
				overflow:hidden;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;//显示的行数
			}
		}
	}
	.book {
		padding: 40rpx 40rpx;
		.book-itme{
			display: flex;
			align-items: center;
			height: 160rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
			border-radius: 12rpx;
			padding: 0 16rpx;
			margin-top: 48rpx;
			.book-itme-name{
				margin-left: 32rpx;
				overflow:hidden;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;//显示的行数
			}
		}
	}
	.knowledge {
		padding: 40rpx 40rpx;
		.knowledge-itme{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 160rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
			border-radius: 12rpx;
			padding: 0 16rpx;
			margin-top: 48rpx;
			.knowledge-itme-name{
				margin-left: 32rpx;
				overflow:hidden;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;//显示的行数
			}
		}
	}
	.store-list {
		padding: 40rpx 40rpx;
		.list-item {
		  margin-bottom: 26rpx;
		
		  .new-tit {
		    font-size: 30rpx;
		    font-family: PingFang-SC-Heavy, PingFang-SC;
		    font-weight: 800;
		    color: #303133;
		    line-height: 44rpx;
		    padding: 0 0 20rpx;
		  }
		
		  .list-top {
		    display: flex;
		    align-items: flex-start;
		    justify-content: space-between;
		    margin-bottom: 26rpx;
		
		    .ima {
		      font-size: 28rpx;
		      font-weight: 800;
		      color: $u-main-color;
		      display: flex;
		      position: relative;
		
		      .date {
		        font-size: 24rpx;
		        font-weight: 400;
		        color: $u-tips-color;
		        margin-top: 12rpx;
		      }
		
		      .img-ct {
		        display: flex;
		        position: relative;
		      }
		
		      image {
		        width: 56rpx;
		        height: 56rpx;
		        border: 2rpx solid $u-form-item-border-color;
		        border-radius: $uni-border-radius-circle;
		        margin-right: 20rpx;
		      }
		
		      .vip1 {
		        border: 2rpx solid #F9C58D;
		      }
		
		      .vip {
		        position: absolute;
		        bottom: 22rpx;
		        right: 2rpx;
		        width: 32rpx;
		        height: 32rpx;
		      }
		    }
		
		    .zhidingq {
		      color: #EE5142;
		      border-radius: 4rpx;
		      border: 2rpx solid #EE5142;
		      font-size: 24rpx;
		      padding: 1rpx 6rpx 2rpx;
		      display: flex;
		      align-items: center;
		    }
		
		    .aut {
		      display: flex;
		      align-items: flex-start;
		      margin-top: 2rpx;
		
		      .zhiding {
		        color: $u-type-primary;
		        border-radius: 4rpx;
		        border: 2rpx solid $u-type-primary;
		        font-size: 24rpx;
		        padding: 1rpx 6rpx 2rpx;
		        display: flex;
		        align-items: center;
		        margin-right: 20rpx;
		        margin-left: 18rpx;
		      }
		    }
		
		    .guanzhu {
		      color: $u-type-primary;
		      border-radius: 8rpx;
		      border: 2rpx solid $u-type-primary;
		      font-size: 24rpx;
		      padding: 4rpx 12rpx 6rpx;
		      display: flex;
		      align-items: center;
		      justify-content: center;
		      letter-spacing: 4rpx;
		      margin-top: 4rpx;
		
		      image {
		        width: 20rpx;
		        height: 20rpx;
		        margin-right: 8rpx;
		      }
		
		      >text {
		        margin-bottom: 4rpx;
		      }
		    }
		
		    .yguanzhu {
		      color: $u-light-color;
		      border-radius: 8rpx;
		      border: 2rpx solid $u-light-color;
		      font-size: 24rpx;
		      padding: 4rpx 12rpx 6rpx;
		      display: flex;
		      align-items: center;
		      justify-content: center;
		      letter-spacing: 4rpx;
		      margin-top: 4rpx;
		    }
		  }
		
		  .list-cot {
		    max-height: 240rpx;
		    font-size: 24rpx;
		    font-weight: 400;
		    color: $u-main-color;
		    line-height: 36rpx;
		    margin-bottom: 20rpx;
		    overflow: hidden;
		  }
		
		  .list-bom {
		    border-bottom: 2rpx solid $u-form-item-border-color;
		    padding-bottom: 26rpx;
		    display: flex;
		    align-items: center;
		    justify-content: space-between;
		    font-size: 24rpx;
		    font-weight: 400;
		    color: $u-tips-color;
		
		    .list-lft {
		      display: flex;
		      align-items: center;
		
		      image {
		        width: 24rpx;
		        height: 24rpx;
		        margin-right: 10rpx;
		      }
		    }
		
		    .list-rigt {
		      display: flex;
		      align-items: center;
		      margin-left: 30rpx;
		
		      image {
		        width: 32rpx;
		        height: 32rpx;
		        margin-right: 10rpx;
		      }
		    }
		  }
		
		  .list-cot-image {
		    display: flex;
		    align-items: center;
		    margin-bottom: 20rpx;
		    overflow: hidden;
		
		    image {
		      width: 204rpx;
		      height: 156rpx;
		      border-radius: 8rpx;
		      margin-left: 30rpx;
		
		      &:first-child {
		        margin: 0;
		      }
		    }
		  }
		  .colog{
		    display: flex;
		    justify-content: space-between;
		    .list-cot-image{
		      width: 216rpx;
		      height: 164rpx;
		      flex-shrink: 0;
		      margin-left: 20rpx;
		      image{
		        width: 216rpx;
		        height: 164rpx;
		      }
		    }
		    .new-tit{
		      padding-bottom: 10rpx;
		      line-height: 40rpx;
		    }
		    .list-cot {
		      font-size: 24rpx;
		      font-weight: 400;
		      color: $u-main-color;
		      line-height: 36rpx;
		    }
		  }
		  .list-cot-video {
		    display: flex;
		    align-items: center;
		    margin-bottom: 20rpx;
		    overflow: hidden;
		    width: 100%;
		    height: 376rpx;
		
		    image {
		      width: 100%;
		      height: 376rpx;
		      border-radius: 8rpx;
		    }
		
		    video {
		      width: 100%;
		      height: 376rpx;
		      border-radius: 8rpx;
		    }
		  }
		
		  .pingl {
		    padding: 24rpx;
		    background: #F6F6F6;
		    border-radius: 12rpx;
		
		    .p-list {
		      .list-top {
		        margin-bottom: 20rpx;
		
		        .p-cot {
		          font-size: 24rpx;
		          font-family: PingFangSC-Regular, PingFang SC;
		          font-weight: 400;
		          color: $u-content-color;
		          line-height: 40rpx;
		        }
		      }
		    }
		
		    .more {
		      color: $u-type-primary;
		      font-size: 24rpx;
		      font-weight: bold;
		      display: flex;
		      align-items: center;
		      justify-content: flex-end;
		    }
		  }
		
		  &:last-child {
		    .list-bom {
		      border-bottom: none;
		    }
		  }
		}
	}
}
.loadmore{
	&::after {
		display: block;
		content: '';
		height: 50rpx;
	}
}
.popup-content{
	padding: 40rpx 40rpx 192rpx 40rpx ;
	height: 746rpx;
	border-radius: 12rpx 12rpx 0rpx 0rpx;
	background: #FFFFFF;
	position: relative;
}
</style>
