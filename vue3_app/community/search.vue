<template>
    <view class="container" :style="{'--theme-color':themeColor}">
        <u-navbar :is-back="true" title="搜索"></u-navbar>
        <view class="s-navbar">
            <uni-search-bar shape="square" placeholder="请输入关键词搜索" @blur="getSearch" :cancelButton="'always'" v-model="searchValue" @cancel="cancelSearch" @clear="getSearch"
                @confirm="getSearch" />
        </view>
        <view class="community">
            <view class="uni-padding-wrap content">
                <view>
                    <Public :searchH="true" :searchParam="searchValue" />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import Public from '@/community/components/Public.vue' // 广场
import Question from '@/community/components/Question.vue' //答疑
import New from '@/community/components/New.vue' // 资讯
export default {
    components: { Public },
    data() {
        return {
            searchParam: "",
            searchValue: ''
        };
    },
    created() {

    },
    watch: {

    },
    methods: {
        cancelSearch() {
            uni.navigateBack({
                delta: 1// 返回层数，2则上上页
            })
        },
        getSearch() {
            this.searchParam = this.searchValue
        }
    }
};
</script>

<style lang="scss" scoped>
::v-deep uni-page-body {
    background: $uni-bg-color !important;
}

::v-deep uni-page {
    overflow: hidden;
}

::v-deep .uni-searchbar {
    padding: 0;
}

::v-deep .uni-searchbar__cancel {
    border-top-right-radius: 10rpx;
    border-bottom-right-radius: 10rpx;
    color: #969696;
    background-color:#F6F6F6;
    font-size: 24rpx;
    padding-right: 32rpx;
    font-weight: normal;
    position: relative;
}
::v-deep .uni-searchbar__box-icon-search .uni-icons{
    display: none !important;;
}
::v-deep .uni-searchbar__box-icon-search{
    width: 32rpx;
    height: 32rpx;
    background: url('https://qiniu.pisenpower.com/FoNTpQRbRGUqMb_qGQY8SvX6326I') no-repeat;
    background-size: contain;
    margin-left: 32rpx;
    margin-right: 16rpx;
}
::v-deep .uni-searchbar__cancel::before {
    content: '';
    width: 2rpx;
    height: 32rpx;
    background: #E0E2E4;
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
}

::v-deep .uni-searchbar__box {
    justify-content: flex-start;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    color: #303133;
    height: 72rpx;
}

.s-navbar {
    width: 100%;
    background: $uni-bg-color;
    position: fixed;
    left: 0;
    right: 0;
    // top: 0;
    z-index: 12;
    padding: 30rpx 30rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #1B1E27;
    font-weight: normal;
}

.community {
    padding-top: 140rpx;
    background: #fff;
}
</style>