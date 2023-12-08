<!--
 * @Description: 支付成功
 * @Author: xmj
 * @Date: 2022-09-08 16:24:44
-->
<template>
  <view>
    <view class="card">
      <view class="title">支付失败</view>
      <view class="description"
        >失败订单：<text>2020151321561321056163</text></view
      >
      <!-- <view class="flex">
        <view class="w-[80rpx]">请在</view>
        <view class="w-[290rpx] pt-1">
          <tm-countdown color="red" ref="cu" :time="30 * 60 * 60 * 1000" format="DD天HH小时MM分SS秒" :autoStart="true">
          </tm-countdown>
        </view>

        <view>内完成付款,超时/</view>

      </view>
      <view>过时间未付款的，订单系统将自动取消</view> -->
    </view>
    <view class="action">
      <button class="text-white bg-red-500" @click="pay">立即支付</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
// import tmCountdown from "@/tmui/components/tm-countdown/tm-countdown.vue";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

// 稍后支付
// const navOrder = () => {
//   uni.navigateTo({
//     url: "/pagesUser/order/index"
//   });
// };

const orderNo = ref("");
const price = ref("");
// 个人版支付
const pay = () => {
  uni.navigateTo({
    url: `/pages/userPay/index?orderNo=${orderNo.value}&price=${price.value}`,
  });
};

onLoad((options: any) => {
  orderNo.value = options.orderNo;
  price.value = options.price;
});
</script>

<style lang="scss" scoped>
page {
  color: #333;
  font-size: 28rpx;
}

.card {
  margin-top: 40rpx;
  background: #fff;
  padding: 24rpx 32rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.12);

  .title {
    font-size: 32rpx;
    text-align: center;
    margin-bottom: 10rpx;
  }

  .description {
    line-height: 2;

    text {
      color: #e94e4b;
    }
  }
}

.action {
  padding: 48rpx 32rpx;

  button {
    border-radius: 0;
    font-size: 28rpx;
    line-height: 88rpx;

    + button {
      margin-top: 40rpx;
    }

    &::after {
      border-radius: 0;
    }
  }
}
</style>
