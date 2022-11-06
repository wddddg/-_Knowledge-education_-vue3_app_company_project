<template>
    <view class="content" :class="{on:isClass}">
		<view class="title">
			<view class="title_letf">
				<view class="title_icon"></view>
				<text style="margin: 0 0 0 16rpx ;">精品好课</text>
			</view>
			<!-- <view class="title_right">更多<u-icon name="arrow-right"></u-icon></view> -->
		</view>
		<u-tabs :list="list"  @change="changeTabs" :is-scroll="false" :current="currentTabs" :active-color="activeColor"></u-tabs>
		<template v-for="(item,index) in componentContent.websiteHtmlCustomModuleLinkVOList">
			<view class="list" v-show="item.courseType == (currentTabs+1)">
				<view class="list_itme" @click="goDetail(item)">
					<view class="top_box">
						<image class="images" :src="item.imgUrl" mode="scaleToFill" style="width: 240rpx;height:180rpx;border-radius: 12rpx;margin: 24rpx;"></image>
						<view class="order" v-if="item.courseType == 2">{{item.liveStatus==0?'未预约':item.liveStatus==1?`${item.studyCount}人已预约`:'正在直播'}}</view>
					</view>
					<view class="list_itme_right">
						<view class="list_itme_title">{{item.title}}</view>
						<view class="list_itme_teacher" v-for="(j,i) in item.courseTeacherVOList" v-if="item.courseType == 1">
							<view class="list_itme_teacher_center">
								<image class="images"  :src="j?.headImg" mode="scaleToFill" style="width: 32rpx;height:32rpx;border-radius: 32rpx;margin-right: 5rpx;"></image>
								<text>{{j?.teacherName}}</text>
							</view>
						</view>
						<view class="list_itme_teacher"  v-else>
							<view class="list_itme_teacher_center">
								<image class="images"  :src="item?.teacherImg" mode="scaleToFill" style="width: 32rpx;height:32rpx;border-radius: 32rpx;margin-right: 5rpx;"></image>
								<text>{{item?.teacherName}}</text>
							</view>
						</view>
						<view class="list_itme_pay">
							<view class="list_itme_pay_letf">
								<image class="images" v-show="item?.costType==4&&payRule.learnPayStatus==1&&payRule.isClosePay==0" src="@/static/index/qian2x.png" mode="scaleToFill" style="width: 32rpx;height:34rpx;"></image>
								<text style="color: #EE5142;" v-show="item?.costType==4&&(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1)&&payRule.isClosePay==0">￥</text>
								<text class="current_price" v-if="item?.costType==1" style="color: #67C23A;">{{'免费'}}</text>
								<text class="current_price" v-else-if="item?.costType==2" style="color: #67C23A;">{{'限时免费'}}</text>
								<text class="current_price" v-else-if="item?.costType==3" style="color: #395AE1;">{{'会员'}}</text>
								<text class="current_price" v-else-if="item?.costType==4&&(payRule.aliPayStatus==1||payRule.wechatPayStatus==1||payRule.iosPayStatus==1||payRule.learnPayStatus==1)&&payRule.isClosePay==0" style="color: #EE5142;">
									{{item?.presentPrice}}
								</text>
								<text class="current_price" v-else style="color: #395AE1;">{{payRule.buttonName}}</text>
								<text class="original_cost">￥{{item?.originalPrice}}</text>
							</view>
							<view class="list_itme_pay_right" v-if="item.courseType==2">
								<button class="mini-btn" type="primary" size="mini" :style="{background:buttonColor,color:themeFontColor}" >观看</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</template>
		<view class="more" @click="onMore">查看更多<u-icon name="arrow-right"></u-icon></view>
    </view>
</template>
<script lang="ts" setup >
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	const props = defineProps(['componentContent','isClass'])
	let list = ref([{
					name: '精品课',
				}, {
					name: '直播课',
				}, {
					name: '线上课',
				}, {
					name: '面授课',
				}])
	let currentTabs = ref(0)
	let activeColor = ref(uni.getStorageSync('themeColor')?uni.getStorageSync('themeColor'):'#395AE1')
	function changeTabs(index) {
		currentTabs.value = index;
	}
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor?'#'+uni.getStorageSync('otherThemeColor').buttonColor:'#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor?'#'+uni.getStorageSync('otherThemeColor').themeFontColor:'#fff')
	let payRule = ref(uni.getStorageSync('payRule'))
	
	function goDetail (data){
		debugger
		if(data.courseType == 1){
			uni.navigateTo({
				url:'/course/class-course/ClassCourse'+'?id='+data.contentUrl
			})
		}else if(data.courseType == 2||data.courseType == 3){
			uni.navigateTo({
				url:'/course/online-course/OnlineCourse'+'?id='+data.contentUrl+'&courseType='+(data.courseType-1)
			})
		}else if(data.courseType == 4){
			uni.navigateTo({
				url:'/course/face-course/FaceCourse'+'?id='+data.contentUrl
			})
		}
	}
	
	function onMore(){
		uni.reLaunch({
		  url: `/pages/course/index?index=0`
		})
	}
</script>
<style lang="scss" scoped>
	.on{
		box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
		border-radius: 12rpx;
		background: #fff;
		position: relative;
		z-index: 9;
	}
	.content{
		margin: 0 40rpx;
		margin-bottom: 24rpx;
		.title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			// margin: 0 40rpx;
			.title_letf{
				// width: 108rpx;
				height: 50rpx;
				font-size: 36rpx;
				font-weight: 800;
				color: #1B1E27;
				line-height: 50rpx;
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
		.list{
			.list_itme{
				height: 248rpx;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
				border-radius: 12rpx;
				margin: 32rpx 0;
				display: flex;
			}
			.top_box {
				position: relative;
				color: #fff;
				.count {
					font-size: 20rpx;
					position: absolute;
					top: 0;
					left: 0;
					width: 144rpx;
					height: 40rpx;
					background: #395AE1;
					opacity: 0.8;
					border-radius: 12rpx 0rpx 200rpx 0rpx;
					line-height: 40rpx;
					font-weight: 400;
					padding-left: 16rpx;
				}
				.order {
					position: absolute;
					bottom: 45rpx;
					left: 24rpx;
					width: 240rpx;
					height: 40rpx;
					background: rgba(0,0,0,0.6);
					// opacity: 0.6;
					border-radius: 0rpx 0rpx 12rpx 12rpx;
					line-height: 40rpx;
					text-align: center;
					font-weight: 400;
				}
			}
			.list_itme_right{
				width: 358rpx;
				padding: 24rpx 32rpx 32rpx 0;
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
			.list_itme_teacher {
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
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;//显示的行数
				.list_itme_teacher_center {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
				}
			}
			.list_itme_pay {
				position: absolute;
				width: 100%;
				bottom:28rpx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				
				.list_itme_pay_letf{
					display: flex;
					align-items: center;
					height: 65rpx;
				}
				.current_price{
					color: #EE5142;
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
		.more {
			text-align: center;
			color: #606266;
		}
	}

</style>