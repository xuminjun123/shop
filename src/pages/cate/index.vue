<!--
 * @Description: 分类页面
 * @Author: xmj
 * @Date: 2022-06-16 16:33:43
-->
<template>
  <view class="flex w-full wrapper">
    <view
      class="w-1/4 bg-white"
      style="border-right: 2rpx solid #ccc; height: 100vh"
    >
      <view
        class="w-full item flex-center h-[110rpx] text-sm"
        :class="select == item.id ? 'selectItem' : ''"
        v-for="(item, index) in list"
        :key="index"
        @click="selectItem(item.id)"
      >
        {{ item.value }}
      </view>
    </view>

    <scroll-view
      style="height: calc(100vh - 15rpx); background: 'green'"
      :scroll-y="true"
      @scrolltolower="scrolltolower"
    >
      <view class="w-full">
        <view class="flex justify-around content">
          <view
            class="flex flex-col my-1 bg-white"
            style="width: 48%"
            @click="navDetai(child.id)"
            v-for="(child, index) in cateData"
            :key="child.id"
          >
            <view class="w-full p-1 h-[265rpx]">
              <image :src="child.productimg" mode="aspectFill" />
            </view>
            <view class="py-1 pl-1 text-sm">
              {{ propTitle(child.producttitle) }}
            </view>
            <!-- <view class="text-sm w-[134rpx] tag"> 限时购优惠 </view> -->
            <view class="flex justify-between w-full p-1 text-sm">
              <view class="text-red-500">
                ¥ {{ child.preferentialprice }} 元
              </view>
              <view
                class="w-[35rpx] h-[35rpx] mr-2"
                @click.stop="addShoppingCart(child.id)"
              >
                <image :src="shoppingImg" />
              </view>
            </view>
          </view>
          <view style="width: 48%"></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts" setup>
import { http } from "@/utils/http";
import { showToast } from "@/utils/toast";
import { onMounted, ref, watch } from "vue";
import shoppingImg from "@/assets/shopping.png";
import { useUserStore } from "@/store/modules/user";
const select = ref<string | null>(null);
const list = ref<any>([]);
const cateData = ref<any>([]);

// 当前页数
const queryPage = ref<number>(1);
// 总页数
const totalPages = ref<number>(0);

const selectItem = (index: string): void => {
  console.log(index);
  select.value = index;
  queryPage.value = 1;
  cateData.value = [];
};
watch(select, (newValue) => {
  if (newValue) {
    getCateDataById(newValue);
  }
});
const propTitle = (title: string) => {
  return title.length > 8 ? title.substring(0, 8) + "..." : title;
};

async function getCateDataById(id: number) {
  const res: any = await http.post(`Small/productClassList`, {
    productclass: id,
    page: queryPage.value,
  });
  if (res.code == 1) {
    cateData.value = [...cateData.value, ...res.data];
    totalPages.value = res.totalPages;
  } else {
    showToast(res.message);
  }
}
// 获取商品分类
async function getCateData() {
  const res: any = await http.post(`Small/productClass`);
  const keys = Object.keys(res.data);
  let arr = keys.map((item) => {
    return {
      id: item,
      value: res.data[item],
    };
  });

  list.value = arr;
  select.value = keys[0];
}
const addCount = ref(0);
// 加入购物车
const addShoppingCart = (id: number) => {
  if (addCount.value > 0) {
    showToast("您已加入购物车！");
    return;
  }
  const userStore = useUserStore();
  http
    .post(`Small/shoppingCartAdd`, {
      openid: userStore.getOpenId,
      productid: id,
    })
    .then((res) => {
      addCount.value = 1;
      if (res.code == 1) {
        showToast("加入购物车成功");
      }
    });
};

const navDetai = (id: number) => {
  uni.navigateTo({
    url: `/pages/goodsDetail/index?id=${id}`,
  });
};

const scrolltolower = () => {
  // 判断有没有下一页数据
  if (queryPage.value >= totalPages.value) {
    showToast("没有更多数据了");
  } else {
    queryPage.value++;
    getCateDataById(select.value);
  }
};

onMounted(() => {
  getCateData();
});
</script>

<style lang="scss" scoped>
.wrapper {
  .item {
    background-color: #ededed;
  }

  .selectItem {
    border-left: 4rpx solid red;
    background-color: #fff;
  }

  .selectType {
    color: black;
  }

  .notSelect {
    color: #888888;
  }

  .content {
    flex-wrap: wrap;
    background-color: #f9f9f9 !important;
  }
  .tag {
    display: inline;
    border: 1rpx solid #ec6f59;
    border-radius: 10rpx;
    margin-left: 10rpx;
    color: #ec6f59;
    padding: 2rpx 3rpx;
    @apply text-xs bg-red-500 text-white;
  }
  .bor {
    border: 1px solid #095b2b;
    background-color: white;
    border-radius: 8rpx;
  }
}
</style>
