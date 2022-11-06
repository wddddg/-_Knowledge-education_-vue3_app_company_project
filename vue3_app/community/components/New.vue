<template>
  <view>
    <view class="navbar" v-if="showNav">
      <uni-segmented-control :current="current" :values="items" :style-type="'text'" :active-color="activeColor"
        @clickItem="onClickItem" />
      <view class="lefts" @click="showMask = true">
        <image class="mdr" src="@/static/community/more@2x.png" mode="aspectFit" />
      </view>
      <view class="tank" v-if="showMask">
        <view class="mask" @click="showMask = false"></view>
        <view class="cont">
          <view class="closr" @click="showMask = false"><text>x</text></view>
          <view class="uni-data-checkbox">
            <uni-data-checkbox @change="changeCategory" v-model="params.categoryIds" :localdata="categoryList"
              selected-color="#395AE1" multiple selected-text-color="#fff" mode="tag"></uni-data-checkbox>
          </view>
          <view class="sure" @click="getSearch">确定</view>
        </view>
      </view>
    </view>
    <scroll-view :style="myCollect?'height: 75.5vh':'height: 70.5vh'"
      @refresherrefresh="refresherrefresh" @scrolltolower="onReachBottoms" class="scroll-Y"
      :refresher-triggered="triggered" :scroll-y="true" :refresher-threshold="45" :scroll-anchoring="true"
      :refresher-enabled="refresher ? false: true">
      <view class="store-list">
        <block v-if="communityList && communityList.length > 0">
          <view class="list-item" v-for="(item,index) in communityList" :key="index">
            <view class="list-top">
              <view class="ima">
                <image mode="aspectFit" src="@/static/user/user-avatar.png" v-if="!item.authorImg" />
                <image mode="aspectFit" :src="item.authorImg" v-else />
                <image  class="vip" v-if="item.isMember==1" src="@/static/community/VIP@2x.png"/>
                <view>
                  <view class="aut">
                    {{item.authorName}}
                    <view class="zhiding">{{item.oneCateName}}</view>
                    <view class="zhidingq" v-if="item.isRecommend==1">置顶</view>
                  </view>
                  <view class="date">
                    {{item.createTime}}
                  </view>
                </view>
              </view>
              <view class="guanzhu" v-if="item.isFocusOn==0" @click="teacherCollection(item,index)">
                <image src="@/static/community/jia@2x.png" />
                关注
              </view>
              <view class="yguanzhu" v-if="item.isFocusOn==1" @click="teacherCollection(item,index)">
                已关注
              </view>
            </view>
            <template v-if="item.newsType == 1">
              <template v-if="item.newImgVOList&&item.newImgVOList.length > 2">
                <view class="new-tit" @click="commonHandleTo(item)">
                  {{item.title && item.title.length > 18 ? item.title : item.title }}
                </view>
                <view class="list-cot" @click="commonHandleTo(item)">
                  <!-- <rich-text :nodes="item.content" v-if="item.content"></rich-text> -->
                  {{item.summary && item.summary.length > 18 ? item.summary : item.summary }}
                </view>
                <view class="list-cot-image" v-if="item.newImgVOList.length>0" @click="commonHandleTo(item)">
                  <image mode="aspectFill" v-for="(it,i) in item.newImgVOList" :key="i" :src="it" />
                </view>
              </template>
              <template v-else>
                <template v-if="item.newImgVOList&&item.newImgVOList.length == 0">
                  <view class="new-tit" @click="commonHandleTo(item)">
                    {{item.title && item.title.length > 18 ? item.title : item.title }}
                  </view>
                  <view class="list-cot" @click="commonHandleTo(item)">
                    <!-- <rich-text :nodes="item.content" v-if="item.content"></rich-text> -->
                    {{item.summary && item.summary.length > 18 ? item.summary : item.summary }}
                  </view>
                  <view class="list-cot-image" v-if="item.newImgVOList.length>0" @click="commonHandleTo(item)">
                    <image mode="aspectFill" v-for="(it,i) in item.newImgVOList" :key="i" :src="it" />
                  </view>
                </template>
                <view v-else class="colog">
                  <view class="lfet">
                    <view class="new-tit" @click="commonHandleTo(item)">
                      {{item.title && item.title.length > 26 ? item.title.slice(0,26) + '...' : item.title }}
                    </view>
                    <view class="list-cot" @click="commonHandleTo(item)">
                      <!-- <rich-text :nodes="item.content" v-if="item.content"></rich-text> -->
                      {{item.summary && item.summary.length > 30 ? item.summary.slice(0,30) + '...' : item.summary }}
                    </view>
                  </view>
                  <view class="list-cot-image" v-if="item.newsCoverImgVOList&&item.newsCoverImgVOList.length>0"
                    @click="commonHandleTo(item)">
                    <image mode="aspectFill" v-for="(it,i) in item.newsCoverImgVOList" :key="i" :src="it.coverImg" />
                  </view>
                </view>
              </template>
            </template>
            <template v-if="item.newsType == 2">
              <view class="new-tit" @click="commonHandleTo(item)">
                {{item.title && item.title.length > 18 ? item.title : item.title }}
              </view>
              <view class="list-cot" @click="commonHandleTo(item)">
                {{item.summary}}
              </view>
              <view class="list-cot-video">
                <video :poster="item.poster" d="myVideo" :src="item.videoUrl" controls></video>
              </view>
            </template>
            <view class="list-bom">
              <view class="list-lft" @click="onRetail">
                <image src="@/static/community/share@2x.png" mode="aspectFit" />
              </view>
              <view class="list-rigt">
                <view class="list-rigt">
                  <image src="@/static/community/pinglun@2x.png" mode="aspectFit" />
                  {{item.commentCount || 0}}
                </view>
                <view class="list-rigt" :class="{'couc':item.isCollection==1}" @click="collectionNewsGood(item,index)">
                  <image v-if="item.isCollection==1" src="@/static/community/shouc_on@2x.png" mode="aspectFit" />
                  <image v-else src="@/static/community/shouc@2x.png" mode="aspectFit" />
                  {{item.collectionCount || 0}}
                </view>
                <view :class="{'dianz':item.isGood==1}" class="list-rigt" @click="likeNewsGood(item,index)">
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
    <RetailPopup :showModal="showRetail" @close="showRetail = false"></RetailPopup>
  </view>
</template>

<script setup>
import { onPullDownRefresh, onLoad, onShow } from "@dcloudio/uni-app";
import { ref, watch } from "vue"
import { setTab } from "@/common/app-utils.js"
import RetailPopup from "@/components/RetailPopup.vue"
import { addTeacherCollection, myPushNewsListForPage, myCollectionNewsListForPage, apiNewsListForPage, addNewsGood, addNewsCollection, systemCategory } from '@/community/community.api'
const props = defineProps({
  myCollect: Boolean,
  myCollect: Boolean,
  myPost: Boolean,
  applyStatus: Number,
  showNav: Boolean,
  refresher: Boolean,// 下拉刷新
});
onPullDownRefresh(async () => {
  await getSearch()
  uni.stopPullDownRefresh()
})
onShow(() => {
  // getSearch()
})
const current = ref(0)
const items = ref([])
const activeColor = ref('#395AE1')
const categoryIds = ref([''])
const categoryList = ref([])
const communityList = ref([])
const triggered = ref(false)
const showMask = ref(false)
const noMore = ref(true)
const page = ref(1)
const showRetail = ref(false)
const loadingText = ref('— 没有更多了 —')
const params = ref({
  category: 3, //文章分类 1、答疑文章 2、广场文章 3、资讯文章
  pageSize: 10,
  oneCateId: '',
  searchParam: '',
  pageNo: 1
})

const getSearch = () => {
  noMore.value = false
  page.value = 1;
  communityList.value = [];
  showMask.value = false
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
  console.log(page.value, noMore.value,'底部加载更多')
  if (!noMore.value) {
    page.value = page.value  + 1;
    getCommunityList()
  }
}
const getCommunityList = async () => {
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
      if (item.newsType == 1) {
        item.newsCoverImgVOList.map((it) => {
          item.newImgVOList = it.coverImg && it.coverImg.split(',') || []
        })
      } else if (item.newsType == 2){
        item.newsCoverImgVOList.map((it) => {
          let lis = it.coverImg && it.coverImg.split(',') || []
          item.poster = lis.length>0 ? lis[0] : ''
        })
        item.videoUrl = item.content
      }
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
// 收藏
const collectionNewsGood = async (item, index) => {
  let operateStatus = item.isCollection == 1 ? 0 : 1
  const res = await addNewsCollection({ newsId: item.id, operateStatus });
  if (res.success) {
    communityList.value[index].isCollection = operateStatus
    if (operateStatus == 1) {
      uni.showToast({
        title: '收藏成功',
        duration: 2000
      });
      communityList.value[index].collectionCount = Number(communityList.value[index].collectionCount) + 1;
    } else {
      uni.showToast({
        title: '取消成功',
        duration: 2000
      });
      communityList.value[index].collectionCount = Number(communityList.value[index].collectionCount) - 1;
    }
  }
}
// 关注
const teacherCollection = async (item, index) => {
  let operateStatus = item.isFocusOn == 1 ? 0 : 1
  const res = await addTeacherCollection({ teacherId: item.authorId, operateStatus });
  if (res.success) {
    communityList.value[index].isFocusOn = operateStatus
    if (operateStatus == 1) {
      uni.showToast({
        title: '关注成功',
        duration: 2000
      });
    } else {
      uni.showToast({
        title: '取消成功',
        duration: 2000
      });
    }
  }

}
const onClickItem = (e) => {
  if (current.value != e.currentIndex) {
    current.value = e.currentIndex;
    params.value.oneCateId = categoryList.value[e.currentIndex].value
    getSearch()
  }
}
// 获取分类
const getSystemCategory = async () => {
  const res = await systemCategory({});
  let tempList = [
    {
      value: '',
      text: "全部"
    }
  ]
  const itemss = ['全部']
  res.result && res.result.length > 0 && res.result.map((item) => {
    tempList.push({
      value: item.id,
      text: item.name
    })
    itemss.push(item.name)
  });

  items.value = itemss
  categoryList.value = tempList;
}
// 门店品类改变
const changeCategory = (e) => {
  let value = e.detail.value
  if (value.length > 1) {
    let id = value.filter(i => i && i != '')
    params.value.oneCateId = id
    categoryIds.value = id
  }
  if (value.length === 0) {
    params.value.oneCateId = ['']
    categoryIds.value = ['']
  }
}
// 详情页面跳转
const commonHandleTo = (item) => {
  uni.navigateTo({
    url: `/community/newDetails?id=${item.id}`
  })
}
// 评论页面跳转
const handleTo = (item) => {
  uni.navigateTo({
    url: `/community/comDetails?id=${item.id}`
  })
}
// 页面跳转
const navigateTo = (url) => {
  uni.navigateTo({
    url
  })
}
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
  () => props.myPost,
  () => {
    if (props.myPost) {
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
if (props.showNav) {
  getSystemCategory()
  getSearch()
}
function onRetail(){
	showRetail.value = true
}
function retailClose(){
	showRetail.value = false
}
</script>
   
<style lang="scss" scoped>
.container {
  background: #fff;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $uni-bg-color;
  position: fixed;
  left: 0;
  right: 0;
  top: 200rpx;
  z-index: 12;
  padding: 10rpx 30rpx 0 0;
  height: 88rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  color: $u-tips-color;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
  border-bottom: 2rpx solid $u-form-item-border-color;

  .lefts {
    width: 5%;
    margin-left: 1%;
    display: flex;
    align-items: center;
  }

  .mdr {
    width: 32rpx;
    height: 32rpx;
    margin-top: 8rpx;
  }

  ::v-deep .segmented-control--text {
    display: flex;
    align-items: center;
    width: 94%;
    overflow-x: scroll !important;
  }

  ::v-deep .segmented-control__item {
    width: 24%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    flex: none;
  }

  ::v-deep .segmented-control__text {
    font-weight: normal !important;
    color: $u-tips-color !important;
    font-size: 24rpx;
  }

  ::v-deep .segmented-control__item--text {
    // color: $u-main-color!important;
    color: $u-type-primary !important;
    font-size: 28rpx;
  }
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

  .new-tit {
    font-size: 30rpx;
    font-family: PingFang-SC-Heavy, PingFang-SC;
    font-weight: 800;
    color: #303133;
    line-height: 44rpx;
    padding: 0 0 20rpx;
  }

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
        margin-top: 12rpx;
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

    .zhidingq {
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
        margin-right: 20rpx;
        margin-left: 18rpx;
      }
    }

    .guanzhu {
      color: $u-type-primary;
      border-radius: 8rpx;
      border: 2rpx solid $u-type-primary;
      font-size: 24rpx;
      padding: 4rpx 12rpx 6rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 4rpx;
      margin-top: 4rpx;

      image {
        width: 20rpx;
        height: 20rpx;
        margin-right: 8rpx;
      }

      >text {
        margin-bottom: 4rpx;
      }
    }

    .yguanzhu {
      color: $u-light-color;
      border-radius: 8rpx;
      border: 2rpx solid $u-light-color;
      font-size: 24rpx;
      padding: 4rpx 12rpx 6rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 4rpx;
      margin-top: 4rpx;
    }
  }

  .list-cot {
    max-height: 174rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: $u-main-color;
    line-height: 36rpx;
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
      height: 174rpx;
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

  .list-cot-video {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    overflow: hidden;
    width: 100%;
    height: 376rpx;

    image {
      width: 100%;
      height: 376rpx;
      border-radius: 8rpx;
    }

    video {
      width: 100%;
      height: 376rpx;
      border-radius: 8rpx;
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

  &:last-child {
    .list-bom {
      border-bottom: none;
    }
  }
}

.store-list {
  .list-item:nth-last-child(2) {
    .list-bom {
      border: none;
    }
  }
}

.tank {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 99;
  height: 100vh;
  overflow: hidden;

  .mask {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    z-index: 22;
    left: 0;
    right: 0;
    top: 282rpx;
    background: rgba($color: #000000, $alpha: .6);
  }

  .closr {
    width: 28rpx;
    height: 28rpx;
    padding-left: 6rpx;
    padding-bottom: 16rpx;
    color: #fff;
    background: rgba($color: #000000, $alpha: .7);
    position: absolute;
    right: 0;
    top: 12rpx;
    text-align: center;
    border-bottom-left-radius: 100%;

    >text {
      position: absolute;
      right: 5rpx;
      font-size: 20rpx;
      top: -6rpx;
    }
  }

  .cont {
    position: absolute;
    left: 0;
    right: 0;
    top: 274rpx;
    background: #fff;
    z-index: 33;
    padding: 40rpx;
    border-radius: 0px 0px 12rpx 12rpx;
  }

  .sure {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 72rpx;
    background: #395AE1;
    border-radius: 8rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    margin-top: 20rpx;
  }

  ::v-deep .uni-data-checklist .checklist-group .checklist-box {
    min-width: 80rpx !important;
    height: 62upx !important;
    background: #f4f4f4;
    border-radius: 8rpx !important;
    border: none !important;
    font-size: 26rpx;
    box-sizing: border-box;
  }

  ::v-deep .uni-data-checklist .checklist-group .checklist-box .checklist-content {
    justify-content: center;
    font-weight: 500;
  }

  ::v-deep .uni-data-checklist .checklist-group .checklist-box .checklist-content .checklist-text {
    // font-weight: 600;
    color: #000000 !important;
  }

  ::v-deep .uni-stat__select {
    padding: 0 !important;
  }

  ::v-deep .uni-data-checklist .checklist-group .is-checked .checklist-content .checklist-text {
    font-weight: 500;
    color: #fff !important;
  }
}

.dianz {
  color: #EE5142 !important;
}

.couc {
  color: #F29E3F !important;
}
</style>
