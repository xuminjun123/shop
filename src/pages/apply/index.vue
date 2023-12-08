<template>
  <view class="apply-wrapper">
    <view style="padding: 10rpx 60rpx">
      <cover-image :src="logo" />
    </view>
    <view class="profile-text-box">
      <text class="profile-text">
        山塘雕花楼美术馆是一家致力于文化艺术推广的民营美术馆。未来它将秉承创新的理念，推动展览、典藏、学术、公共教育等，力图发掘有创造性的艺术家，通过多样化的形式为大众传播优秀的艺术作品与生活方式
      </text>
    </view>
    <view class="flex mt-5">
      <button class="px-5 btn" @click="activeApply">活动预约</button>
    </view>
  </view>
</template>
<script setup lang="ts">
import logo from "@/assets/logo.jpeg";

// 活动预约
const activeApply = () => {
  uni.navigateTo({
    url: "/pages/applyActive/index",
  });
};
</script>
<style lang="scss">
.apply-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: white;

  .btn {
    color: #095b2b;
    line-height: 200rpx;
    border: 4rpx solid #095b2b;
  }

  .profile-text-box {
    padding: 10rpx 30rpx;
  }

  .profile-text {
    text-indent: 20rpx;
    font-size: 24rpx;
  }
}
</style>
