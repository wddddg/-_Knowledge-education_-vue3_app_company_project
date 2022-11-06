<template>
    <view class="community MyPersonal">
        <view class="uni-padding-wrap f-tops">
            <uni-segmented-control :current="current" :values="items" :style-type="'button'" @clickItem="onClickItem" />
        </view>
        <view class="uni-padding-wrap content">
            <view v-if="current === 0">
                <Public :applyStatus="applyStatus" :myPost="true" />
            </view>
            <view v-if="current === 1">
                <Question :applyStatus="applyStatus" :myPost="true" />
            </view>
        </view>
    </view>
</template>
<script setup>
import Public from '@/community/components/Public.vue' // 广场
import Question from '@/community/components/Question.vue' //答疑
import { ref, watch} from "vue"
const props = defineProps({
  status: Number,
});

const current = ref(0)
const items = ref(['广场', '答疑'])
const applyStatus = ref(1)

const onClickItem = (e) => {
	if (current.value != e.currentIndex) {
		current.value = e.currentIndex;
	}
}
const init  = ()=>{
    current.value = 0 
    applyStatus.value = props.status == 0 ? 1 : props.status == 1 ? 2 : 3
}
watch(
  () => props.status,
  () => {
    init()
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.container {
    background: #fff;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.community {
    padding-top: 90rpx;
    padding-bottom: 26rpx;

    .f-tops {
        position: fixed;
        z-index: 99;
        left: 0;
        right: 0;
        padding: 0 30rpx 30rpx;
        margin-top: 40rpx;
        background: #fff;
    }

    .content {
        margin-top: 40rpx;
        padding-top: 110rpx;
        overflow-y: scroll;
        height: 82vh;
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
}


</style>
