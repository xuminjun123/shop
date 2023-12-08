<!--
 * @Description: 查看全部
 * @Author: xmj
 * @Date: 2022-09-02 17:10:26
-->
<template>
  <view>
    <view class="flex justify-between w-full bg-white logo">
      <view class="flex">
        <view class="w-[240rpx]">
          <image :src="logo" mode="widthFix" />
        </view>
        <!-- <view class="self-center">
          <view class="text-xs"> 公众号客服 </view>
          <view class="pt-2 text-xs"> 点击添加客服微信咨询详情 </view>
        </view> -->
      </view>
      <!-- <view class="self-center">
        <button
          @click="addKefu"
          class="py-2 mr-1 text-xs text-white bg-red-500 kefuBtn"
        >
          立即添加
        </button>
      </view> -->
    </view>
    <tm-overlay contentAnimation ref="calendarView" v-model:show="show">
      <view @click.stop="">
        <tm-sheet :width="600" :height="620">
          <view class="flex items-center justify-center w-full mx-auto my-2">
            <image
              src="https://www.stdhlmsg.com/public/uploads/wx.jpg"
              mode="widthFix"
            />
          </view>
        </tm-sheet>
      </view>
    </tm-overlay>
  </view>
</template>
<script lang="ts" setup>
import logo from "@/assets/logo.jpg";
import tmOverlay from "@/tmui/components/tm-overlay/tm-overlay.vue";
import { ref } from "vue";
const show = ref(false);
const addKefu = () => {
  show.value = true;
};
</script>
<style lang="scss" scoped></style>
