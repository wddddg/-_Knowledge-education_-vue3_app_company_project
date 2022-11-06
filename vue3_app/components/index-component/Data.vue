<template>
    <view class="content" :class="{on:isClass}">
		<view class="title">
			<view class="title_letf">
				<view class="title_icon"></view>
				<text style="margin: 0 0 0 16rpx ;">考点专区</text>
			</view>
			<view class="title_right" style="color: #606266;" @click="onMore">更多<u-icon name="arrow-right"></u-icon></view>
		</view>
		<template v-for="(item,index) in componentContent.websiteHtmlCustomModuleLinkVOList">
			<view class="list" @click="goKnowledgeDetail(item)">
				<view class="list_itme">
					<view class="txt">{{item.title}}</view>
				</view>
			</view>
		</template>

    </view>
</template>
<script lang="ts" setup >
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	const props = defineProps(['componentContent','isClass'])
	
	function goKnowledgeDetail(e){
		uni.navigateTo({
			url:'/course/knowledge/KnowledgeDetail'+'?id='+e.contentUrl
		})
	}
	
	function onMore(){
		uni.reLaunch({
		  url: `/pages/course/index?index=3`
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
				height: 112rpx;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
				border-radius: 4rpx 12rpx 12rpx 4rpx;
				border-left: 8rpx solid $u-global-color ;
				margin: 32rpx 0;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				display: flex;
				line-height: 112rpx;
				overflow:hidden;
				text-overflow:ellipsis;
			}
			.txt{
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				overflow:hidden;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:1;//显示的行数
				width: 100%;
				margin: 0 0 0 32rpx;
				font-size: 30rpx;
				font-weight: 800;
			}
		}
	}

</style>