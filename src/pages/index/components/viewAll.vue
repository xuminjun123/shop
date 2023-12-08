<!--
 * @Description: 查看全部
 * @Author: xmj
 * @Date: 2022-09-02 17:10:26
-->
<template>
    <view class="flex items-center justify-between w-11/12 mx-auto">
        <view class="flex ">
            <view class="font-bold"> {{ title }} </view>
            <view class="pt-1 pl-2 text-sm">
                <text class="text-SUIT"> {{ subTitle }} </text>
                <text class="text-SUIT"> > </text>
            </view>
        </view>
        <view>
            <button @click="viewAll" class="viewAllBtn"> 查看全部 </button>
        </view>
    </view>
</template>
<script lang="ts" setup>

defineProps({
    title: {
        type: String,
        default: "",
    },
    subTitle: {
        type: String,
        default: "",
    },
});
const viewAll = () => {
    uni.switchTab({
        url: "/pages/cate/index",
    });
}
</script>
<style lang="scss" scoped>
.viewAllBtn {
    width: 142rpx;
    height: 40rpx;
    background: #3C3C3B;
    border-radius: 20rpx;
    color: #fff;
    font-size: 20rpx;
    font-weight: bold;
    text-align: center;
    line-height: 40rpx;
}

.text-SUIT {
    font-size: 18rpx;
}
</style>