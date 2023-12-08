<!--
 * @Description:  我的订单
 * @Author: xmj
 * @Date:
-->
<template>
  <view class="wrapper">
    <view class="container w-11/12 py-1 mx-auto bg-white">
      <view class="my-menus">
        <view class="justify-between my-menu-item">
          <view class="flex items-center justify-center align-center">
            <view class="pb-1 my-menu-title">我的订单</view>
          </view>
          <view class="flex" @click="navOrder(0)">
            <text class="pr-3 text-md"> 查看所有订单 </text>
            <i class="my-menu-right-icon es-icon es-icon-xiangyou"></i>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
function toPage(path: string) {
  uni.navigateTo({
    url: path,
  });
}
//  跳转到我的订单页面
const navOrder = (num: number): void => {
  toPage(`/pagesSub/order/index?payload=${num}`);
}
</script>
<style lang="scss" scoped>
.container {
  border-radius: 10rpx;
  overflow: hidden;
}

.my-menus {
  width: 96%;
  margin: 0 auto;
  background-color: #ffffff;

  .my-menu-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;

    .my-menu-icon {
      font-size: 30rpx;
      color: $primary-color;
    }

    .my-menu-right-icon {
      padding-top: 8rpx;
      font-size: 30rpx;
    }
  }
}
</style>
