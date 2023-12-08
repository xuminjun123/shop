<!--
 * @Description: 个人中心
 * @Author: xmj
 * @Date: 2022-09-02 10:32:57
-->
<template>
  <view class="wrapper">
    <view class="w-full pb-3 mine-header" style="background: #095b2b">
      <page-header @login="login"></page-header>
    </view>

    <view class="w-full mt-3 bor">
      <user-limit></user-limit>
    </view>

    <view class="w-11/12 mx-auto mt-3 cell all">
      <view>
        <tm-cell
          url="/pages/order/index"
          :round="3"
          :margin="[0, 8]"
          _style="border: 1rpx solid #095b2b"
          :titleFontSize="30"
          title="所有订单"
        >
        </tm-cell>
      </view>
    </view>
    <view class="w-11/12 mx-auto my-2 cell">
      <view>
        <tm-cell
          url="/pages/address/index"
          _style="border: 1rpx solid #095b2b"
          :round="3"
          :margin="[0, 8]"
          :titleFontSize="30"
          title="收货地址"
        >
        </tm-cell>
      </view>
    </view>

    <view class="w-11/12 mx-auto my-2 cell">
      <view>
        <tm-cell
          url="/pages/myApply/index"
          _style="border: 1rpx solid #095b2b"
          :round="3"
          :margin="[0, 8]"
          :titleFontSize="30"
          title="我的预约"
        >
        </tm-cell>
      </view>
    </view>

    <!-- <view class="w-11/12 mx-auto my-2 cell">
      <view>
        <tm-cell
          url="/pages/logistics/index"
          _style="border: 1rpx solid #095b2b"
          :round="3"
          :margin="[0, 8]"
          :titleFontSize="30"
          title="查看物流"
        >
        </tm-cell>
      </view>
    </view> -->
    <!-- <button @click="look">物流</button> -->
  </view>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import tmCell from "@/tmui/components/tm-cell/tm-cell.vue";
import PageHeader from "./components/header.vue";
import UserLimit from "./components/userLimit.vue";

const show = ref(false);
const login = () => {
  show.value = true;
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-color: white;
}
.mine-header {
  background-size: 100% 100%;
}
.bor {
}
</style>
