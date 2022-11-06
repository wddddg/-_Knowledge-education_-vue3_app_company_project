<template>
  <view class="container" :style="{'--theme-color':themeColor}">
    <view class="fab" v-if="newsId" @click="commonHandleToCom">
      <view class="btn">
        <image src="@/static/community/edit@2x.png" />
      </view>
      <view class="fan">发表</view>
    </view>
    <view class="fab" v-else @click="$refs.popup.open()">
      <view class="btn">
        <image src="@/static/community/edit@2x.png" />
      </view>
      <view class="fan">发表</view>
    </view>
    <view class="tank" v-if="showMask">
      <view class="mask" @click="showMask = false"></view>
      <view class="cont">
        <view class="closr" @click="showMask = false"><text>x</text></view>
        <view class="uni-data-checkbox">
          <uni-data-checkbox @change="changeCategory" v-model="categoryIds" :localdata="categoryList"
            selected-color="#395AE1" multiple selected-text-color="#fff" mode="tag"></uni-data-checkbox>
        </view>
        <view class="sure" @click="getSearch">确定</view>
      </view>
    </view>
    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="$uni-text-color-inverse" type="bottom">
      <view class="popup-conten">
        <view @click="$refs.popup.close()" class="popup-close">
          <uni-icons color="$u-tips-color" type="closeempty" size="20"></uni-icons>
        </view>
        <view class="list-rigt" @click="$refs.popup.close(),commonHandleTo(2)">
          <image src="@/static/community/help.png" mode="aspectFit" />
          发布动态
        </view>
        <view class="list-rigt" @click="$refs.popup.close(),commonHandleTo(1)">
          <image src="@/static/community/fab.png" mode="aspectFit" />
          发布答疑
        </view>
      </view>
    </uni-popup>

  </view>
</template>

<script setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, getCurrentInstance } from "vue"
import { setTab } from "@/common/app-utils.js"
const themeColor = ref(uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe')
const props = defineProps({
  newsId: String,
});
// 页面跳转
const commonHandleTo = (category) => {
  uni.navigateTo({
    url: `/community/publish?category=${category}`
  })
}
// 发布评论
const commonHandleToCom = () => {
  uni.navigateTo({
    url: `/community/comment?newsId=${props.newsId}`
  })
}
</script>

<style lang="scss" scoped>
.popup-conten {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: $uni-bg-color;
  padding: 100rpx 60rpx 160rpx;

  .list-rigt {
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    text-align: center;
    color: $u-main-color;
    display: flex;
    flex-direction: column;

    image {
      width: 88rpx;
      height: 88rpx;
      margin: 0 auto 20rpx;
    }
  }

  .popup-close {
    position: absolute;
    right: 40rpx;
    top: 40rpx;
  }
}

.fab {
  width: 174rpx;
  height: 88rpx;
  background: rgba($color: #C4CEF6, $alpha: .9);
  border-radius: 100px 0px 0px 100px;
  position: fixed;
  right: 0;
  bottom: 9vh;
  display: flex;
  align-items: center;

  .btn {
    width: 72rpx;
    height: 72rpx;
    border-radius: $uni-border-radius-circle;
    background: #395AE1;
    margin-left: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 32rpx;
      height: 32rpx;
    }
  }

  .fan {
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #395AE1;
    margin-left: 14rpx;
  }
}
</style>
