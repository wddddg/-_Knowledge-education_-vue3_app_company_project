<template>
	<view class="" :style="{'--theme-color':themeColor}">
		<view class="tarbar-box-placeholder"></view>
		<view class="tarbar-box" :style="{height:osHeight}">
			<view class="bar-item" v-for="(item,index) in navList" :key="index" @click="rediectTo(item)">
				<image :src="pagePath==item.pagePath ? item.selectedIconPath:item.iconPath" class="bar-img" mode="aspectFill"></image>
				<view class="title"  :class="{active:item.pagePath == pagePath}" >{{ item.text }}</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref,onMounted } from "vue";
	onMounted(()=>{
		setTab()
		if(!uni.getStorageSync('themeColor')){
			setTimeout(()=>{
				themeColor.value = ref(uni.getStorageSync('themeColor')?uni.getStorageSync('themeColor'):'#395AE1')
			},1000)
		}
	})
	let props = defineProps({
		pagePath:{
			type:String,
			default:"pages/index/index"
		}
	})
	let title = ref('')
	let themeColor = ref(uni.getStorageSync('themeColor')?uni.getStorageSync('themeColor'):'#395AE1')
	
	function rediectTo(data){
		uni.switchTab({
			url:'/' + data.pagePath
		})
	}
	let osHeight = uni.getStorageSync('useDevice').osName=='ios'?'150rpx':'130rpx'
	let navList = ref([{
				"pagePath": "pages/index/index",
				"iconPath": "static/component.png",
				"selectedIconPath": "static/componentHL.png",
				"text": "首页",
			},
			{
				"pagePath": "pages/course/index",
				"iconPath": "static/component.png",
				"selectedIconPath": "static/componentHL.png",
				"text": "课程",
			},
			{
				"pagePath": "pages/question/index",
				"iconPath": "static/component.png",
				"selectedIconPath": "static/componentHL.png",
				"text": "题库",
			},
			{
				"pagePath": "pages/community/index",
				"iconPath": "static/component.png",
				"selectedIconPath": "static/componentHL.png",
				"text": "社区",
			},
			{
				"pagePath": "pages/mine/index",
				"iconPath": "static/component.png",
				"selectedIconPath": "static/componentHL.png",
				"text": "我的",
			}
	])
	function setTab(){
		let bottomIcon = uni.getStorageSync('bottomIcon')
		if(!bottomIcon){
			setTimeout(()=>{
				setTab()
			},1000)
			return
		}
		bottomIcon.forEach((itme,index)=>{
			navList.value[index].index = index
			navList.value[index].pagePath = itme.onclickUrl
			navList.value[index].iconPath = itme.onclickAgo
			navList.value[index].selectedIconPath = itme.onclickAfter
			navList.value[index].text = itme.title
			
			// uni.setTabBarItem({
			// 	"index":index,
			// 	"pagePath": itme.onclickUrl,
			// 	"iconPath": itme.onclickAgo,
			// 	"selectedIconPath": itme.onclickAfter,
			// 	"text": itme.title,
			// 	"visible":true,
			// })
		})
	}

</script>

<style lang="scss" scoped>
	.tarbar-box-placeholder{
		height: 160rpx;
		width: 100%;
	}
	.tarbar-box {
		position: fixed;
		bottom:0;
		z-index:999 ;
		height: 150rpx;
		width: 100%;
		background-color: #F9F9F9;
		// border-radius: 30rpx 30rpx 0 0;
		display: flex;
		flex-direction: row;
		border-top: 1rpx solid #ccc;
		.bar-item{
			margin-top: 16rpx;
			height: 100rpx;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 20rpx;
			image{
				margin-bottom: 10rpx;
				width: 40rpx;
				height: 40rpx;
			}
			.active{
				color:$u-global-color;
				
			}
		}
	}
</style>