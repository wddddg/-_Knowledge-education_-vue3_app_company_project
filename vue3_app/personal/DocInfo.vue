<template>
	<view class="">
		<u-navbar :title="title"></u-navbar>
		<view class="message-content" v-html="content"></view>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	import { ref } from 'vue'
	import { getDoc } from './Personal.api.ts'
	const title = ref('用户协议')
	const content = ref('')
	onLoad(async (option) =>{
		title.value = option.type == 1 ? "服务政策" : option.type == 2 ? "隐私政策" : '关于我们';
		await getDoc({type: option.type}).then(res =>{
			content.value = res.result.content
		})
	})
</script>

<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss">
	.message-content{
		width: 90%;
		margin-left: 5%;
		margin-top: 20upx;
	}

</style>
