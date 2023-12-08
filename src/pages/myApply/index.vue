<!--
 * @Description: 
 * @param : 
 * @return:        @click="navApplyDetil(item)"
 * @Author: xmj
 * @Date: 2023-04-25 18:11:49
-->
<template>
  <view class="pb-6">
    <view
      class="w-11/12 p-2 mx-auto mt-2 mb-4 bg-white"
      style="border: 1px solid #095b2b; border-radius: 8rpx"
      v-for="item in list"
      :key="item.activityid"
    >
      <view>
        <view class=""> <img :src="item.img" mode="widthFix" /> </view>
        <view class="py-1 pl-1 text-sm"> {{ item.title }}</view>
        <view class="pb-1 pl-1 text-xs" style="color: #eb6120">
          活动时间: {{ item.starttime }}至{{ item.endtime }}</view
        >
        <view
          class="pb-1 pl-1 text-xs"
          v-if="item.type == 3"
          style="color: #eb6120"
        >
          核销时间: {{ item.checktime }}</view
        >
        <view class="flex justify-end w-full py-1 pl-1 text-sm">
          <view
            @click="navActiveDetail(item)"
            class="w-[150rpx] text-center state"
            :class="
              item.applystate == '可用显示二维码' ? 'baseColorBg' : 'disabledBg'
            "
          >
            {{ typeStatus[item.type] }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import { http } from "@/utils/http";
import { showModal, showToast } from "@/utils/toast";
import { useUserStore } from "@/store/modules/user";
import { format } from "date-fns";
interface Idata {
  activityid: number;
  title: string;
  img: string;
  appointmentid: number;
  qrcode: string;
  type: 1 | 2 | 3; // 1已预约 2已取消 3已核销
  applytime: string;
  checktime: number; // 核销时间（type=3显示）
  applystate: string; //  我的预约列表显示状态
  starttime: string;
  endtime: string;
}

const list = ref<Idata[]>([]);
const openid = computed(() => {
  const userStore = useUserStore();
  return userStore.getOpenId;
});

const applytime = (time: any) => {
  const date = format(Number(time * 1000), "yyyy年MM月dd日 HH时");
  return date;
};

const typeStatus = {
  1: "已预约",
  2: "已取消",
  3: "已核销",
} as { [key: number]: string };

const navActiveDetail = (item: Idata) => {
  if (item.applystate != "可用显示二维码") {
    return;
  }
  uni.navigateTo({
    url: `/pages/myApplyDetail/index?id=${item.appointmentid}`,
  });
};

function getAllData() {
  http
    .post("Users/getUserAppointment", {
      openid: openid.value,
    })
    .then((res: any) => {
      list.value = res.data;
    });
}

onShow(() => {
  getAllData();
});
</script>
<style lang="scss">
.state {
  border: 1px solid #ccc;
  border-radius: 10rpx;
  display: inline-block;
  color: white;
  font-size: 24rpx;
  width: 150rpx;

  @apply text-center;
}
.baseColorBg {
  background-color: #095b2b;
}
.disabledBg {
  background-color: #ccc;
}
</style>
