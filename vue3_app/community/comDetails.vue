<!-- 评论详情页 -->
<template>
  <view class="container" :style="{'--theme-color':themeColor}">
    <u-navbar :is-back="true" title="评论详情"></u-navbar>
    <view class="community">
      <view class="content">
        <view class="list-item">
          <view class="list-top uni-padding-wrap">
            <view class="ima" style="align-items: flex-start;">
              <image src="@/static/user/user-avatar.png" v-if="!detailsInfo.headImg" />
              <image :src="detailsInfo.headImg" v-else />
              <view>
                {{detailsInfo.createBy}}
                <view class="date">
                  {{detailsInfo.createTime}}
                </view>
              </view>
            </view>
            <view class="list-lft">
              <image src="@/static/community/eye@2x.png" mode="aspectFit" />
              {{detailsInfo.lookCount || 0}}次阅读
            </view>
          </view>
          <view class="list-cot uni-padding-wrap">
            {{detailsInfo.content}}
          </view>
          <view class="list-cot-image uni-padding-wrap">
            <image src="@/static/community/eye@2x.png" mode="aspectFit" />
            <image src="@/static/community/eye@2x.png" mode="aspectFit" />
            <image src="@/static/community/eye@2x.png" mode="aspectFit" />
          </view>
          <view class="list-bom uni-padding-wrap">
            <view class="list-lft">
              <image src="@/static/community/share@2x.png" mode="aspectFit" />
            </view>
            <view class="list-rigt">
              <view class="list-rigt">
                <image src="@/static/community/shouc@2x.png" mode="aspectFit" />
                5555
              </view>
              <view class="list-rigt">
                <image src="@/static/community/dianz@2x.png" mode="aspectFit" />
                {{detailsInfo.likeCount || 0}}
              </view>
            </view>
          </view>
        </view>
      </view>
      <CommentList :commentCount="detailsInfo.commentCount" :newId="commentId" :isComment="true"/>
    </view>
    <Release />
  </view>
</template>

<script setup>
  import { onLoad, onShow } from "@dcloudio/uni-app";
  import { ref, getCurrentInstance } from "vue"
  import { setTab } from "@/common/app-utils.js"
  import Release from '@/community/components/Release.vue'
  import CommentList from '@/community/components/CommentList.vue'
  import { getCommentDetails,addNewsCommentGood } from '@/community/community.api'
  const themeColor = ref(uni.getStorageSync('themeColor') ? uni.getStorageSync('themeColor') : '#97fffe')
  onLoad((option) => {
    if (option.id) {
      const id = option.id
      commentId.value = id
      getDetails(id)
    }
  })
  const detailsInfo = ref({ newsCoverImgVOList: [] })
  const communityList = ref([{}])
  const triggered = ref(false)
  const noMore = ref(false)
  const page = ref(1)
  const commentId = ref('')
  const total = ref(123)
  const loadingText = ref('— 没有更多了 —')
  const params = ref({})
  
  //-查询详情 
  const getDetails = async (commentId) => {
    const res = await getCommentDetails({ commentId: commentId || commentId.value });
    detailsInfo.value = res.result
  }
  // 点赞
  const likeNewsGood = async (item) => {
    let operateStatus = item.isGood == 1 ? 0 : 1
    const res = await addNewsCommentGood({ commentId: item.id, operateStatus });
    detailsInfo.value.isGood = operateStatus
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
  </script>
  
<style lang="scss" scoped>
::v-deep uni-page-body {
  background: $uni-bg-color !important;
}

.popup-conten {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: $uni-bg-color;
  padding: 100rpx 60rpx 140rpx;

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

// .container {
// 	background: $u-global-color;
// }

.scroll-Y {
  height: 80vh;
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
  }

  .fan {
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #395AE1;
    margin-left: 14rpx;
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
        align-items: center;

        .date {
          font-size: 24rpx;
          font-weight: 400;
          color: $u-tips-color;
          margin-top: 14rpx;
        }

        image {
          width: 56rpx;
          height: 56rpx;
          border: 2rpx solid #F9C58D;
          border-radius: $uni-border-radius-circle;
          margin-right: 20rpx;
          flex-shrink: 0;
        }

        .bor {
          border: 2rpx solid #DCDFE6;
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
      margin-right: 8rpx;
    }
  }

}
</style>
