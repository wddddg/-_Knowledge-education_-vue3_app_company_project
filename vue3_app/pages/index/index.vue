<template>
	<page>
	<view class="container" :style="{'--theme-color':themeColor}">
		<u-navbar :is-back="false" :title="indexCustom.webTitle"></u-navbar>
		<!-- <mescroll-uni ref="mescrollRef" :height="windowHeight" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption" > -->
		<view class="index">
			<template v-for="(item,index) in indexItme">
				<Seacher v-if="item.moduleCode == '1001'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<Banner v-else-if="item.moduleCode == '1005'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<BannerBackground v-else-if="item.moduleCode == '1006'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<Navigation v-else-if="item.moduleCode == '1007'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<NavigationBanner v-else-if="item.moduleCode == '1008'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<Advert v-else-if="item.moduleCode == '1015'" :componentContent="item" :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<Propaganda v-else-if="item.moduleCode == '1016'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<Live v-else-if="item.moduleCode == '1010'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<Class v-else-if="item.moduleCode == '1011'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<Book v-else-if="item.moduleCode == '1012'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<Data v-else-if="item.moduleCode == '1013'" :componentContent="item" :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<News v-else-if="item.moduleCode == '1014'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
				<Statement v-else-if="item.moduleCode == '1009'" :componentContent="item"  :isClass="indexItme[index-1]?.moduleCode=='1006'"/>
			</template>
		</view>
		<!-- </mescroll-uni> -->
		<u-popup v-model="show" mode="center" closeable border-radius="12">
			<image class="images" :src="AdvertData?.imgUrl" mode="scaleToFill" style="width: 558rpx;height:712rpx;border-radius: 12rpx;" @click="goUrl(AdvertData?.onclickUrl,AdvertData?.onclickType,AdvertData?.courseType)"></image>
		</u-popup>
		<VersionUpgrade/>
	</view>
	<BottomTabbar :pagePath="'pages/index/index'" />
	</page>
</template>

<script setup>
	import {onLoad,onShow,onPullDownRefresh} from "@dcloudio/uni-app";
	import {setTab} from "@/common/app-utils.js"
	import {ref,getCurrentInstance,nextTick,watch } from "vue"
	import Seacher from "@/components/index-component/Seacher.vue"
	import Banner from "@/components/index-component/Banner.vue"
	import Navigation from "@/components/index-component/Navigation.vue"
	import NavigationBanner from "@/components/index-component/NavigationBanner.vue"
	import Advert from "@/components/index-component/Advert.vue"
	import Propaganda from "@/components/index-component/Propaganda.vue"
	import Live from "@/components/index-component/Live.vue"
	import Class from "@/components/index-component/Class.vue"
	import Book from "@/components/index-component/Book.vue"
	import Data from "@/components/index-component/Data.vue"
	import News from "@/components/index-component/News.vue"
	import Statement from "@/components/index-component/Statement.vue"
	import BannerBackground from "@/components/index-component/BannerBackground.vue"
	import VersionUpgrade from "@/components/VersionUpgrade.vue"
	import BottomTabbar from "@/components/BottomTabbar.vue"
	import {getWebsiteAdvert,getNewVersion} from "@/common/commonApi.ts"
	let themeColor = ref(uni.getStorageSync('themeColor')?uni.getStorageSync('themeColor'):'#395AE1')
	
	onLoad(async(e)=>{
		// setTimeout(()=>{
			// setTab()
		// },5000)
		uni.hideTabBar()
		if(!indexItme.value){
			setTimeout(()=>{
				getIndexCustom()
			},2000)
		}
		getIndexCustom()
		if(!uni.getStorageSync('themeColor')){
			setTimeout(()=>{
				themeColor.value = ref(uni.getStorageSync('themeColor')?uni.getStorageSync('themeColor'):'#395AE1')
			},1000)
		}
		// uni.setBackgroundTextStyle({
		//   textStyle: 'light' ,// 下拉背景字体、loading 图的样式为dark
		//   	success:()=>{
		// 		console.log('成功');
		// 	}
		// })

		let useDevice = uni.getStorageSync('useDevice')
		console.log(useDevice.uniPlatform,'useDevice');
		if (useDevice.uniPlatform == 'web') {
			useDevice = 4
		} else if (useDevice.uniPlatform == 'mp-weixin') {
			useDevice = 3
		} else if (useDevice.uniPlatform == 'app') {
			if (useDevice.osName == 'android') {
				useDevice = 2
			} else {
				useDevice = 1
			}
		} else {
			useDevice = 4
		}
		let nowTime = new Date().getTime()
		let oldTime = uni.getStorageSync('showAdvertTime')
		// 86400000
		if((nowTime-oldTime)>86400000){
			getWebsiteAdvert({useDevice:useDevice}).then(res=>{
				AdvertData.value = res.result
				show.value = true
			})
			uni.setStorageSync('showAdvertTime',nowTime)
		}
	})
	onShow(()=>{
		getIndexCustom()
	})
	onPullDownRefresh(()=>{
		indexItme.value = indexCustom?.websiteHtmlCustomModuleVOList
		console.log(uni.getStorageSync('LoadingImg'),'indexItme.value');
		uni.stopPullDownRefresh()
	})
	let show = ref(false)
	let showVersion = ref(true)
	let AdvertData = ref()
	let windowHeight = ref('85%')
	let indexCustom = uni.getStorageSync('indexCustom')
	let indexItme = ref(indexCustom?.websiteHtmlCustomModuleVOList)
	uni.$emit('apiLoadNo')
	function getIndexCustom(){
		indexCustom = uni.getStorageSync('indexCustom')
		indexItme.value = indexCustom?.websiteHtmlCustomModuleVOList
		setTimeout(()=>{
			uni.$emit('apiLoadOff')
		})
	}
	
	let upOption = ref({use:false})
	const mescroll = ref()
	function mescrollInit(mescrollRef){
		mescroll.value = mescrollRef
	}
	function downCallback(){
		indexItme.value = indexCustom?.websiteHtmlCustomModuleVOList
		console.log(uni.getStorageSync('LoadingImg'),'indexItme.value');
		mescroll.value.endSuccess()
	}
	function upCallback(){}
	
	
	
	let indexPage = {
		'pages/index/index':true,
		'pages/course/index':true,
		'pages/question/index':true,
		'pages/community/index':true,
		'pages/mine/index':true,
	}
	function goUrl(e,linkType,courseType){
		if(linkType==1||linkType==2){
			if(indexPage[e]||e.indexOf('?')!=-1){
				if(e.indexOf('?')!=-1){
					uni.reLaunch({
						url:'/'+e
					})
				}else{
					uni.switchTab({
						url:'/'+e
					})
				}
			}else{
				uni.navigateTo({
					url:'/'+e
				})
			}
		}else if(linkType==3){
			if(courseType == 4){
				uni.navigateTo({
					url:'/course/class-course/ClassCourse'+'?id='+e
				})
			}else if(courseType == 1||courseType == 2){
				uni.navigateTo({
					url:'/course/online-course/OnlineCourse'+'?id='+e+'&courseType='+(courseType)
				})
			}else if(courseType == 3){
				uni.navigateTo({
					url:'/course/face-course/FaceCourse'+'?id='+e
				})
			}
		}else if(linkType == 4){
			uni.navigateTo({
				url:'/course/class-course/ClassCourse'+'?id='+e
			})
		}else if(linkType == 5){
			uni.navigateTo({
				url:'/course/knowledge/KnowledgeDetail'+'?id='+e
			})
		}else if(linkType == 6){
			uni.navigateTo({
				url:'/course/book/BookDetail'+'?id='+e
			})
		}else if(linkType == 7){
			uni.navigateTo({
				url:'/mall/all-products/PhysicalGoodsDetails'+'?id='+e
			})
		}else if(linkType == 7){
			// 详情页面跳转
			uni.navigateTo({
				url: `/community/newDetails?id=${e}`
			})
		}
		show.value = false
	}
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		// background: $u-global-color;
		.index{
			// margin: 0 40rpx;
			font-size: 24rpx
		}
		.on{
			box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
			border-radius: 12rpx;
			background: #fff;
		}
	}
</style>
