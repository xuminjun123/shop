<!--
 * @Description: 支付成功
 * @Author: xmj
 * @Date: 2022-09-08 16:30:40
-->
<template>
  <view>
    <view class="flex-col card flex-center">
      <img :src="paySuccess" class="paySuccess" />
      <view class="py-2"> 支付成功 </view>
    </view>
    <view class="action">
      <button @click="back">返回首页</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import paySuccess from '@/static/paySuccess.png';
const back = () => {
  uni.switchTab({
    url: '/pages/index/index'
  });
};

</script>

<style lang="scss" scoped>
page {
  font-size: 28rpx;
}

.paySuccess {
  width: 80rpx;
  height: 80rpx;
}

.card {
  margin-top: 40rpx;
  background: #fff;
  padding: 24rpx 32rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.12);
}

.action {
  padding: 48rpx 32rpx;

  button {
    border-radius: 0;
    font-size: 28rpx;
    line-height: 88rpx;

    +button {
      margin-top: 40rpx;
    }

    &::after {
      border-radius: 0;
    }
  }
}
</style>
