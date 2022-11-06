<template>
	<view class="container" :style="{'--theme-color':themeColor,'--theme-font-color':themeFontColor}">
		<view>
			<u-navbar title="我的学习"></u-navbar>
		</view>
		<u-sticky bgColor="#fff" class="tabs-list">
			<u-tabs :list="tabsList" :is-scroll="false" :current="currentTabs" @change="changeTabs" :activeColor="themeColor"></u-tabs>
		</u-sticky>
		<!-- 预约 课程 班课 资料 书籍 -->
		<!-- Reservation Courses Classes Materials Books -->
		<view class="tabs-list-item">
			<Reservation v-if="currentTabs === 0" />
			<Courses v-if="currentTabs === 1" />
			<Classes v-if="currentTabs === 2" />
			<Materials v-if="currentTabs === 3" />
			<Books v-if="currentTabs === 4" />
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import Reservation from './Reservation.vue'
	import Courses from './Courses.vue'
	import Classes from './Classes.vue'
	import Materials from './Materials.vue'
	import Books from './Books.vue'
	let themeColor = ref(uni.getStorageSync('otherThemeColor').themeColor ? '#' + uni.getStorageSync('otherThemeColor')
		.themeColor : '#395AE1')
	let buttonColor = ref(uni.getStorageSync('otherThemeColor').buttonColor ? '#' + uni.getStorageSync('otherThemeColor')
		.buttonColor : '#395AE1')
	let themeFontColor = ref(uni.getStorageSync('otherThemeColor').themeFontColor ? '#' + uni.getStorageSync(
		'otherThemeColor').themeFontColor : '#fff')
	const tabsList = [{
		name: '预约'
	}, {
		name: '课程'
	}, {
		name: '班课'
	}, {
		name: '资料'
	}, {
		name: '书籍'
	}]
	const currentTabs = ref(0)
	const changeTabs = (e) =>{
		currentTabs.value = e
	}
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style scoped lang="scss">
	/* $u-global-color */
	.tabs-list{
		background: #FFFFFF;
		box-shadow: 0px 20px 40px 0px rgba(0,0,0,0.1);
	}
	.tabs-list-item{
		padding: 0rpx 40rpx;
	}
</style>
