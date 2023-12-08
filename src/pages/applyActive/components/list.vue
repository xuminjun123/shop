<!--
 * @Description: 
 * @Author: xmj
 * @Date: 2023-04-12 14:57:26
-->
<template>
  <view>
    <view class="w-11/12 mx-auto mt-2 mb-4"> 预约信息 </view>
  </view>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
interface IData {
  id: number;
  title: string;
  img: string;
  state: string;
}
const props = defineProps({
  list: {
    type: Array as () => IData[],
    required: true,
    default: () => [],
  },
});

onMounted(() => {});
</script>
<style lang="scss" scoped>
.bor {
  border: 1px solid #095b2b;
  background-color: white;
  border-radius: 8rpx;
}
</style>
