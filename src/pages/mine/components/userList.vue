<!--
 * @Description:  我的订单
 * @Author: xmj
 * @Date:
-->
<template>
  <view class="flow-root" style="min-height: 100%; background-color: #f6f8fa">
    <!-- <view class="my-menus">
      <view class="justify-between my-menu-item" @click="toPage(item.path)" v-for="(item, index) in menus" :key="index">
        <view class="flex items-center justify-center align-center">
          <view class="w-[50rpx] mx-2">
            <img :src="item.icon" mode="widthFix" />
          </view>
          <view class="pb-1 my-menu-title">{{ item.label }}</view>
        </view>
        <i class="my-menu-right-icon es-icon es-icon-xiangyou"></i>
      </view>
    </view> -->
  </view>
</template>
<script lang="ts" setup>
import { onShow } from "@dcloudio/uni-app";
import config from "@/config";
const menus = [
  // {
  //   label: "隐私协议",
  //   icon: `${config.imgUrl}/mine/list3.png`,
  //   path: "/pagesSub/agreement/index",
  // },
  // {
  //   label: "使用说明",
  //   icon: `${config.imgUrl}/mine/list4.png`,
  //   path: "/pagesSub/userManual/index",
  // },
];
function toPage(path: string) {
  uni.navigateTo({
    url: path,
  });
}
onShow(() => {});
</script>
<style lang="scss" scoped>
.my-menus {
  width: 690rpx;
  margin-left: 30rpx;
  min-height: 100rpx;
  background-color: #ffffff;
  border-radius: 20rpx;

  .my-menu-item {
    display: flex;
    align-items: center;
    height: 100rpx;

    .my-menu-icon {
      font-size: 50rpx;
      margin-left: 30rpx;
      margin-right: 30rpx;
      color: $primary-color;
    }

    .my-menu-right-icon {
      font-size: 40rpx;
      margin-left: 30rpx;
      margin-right: 30rpx;
    }
  }
}
</style>
