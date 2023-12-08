<!--
 * @Description:
 * @param :
 * @return:
 * @Author: xmj
 * @Date: 2022-09-05 10:20:36
-->
<template>
  <view class="es-tabbar">
    <view class="es-tabbar-shadow-line"></view>
    <view class="es-tabbar-item" :class="{
      big: tab.big,
      'es-tabbar-active': tab.page === props.activePage,
    }" v-for="(tab, tabIndex) in tabbar" :key="tabIndex" @click="tabClick(tabIndex)">
      <view class="big-shadow">
        <view class="big-shadow-mask"></view>
        <view class="big-shadow-instance"></view>
      </view>
      <!-- <i class="tab-icon" :class="[
        tab.icon,
        tab.page === currentPage ? 'animation-scale-up' : '',
      ]"></i> -->
      <img mode="widthFix" style="width: 50rpx;" :src="tab.page === props.activePage ? tab.activeIcon : tab.icon" />
      <view class="tab-title">{{ tab.title }}</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
const props = defineProps(["tabbar", "activePage", "refresh", "loadMore"]);
const emit = defineEmits(["tabbar-change"]);
const currentPage = ref(props.activePage);
const currentIndex = ref(0);

function tabClick(index: number) {
  currentPage.value = props.tabbar[index].page;
  currentIndex.value = index;
  emit("tabbar-change", {
    page: currentPage.value,
    index: currentIndex.value,
  });
}
</script>
<style lang="scss">
@import "../styles/tabbar.scss";
</style>
