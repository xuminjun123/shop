<!--
 * @Description: 确认支付(作废)
 * @Author: xmj
 * @Date: 2022-09-08 16:18:39
-->
<!-- <template>
  <view>
    <view class="card">
      <view class="title">应付金额 ：<text>￥1200.00</text></view>
      <view class="description">请尽快完成支付</view>
      <view class="description">
        请在<text>09:59:05</text>内完成付款，超时=过时间未付款的订单系统将自动取消
      </view>
    </view>
    <view class="card balance-payment">
      <uni-icons type="wallet-filled" size="52rpx"></uni-icons>
      <text style="margin-left: 20rpx">余额支付</text>
    </view>
    <view class="action">
      <button @click="navPaySuccess" class="text-white bg-red-500">确认支付</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
const navPaySuccess = () => {
  uni.navigateTo({
    url: "/pages/paySuccess/index"
  });
};
</script>

<style lang="scss" scoped>
page {
  font-size: 28rpx;
}

.card {
  margin-top: 40rpx;
  background: #fff;
  padding: 24rpx 32rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.12);

  .title {
    font-size: 24rpx;
    text-align: center;
    margin-bottom: 10rpx;

    text {
      font-size: 32rpx;
      color: #E94E4B;
    }
  }

  .description {
    line-height: 2;

    text {
      color: #E94E4B;
      margin: 0 10rpx;
    }
  }

  &.balance-payment {
    padding: 20rpx 32rpx;
    display: flex;
    align-items: center;
    line-height: 1;
  }
}

.action {
  padding: 48rpx 32rpx;

  button {
    border-radius: 0;
    font-size: 28rpx;
    line-height: 88rpx;

    &::after {
      border-radius: 0;
    }
  }
}
</style> -->
