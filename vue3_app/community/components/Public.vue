<template>
  <scroll-view :style="myCollect  ? 'height: 75.5vh':'height: 70.5vh'" @refresherrefresh="refresherrefresh"
    @scrolltolower="onReachBottoms" class="scroll-Y" :refresher-triggered="triggered" :scroll-y="true"
    :refresher-threshold="45" :scroll-anchoring="true" :refresher-enabled="refresher ? false: true">
    <view class="store-list">
      <block v-if="communityList && communityList.length > 0">
        <view class="list-item" v-for="(item,index) in communityList" :key="index">
          <view class="list-top">
            <view class="ima">
              <!-- <view class="img-ct" v-if="index==0">
                <image class="vip1" src="@/static/community/nodata.png" mode="aspectFit" />
                <image class="vip" src="@/static/community/vip@2x.png" mode="aspectFit" />
              </view> -->
              <image src="@/static/user/user-avatar.png" v-if="!item.authorImg" />
              <image :src="item.authorImg" v-else />
              <image  class="vip" v-if="item.isMember==1" src="@/static/community/VIP@2x.png"/>
              <view>
                {{item.authorName || '暂无'}}
                <view class="date">
                  {{item.createTime}}
                </view>
              </view>
            </view>
            <view class="zhiding" v-if="item.isRecommend==1">置顶</view>
          </view>
          <template v-if="item.newImgVOList&&item.newImgVOList.length > 2">
            <view class="list-cot" @click="navigateTo(item)">
              <rich-text :nodes="item.content" v-if="item.content"></rich-text>
              <template v-else>{{item.summary && item.summary.length > 30 ? item.summary.slice(0,30) + '...' : item.summary }}</template>
            </view>
            <view class="list-cot-image" v-if="item.newImgVOList.length>0" @click="navigateTo(item)">
              <image mode="aspectFill" v-for="(it,i) in item.newImgVOList" :key="i" :src="it" />
            </view>
          </template>
          <template v-else>
              <template v-if="item.newImgVOList&&item.newImgVOList.length == 0">
                <view class="list-cot" @click="navigateTo(item)">
                  <rich-text :nodes="item.content" v-if="item.content"></rich-text>
                  <template v-else>{{item.summary && item.summary.length > 30 ? item.summary.slice(0,30) + '...' :
                  item.summary }}</template>
                </view>
                <view class="list-cot-image" v-if="item.newImgVOList.length>0" @click="navigateTo(item)">
                  <image mode="aspectFill" v-for="(it,i) in item.newImgVOList" :key="i" :src="it" />
                </view>
              </template>
              <view v-else class="colog">
                <view class="lfet">
                  <view class="list-cot" @click="navigateTo(item)">
                    <rich-text :nodes="item.content" v-if="item.content"></rich-text>
                    <template v-else>{{item.summary && item.summary.length > 30 ? item.summary.slice(0,30) + '...' :
                    item.summary }}</template>
                  </view>
                </view>
                <view class="list-cot-image" v-if="item.newImgVOList&&item.newImgVOList.length>0"
                  @click="navigateTo(item)">
                  <image mode="aspectFill" v-for="(it,i) in item.newImgVOList" :key="i" :src="it" />
                </view>
              </view>
            </template>
          <view class="list-bom" v-if="applyStatus!=2">
            <view class="list-lft">
              <image src="@/static/community/eye@2x.png" mode="aspectFit" />
              {{item.lookCount || 0}}次阅读
            </view>
            <view class="list-rigt">
              <view class="list-rigt">
                <image src="@/static/community/pinglun@2x.png" mode="aspectFit" />
                {{item.commentCount || 0}}
              </view>
              <view class="list-rigt" @click="likeNewsGood(item,index)" :class="{'dianz':item.isGood==1}">
                <image v-if="item.isGood==1" src="@/static/community/dianz_on@2x.png" mode="aspectFit" />
                <image v-else src="@/static/community/dianz@2x.png" mode="aspectFit" />
                {{item.likeCount || 0}}
              </view>
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
</template>

<script setup>
import { onPullDownRefresh, onLoad, onShow } from "@dcloudio/uni-app";
import { ref, getCurrentInstance, watch } from "vue"
import { setTab } from "@/common/app-utils.js"
import { myPushNewsListForPage, myCollectionNewsListForPage, apiNewsListForPage, addNewsGood } from '@/community/community.api'
const props = defineProps({
  searchParam: String,
  searchH: Boolean,
  myCollect: Boolean,
  myPost: Boolean,
  applyStatus: Number, //审批状态：1、已通过2、待审批3、已拒绝
  refresher: Boolean,// 下拉刷新
});
onPullDownRefresh(async () => {
  await getSearch()
  uni.stopPullDownRefresh()
})
onShow(() => {
  // getSearch()
})
const communityList = ref([])
const triggered = ref(false)
const noMore = ref(true)
const page = ref(1)
const loadingText = ref('— 没有更多了 —')
const params = ref({
  category: 2,
  pageSize: 10,
  searchParam: ''
})
// 页面跳转
const commonHandleTo = (url) => {
  uni.navigateTo({
    url
  })
}
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
  console.log(page.value,noMore.value, '底部加载更多')
  if (!noMore.value) {
    page.value = page.value  + 1;
    getCommunityList()
  }
}
const getCommunityList = async () => {
  params.value.category = props.searchH ? '' : 2
  params.value.searchParam = props.searchParam
  uni.showLoading({ title: "加载中" });
  triggered.value = true;
  const res = props.myCollect ? await myCollectionNewsListForPage({ ...params.value, pageNo: page.value }) : props.myPost ? await myPushNewsListForPage({ ...params.value, applyStatus: props.applyStatus, pageNo: page.value }) : await apiNewsListForPage({ ...params.value, pageNo: page.value });
  triggered.value = false;
  if (res.code == 200) {
    if (res.result.records.length == 0 || res.result.records == null) {
      noMore.value = true
      loadingText.value = '— 没有更多了 —'
      return false;
    }
    loadingText.value = res.result.records.length < 11 || res.result.records.length == 0 ? '— 没有更多了 —' : "-- 正在加载 --";
    noMore.value = false
    const newlist = res.result.records.map((item)=>{
      item.newsCoverImgVOList.map((it)=>{
        item.newImgVOList = it.coverImg && it.coverImg.split(',') || []
      })
      return item
    });
    if (page.value == 1) {
      communityList.value = newlist
    } else {
      communityList.value = communityList.value.concat(newlist);
    }

  }
  uni.hideLoading();
}

// 点赞
const likeNewsGood = async (item, index) => {
  let operateStatus = item.isGood == 1 ? 0 : 1
  const res = await addNewsGood({ newsId: item.id, operateStatus });
  if (res.success) {
    communityList.value[index].isGood = operateStatus
    if (operateStatus == 1) {
      uni.showToast({
        title: '点赞成功',
        duration: 2000
      });
      communityList.value[index].likeCount = Number(communityList.value[index].likeCount) + 1;
    } else {
      uni.showToast({
        title: '取消成功',
        duration: 2000
      });
      communityList.value[index].likeCount = Number(communityList.value[index].likeCount) - 1;
    }
  }
}

// 页面跳转
const navigateTo = (item) => {
  uni.navigateTo({
    url: `/community/details?id=${item.id}`
  })
}

watch(
  () => props.searchParam,
  () => {
    if (props.searchParam) {
      getSearch()
    }
  },
  { immediate: true }
);
watch(
  () => props.applyStatus,
  () => {
    if (props.applyStatus) {
      getSearch()
    }
  },
  { immediate: true }
);
watch(
  () => props.myCollect,
  () => {
    if (props.myCollect) {
      getSearch()
    }
  },
  { immediate: true }
);
// getSearch()
</script>

<style lang="scss" scoped>
.container {
  background: #fff;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.scroll-Y {
  height: 100%;
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
        left: 30rpx;
        width: 30rpx;
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
      align-items: flex-start;
      margin-top: 2rpx;

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
    max-height: 164rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: $u-main-color;
    line-height: 48rpx;
    margin-bottom: 20rpx;
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

    .list-lft {
      display: flex;
      align-items: center;

      image {
        width: 24rpx;
        height: 24rpx;
        margin-right: 10rpx;
      }
    }

    .list-rigt {
      display: flex;
      align-items: center;
      margin-left: 30rpx;

      image {
        width: 32rpx;
        height: 32rpx;
        margin-right: 10rpx;
      }
    }
  }

  .list-cot-image {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    overflow: hidden;

    image {
      width: 204rpx;
      height: 164rpx;
      border-radius: 8rpx;
      margin-left: 30rpx;

      &:first-child {
        margin: 0;
      }
    }
  }

  .colog {
    display: flex;
    justify-content: space-between;

    .list-cot-image {
      width: 216rpx;
      height: 164rpx;
      flex-shrink: 0;
      margin-left: 20rpx;

      image {
        width: 216rpx;
        height: 164rpx;
      }
    }

    .new-tit {
      padding-bottom: 10rpx;
      line-height: 40rpx;
    }

    .list-cot {
      font-size: 28rpx;
      font-weight: 400;
      color: $u-main-color;
      line-height: 36rpx;
    }
  }

  .pingl {
    padding: 24rpx;
    background: #F6F6F6;
    border-radius: 12rpx;

    .p-list {
      .list-top {
        margin-bottom: 20rpx;

        .p-cot {
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: $u-content-color;
          line-height: 40rpx;
        }
      }
    }

    .more {
      color: $u-type-primary;
      font-size: 24rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

}
.store-list{
  .list-item:nth-last-child(2) {
    .list-bom {
      border: none;
    }
  }
}

.dianz {
  color: #EE5142 !important;
}

.couc {
  color: #F29E3F !important;
}
</style>
