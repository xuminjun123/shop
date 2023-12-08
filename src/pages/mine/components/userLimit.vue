<!--
 * @Description:  用户额度
 * @Author: xmj
 * @Date: 
-->
<template>
  <view class="wrapper">
    <tm-sheet _style="border: 1rpx solid #095b2b; border-radius: 10rpx;">
      <tm-text
        :font-size="24"
        _class="font-weight-b"
        label="我的订单"
      ></tm-text>
      <tm-grid :width="638" :col="3">
        <!-- <tm-grid-item :height="120" :count="1" @click="navPay">
          <img :src="pay" style="width: 65rpx; height: 65rpx" />
          <tm-text _class="pt-10" :font-size="25" label="待付款"></tm-text>
        </tm-grid-item> -->
        <tm-grid-item :height="120" :count="waitSendValue" @click="navWaitSend">
          <img :src="wait" style="width: 65rpx; height: 65rpx" />
          <tm-text _class="pt-10" :font-size="25" label="待发货"></tm-text>
        </tm-grid-item>
        <tm-grid-item :height="120" :count="waitGetValue" @click="navWaitGet">
          <img :src="get" style="width: 65rpx; height: 65rpx" />
          <tm-text :font-size="25" label="待收货"></tm-text>
        </tm-grid-item>
        <tm-grid-item :height="120" :count="acceptValue" @click="navAccept">
          <img :src="accept" style="width: 65rpx; height: 65rpx" />
          <tm-text :font-size="25" label="已完成"></tm-text>
        </tm-grid-item>
      </tm-grid>
    </tm-sheet>
  </view>
</template>
<script lang="ts" setup>
import { http } from "@/utils/http";
import { onShow } from "@dcloudio/uni-app";
import { computed, reactive, ref } from "vue";
import tmText from "@/tmui/components/tm-text/tm-text.vue";
import tmSheet from "@/tmui/components/tm-sheet/tm-sheet.vue";
import tmGridItem from "@/tmui/components/tm-grid-item/tm-grid-item.vue";
import tmGrid from "@/tmui/components/tm-grid/tm-grid.vue";
import pay from "@/assets/pay.png";
import wait from "@/assets/wait.png";
import get from "@/assets/get.png";
import accept from "@/assets/accept.png";
import { useUserStore } from "@/store/modules/user";
const userQuota = reactive({
  cost: 0,
  balance: 0,
  quota: 0,
});

const waitSendValue = ref(0);
const waitGetValue = ref(0);
const acceptValue = ref(0);

const navWaitSend = () => {
  uni.navigateTo({
    url: "/pages/waitSend/index",
  });
};

const navWaitGet = () => {
  uni.navigateTo({
    url: "/pages/waitGet/index",
  });
};

const navAccept = () => {
  uni.navigateTo({
    url: "/pages/accept/index",
  });
};

const openid = computed(() => {
  const userStore = useUserStore();
  return userStore.getOpenId;
});
async function getInfoData() {
  http
    .post(`Users/getUserInfo`, {
      openid: openid.value,
    })
    .then((res: any) => {
      if (res.data) {
        const waitSend = res.data.find((item: any) => {
          return item.state == "待发货";
        });
        if (waitSend) {
          waitSendValue.value = waitSend.num;
        }

        const waitGet = res.data.find((item: any) => {
          return item.state == "待收货";
        });
        if (waitGet) {
          waitGetValue.value = waitGet.num;
        }

        const accept = res.data.find((item: any) => {
          return item.state == "已完成";
        });
        if (accept) {
          acceptValue.value = accept.num;
        }
      }
    });
}
onShow(() => {
  waitSendValue.value = 0;
  waitGetValue.value = 0;
  acceptValue.value = 0;
  getInfoData();
});
</script>
<style lang="scss" scoped>
.container {
  border-radius: 10rpx;
  overflow: hidden;
}
</style>
