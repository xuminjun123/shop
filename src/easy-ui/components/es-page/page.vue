<template>
  <view>
    <scroll-view :scroll-top="scrollTop" :scroll-y="true" class="es-page-content-height" :refresher-enabled="refresh"
      :refresher-triggered="triggered" :refresher-threshold="100" @scroll="scroll" @refresherrefresh="onRefresh"
      @refresherrestore="onRestore" @refresherabort="onAbort" @scrolltolower="onScrollToLower">
      <slot></slot>
      <view class="es-page-bottom-area" v-if="loadMore && noMoreData">
        <!-- <uni-load-more
          v-if="loadingMore"
          :status="props.status"
          :content-text="props.text"
        ></uni-load-more> -->
        <view class="flex justify-center text-gray-400 align-center" style="height: 100%">
          没有更多了
        </view>
      </view>
    </scroll-view>
    <tabbar-vue v-if="props.tabbar.length" :tabbar="props.tabbar" :active-page="activePage"
      @tabbar-change="tabbarChange"></tabbar-vue>
  </view>
</template>
<script lang="ts" setup>
// import { propTypes } from "@/utils/propTypes";
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import TabbarVue from "./components/tabbar.vue";
const props = defineProps({
  activePage: String,
  tabbar: {
    type: Array,
    default: () => [],
  },
  refresh: {
    type: Boolean,
    default: false,
  },
  loadMore: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "noMore",
    validator(value: string) {
      return ["more", "noMore", "loading"].includes(value);
    },
  },
  text: {
    type: String,
    default: "",
  },
  scrollTop: {
    type: String,
    default: "0",
  },
  /* 展示没有更多 */
  noMoreData: {
    type: Boolean,
    default: false,
  },
});
const tabbarOpt = reactive({
  page: props.activePage,
  index: -1,
});
const emits = defineEmits([
  "tabbar-change",
  "on-refresh",
  "on-touch-bottom",
  "handleScroll",
]);
function tabbarChange(opt: { page: string; index: number }) {
  loadingMore.value = false;
  noMore.value = false;
  tabbarOpt.page = opt.page;
  tabbarOpt.index = opt.index;
  emits("tabbar-change", opt);
}
const triggered = ref<Boolean | string>(false);
const _freshing = ref(false);
onLoad(() => {
  _freshing.value = false;
  triggered.value = false;
  // setTimeout(() => {
  //   triggered.value = true;
  // }, 1000);
});

function onRefresh() {
  triggered.value = "restore";
  if (_freshing.value) return;
  _freshing.value = true;

  setTimeout(() => {
    triggered.value = false;
    _freshing.value = false;
    emits("on-refresh", tabbarOpt);
  }, 500);
}
function onRestore() {
  triggered.value = "restore"; // 需要重置
  console.log("onRestore");
}
function onAbort() {
  console.log("onAbort");
}
// 没有更多了
const noMore = ref(false);
// 加载更多中
const loadingMore = ref(false);
function onScrollToLower(e: any) {
  if (!props.loadMore) return;
  if (noMore.value) return;
  console.log('onScrollToLower----------------->>>>>>>>>>>>>>>>>>', e);
  emits("on-touch-bottom");
  loadingMore.value = true;
}
function stopLoadMore() {
  loadingMore.value = false;
}
function setNoMore() {
  loadingMore.value = false;
  noMore.value = true;
}

// const oldscroll = reactive({
//   scrollTop: 0,
// });

const scroll = (e: any) => {
  // console.log("e----->", e);

  emits("handleScroll", e.detail.scrollTop);
  // oldscroll.scrollTop = e.detail.scrollTop;
  //  .scrollTop = e.detail.scrollTop
};
defineExpose({ stopLoadMore, setNoMore });
</script>
<style lang="scss">
@import "./styles/index.scss";
@import "../../styles/common.css";
</style>
