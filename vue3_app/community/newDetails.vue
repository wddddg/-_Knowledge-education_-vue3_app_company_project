<!-- 资讯详情页 -->
<template>
  <view class="container" :style="{ '--theme-color': themeColor }">
    <u-navbar :is-back="true" title="详情页"></u-navbar>
    <view class="community">
      <view class="new-tit uni-padding-wrap">
        {{ detailsInfo.title }}
      </view>
      <view class="content">
        <view class="list-item">
          <view class="list-top uni-padding-wrap">
            <view class="ima" style="align-items: flex-start;">
              <image mode="aspectFit" :class="{ 'vip1': detailsInfo.isMember == 1 }"
                @click="goTeacherDetail(detailsInfo)" src="@/static/user/user-avatar.png"
                v-if="!detailsInfo.authorImg" />
              <image mode="aspectFit" :class="{ 'vip1': detailsInfo.isMember == 1 }"
                @click="goTeacherDetail(detailsInfo)" :src="detailsInfo.authorImg" v-else />
              <image class="vip" v-if="detailsInfo.isMember == 1" src="@/static/community/VIP@2x.png" />
              <view>
                {{ detailsInfo.authorName }}
                <view class="date">
                  {{ detailsInfo.createTime }}
                </view>
              </view>
            </view>
            <view class="guanzhu" v-if="detailsInfo.isFocusOn == 0" @click="teacherCollection(detailsInfo)">
              <image src="@/static/community/jia@2x.png" />
              关注
            </view>
            <view class="yguanzhu" v-if="detailsInfo.isFocusOn == 1" @click="teacherCollection(detailsInfo)">
              已关注
            </view>
          </view>
          <template v-if="detailsInfo.newsType == 1">
            <view class="list-cot uni-padding-wrap">
              <rich-text :nodes="detailsInfo.content" v-if="detailsInfo.content"></rich-text>
              <template v-else>{{ detailsInfo.summary }}</template>
            </view>
            <view class="list-cot-image uni-padding-wrap"
              v-if="detailsInfo.newImgVOList && detailsInfo.newImgVOList.length > 0">
              <image @click="previewImage(it, detailsInfo.newImgVOList)" v-for="(it, i) in detailsInfo.newImgVOList"
                :key="i" :src="it" mode="widthFix" />
            </view>
          </template>
          <template v-if="detailsInfo.newsType == 2">
            <view class="list-cot uni-padding-wrap">
              <rich-text :nodes="detailsInfo.content" v-if="detailsInfo.content"></rich-text>
              <template v-else>{{ detailsInfo.summary }}</template>
            </view>
            <view class="list-cot-video uni-padding-wrap">
              <video  id="myVideo" :poster="detailsInfo.poster" d="myVideo" :src="detailsInfo.videoUrl" controls ></video>
            </view>
          </template>
          <view class="list-bom uni-padding-wrap">
            <view class="list-l">
              <view class="list-lft" @click="onRetail">
                <image src="@/static/community/share@2x.png" mode="aspectFit" />
              </view>
              <view class="list-rigt">
                <image src="@/static/community/eye@2x.png" mode="aspectFit" />
                {{ detailsInfo.lookCount || 0 }}次阅读
              </view>
            </view>
            <view class="list-rigt">
              <view class="list-rigt" @click="collectionNewsGood(detailsInfo)"
                :class="{ 'couc': detailsInfo.isCollection == 1 }">
                <image v-if="detailsInfo.isCollection == 1" src="@/static/community/shouc_on@2x.png" mode="aspectFit" />
                <image v-else src="@/static/community/shouc@2x.png" mode="aspectFit" />
                {{ detailsInfo.collectionCount || 0 }}
              </view>
              <view class="list-rigt" @click="likeNewsGood(detailsInfo)" :class="{ 'dianz': detailsInfo.isGood == 1 }">
                <image v-if="detailsInfo.isGood == 1" src="@/static/community/dianz_on@2x.png" mode="aspectFit" />
                <image v-else src="@/static/community/dianz@2x.png" mode="aspectFit" />
                {{ detailsInfo.likeCount || 0 }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <CommentList v-if="hackReset" :hackReset="hackReset" :commentCount="detailsInfo.commentCount" :newId="newId" />
    </view>
    <Release :newsId="newId" />
    <RetailPopup :showModal="showRetail" @close="retailClose"></RetailPopup>
  </view>
</template>

<script setup>
import { onLoad, onShow, onHide } from "@dcloudio/uni-app";
import { ref, getCurrentInstance } from "vue"
import { setTab } from "@/common/app-utils.js"
import Release from '@/community/components/Release.vue'
import CommentList from '@/community/components/CommentList.vue'
import RetailPopup from "@/components/RetailPopup.vue"
import { addTeacherCollection, getNewsDetails, addNewsGood, addNewsCollection, } from '@/community/community.api'
const themeColor = ref(uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe')
onLoad((option) => {
  if (option.id) {
    const id = option.id
    newId.value = id
    // getDetails(id)
  }
})

const detailsInfo = ref({ newsCoverImgVOList: [] })
const communityList = ref([{}])
const triggered = ref(false)
const noMore = ref(false)
const hackReset = ref(false)
const showRetail = ref(false)
const page = ref(1)
const newId = ref('')
const total = ref(123)
const loadingText = ref('— 没有更多了 —')
const params = ref({})
onShow(() => {
  hackReset.value = true
  uni.showLoading({ title: "加载中" });
  getDetails(newId.value)
})
onHide(() => {
  hackReset.value = false
})
//社区文章-查询详情 
const getDetails = async (newId) => {
  const res = await getNewsDetails({ newsId: newId || newId.value });
  detailsInfo.value = res.result
  uni.hideLoading()
  res.result.newsCoverImgVOList.map((it) => {
    if (detailsInfo.value.newsType == 1) {
      detailsInfo.value.newImgVOList = it.coverImg && it.coverImg.split(',') || []
    } else if (detailsInfo.value.newsType == 2) {
      let lis = detailsInfo.value.newImgVOList = it.coverImg && it.coverImg.split(',') || []
      detailsInfo.value.poster = lis.length > 0 ? lis[0] : ''
      detailsInfo.value.videoUrl = detailsInfo.value.content
    }

  })
}
// 点赞
const likeNewsGood = async (item) => {
  let operateStatus = item.isGood == 1 ? 0 : 1
  const res = await addNewsGood({ newsId: item.id, operateStatus });
  if (res.success) {
    detailsInfo.value.isGood = operateStatus
    if (operateStatus == 1) {
      uni.showToast({
        title: '点赞成功',
        duration: 2000
      });
      detailsInfo.value.likeCount = Number(detailsInfo.value.likeCount) + 1;
    } else {
      uni.showToast({
        title: '取消成功',
        duration: 2000
      });
      detailsInfo.value.likeCount = Number(detailsInfo.value.likeCount) - 1;
    }
  }
}
// 收藏
const collectionNewsGood = async (item) => {
  let operateStatus = item.isCollection == 1 ? 0 : 1
  const res = await addNewsCollection({ newsId: item.id, operateStatus });
  if (res.success) {
    detailsInfo.value.isCollection = operateStatus
    if (operateStatus == 1) {
      uni.showToast({
        title: '收藏成功',
        duration: 2000
      });
      detailsInfo.value.collectionCount = Number(detailsInfo.value.collectionCount) + 1;
    } else {
      uni.showToast({
        title: '取消成功',
        duration: 2000
      });
      detailsInfo.value.collectionCount = Number(detailsInfo.value.collectionCount) - 1;
    }
  }
}
// 关注
const teacherCollection = async (item) => {
  let operateStatus = item.isFocusOn == 1 ? 0 : 1
  const res = await addTeacherCollection({ teacherId: item.authorId, operateStatus });
  if (res.success) {
    detailsInfo.value.isFocusOn = operateStatus
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
const getSearch = () => {
  noMore.value = false
  page.value = 1;
  communityList.value = [];
  getCommunityList();
}
function goTeacherDetail(e) {
  uni.navigateTo({
    url: '/course/teacher/TeacherDetail' + '?id=' + e.teacherId
  })
}
const previewImage = (urls, itemList) => {
  // 预览图片
  uni.previewImage({
    current: urls,
    urls: itemList
  })
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
  const paramsData = {
    ...params.value,
    categoryId: 1
  }
  // const res = await getList({ ...paramsData, offset: page.value });
  // triggered.value = false;
  // if (res.code == 1) {
  //   if (res.data.records.length == 0 || res.data.records == null) {
  //     noMore.value = true
  //     loadingText.value = '— 没有更多了 —'
  //     return false;
  //   }
  //   loadingText.value = res.data.records.length < 10 || res.data.records.length == 0 ? '— 没有更多了 —' : "-- 正在加载 --";
  //   noMore.value = false
  //   const newlist = res.data.records;
  //   if (page == 1) {
  //     communityList.value = newlist
  //   } else {
  //     communityList.value = storeList.value.concat(newlist);
  //   }

  // }
  uni.hideLoading();
}
function onRetail() {
  showRetail.value = true
}
function retailClose() {
  showRetail.value = false
}
</script>
  
<style lang="scss" scoped>
::v-deep uni-page-body {
  background: $uni-bg-color !important;
}

.new-tit {
  font-size: 32rpx;
  font-family: PingFang-SC-Heavy, PingFang-SC;
  font-weight: 800;
  color: #303133;
  line-height: 44rpx;
  padding-top: 30rpx;
}

// .container {
// 	background: $u-global-color;
// }

.scroll-Y {
  height: 80vh;
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
  padding-bottom: 80rpx;

  .content {
    padding-top: 40rpx;
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
          flex-shrink: 0;
        }

        .vip1 {
          border: 2rpx solid #F9C58D;
        }

        .vip {
          position: absolute;
          bottom: 6rpx;
          left: 30rpx;
          width: 30rpx;
          height: 32rpx;
        }
      }

      .guanzhu {
        color: $u-type-primary;
        border-radius: 8rpx;
        border: 2rpx solid $u-type-primary;
        font-size: 24rpx;
        padding: 2rpx 12rpx 4rpx;
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

      .aut {
        display: flex;
        align-items: center;

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
      font-size: 28rpx;
      font-weight: 400;
      color: $u-main-color;
      line-height: 48rpx;
      margin-bottom: 20rpx;
      overflow: hidden;
    }

    .list-bom {
      border-bottom: 40rpx solid #f6f6f6;
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
        margin-left: 30rpx;
        font-size: 24rpx;

        image {
          width: 32rpx;
          height: 32rpx;
          margin-right: 8rpx;
        }
      }
    }

    .list-l {
      display: flex;
      align-items: center;
    }

    .list-lft {
      font-size: 24rpx;
      display: flex;
      align-items: center;
      color: $u-tips-color;

      image {
        width: 24rpx;
        height: 24rpx;
        margin-right: 8rpx;
      }
    }

    .list-cot-image {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      overflow: hidden;

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
        font-size: 24rpx;
        font-weight: 400;
        color: $u-main-color;
        line-height: 36rpx;
      }
    }

    .list-cot-pinl {
      margin-left: 76rpx;
      margin-bottom: 30rpx;

      .list-cot {
        max-height: 240rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: $u-main-color;
        line-height: 48rpx;
        text-align: justify;
        overflow: hidden;
        margin-bottom: 14rpx;
      }
    }

    .bot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;

      .date {
        font-weight: 400;
        color: $u-tips-color;
        margin-top: 0;
        display: flex;
        align-items: center;
      }

      .list-rigt {
        display: flex;
        align-items: center;
        margin-left: 30rpx;

        .list-rigt {
          margin: 0;
        }

        image {
          width: 32rpx;
          height: 32rpx;
          margin-right: 8rpx;
        }
      }
    }

    .pingl {
      padding: 24rpx;
      background: #F6F6F6;
      border-radius: 12rpx;
      margin-left: 76rpx;

      .p-list {
        .list-top {
          margin-bottom: 20rpx;

          .ima {
            align-items: flex-start;

            .aut {
              margin: 0 0 10rpx;
            }

            image {
              width: 40rpx;
              height: 40rpx;
              border: 2rpx solid #DCDFE6;
              border-radius: $uni-border-radius-circle;
              margin-right: 20rpx;
              flex-shrink: 0;
            }
          }

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
        justify-content: flex-start;
      }
    }
  }

  .huifu {
    color: $u-type-primary;
    font-size: 24rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 14rpx;
  }

  .list-rigt1 {
    font-size: 24rpx;
    display: flex;
    align-items: center;
    color: $u-tips-color;
    margin: 0 40rpx 20rpx;

    image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 10rpx;
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
