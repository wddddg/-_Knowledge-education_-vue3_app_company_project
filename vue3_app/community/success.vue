<template>
  <view class="container" :style="{'--theme-color':themeColor}">
    <u-navbar :is-back="false" title="发布成功"></u-navbar>
    <view class="sucess">
      <image src="@/static/community/sucess@2x.png" />
      <view>发布成功！</view>
      <view class="btns" @click="backFun">返回上级页面</view>
    </view>
  </view>
</template>

<script setup>
import {
  onLoad,
  onShow,
} from "@dcloudio/uni-app";
import { ref, getCurrentInstance } from "vue"
import { setTab } from "@/common/app-utils.js"
let themeColor = ref(uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe')
onLoad(() => {
 
})
const backFun = () => {
  uni.navigateBack({
    delta: 2// 返回层数，2则上上页
  })
}
</script>

<style lang="scss" scoped>
  ::v-deep uni-page-body {
    background: $uni-bg-color !important;
}
.container {
  // background: $u-global-color;
  text-align: center;

  .sucess {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 10vh;
    font-size: 30rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $u-content-color;

    image {
      width: 160rpx;
      height: 160rpx;
      margin: 42rpx auto;
    }

    .btns {
      padding: 20rpx 40rpx;
      color: $uni-color-primary;
      background: #FFFFFF;
      border-radius: 8rpx;
      border: 2rpx solid $uni-color-primary;
      margin: 42rpx auto;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
  }
}
</style>