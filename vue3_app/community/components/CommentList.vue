<!-- 评论详情页 -->
<template>
  <view class="comment">
    <view class="list-rigt1">
      <image src="@/static/community/pinglun@2x.png" mode="aspectFit" />
      {{ commentCount || 0 }}条评论
    </view>
    <block v-if="communityList && communityList.length > 0">
      <view class="list-item uni-padding-wrap" v-for="(item, index) in communityList" :key="index">
        <view class="list-top">
          <view class="ima">
            <image mode="aspectFit" src="@/static/user/user-avatar.png" v-if="!item.headImg" />
            <image mode="aspectFit" :src="item.headImg" v-else />
            <image class="vip" v-if="item.isMember == 1" src="@/static/community/VIP@2x.png" />
            <view>
              <view class="aut">
                {{ item.nickName || item.createBy }}
              </view>
            </view>
          </view>
        </view>
        <view class="list-cot-pinl">
          <view class="list-cot">
            {{ item.content }}
          </view>
          <view class="bot">
            <view class="date">
              {{ item.createTime }}
              <view class="huifu" @click="commonHandleTo(item)">
                回复
              </view>
            </view>
            <view class="list-rigt dianz" @click="likeNewsGood(item, index)">
              <image src="@/static/community/dianz_on@2x.png" mode="aspectFit" />
              {{ item.likeCount || 0 }}
            </view>
          </view>
        </view>
        <view class="pingl" v-if="item.childCount && item.childCount != 0">
          <view class="p-list">
            <view class="list-top" v-for="item in 2" :key="item">
              <view class="ima">
                <image src="@/static/user/user-avatar.png" mode="aspectFit" v-if="!item.headImg" />
                <image :src="item.headImg" mode="aspectFit" v-else />
                <view>
                  <view class="aut">
                    {{ item.nickName || item.createBy }}
                  </view>
                  <view class="p-cot">
                    {{ item.content }}
                  </view>
                  <view class="bot">
                    <view class="date">
                      {{ item.createTime }}
                      <view class="p-cot">
                        回复
                      </view>
                    </view>
                    <view class="list-rigt dianz" @click="likeNewsGood(item, index)">
                      <image src="@/static/community/dianz_on@2x.png" mode="aspectFit" />
                      <!-- <image v-else src="@/static/community/dianz@2x.png" mode="aspectFit" /> -->
                      {{ item.likeCount || 0 }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="more" @click="item.isExpand = !item.isExpand">
            {{ item.isExpand ? '收起回复>>' : `查看${item.childCount || 0}条回复>>` }}
          </view>
        </view>
      </view>
    </block>
    <view v-if="communityList && communityList.length == 0" class="no-data">
      <image src="@/static/community/nodata.png" mode="aspectFit" />
      <view>
        暂无评论！
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { addNewsCommentGood, apiNewsCommentListForPage, findSubCommentListForPage } from '@/community/community.api'
const communityList = ref([])
const pageNo = ref(1)
onShow(() => {
  // init()
})
const props = defineProps({
  newId: String,
  commentCount: String,
  isComment: Boolean,
  hackReset: Boolean
});
const init = async () => {
  // props.isComment ? await findSubCommentListForPage({ parentCommentId: props.newId, pageNo: pageNo.value, pageSize: 10 }) : 
  const res = await apiNewsCommentListForPage({ newsId: props.newId, pageNo: pageNo.value, pageSize: 10 });
  res.result && res.result.records.map((it) => {
    it.isExpand = false
    return it
  })
  communityList.value = res.result && res.result.records || []
}
// 页面跳转
const commonHandleTo = async (item) => {
  // 一级评论id（若为第二级则传上一级，id一级不填写）
  uni.navigateTo({
    url: `/community/comment?parentCommentId=${item.parentCommentId}`
  })
}
const likeNewsGood = async (item, index) => {
  let operateStatus = item.isGood == 1 ? 0 : 1
  const res = await addNewsCommentGood({ newsId: item.newsId, operateStatus,commentId:item.id});
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
// watch(
//   () => props.newId,
//   () => {
//     if (props.newId) {
//       init()
//     }
//   },
//   { immediate: true }
// );
watch(
  () => props.hackReset,
  () => {
    if (props.hackReset && props.newId) {
      init()
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
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

.content {
  padding-top: 40rpx;
}

.list-item {
  margin-bottom: 26rpx;

  .list-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 8rpx;

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

      >image {
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
      font-weight: normal;
      font-size: 24rpx;

      .dianz {
        color: #EE5142 !important;
      }

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
      font-weight: normal;
      font-size: 24rpx;

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

          >image {
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

.dianz {
  color: #EE5142 !important;
}

.couc {
  color: #F29E3F !important;
}
</style>
