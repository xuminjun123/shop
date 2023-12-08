<!--
 * @Author: xmj
 * @Date:
-->
<template>
  <view>
    <!-- <button @click="tab">111</button> -->
    <!-- @click="checkVersion" -->
    <!-- open-type="chooseAvatar" type="balanced" -->
    <view class="bg">
      <view class="flex pt-4 pl-3">
        <view class="avatarUrl">
          <button class="block btn">
            <img :src="avatarSrc" class="avatarUrl" />
            <!-- <img :src="avatarUrl ? avatarUrl : avatarSrc" class="avatarUrl" /> -->
          </button>
        </view>
        <!-- 
        <view class="flex-col mt-3 ml-5 text-white">
          <view class="flex text-md">
            昵称:
            <input
              type="nickname"
              class="nameInp"
              :value="name ? name : ''"
              placeholder="点击设置昵称"
              @change="bindinput"
            />
          </view>
        </view> -->
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import avatarSrc from "@/assets/avatarSrc2.png";
import { onShow } from "@dcloudio/uni-app";
import { useUserStore } from "@/store/modules/user";

const avatar = uni.getStorageSync("avatar");
const nickName = uni.getStorageSync("nickName");
const avatarUrl = ref(avatar);
const name = ref(nickName);
const onChooseavatar2 = async (e: any) => {
  console.log("e-->>", e);

  avatarUrl.value = e.detail.avatarUrl;
  uni.setStorageSync("avatar", e.detail.avatarUrl);
};
const bindinput = (e: any) => {
  name.value = e.detail.value;
  uni.setStorageSync("nickName", e.detail.value);
};

const checkVersion = () => {
  const version = uni.getSystemInfoSync().SDKVersion;
  console.log("version 版本为:", version);
};

const tab = async () => {
  const userStore = useUserStore();
  const info = await userStore.setAuthInfo();
  console.log("info-------->>", info);
};
</script>
<style lang="scss" scoped>
.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  overflow: hidden;
}
.avatarUrl {
  button {
    border: none;
    font-size: 0;
    width: 160rpx;
    height: 160rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    padding: 0;
    margin: 0;
  }
}
</style>
