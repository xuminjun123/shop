<!--
 * @Description: 选项衣服类型
 * @Author: xmj
 * @Date: 2022-09-02 15:49:37
-->
<template>
  <view class="mx-auto my-3 wrapper">
    <scroll-view class="scroll-view_H" :scroll-x="true">
      <view
        id="demo1"
        class="scroll-view-item_H uni-bg-red"
        v-for="item in list"
        :key="item.id"
        :class="item.id == selectId ? 'selectItem' : 'notSelect'"
        @click="selectType(item.id)"
      >
        <text :class="item.id == selectId ? 'bor' : ''">
          {{ item.value }}
        </text>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts" setup>
import { http } from "@/utils/http";
import { onShow } from "@dcloudio/uni-app";
import { onMounted, ref } from "vue";

type ListType = {
  id: number;
  value: string;
};

const selectId = ref<null | number>(null);
const emits = defineEmits(["select"]);
const selectType = (id: number) => {
  selectId.value = id;
  emits("select", id);
};

const list = ref<ListType[]>([]);
const select = ref();
// 获取商品分类
async function getCateData() {
  const res: any = await http.post(`Small/productClass`);
  const keys = Object.keys(res.data);
  let arr: ListType[] = keys.map((item) => {
    return {
      id: item,
      value: res.data[item],
    };
  });

  list.value = arr;
  // select.value = keys[0];
  // emits("select", null);
}
onShow(() => {
  selectId.value = null;
  getCateData();
});
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  .scroll-view_H {
    white-space: nowrap;
    width: 100%;
  }

  .container {
    width: 100%;
    background-color: red;
    .select {
      width: 25%;
      background-color: #fff;
      height: 40rpx;
    }

    .select-text {
      font-size: 20rpx;
    }

    .select-img {
      position: relative;
      left: 5rpx;
    }

    .left3 {
      left: 32rpx;
    }
  }
  .bor {
    color: #095b2b;
    border-radius: 20rpx;
  }
  .scroll-view-item_H {
    display: inline-block;
    width: 27%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
  }
}
</style>
