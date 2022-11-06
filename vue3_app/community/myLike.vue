
<template>
    <view class="container" :style="{'--theme-color':themeColor}">
        <u-navbar :is-back="true" title="我收到的赞"></u-navbar>
        <view class="community uni-padding-wrap">
            <scroll-view @refresherrefresh="refresherrefresh" @scrolltolower="onReachBottoms" class="scroll-Y"
                :refresher-triggered="triggered" :scroll-y="true" :refresher-threshold="45" :scroll-anchoring="true"
                :refresher-enabled="true">
                <view class="store-list">
                    <block v-if="communityList && communityList.length > 0">
                        <view class="list-item" v-for="(item,index) in communityList" :key="index">
                            <view class="list-top">
                                <view class="ima">
                                    <image src="@/static/user/user-avatar.png" v-if="!item.headImg" />
                                    <image :src="item.headImg" v-else />
                                    <view>
                                        <view class="aut">
                                            {{item.nickName}}
                                        </view>
                                        <view class="date">
                                            赞了你的文章
                                        </view>
                                    </view>
                                </view>
                            </view>

                            <view class="pingl">
                                <view class="list-cot" @click="commonHandleTo(item)">
                                    <rich-text :nodes="item.oldContent" v-if="item.oldContent"></rich-text>
                                </view>
                                <view class="list-cot-image"
                                    v-if="item.newImgVOList&&item.newImgVOList.length>0"
                                    @click="commonHandleTo(item)">
                                    <image v-for="(it,i) in item.newImgVOList" :key="i" :src="it"
                                        mode="aspectFill" />
                                </view>
                            </view>
                            <view class="list-bom">
                                <view class="list-rigt">
                                    {{item.createTime}}
                                </view>
                            </view>
                        </view>
                        <view class="loadingText">{{ loadingText }}</view>
                    </block>
                    <view v-else class="no-data">
                        <image src="@/static/community/nodata.png" mode="aspectFit" />
                        <view>
                            暂无更多内容！
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>
  
<script setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, getCurrentInstance } from "vue"
import { findMyGoodNewsListForPage } from '@/community/community.api'
const themeColor = ref(uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe')
onLoad(() => {

})
const communityList = ref([1, 2, 1])
const triggered = ref(false)
const noMore = ref(false)
const page = ref(1)
const loadingText = ref('— 没有更多了 —')
const params = ref({
    pageSize: 10,
    pageNo: 1
})

const getSearch = () => {
    noMore.value = false
    page.value = 1;
    communityList.value = [];
    getCommunityList();
}

const refresherrefresh = () => {
    if (triggered.value) {
        return;
    }
    getSearch()
}
// 底部加载更多
const onReachBottoms = () => {
    console.log(page, '底部加载更多')
    if (!noMore.value) {
        page.value = page.value++;
        getCommunityList()
    }
}
const getCommunityList = async () => {
    uni.showLoading({ title: "加载中" });
    triggered.value = true;
    const res = await findMyGoodNewsListForPage({ ...params.value, pageNo: page.value });
    triggered.value = false;
    if (res.code) {
        if (res.result.records.length == 0 || res.result.records == null) {
            noMore.value = true
            loadingText.value = '— 没有更多了 —'
            return false;
        }
        loadingText.value = res.result.records.length < 11 || res.result.records.length == 0 ? '— 没有更多了 —' : "-- 正在加载 --";
        noMore.value = false
        const newList = res.result.records.map((item) => {
            item.newsCoverImgVOList.map((it) => {
                item.newImgVOList = it.coverImg && it.coverImg.split(',') || []
            })
            return item
        });
        if (page.value == 1) {
            communityList.value = newList
        } else {
            communityList.value = communityList.value.concat(newList);
        }

    }
    uni.hideLoading();
}
getSearch()
</script>
  
<style lang="scss" scoped>
::v-deep uni-page-body {
    background: $uni-bg-color !important;
}

.scroll-Y {
    height: 84vh;
}

.loadingText {
    padding: 20rpx 0 40rpx 0;
    text-align: center;
    color: #969799;
    font-size: 26rpx;
}

.no-data {
    padding: 80px 40rpx 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26upx;
    color: #969799;
    flex-direction: column;

    image {
        width: 320rpx;
        height: 320rpx;
    }

    view {
        margin-top: 30rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: $u-content-color;
    }
}

.community {
    padding-top: 20rpx;
    padding-bottom: 26rpx;
}

.list-item {
    margin-bottom: 26rpx;

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
                margin-top: 8rpx;
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

        .zhiding {
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
            align-items: center;
            margin-top: 10rpx;

            .zhiding {
                color: $u-type-primary;
                border-radius: 4rpx;
                border: 2rpx solid $u-type-primary;
                font-size: 24rpx;
                padding: 1rpx 6rpx 2rpx;
                display: flex;
                align-items: center;
                margin-left: 16rpx;
            }
        }
    }

    .list-cot {
        max-height: 240rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: $u-main-color;
        line-height: 40rpx;
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

        .list-rigt {
            display: flex;
            align-items: center;
            margin-left: 72rpx;
        }
    }

    .list-cot-image {
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-top: 20rpx;

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

    .pingl {
        padding: 24rpx;
        background: #F6F6F6;
        border-radius: 12rpx;
        margin-bottom: 20rpx;
        margin-left: 70rpx;
    }

    &:last-child {
        .list-bom {
            border-bottom: none;
        }
    }
}
</style>
  