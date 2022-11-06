<template>
    <view class="content" :class="{on:isClass}">
		<view class="title">
			<view class="title_letf">
				<view class="title_icon"></view>
				<text style="margin: 0 0 0 16rpx ;">资讯专区</text>
			</view>
			<view class="title_right" style="color: #606266;" @click="onMore">更多<u-icon name="arrow-right"></u-icon></view>
		</view>
		<template v-for="(item,index) in componentContent.websiteHtmlCustomModuleLinkVOList">
			<view class="list" @click="commonHandleTo(item)">
				<view class="list_itme">
					<view class="txt">{{item.title}}</view>
					<view class="bottom">
						<view class="bottom_left">{{item.createTime.substr(0,11)}}</view>
						<view class="bottom_right bottom_right_icon">
							<view style="margin-right:32rpx;" class="bottom_right_icon">
								<image class="images"  src="@/static/index/ping_l2x.png" mode="scaleToFill" style="width: 32rpx;height:32rpx;"></image>
								<view class="count" style="height: 35rpx;">{{item.commentCount}}</view>
							</view>
							<view class="bottom_right_icon">
								<image class="images" v-if="item.isGood == 0" src="@/static/index/dian_z@2x.png" mode="scaleToFill" style="width: 32rpx;height:32rpx;"></image>
								<image class="images" v-if="item.isGood==1" src="@/static/community/dianz_on@2x.png" mode="scaleToFill" style="width: 32rpx;height:32rpx;"></image>
								<view class="count" :style="{color:item.isGood==1?'#EE5142':'#606266'}">{{item.likeCount}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</template>
    </view>
</template>
<script lang="ts" setup >
	import { ref, defineProps, watch, unref,watchEffect } from 'vue';
	const props = defineProps(['componentContent','isClass'])
	
	// 详情页面跳转
	const commonHandleTo = (item) => {
	  uni.navigateTo({
	    url: `/community/newDetails?id=${item.contentUrl}`
	  })
	}
	
	function onMore(){
		uni.switchTab({
		  url: `/pages/community/index`
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
				height: 208rpx;
				box-shadow: 0rpx 20rpx 40rpx 0rpx rgba(0,0,0,0.1);
				border-radius: 12rpx;
				margin: 32rpx 0;
				overflow:hidden;
				text-overflow:ellipsis;
				padding: 32rpx;
				position: relative;
				
			}
			.txt{
				width: 100%;
				font-size: 30rpx;
				font-weight: 800;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				overflow:hidden;
				text-overflow:ellipsis;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;//显示的行数
			}
			.bottom{
				position: absolute;
				bottom: 32rpx;
				width: 90%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.bottom_left {
					color: #909399;
				}
				.bottom_right_icon{
					display: flex;
					align-items:center;
				}
			}
		}
	}

</style>